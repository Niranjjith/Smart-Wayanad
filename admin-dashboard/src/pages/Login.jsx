import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Container, TextField, Button, Typography, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { user, login } = useContext(AuthContext);
  const [username, setUsername] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123456");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 12 }}>
      <Paper elevation={4} sx={{ p: 5, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom align="center">
          Smart Wayanad Admin Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" size="large" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
