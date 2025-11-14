import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Button,
} from "@mui/material";
import {
  Dashboard,
  Sos,
  Map,
  DirectionsBus,
  Cloud,
  Chat,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

// Sidebar menu items
const items = [
  { to: "/", text: "Dashboard", icon: <Dashboard /> },
  { to: "/alerts", text: "Help Alerts", icon: <Sos /> },
  { to: "/locations", text: "Locations", icon: <Map /> },
  { to: "/bus", text: "Bus Routes", icon: <DirectionsBus /> },
  { to: "/climate", text: "Climate", icon: <Cloud /> },
  { to: "/chatbot", text: "Chatbot", icon: <Chat /> },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: {
          width: 260,
          bgcolor: "#15172a",
          color: "white",
          borderRight: "none",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Logo / Title */}
      <Toolbar sx={{ minHeight: 72 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, letterSpacing: 0.5 }}
        >
          Smart Wayanad
        </Typography>
      </Toolbar>

      {/* Navigation List */}
      <Box sx={{ px: 1, flexGrow: 1 }}>
        <List sx={{ mt: 1 }}>
          {items.map((i) => (
            <ListItemButton
              key={i.to}
              component={Link}
              to={i.to}
              selected={pathname === i.to}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&.Mui-selected": {
                  bgcolor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                {i.icon}
              </ListItemIcon>
              <ListItemText primary={i.text} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* 🔴 SEND ALERT BUTTON */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          component={Link}
          to="/send-alert"
          startIcon={<Sos />}
          sx={{
            bgcolor: "#e53935",
            color: "white",
            fontWeight: 700,
            py: 1.2,
            "&:hover": { bgcolor: "#c62828" },
            borderRadius: 2,
            boxShadow: "0px 4px 12px rgba(229, 57, 53, 0.3)",
          }}
        >
          Send Alert
        </Button>
      </Box>
    </Drawer>
  );
}
