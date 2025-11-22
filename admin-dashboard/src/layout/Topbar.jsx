import { AppBar, Toolbar, Typography, Box, IconButton, Badge, Avatar, Chip } from "@mui/material";
import { Notifications, Logout } from "@mui/icons-material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";

export default function Topbar({ title = "Dashboard", notifCount = 0 }) {
  const { logout } = useContext(AuthContext);
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        ml: "260px",
        width: "calc(100% - 260px)",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        color: "black",
        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Toolbar sx={{ minHeight: 72, px: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            fontSize: "1.5rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label="Admin"
            size="small"
            sx={{
              bgcolor: "rgba(102, 126, 234, 0.1)",
              color: "#667eea",
              fontWeight: 600,
              height: 28,
            }}
          />
          <IconButton
            sx={{
              bgcolor: "rgba(102, 126, 234, 0.08)",
              "&:hover": {
                bgcolor: "rgba(102, 126, 234, 0.15)",
                transform: "scale(1.1)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <Badge badgeContent={notifCount} color="error">
              <Notifications sx={{ color: "#667eea" }} />
            </Badge>
          </IconButton>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <IconButton
              onClick={logout}
              title="Logout"
              sx={{
                bgcolor: "rgba(245, 87, 108, 0.1)",
                "&:hover": {
                  bgcolor: "rgba(245, 87, 108, 0.2)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Logout sx={{ color: "#f5576c" }} />
            </IconButton>
          </motion.div>
          <Avatar
            sx={{
              ml: 1,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              width: 40,
              height: 40,
              fontWeight: 700,
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
            }}
          >
            SW
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
