import { useEffect, useState } from "react";
import {
  Box,
  Toolbar,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
  Button,
  LinearProgress,
  Alert as MuiAlert,
} from "@mui/material";
import Sidebar from "../layout/Sidebar.jsx";
import Topbar from "../layout/Topbar.jsx";
import API, { SOCKET_URL } from "../services/api.js";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  Warning,
  LocationOn,
  Schedule,
  Psychology,
  AutoAwesome,
  Insights,
  Speed,
} from "@mui/icons-material";
import { io } from "socket.io-client";

const COLORS = ["#667eea", "#f5576c", "#4facfe", "#43e97b", "#fa709a", "#fee140"];

export default function AIMLFeatures() {
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState(null);
  const [anomalies, setAnomalies] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [realTimeData, setRealTimeData] = useState({
    activeAlerts: 0,
    predictions: [],
    riskLevel: "normal",
  });
  const [socket, setSocket] = useState(null);
  const [chatbotAnalytics, setChatbotAnalytics] = useState(null);

  useEffect(() => {
    loadAllData();
    setupSocket();
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const setupSocket = () => {
    const newSocket = io(SOCKET_URL, { transports: ["websocket"] });
    setSocket(newSocket);

    newSocket.on("alert:new", (alert) => {
      toast.info(`New alert: ${alert.alertType}`);
      loadAllData();
    });

    newSocket.on("admin:alert", (alert) => {
      toast.success(`Admin alert broadcasted: ${alert.alertType}`);
      loadAllData();
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to real-time server");
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from real-time server");
    });
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [predData, anomData, dashData, chatData] = await Promise.allSettled([
        API.get("/analytics/alerts/predictions"),
        API.get("/analytics/alerts/anomalies"),
        API.get("/analytics/dashboard"),
        API.get("/chatbot/analytics"),
      ]);

      if (predData.status === "fulfilled") {
        setPredictions(predData.value.data);
        setRealTimeData((prev) => ({
          ...prev,
          riskLevel: predData.value.data?.predictions?.riskLevel || "normal",
        }));
      }
      if (anomData.status === "fulfilled") {
        setAnomalies(anomData.value.data);
      }
      if (dashData.status === "fulfilled") {
        setDashboard(dashData.value.data);
        setRealTimeData((prev) => ({
          ...prev,
          activeAlerts: dashData.value.data?.overview?.totalAlerts || 0,
        }));
      }
      if (chatData.status === "fulfilled") {
        setChatbotAnalytics(chatData.value.data);
      }
    } catch (err) {
      console.error("AI/ML data error:", err);
      toast.error("Failed to load AI/ML data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", bgcolor: "#f5f7fa", minHeight: "100vh" }}>
        <Sidebar />
        <Topbar title="AI/ML Features" />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: "260px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  const riskColor = {
    normal: "success",
    low: "info",
    medium: "warning",
    high: "error",
  }[realTimeData.riskLevel] || "info";

  return (
    <Box sx={{ display: "flex", bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Sidebar />
      <Topbar title="AI/ML Features & Real-Time Analytics" />

      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: "260px" }}>
        <Toolbar />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={800} mb={1}>
                  🤖 AI/ML Features & Real-Time Analytics
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Advanced machine learning predictions, anomaly detection, and real-time insights
                </Typography>
              </Box>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  icon={<Speed />}
                  label={socket?.connected ? "🟢 Real-Time" : "🔴 Offline"}
                  sx={{ bgcolor: socket?.connected ? "rgba(255,255,255,0.2)" : "rgba(255,0,0,0.2)" }}
                />
                <Button
                  variant="contained"
                  onClick={loadAllData}
                  sx={{
                    bgcolor: "white",
                    color: "#667eea",
                    fontWeight: 700,
                    "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                  }}
                >
                  Refresh
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </motion.div>

        <Grid container spacing={3}>
          {/* App chatbot usage (same data as mobile app /api/chatbot) */}
          {chatbotAnalytics && (
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} mb={2}>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          App chatbot activity
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Logged from the Flutter app via POST /api/chatbot (same pipeline as admin Chatbot page)
                        </Typography>
                      </Box>
                      <Chip
                        label={`${chatbotAnalytics.totalChats ?? 0} total messages stored`}
                        color="primary"
                        variant="outlined"
                      />
                    </Stack>
                    <Grid container spacing={2}>
                      {(chatbotAnalytics.intents || []).slice(0, 6).map((row, idx) => (
                        <Grid item xs={6} sm={4} md={2} key={`${row._id}-${idx}`}>
                          <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, textAlign: "center" }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {row._id || "—"}
                            </Typography>
                            <Typography variant="h6" fontWeight={800}>
                              {row.count}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                    {(chatbotAnalytics.popularQueries || []).length > 0 && (
                      <Box mt={2}>
                        <Typography variant="subtitle2" fontWeight={700} mb={1}>
                          Frequent user phrases
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                          {(chatbotAnalytics.popularQueries || []).slice(0, 5).map((q, i) => (
                            <Chip
                              key={i}
                              size="small"
                              label={`"${String(q._id).slice(0, 32)}${String(q._id).length > 32 ? "…" : ""}" (${q.count})`}
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          )}

          {/* Real-Time Risk Assessment */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", height: "100%" }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" mb={2}>
                    <Psychology sx={{ color: "#667eea", mr: 1, fontSize: 32 }} />
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Real-Time Risk
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Live assessment
                      </Typography>
                    </Box>
                  </Stack>
                  <MuiAlert severity={riskColor} sx={{ mb: 2 }}>
                    <Typography variant="h5" fontWeight={800}>
                      {realTimeData.riskLevel.toUpperCase()}
                    </Typography>
                  </MuiAlert>
                  <Typography variant="body2" color="text.secondary">
                    Active Alerts: {realTimeData.activeAlerts}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((realTimeData.activeAlerts / 20) * 100, 100)}
                    sx={{ mt: 2, height: 8, borderRadius: 4 }}
                    color={riskColor}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Predictions */}
          {predictions && (
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", height: "100%" }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" mb={2}>
                      <TrendingUp sx={{ color: "#f5576c", mr: 1, fontSize: 32 }} />
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          Predictions
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ML-powered
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography variant="h4" fontWeight={800} color="primary">
                      {predictions.predictions?.expectedAlertsToday || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      Expected alerts today
                    </Typography>
                    <Chip
                      label={`Peak: ${predictions.predictions?.nextPeakHour || 12}:00`}
                      color="primary"
                      size="small"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          )}

          {/* Anomalies */}
          {anomalies && (
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", height: "100%" }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" mb={2}>
                      <Warning sx={{ color: "#fa709a", mr: 1, fontSize: 32 }} />
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          Anomalies
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Detected
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography variant="h4" fontWeight={800} color="error">
                      {anomalies.anomalies?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      Unusual patterns detected
                    </Typography>
                    <Chip
                      label={anomalies.riskAssessment?.message || "All normal"}
                      color={anomalies.anomalies?.length > 0 ? "error" : "success"}
                      size="small"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          )}

          {/* Alert Trends Chart */}
          {dashboard?.trends && (
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} mb={2}>
                      <Insights sx={{ mr: 1, verticalAlign: "middle" }} />
                      Alert Trends (Last 7 Days)
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={Object.entries(dashboard.trends.alerts || {}).map(([date, count]) => ({ date, count }))}>
                        <defs>
                          <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#667eea"
                          fillOpacity={1}
                          fill="url(#colorAlerts)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          )}

          {/* Intent Distribution */}
          {dashboard?.trends?.intents && (
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} mb={2}>
                      <AutoAwesome sx={{ mr: 1, verticalAlign: "middle" }} />
                      Chatbot Intents
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={Object.entries(dashboard.trends.intents || {}).map(([name, value]) => ({ name, value }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {Object.entries(dashboard.trends.intents || {}).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          )}

          {/* High Risk Areas */}
          {predictions?.highRiskAreas && predictions.highRiskAreas.length > 0 && (
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" mb={2}>
                      <LocationOn sx={{ color: "#f5576c", mr: 1 }} />
                      <Typography variant="h6" fontWeight={700}>
                        High Risk Areas (ML-Detected)
                      </Typography>
                    </Stack>
                    <Grid container spacing={2}>
                      {predictions.highRiskAreas.map((area, i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                          <Paper
                            sx={{
                              p: 2,
                              bgcolor: area.riskLevel === "high" ? "#fff5f5" : "#f0f9ff",
                              border: `2px solid ${area.riskLevel === "high" ? "#f5576c" : "#4facfe"}`,
                              borderRadius: 2,
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight={700}>
                              Area {i + 1}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {area.coordinates[0]}, {area.coordinates[1]}
                            </Typography>
                            <Stack direction="row" spacing={1} mt={1}>
                              <Chip
                                label={`${area.alertCount} alerts`}
                                size="small"
                                color={area.riskLevel === "high" ? "error" : "primary"}
                              />
                              <Chip
                                label={area.riskLevel}
                                size="small"
                                variant="outlined"
                              />
                            </Stack>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          )}

          {/* Anomaly Details */}
          {anomalies?.anomalies && anomalies.anomalies.length > 0 && (
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} mb={2}>
                      <Warning sx={{ mr: 1, verticalAlign: "middle" }} />
                      Detected Anomalies
                    </Typography>
                    <Stack spacing={2}>
                      {anomalies.anomalies.map((anomaly, i) => (
                        <MuiAlert key={i} severity={anomaly.severity === "critical" ? "error" : "warning"}>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {anomaly.message}
                          </Typography>
                          <Typography variant="caption">
                            Hour: {anomaly.hour}:00 | Count: {anomaly.count}
                          </Typography>
                        </MuiAlert>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}




