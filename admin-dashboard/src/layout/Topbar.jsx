import { AppBar, Toolbar, Typography, Box, IconButton, Badge, Avatar } from "@mui/material";
import { Notifications, Logout } from "@mui/icons-material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Topbar({ title = "Dashboard", notifCount = 0 }) {
  const { logout } = useContext(AuthContext);
  return (
    <AppBar position="fixed" elevation={2} sx={{ ml: "260px", width: "calc(100% - 260px)", bgcolor: "white", color: "black" }}>
      <Toolbar sx={{ minHeight: 72 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton>
          <Badge badgeContent={notifCount} color="error">
            <Notifications />
          </Badge>
        </IconButton>
        <IconButton onClick={logout} title="Logout">
          <Logout />
        </IconButton>
        <Avatar sx={{ ml: 1, bgcolor: "#673ab7" }}>SW</Avatar>
      </Toolbar>
    </AppBar>
  );
}
