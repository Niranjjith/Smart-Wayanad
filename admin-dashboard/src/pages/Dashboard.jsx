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
} from "@mui/material";
import Sidebar from "../layout/Sidebar.jsx";
import StatCard from "../components/StatCard.jsx";
import Footer from "../layout/Footer.jsx";
import API from "../services/api.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext.jsx";
import { PhotoCamera } from "@mui/icons-material";

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

  // Fetch dashboard data
  useEffect(() => {
    (async () => {
      try {
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
      } catch (err) {
        console.error(err);
        toast.error("Failed to load stats");
      }
    })();
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
    <Box sx={{ display: "flex", bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Sidebar />

      {/* Header */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: "260px",
          right: 0,
          height: 72,
          bgcolor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
          zIndex: 1200,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Smart Wayanad Dashboard
        </Typography>
        <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
          <Avatar
            src={profileImage}
            sx={{ bgcolor: "#7c3aed", width: 42, height: 42 }}
          >
            SW
          </Avatar>
        </IconButton>

        {/* Avatar Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleChangeImage}>Change Profile Image</MenuItem>
          <MenuItem onClick={logout}>Logout</MenuItem>
        </Menu>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: "260px",
          pt: 10,
          px: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        {/* Centered Stat Cards */}
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 5, maxWidth: 1200 }}
        >
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              title="Users"
              value={stats.users}
              subtitle="Registered"
              gradient="linear-gradient(135deg,#0ea5e9,#38bdf8)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              title="Help Alerts"
              value={stats.alerts}
              subtitle="Last 7 days"
              gradient="linear-gradient(135deg,#ef4444,#f59e0b)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              title="Locations"
              value={stats.locations}
              subtitle="Police / Hospital / Taxi / Auto"
              gradient="linear-gradient(135deg,#06b6d4,#22d3ee)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              title="Bus Routes"
              value={stats.buses}
              subtitle="Active routes"
              gradient="linear-gradient(135deg,#84cc16,#22c55e)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              title="Chatbot Msgs"
              value={stats.chatbot}
              subtitle="Today"
              gradient="linear-gradient(135deg,#8b5cf6,#a855f7)"
            />
          </Grid>
        </Grid>

        {/* Weekly Chart */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            width: "100%",
            maxWidth: 1100,
            mb: 4,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 2, textAlign: "center" }}
          >
            Help Alerts (Weekly)
          </Typography>
          <Box sx={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="alerts"
                  stroke="#ef4444"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* More Features */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 1100,
            textAlign: "center",
            mb: 5,
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            More Features
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {[
              { title: "Climate Info", desc: "Live weather data and forecasts." },
              { title: "Chatbot Logs", desc: "Monitor user queries and responses." },
              { title: "Help Requests", desc: "Track real-time SOS alerts." },
              { title: "Bus Timings", desc: "Manage route and schedules." },
            ].map((item, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    height: "100%",
                    textAlign: "center",
                    transition: "0.3s",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: 5 },
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={700}>
                    {item.title}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.4 }}
                  >
                    {item.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Footer />
      </Box>

      {/* Image Upload Dialog */}
      <Dialog open={openUpload} onClose={() => setOpenUpload(false)}>
        <DialogTitle>Change Profile Image</DialogTitle>
        <DialogContent>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 1 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<PhotoCamera />}
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
          <Button onClick={() => setOpenUpload(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
