import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { user, login } = useContext(AuthContext);
  const [username, setUsername] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667EEA 0%, #764BA2 50%, #F093FB 100%)",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={20}
          sx={{
            p: 5,
            borderRadius: 4,
            backgroundColor: "#FFFFFF",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                margin: "0 auto 24px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
              }}
            >
              <Lock sx={{ fontSize: 40, color: "#FFFFFF" }} />
            </Box>
            <Typography
              variant="h4"
              fontWeight={800}
              gutterBottom
              sx={{
                color: "#1A1A1A",
                fontSize: "32px",
                letterSpacing: "-0.5px",
                mb: 1,
              }}
            >
              Smart Wayanad
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#424242",
                fontSize: "18px",
                fontWeight: 500,
              }}
            >
              Admin Login
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#FFFFFF",
                  "& fieldset": {
                    borderColor: "#E0E0E0",
                    borderWidth: "1.5px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#667EEA",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667EEA",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#757575",
                  fontSize: "16px",
                },
                "& .MuiInputBase-input": {
                  color: "#1A1A1A",
                  fontSize: "16px",
                  padding: "14px",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: "#667EEA" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#FFFFFF",
                  "& fieldset": {
                    borderColor: "#E0E0E0",
                    borderWidth: "1.5px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#667EEA",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667EEA",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#757575",
                  fontSize: "16px",
                },
                "& .MuiInputBase-input": {
                  color: "#1A1A1A",
                  fontSize: "16px",
                  padding: "14px",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#667EEA" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "#757575" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              size="large"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
                fontSize: "18px",
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5568D3 0%, #6B3D91 100%)",
                  boxShadow: "0 12px 30px rgba(102, 126, 234, 0.5)",
                },
              }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
