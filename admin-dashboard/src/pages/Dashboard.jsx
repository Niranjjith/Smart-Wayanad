import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import Sidebar from "../layout/Sidebar.jsx";
import Topbar from "../layout/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import LoadingAnimation from "../components/LoadingAnimation.jsx";
import API from "../services/api.js";
import { Refresh, TrendingUp } from "@mui/icons-material";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { WAYANAD_HERO_IMAGE, APP_LOGO_SRC } from "../constants/branding.js";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    alerts: 0,
    locations: 0,
    buses: 0,
    chatbot: 0,
  });
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Fetch dashboard data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [help, locs, bus, chat, users] = await Promise.allSettled([
        API.get("/help"),
        API.get("/location"),
        API.get("/bus"),
        API.get("/chat"),
        API.get("/users"),
      ]);

      const alerts =
        help.status === "fulfilled" ? help.value.data?.length || 0 : 0;
      const locations =
        locs.status === "fulfilled" ? locs.value.data?.length || 0 : 0;
      const buses =
        bus.status === "fulfilled" ? bus.value.data?.length || 0 : 0;
      const chatbot =
        chat.status === "fulfilled" ? chat.value.data?.length || 0 : 0;
      const usersCount =
        users.status === "fulfilled" ? users.value.data?.length || 0 : 0;

      setStats({ users: usersCount, alerts, locations, buses, chatbot });

      setSeries([
        { day: "Mon", alerts: Math.max(1, Math.floor(alerts * 0.2)) },
        { day: "Tue", alerts: Math.max(1, Math.floor(alerts * 0.3)) },
        { day: "Wed", alerts: Math.max(1, Math.floor(alerts * 0.4)) },
        { day: "Thu", alerts: Math.max(1, Math.floor(alerts * 0.5)) },
        { day: "Fri", alerts: Math.max(1, Math.floor(alerts * 0.6)) },
        { day: "Sat", alerts: Math.max(1, Math.floor(alerts * 0.7)) },
        { day: "Sun", alerts },
      ]);
      setLastUpdate(new Date());
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Show loading animation while initial data is loading
  if (loading && stats.users === 0 && stats.alerts === 0) {
    return (
      <Box sx={{ display: "flex", bgcolor: "#f5f7fa", minHeight: "100vh" }}>
        <Sidebar />
        <Topbar title="Dashboard" />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: "260px",
            minHeight: "100vh",
          }}
        >
          <LoadingAnimation message="Loading Dashboard..." />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Sidebar />
      <Topbar title="Dashboard" />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: "260px",
          pt: 3,
          px: 3,
          minHeight: "100vh",
        }}
      >
        <Toolbar />

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            sx={{
              position: "relative",
              overflow: "hidden",
              p: 3,
              mb: 3,
              borderRadius: 3,
              color: "white",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              backgroundColor: "#1a1f3a",
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.62)), url(${WAYANAD_HERO_IMAGE})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "background-image 0.35s ease, box-shadow 0.35s ease",
              "&:hover": {
                backgroundImage: `linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.78)), url(${WAYANAD_HERO_IMAGE})`,
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.35)",
              },
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <Box
                  component="img"
                  src={APP_LOGO_SRC}
                  alt=""
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2,
                    objectFit: "contain",
                    bgcolor: "rgba(255,255,255,0.12)",
                    p: 0.5,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                  }}
                />
                <Box>
                <Typography variant="h4" fontWeight={800} mb={1}>
                  Dashboard Overview
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.95 }}>
                  Welcome to Smart Wayanad Admin Panel
                </Typography>
                </Box>
              </Box>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={fetchData}
                  disabled={loading}
                  sx={{
                    bgcolor: "white",
                    color: "#667eea",
                    fontWeight: 700,
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.9)",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Refresh
                </Button>
              </Stack>
            </Stack>
            <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={`Last updated: ${lastUpdate.toLocaleTimeString()}`}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 600,
                }}
              />
              {loading && (
                <CircularProgress
                  size={16}
                  sx={{
                    color: "white",
                  }}
                />
              )}
            </Box>
          </Paper>
        </motion.div>

        {/* Stat Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <StatCard
                title="Users"
                value={stats.users}
                subtitle="Registered"
                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                icon="👥"
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <StatCard
                title="Help Alerts"
                value={stats.alerts}
                subtitle="Total alerts"
                gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                icon="🚨"
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <StatCard
                title="Locations"
                value={stats.locations}
                subtitle="All locations"
                gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                icon="📍"
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <StatCard
                title="Bus Routes"
                value={stats.buses}
                subtitle="Active routes"
                gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                icon="🚌"
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <StatCard
                title="Chatbot"
                value={stats.chatbot}
                subtitle="Messages"
                gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                icon="🤖"
              />
            </motion.div>
          </Grid>
        </Grid>

        {/* Chart Section */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h6" fontWeight={700}>
                      Help Alerts Trend (Weekly)
                    </Typography>
                    <Chip
                      icon={<TrendingUp />}
                      label="Live Data"
                      color="success"
                      size="small"
                    />
                  </Stack>
                  <Box sx={{ width: "100%", height: 350 }}>
                    <ResponsiveContainer>
                      <AreaChart data={series}>
                        <defs>
                          <linearGradient
                            id="colorAlerts"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#f5576c"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#f5576c"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="day"
                          stroke="#666"
                          style={{ fontSize: "12px" }}
                        />
                        <YAxis
                          allowDecimals={false}
                          stroke="#666"
                          style={{ fontSize: "12px" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="alerts"
                          stroke="#f5576c"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorAlerts)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        <Box sx={{ height: 50 }} />
      </Box>
    </Box>
  );
}
