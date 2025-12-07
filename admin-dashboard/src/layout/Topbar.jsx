import { AppBar, Toolbar, Typography, Box, IconButton, Badge, Avatar, Chip, Menu, MenuItem } from "@mui/material";
import { Notifications, Logout, Settings } from "@mui/icons-material";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../services/api.js";

export default function Topbar({ title = "Dashboard", notifCount = 0 }) {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    // Load profile image from localStorage
    const storedImage = localStorage.getItem("adminAvatar");
    if (storedImage) {
      setProfileImage(storedImage);
    }
    
    // Also try to fetch from API
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        if (res.data?.profilePhoto) {
          setProfileImage(res.data.profilePhoto);
          localStorage.setItem("adminAvatar", res.data.profilePhoto);
        }
      } catch (err) {
        // Silently fail - use localStorage value
      }
    };
    fetchProfile();
  }, []);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    handleMenuClose();
    navigate("/settings");
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

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
              onClick={handleAvatarClick}
              sx={{
                ml: 1,
                p: 0,
              }}
            >
              <Avatar
                src={profileImage}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  width: 40,
                  height: 40,
                  fontWeight: 700,
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                  cursor: "pointer",
                }}
              >
                {!profileImage && (user?.name?.[0]?.toUpperCase() || "A")}
              </Avatar>
            </IconButton>
          </motion.div>
        </Box>
      </Toolbar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleSettings}>
          <Settings sx={{ mr: 2, fontSize: 20, color: "#667eea" }} />
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 2, fontSize: 20, color: "#f5576c" }} />
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
