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
        // ✅ You can later replace this with your backend proxy API endpoint: /api/climate
        const { data } = await API.get(
          "https://api.open-meteo.com/v1/forecast?latitude=11.6854&longitude=76.1320&current_weather=true"
        );
        setClimate(data.current_weather);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch weather data");
      }
    };
    fetchWeather();
  }, []);

  return (
    <Box sx={{ display: "flex", bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      {/* ✅ Left Sidebar */}
      <Sidebar />

      {/* ✅ Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: "260px", // same width as sidebar
          p: 4,
          mt: 2,
          minHeight: "100vh",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ mb: 3, color: "#1e293b" }}
        >
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
              Temperature: {climate.temperature}°C
            </Typography>
            <Typography>Windspeed: {climate.windspeed} km/h</Typography>
            <Typography>Weather Code: {climate.weathercode}</Typography>
          </Paper>
        ) : (
          <Typography>Loading...</Typography>
        )}

        <Footer />
      </Box>
    </Box>
  );
}
