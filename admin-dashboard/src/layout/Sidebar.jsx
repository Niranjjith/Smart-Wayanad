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
  Analytics,
  Psychology,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

// Sidebar menu items
const items = [
  { to: "/", text: "Dashboard", icon: <Dashboard /> },
  { to: "/alerts", text: "Help Alerts", icon: <Sos /> },
  { to: "/locations", text: "Locations", icon: <Map /> },
  { to: "/bus", text: "Bus Routes", icon: <DirectionsBus /> },
  { to: "/climate", text: "Climate", icon: <Cloud /> },
  { to: "/chatbot", text: "Chatbot", icon: <Chat /> },
  { to: "/analytics", text: "AI Analytics", icon: <Analytics /> },
  { to: "/ai-ml", text: "AI/ML Features", icon: <Psychology /> },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: {
          width: 260,
          background: "linear-gradient(180deg, #1a1f3a 0%, #2d3561 100%)",
          color: "white",
          borderRight: "none",
          display: "flex",
          flexDirection: "column",
          boxShadow: "4px 0 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {/* Logo / Title */}
      <Toolbar
        sx={{
          minHeight: 72,
          background: "rgba(255, 255, 255, 0.05)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 900, color: "white" }}>
              SW
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: 0.5,
              background: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Smart Wayanad
          </Typography>
        </Box>
      </Toolbar>

      {/* Navigation List */}
      <Box sx={{ px: 1.5, flexGrow: 1, pt: 2 }}>
        <List sx={{ mt: 1 }}>
          {items.map((i, index) => (
            <motion.div
              key={i.to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ListItemButton
                component={Link}
                to={i.to}
                selected={pathname === i.to}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1.2,
                  transition: "all 0.3s ease",
                  "&.Mui-selected": {
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "white",
                    },
                  },
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.08)",
                    transform: "translateX(4px)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: pathname === i.to ? "white" : "rgba(255,255,255,0.7)",
                    minWidth: 40,
                  }}
                >
                  {i.icon}
                </ListItemIcon>
                <ListItemText
                  primary={i.text}
                  primaryTypographyProps={{
                    fontWeight: pathname === i.to ? 700 : 500,
                    fontSize: "0.95rem",
                  }}
                />
              </ListItemButton>
            </motion.div>
          ))}
        </List>
      </Box>

      {/* 🔴 SEND ALERT BUTTON */}
      <Box sx={{ p: 2 }}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            fullWidth
            variant="contained"
            component={Link}
            to="/send-alert"
            startIcon={<Sos />}
            sx={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              fontWeight: 700,
              py: 1.5,
              borderRadius: 2,
              boxShadow: "0px 4px 20px rgba(245, 87, 108, 0.4)",
              textTransform: "none",
              fontSize: "0.95rem",
              "&:hover": {
                background: "linear-gradient(135deg, #f5576c 0%, #f093fb 100%)",
                boxShadow: "0px 6px 25px rgba(245, 87, 108, 0.5)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Send Alert
          </Button>
        </motion.div>
      </Box>
    </Drawer>
  );
}
