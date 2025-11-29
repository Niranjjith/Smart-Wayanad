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
} from "@mui/material";
import Sidebar from "../layout/Sidebar.jsx";
import Topbar from "../layout/Topbar.jsx";
import API from "../services/api.js";
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
} from "recharts";
import {
  TrendingUp,
  Warning,
  LocationOn,
  Schedule,
} from "@mui/icons-material";

const COLORS = ["#667eea", "#f5576c", "#4facfe", "#43e97b", "#fa709a"];

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState(null);
  const [anomalies, setAnomalies] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [predData, anomData, dashData] = await Promise.allSettled([
        API.get("/analytics/alerts/predictions"),
        API.get("/analytics/alerts/anomalies"),
        API.get("/analytics/dashboard"),
      ]);

      if (predData.status === "fulfilled") {
        setPredictions(predData.value.data);
      }
      if (anomData.status === "fulfilled") {
        setAnomalies(anomData.value.data);
      }
      if (dashData.status === "fulfilled") {
        setDashboard(dashData.value.data);
      }
    } catch (err) {
      console.error("Analytics error:", err);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", bgcolor: "#f5f7fa", minHeight: "100vh" }}>
        <Sidebar />
        <Topbar title="AI Analytics" />
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

  return (
    <Box sx={{ display: "flex", bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Sidebar />
      <Topbar title="AI Analytics & Predictions" />

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
            <Typography variant="h4" fontWeight={800} mb={1}>
              🤖 AI-Powered Analytics
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Predictive analytics, anomaly detection, and smart insights
            </Typography>
          </Paper>
        </motion.div>

        <Grid container spacing={3}>
          {/* Alert Predictions */}
          {predictions && (
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" mb={2}>
                      <TrendingUp sx={{ color: "#667eea", mr: 1 }} />
                      <Typography variant="h6" fontWeight={700}>
                        Alert Predictions
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      Peak Hours: {predictions.peakHours?.join(", ") || "N/A"}
                    </Typography>
                    <Stack spacing={1}>
                      <Chip
                        label={`Expected Today: ${predictions.predictions?.expectedAlertsToday || 0}`}
                        color="primary"
                      />
                      <Chip
                        label={`Risk Level: ${predictions.predictions?.riskLevel?.toUpperCase() || "NORMAL"}`}
                        color={
                          predictions.predictions?.riskLevel === "high"
                            ? "error"
                            : "default"
                        }
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          )}

          {/* Anomaly Detection */}
          {anomalies && (
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" mb={2}>
                      <Warning sx={{ color: "#f5576c", mr: 1 }} />
                      <Typography variant="h6" fontWeight={700}>
                        Anomaly Detection
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {anomalies.anomalies?.length || 0} anomalies detected
                    </Typography>
                    <Chip
                      label={anomalies.riskAssessment?.message || "All normal"}
                      color={
                        anomalies.riskAssessment?.level === "high"
                          ? "error"
                          : "success"
                      }
                    />
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
                transition={{ delay: 0.4 }}
              >
                <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" mb={2}>
                      <LocationOn sx={{ color: "#f5576c", mr: 1 }} />
                      <Typography variant="h6" fontWeight={700}>
                        High Risk Areas
                      </Typography>
                    </Stack>
                    <Grid container spacing={2}>
                      {predictions.highRiskAreas.map((area, i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                          <Paper
                            sx={{
                              p: 2,
                              bgcolor: area.riskLevel === "high" ? "#fff5f5" : "#f0f9ff",
                              border: `2px solid ${
                                area.riskLevel === "high" ? "#f5576c" : "#4facfe"
                              }`,
                              borderRadius: 2,
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight={700}>
                              Area {i + 1}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {area.coordinates[0]}, {area.coordinates[1]}
                            </Typography>
                            <Chip
                              label={`${area.alertCount} alerts`}
                              size="small"
                              sx={{ mt: 1 }}
                              color={area.riskLevel === "high" ? "error" : "primary"}
                            />
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
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




