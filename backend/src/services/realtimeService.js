// Real-time service for broadcasting analytics and predictions
import Alert from "../models/Alert.js";
import Chat from "../models/Chat.js";

let io = null;

export const initializeRealtime = (socketIO) => {
  io = socketIO;
  
  // Broadcast analytics every 30 seconds
  setInterval(async () => {
    if (io) {
      try {
        const analytics = await getRealtimeAnalytics();
        io.emit("analytics:update", analytics);
      } catch (err) {
        console.error("Error broadcasting analytics:", err);
      }
    }
  }, 30000); // Every 30 seconds
};


export const getRealtimeAnalytics = async () => {
  try {
    const [alerts, chats] = await Promise.all([
      Alert.find().sort({ createdAt: -1 }).limit(100),
      Chat.find().sort({ createdAt: -1 }).limit(50),
    ]);

    // Calculate real-time metrics
    const activeAlerts = alerts.filter(a => a.status === 'pending' || a.status === 'active').length;
    const recentAlerts = alerts.filter(a => {
      const hoursAgo = (Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60);
      return hoursAgo < 24;
    }).length;

    // Calculate hourly distribution
    const hourlyCounts = {};
    alerts.forEach(alert => {
      const hour = new Date(alert.createdAt).getHours();
      hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
    });

    // Detect anomalies
    const avgPerHour = recentAlerts / 24;
    const anomalies = [];
    Object.entries(hourlyCounts).forEach(([hour, count]) => {
      if (count > avgPerHour * 2) {
        anomalies.push({
          hour: parseInt(hour),
          count,
          severity: count > avgPerHour * 3 ? 'critical' : 'high',
        });
      }
    });

    // Risk assessment
    let riskLevel = 'normal';
    if (activeAlerts > 10 || anomalies.length > 3) {
      riskLevel = 'high';
    } else if (activeAlerts > 5 || anomalies.length > 1) {
      riskLevel = 'medium';
    } else if (activeAlerts > 0) {
      riskLevel = 'low';
    }

    return {
      activeAlerts,
      recentAlerts,
      totalAlerts: alerts.length,
      totalChats: chats.length,
      riskLevel,
      anomalies,
      hourlyDistribution: hourlyCounts,
      timestamp: new Date(),
    };
  } catch (err) {
    console.error("Error getting real-time analytics:", err);
    return {
      activeAlerts: 0,
      recentAlerts: 0,
      totalAlerts: 0,
      totalChats: 0,
      riskLevel: 'normal',
      anomalies: [],
      hourlyDistribution: {},
      timestamp: new Date(),
    };
  }
};

export const broadcastAlertUpdate = (alert) => {
  if (io) {
    io.emit("alert:update", alert);
    // Also trigger analytics update
    getRealtimeAnalytics().then(analytics => {
      io.emit("analytics:update", analytics);
    });
  }
};

export const broadcastPrediction = (prediction) => {
  if (io) {
    io.emit("prediction:new", prediction);
  }
};

