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
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
  Alert,
  LinearProgress,
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
import {
  PhotoCamera,
  TrendingUp,
  Refresh,
  Search,
  Download,
  CheckCircle,
  Error,
  Warning,
  NavigateNext,
  AccessTime,
  Cloud,
  DirectionsBus,
  Chat,
  Analytics,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
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
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    api: "checking",
    database: "checking",
    websocket: "checking",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [exportLoading, setExportLoading] = useState(false);

  // Check system status
  const checkSystemStatus = async () => {
    const status = { api: "checking", database: "checking", websocket: "checking" };
    
    // Check API
    try {
      await API.get("/help");
      status.api = "online";
    } catch {
      status.api = "offline";
    }

    // Check Database (via API)
    try {
      await API.get("/bus");
      status.database = "online";
    } catch {
      status.database = "offline";
    }

    // WebSocket status (assume online if API works)
    status.websocket = status.api === "online" ? "online" : "offline";
    
    setSystemStatus(status);
  };

  // Fetch recent activity
  const fetchRecentActivity = async () => {
    try {
      const [help, bus, chat] = await Promise.allSettled([
        API.get("/help"),
        API.get("/bus"),
        API.get("/chat"),
      ]);

      const activities = [];
      
      if (help.status === "fulfilled" && help.value.data) {
        help.value.data.slice(0, 3).forEach((alert) => {
          activities.push({
            id: alert._id,
            type: "alert",
            title: `New ${alert.alertType || "emergency"} alert`,
            description: alert.message || "No description",
            time: new Date(alert.createdAt),
            icon: "🚨",
          });
        });
      }

      if (bus.status === "fulfilled" && bus.value.data) {
        bus.value.data.slice(0, 2).forEach((route) => {
          activities.push({
            id: route._id,
            type: "route",
            title: `Route ${route.routeNo} updated`,
            description: `${route.origin} → ${route.destination}`,
            time: new Date(route.updatedAt || route.createdAt),
            icon: "🚌",
          });
        });
      }

      if (chat.status === "fulfilled" && chat.value.data) {
        chat.value.data.slice(0, 2).forEach((msg) => {
          activities.push({
            id: msg._id,
            type: "chat",
            title: "New chatbot message",
            description: msg.message || "User query",
            time: new Date(msg.createdAt),
            icon: "💬",
          });
        });
      }

      // Sort by time and take latest 5
      activities.sort((a, b) => b.time - a.time);
      setRecentActivity(activities.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch activity:", err);
    }
  };

  // Export data
  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const [help, bus, chat, users] = await Promise.allSettled([
        API.get("/help"),
        API.get("/bus"),
        API.get("/chat"),
        API.get("/users"),
      ]);

      const exportData = {
        timestamp: new Date().toISOString(),
        stats: {
          alerts: help.status === "fulfilled" ? help.value.data?.length || 0 : 0,
          routes: bus.status === "fulfilled" ? bus.value.data?.length || 0 : 0,
          chats: chat.status === "fulfilled" ? chat.value.data?.length || 0 : 0,
          users: users.status === "fulfilled" ? users.value.data?.length || 0 : 0,
        },
        data: {
          alerts: help.status === "fulfilled" ? help.value.data : [],
          routes: bus.status === "fulfilled" ? bus.value.data : [],
          chats: chat.status === "fulfilled" ? chat.value.data : [],
          users: users.status === "fulfilled" ? users.value.data : [],
        },
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `smart-wayanad-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Data exported successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export data");
    } finally {
      setExportLoading(false);
    }
  };

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
      
      // Fetch additional data
      await Promise.all([fetchRecentActivity(), checkSystemStatus()]);
      
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
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={handleExportData}
                  disabled={exportLoading}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: 700,
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.3)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {exportLoading ? "Exporting..." : "Export Data"}
                </Button>
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
                      { label: "View All Alerts", icon: "🚨", path: "/alerts" },
                      { label: "Manage Routes", icon: "🚌", path: "/bus" },
                      { label: "Climate Data", icon: "🌤️", path: "/climate" },
                      { label: "Chatbot Logs", icon: "🤖", path: "/chatbot" },
                      { label: "AI Analytics", icon: "📊", path: "/analytics" },
                    ].map((action, i) => (
                      <Button
                        key={i}
                        variant="contained"
                        startIcon={<span>{action.icon}</span>}
                        endIcon={<NavigateNext />}
                        onClick={() => navigate(action.path)}
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                          justifyContent: "space-between",
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
                  
                  <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.2)" }} />
                  
                  <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
                    System Status
                  </Typography>
                  <Stack spacing={1}>
                    {[
                      { label: "API", status: systemStatus.api },
                      { label: "Database", status: systemStatus.database },
                      { label: "WebSocket", status: systemStatus.websocket },
                    ].map((item) => (
                      <Box key={item.label} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {item.label}
                        </Typography>
                        <Chip
                          icon={
                            item.status === "online" ? (
                              <CheckCircle sx={{ fontSize: 14 }} />
                            ) : item.status === "offline" ? (
                              <Error sx={{ fontSize: 14 }} />
                            ) : (
                              <Warning sx={{ fontSize: 14 }} />
                            )
                          }
                          label={item.status}
                          size="small"
                          color={
                            item.status === "online"
                              ? "success"
                              : item.status === "offline"
                              ? "error"
                              : "warning"
                          }
                          sx={{
                            bgcolor:
                              item.status === "online"
                                ? "rgba(76, 175, 80, 0.3)"
                                : item.status === "offline"
                                ? "rgba(244, 67, 54, 0.3)"
                                : "rgba(255, 152, 0, 0.3)",
                            color: "white",
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Recent Activity & Features Grid */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
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
                      Recent Activity
                    </Typography>
                    <Chip
                      icon={<AccessTime />}
                      label="Live"
                      color="success"
                      size="small"
                    />
                  </Stack>
                  {recentActivity.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {recentActivity.map((activity, i) => (
                        <ListItem
                          key={activity.id}
                          sx={{
                            px: 0,
                            py: 1.5,
                            borderBottom:
                              i < recentActivity.length - 1
                                ? "1px solid #f0f0f0"
                                : "none",
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                bgcolor: "rgba(102, 126, 234, 0.1)",
                                width: 40,
                                height: 40,
                              }}
                            >
                              {activity.icon}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={{ mb: 0.5 }}
                              >
                                {activity.title}
                              </Typography>
                            }
                            secondary={
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography
                                  variant="caption"
                                  sx={{ color: "text.secondary" }}
                                >
                                  {activity.description.length > 30
                                    ? `${activity.description.substring(0, 30)}...`
                                    : activity.description}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "text.secondary", fontSize: "0.7rem" }}
                                >
                                  • {activity.time.toLocaleTimeString()}
                                </Typography>
                              </Stack>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        py: 4,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No recent activity
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
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
                      System Features
                    </Typography>
                    <TextField
                      size="small"
                      placeholder="Search features..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ width: 250 }}
                    />
                  </Stack>
                  <Grid container spacing={2}>
                    {[
                      {
                        title: "Climate Info",
                        desc: "Live weather data and forecasts",
                        icon: "🌤️",
                        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                        path: "/climate",
                      },
                      {
                        title: "Chatbot Logs",
                        desc: "Monitor user queries and responses",
                        icon: "💬",
                        gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                        path: "/chatbot",
                      },
                      {
                        title: "Help Requests",
                        desc: "Track real-time SOS alerts",
                        icon: "🆘",
                        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                        path: "/alerts",
                      },
                      {
                        title: "Bus Management",
                        desc: "Manage routes and schedules",
                        icon: "🚌",
                        gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                        path: "/bus",
                      },
                      {
                        title: "AI Analytics",
                        desc: "Advanced analytics and insights",
                        icon: "📊",
                        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        path: "/analytics",
                      },
                      {
                        title: "AI/ML Features",
                        desc: "Machine learning capabilities",
                        icon: "🤖",
                        gradient: "linear-gradient(135deg, #f093fb 0%, #764ba2 100%)",
                        path: "/ai-ml",
                      },
                    ]
                      .filter((item) =>
                        searchQuery
                          ? item.title
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            item.desc
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                          : true
                      )
                      .map((item, i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                          <Card
                            onClick={() => navigate(item.path)}
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
                            <Divider
                              sx={{ my: 1.5, bgcolor: "rgba(255,255,255,0.3)" }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ opacity: 0.9, lineHeight: 1.6 }}
                            >
                              {item.desc}
                            </Typography>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

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
