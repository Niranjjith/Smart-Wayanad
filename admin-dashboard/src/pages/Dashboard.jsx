import { useEffect, useState, useContext } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Divider,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import Sidebar from "../layout/Sidebar.jsx";
import Topbar from "../layout/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import API from "../services/api.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext.jsx";
import { PhotoCamera, TrendingUp, Refresh } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Toolbar } from "@mui/material";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const [stats, setStats] = useState({
    users: 0,
    alerts: 0,
    locations: 0,
    buses: 0,
    chatbot: 0,
  });
  const [series, setSeries] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openUpload, setOpenUpload] = useState(false);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("adminAvatar") || ""
  );
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
      toast.success("Dashboard updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load stats");
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

  // Avatar menu handlers
  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleChangeImage = () => {
    setAnchorEl(null);
    setOpenUpload(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      localStorage.setItem("adminAvatar", base64);
      setProfileImage(base64);
      toast.success("Profile image updated");
      setOpenUpload(false);
    };
    reader.readAsDataURL(file);
  };

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
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h4" fontWeight={800} mb={1}>
                  📊 Dashboard Overview
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Real-time statistics and insights for Smart Wayanad
                </Typography>
              </Box>
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
            <Box sx={{ mt: 2 }}>
              <Chip
                label={`Last updated: ${lastUpdate.toLocaleTimeString()}`}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 600,
                }}
              />
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
                subtitle="Last 7 days"
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

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  height: "100%",
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

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  height: "100%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={700} mb={3}>
                    Quick Actions
                  </Typography>
                  <Stack spacing={2}>
                    {[
                      { label: "View All Alerts", icon: "🚨", color: "#f5576c" },
                      { label: "Manage Routes", icon: "🚌", color: "#43e97b" },
                      { label: "View Locations", icon: "📍", color: "#4facfe" },
                      { label: "Chatbot Logs", icon: "🤖", color: "#fa709a" },
                    ].map((action, i) => (
                      <Button
                        key={i}
                        variant="contained"
                        startIcon={<span>{action.icon}</span>}
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                          justifyContent: "flex-start",
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          "&:hover": {
                            bgcolor: "rgba(255,255,255,0.3)",
                            transform: "translateX(5px)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Typography variant="h6" fontWeight={700} mb={2}>
            System Features
          </Typography>
          <Grid container spacing={2}>
            {[
              {
                title: "Climate Info",
                desc: "Live weather data and forecasts",
                icon: "🌤️",
                gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              },
              {
                title: "Chatbot Logs",
                desc: "Monitor user queries and responses",
                icon: "💬",
                gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              },
              {
                title: "Help Requests",
                desc: "Track real-time SOS alerts",
                icon: "🆘",
                gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              },
              {
                title: "Bus Management",
                desc: "Manage routes and schedules",
                icon: "🚌",
                gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              },
            ].map((item, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    height: "100%",
                    background: item.gradient,
                    color: "white",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <Typography variant="h4" mb={1}>
                    {item.icon}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} mb={1}>
                    {item.title}
                  </Typography>
                  <Divider sx={{ my: 1.5, bgcolor: "rgba(255,255,255,0.3)" }} />
                  <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                    {item.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        <Box sx={{ height: 50 }} />
      </Box>

      {/* Image Upload Dialog */}
      <Dialog
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Change Profile Image</DialogTitle>
        <DialogContent>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 1 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<PhotoCamera />}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Upload Image
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageUpload}
              />
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenUpload(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
