import Alert from "../models/Alert.js";
import Chat from "../models/Chat.js";
import BusRoute from "../models/BusRoute.js";
import Location from "../models/Location.js";
import User from "../models/User.js";

// 📊 Predictive Analytics for Alerts
export const getAlertPredictions = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    
    // Time-based analysis
    const hourlyAlerts = {};
    const dailyAlerts = {};
    const alertTypes = {};
    
    alerts.forEach((alert) => {
      const date = new Date(alert.createdAt);
      const hour = date.getHours();
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      hourlyAlerts[hour] = (hourlyAlerts[hour] || 0) + 1;
      dailyAlerts[day] = (dailyAlerts[day] || 0) + 1;
      alertTypes[alert.alertType] = (alertTypes[alert.alertType] || 0) + 1;
    });
    
    // Predict peak hours (ML-based prediction)
    const peakHours = Object.entries(hourlyAlerts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));
    
    // Predict risk areas based on alert density
    const locationDensity = {};
    alerts.forEach((alert) => {
      if (alert.location && alert.location.coordinates) {
        const [lng, lat] = alert.location.coordinates;
        const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
        locationDensity[key] = (locationDensity[key] || 0) + 1;
      }
    });
    
    const highRiskAreas = Object.entries(locationDensity)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([coords, count]) => ({
        coordinates: coords.split(',').map(Number),
        alertCount: count,
        riskLevel: count > 5 ? 'high' : count > 2 ? 'medium' : 'low',
      }));
    
    res.json({
      totalAlerts: alerts.length,
      peakHours,
      dailyPattern: dailyAlerts,
      alertTypeDistribution: alertTypes,
      highRiskAreas,
      predictions: {
        nextPeakHour: peakHours[0] || 12,
        expectedAlertsToday: Math.round(alerts.length / 7),
        riskLevel: alerts.length > 10 ? 'high' : alerts.length > 5 ? 'medium' : 'low',
      },
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🧠 Advanced Smart Route Search & Recommendations
export const getSmartRouteRecommendations = async (req, res) => {
  try {
    const { origin, destination, query, time } = req.query;
    
    // If query is provided, search by query string (e.g., "routes to kalpetta")
    if (query) {
      const searchQuery = query.toLowerCase();
      const routes = await BusRoute.find({ isActive: true });
      
      // Advanced search: match in origin, destination, routeNo, description, alternativeNames
      const matchedRoutes = routes
        .map((route) => {
          let matchScore = 0;
          const searchTerms = searchQuery.split(' ');
          
          searchTerms.forEach((term) => {
            // Check origin
            if (route.origin.toLowerCase().includes(term)) matchScore += 3;
            // Check destination
            if (route.destination.toLowerCase().includes(term)) matchScore += 3;
            // Check route number
            if (route.routeNo.toLowerCase().includes(term)) matchScore += 2;
            // Check description
            if (route.description && route.description.toLowerCase().includes(term)) matchScore += 1;
            // Check alternative names
            if (route.alternativeNames && route.alternativeNames.length > 0) {
              route.alternativeNames.forEach((altName) => {
                if (altName.toLowerCase().includes(term)) matchScore += 2;
              });
            }
            // Check sub-routes
            if (route.subRoutes && route.subRoutes.length > 0) {
              route.subRoutes.forEach((subRoute) => {
                if (subRoute.origin.toLowerCase().includes(term) || 
                    subRoute.destination.toLowerCase().includes(term)) {
                  matchScore += 1;
                }
              });
            }
          });
          
          return { route, matchScore };
        })
        .filter((item) => item.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .map((item) => ({
          routeNo: item.route.routeNo,
          origin: item.route.origin,
          destination: item.route.destination,
          firstBus: item.route.firstBus,
          lastBus: item.route.lastBus,
          frequencyMin: item.route.frequencyMin,
          roadStatus: item.route.roadStatus || 'normal',
          roadStatusMessage: item.route.roadStatusMessage || '',
          estimatedTime: item.route.estimatedTime || 0,
          distance: item.route.distance || 0,
          popularity: item.route.popularity || 0,
          confidence: Math.min(item.matchScore / 10, 1.0),
          subRoutes: item.route.subRoutes || [],
        }));
      
      // Find best route (highest confidence, normal road status, highest popularity)
      const bestRoute = matchedRoutes.length > 0 
        ? matchedRoutes
            .filter((r) => r.roadStatus === 'normal')
            .sort((a, b) => {
              // Sort by: normal road status first, then popularity, then confidence
              if (a.roadStatus === 'normal' && b.roadStatus !== 'normal') return -1;
              if (a.roadStatus !== 'normal' && b.roadStatus === 'normal') return 1;
              if (a.popularity !== b.popularity) return b.popularity - a.popularity;
              return b.confidence - a.confidence;
            })[0] || matchedRoutes[0]
        : null;
      
      return res.json({
        recommendations: matchedRoutes,
        bestRoute,
        query: { search: query },
        totalRoutes: matchedRoutes.length,
        totalRoutesInSystem: routes.length,
      });
    }
    
    // Original origin-destination search
    if (!origin || !destination) {
      return res.status(400).json({ message: "Origin and destination or query required" });
    }
    
    // Get all routes
    const routes = await BusRoute.find({ isActive: true });
    
    // Advanced ML-based matching algorithm with road status consideration
    const recommendations = routes
      .map((route) => {
        let score = 0;
        const originMatch = route.origin.toLowerCase().includes(origin.toLowerCase()) ||
                           origin.toLowerCase().includes(route.origin.toLowerCase());
        const destMatch = route.destination.toLowerCase().includes(destination.toLowerCase()) ||
                         destination.toLowerCase().includes(route.destination.toLowerCase());
        
        if (originMatch) score += 3;
        if (destMatch) score += 3;
        
        // Check sub-routes
        if (route.subRoutes && route.subRoutes.length > 0) {
          route.subRoutes.forEach((subRoute) => {
            if (subRoute.origin.toLowerCase().includes(origin.toLowerCase())) score += 1;
            if (subRoute.destination.toLowerCase().includes(destination.toLowerCase())) score += 1;
          });
        }
        
        // Road status penalty/bonus
        let roadStatusMultiplier = 1.0;
        if (route.roadStatus === 'normal') roadStatusMultiplier = 1.2;
        else if (route.roadStatus === 'slow') roadStatusMultiplier = 0.9;
        else if (route.roadStatus === 'maintenance') roadStatusMultiplier = 0.7;
        else if (route.roadStatus === 'under_construction') roadStatusMultiplier = 0.5;
        else if (route.roadStatus === 'blocked') roadStatusMultiplier = 0.3;
        
        // Popularity bonus
        score += (route.popularity || 0) / 20;
        
        return { route, score: score * roadStatusMultiplier };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => ({
        routeNo: item.route.routeNo,
        origin: item.route.origin,
        destination: item.route.destination,
        firstBus: item.route.firstBus,
        lastBus: item.route.lastBus,
        frequencyMin: item.route.frequencyMin,
        roadStatus: item.route.roadStatus || 'normal',
        roadStatusMessage: item.route.roadStatusMessage || '',
        estimatedTime: item.route.estimatedTime || 0,
        distance: item.route.distance || 0,
        popularity: item.route.popularity || 0,
        confidence: Math.min(item.score / 6, 1.0),
        subRoutes: item.route.subRoutes || [],
      }));
    
    // Find best route
    const bestRoute = recommendations.length > 0
      ? recommendations
          .filter((r) => r.roadStatus === 'normal')
          .sort((a, b) => {
            if (a.popularity !== b.popularity) return b.popularity - a.popularity;
            return b.confidence - a.confidence;
          })[0] || recommendations[0]
      : null;
    
    res.json({
      recommendations,
      bestRoute,
      query: { origin, destination, time },
      totalMatches: recommendations.length,
      totalRoutesInSystem: routes.length,
    });
  } catch (err) {
    console.error("Route recommendation error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔍 Anomaly Detection for Alerts
export const detectAnomalies = async (req, res) => {
  try {
    const alerts = await Alert.find({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
    
    // Calculate average alerts per hour
    const avgAlertsPerHour = alerts.length / 24;
    
    // Detect anomalies (spikes in alerts)
    const hourlyCounts = {};
    alerts.forEach((alert) => {
      const hour = new Date(alert.createdAt).getHours();
      hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
    });
    
    const anomalies = [];
    Object.entries(hourlyCounts).forEach(([hour, count]) => {
      if (count > avgAlertsPerHour * 2) {
        anomalies.push({
          hour: parseInt(hour),
          count,
          severity: count > avgAlertsPerHour * 3 ? 'critical' : 'high',
          message: `Unusual spike in alerts at ${hour}:00 (${count} alerts)`,
        });
      }
    });
    
    // Detect location clusters (potential incidents)
    const locationClusters = {};
    alerts.forEach((alert) => {
      if (alert.location && alert.location.coordinates) {
        const [lng, lat] = alert.location.coordinates;
        const key = `${lat.toFixed(1)},${lng.toFixed(1)}`;
        if (!locationClusters[key]) {
          locationClusters[key] = [];
        }
        locationClusters[key].push(alert);
      }
    });
    
    const incidentAreas = Object.entries(locationClusters)
      .filter(([_, alerts]) => alerts.length >= 3)
      .map(([coords, alerts]) => ({
        coordinates: coords.split(',').map(Number),
        alertCount: alerts.length,
        alerts: alerts.map((a) => ({
          type: a.alertType,
          message: a.message,
          time: a.createdAt,
        })),
        severity: alerts.length > 5 ? 'critical' : 'high',
      }));
    
    res.json({
      anomalies,
      incidentAreas,
      totalAlerts24h: alerts.length,
      averagePerHour: avgAlertsPerHour.toFixed(2),
      riskAssessment: {
        level: anomalies.length > 0 || incidentAreas.length > 0 ? 'high' : 'normal',
        message: anomalies.length > 0
          ? `${anomalies.length} anomaly detected`
          : incidentAreas.length > 0
          ? `${incidentAreas.length} potential incident area(s)`
          : 'All systems normal',
      },
    });
  } catch (err) {
    console.error("Anomaly detection error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📈 Dashboard Analytics
export const getDashboardAnalytics = async (req, res) => {
  try {
    const [alerts, chats, routes, locations, users] = await Promise.all([
      Alert.find(),
      Chat.find(),
      BusRoute.find(),
      Location.find(),
      User.find(),
    ]);
    
    // Alert trends
    const alertTrends = {};
    alerts.forEach((alert) => {
      const date = new Date(alert.createdAt).toLocaleDateString();
      alertTrends[date] = (alertTrends[date] || 0) + 1;
    });
    
    // Intent analysis
    const intentDistribution = {};
    chats.forEach((chat) => {
      const intent = chat.intent || 'general';
      intentDistribution[intent] = (intentDistribution[intent] || 0) + 1;
    });
    
    // Response time analysis (simulated)
    const avgResponseTime = chats.length > 0 ? 2.5 : 0;
    
    res.json({
      overview: {
        totalAlerts: alerts.length,
        totalChats: chats.length,
        totalRoutes: routes.length,
        totalLocations: locations.length,
        totalUsers: users.length,
      },
      trends: {
        alerts: alertTrends,
        intents: intentDistribution,
      },
      metrics: {
        avgResponseTime,
        activeRoutes: routes.filter((r) => r.isActive).length,
        pendingAlerts: alerts.filter((a) => a.status === 'pending').length,
      },
    });
  } catch (err) {
    console.error("Dashboard analytics error:", err);
    res.status(500).json({ message: err.message });
  }
};




