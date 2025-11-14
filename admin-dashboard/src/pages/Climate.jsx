import { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import Sidebar from "../layout/Sidebar.jsx";
import Footer from "../layout/Footer.jsx";
import API from "../services/api.js";
import { toast } from "react-toastify";

export default function Climate() {
  const [climate, setClimate] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // ⬅️ Now fetching from your backend
        const { data } = await API.get("/climate/current?city=Wayanad");

        setClimate(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch climate data");
      }
    };

    fetchWeather();
  }, []);

  return (
    <Box sx={{ display: "flex", bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: "260px",
          p: 4,
          mt: 2,
          minHeight: "100vh",
        }}
      >
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: "#1e293b" }}>
          🌤 Current Climate in Wayanad
        </Typography>

        {climate ? (
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              maxWidth: 600,
              bgcolor: "white",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Temperature: {climate.temp}°C
            </Typography>
            <Typography>Humidity: {climate.humidity}%</Typography>
            <Typography>Wind Speed: {climate.wind} km/h</Typography>
            <Typography>Description: {climate.description}</Typography>
          </Paper>
        ) : (
          <Typography>Loading...</Typography>
        )}

        <Footer />
      </Box>
    </Box>
  );
}
