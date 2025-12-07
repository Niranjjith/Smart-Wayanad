import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import Sidebar from "../layout/Sidebar.jsx";
import Topbar from "../layout/Topbar.jsx";
import API from "../services/api.js";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Toolbar } from "@mui/material";
import {
  Refresh,
  Thermostat,
  WaterDrop,
  Air,
  Visibility,
  WbSunny,
  Cloud,
  Warning,
  TrendingUp,
  CalendarToday,
  LocationOn,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function Climate() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [city, setCity] = useState("Wayanad");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("current"); // current, forecast, history, stats

  const cities = ["Wayanad", "Kalpetta", "Mananthavady", "Sultan Bathery", "Vythiri"];

  const fetchAllData = async () => {
    try {
      setRefreshing(true);
      const [currentRes, forecastRes, historyRes, alertsRes, statsRes] = await Promise.allSettled([
        API.get(`/climate/current?city=${city}`),
        API.get(`/climate/forecast?city=${city}&days=7`),
        API.get(`/climate/history?city=${city}&days=7`),
        API.get(`/climate/alerts?city=${city}`),
        API.get(`/climate/stats?city=${city}&days=30`),
      ]);

      if (currentRes.status === "fulfilled") {
        setCurrentWeather(currentRes.value.data);
        setForecast(currentRes.value.data.forecast || []);
        setAlerts(currentRes.value.data.alerts || []);
      }

      if (forecastRes.status === "fulfilled" && forecastRes.value.data) {
        setForecast(forecastRes.value.data.forecast || []);
      }

      if (historyRes.status === "fulfilled" && historyRes.value.data) {
        setHistory(historyRes.value.data.history || []);
      }

      if (alertsRes.status === "fulfilled" && alertsRes.value.data) {
        setAlerts(alertsRes.value.data.alerts || []);
      }

      if (statsRes.status === "fulfilled" && statsRes.value.data) {
        setStats(statsRes.value.data.stats || null);
      }
    } catch (err) {
      console.error("Failed to fetch climate data:", err);
      toast.error("Failed to load climate data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [city]);

  const getWeatherIcon = (icon) => {
    const iconMap = {
      "☀️": <WbSunny sx={{ fontSize: 40, color: "#FFA726" }} />,
      "⛅": <Cloud sx={{ fontSize: 40, color: "#90CAF9" }} />,
      "🌤️": <WbSunny sx={{ fontSize: 40, color: "#FFB74D" }} />,
      "🌦️": <Cloud sx={{ fontSize: 40, color: "#64B5F6" }} />,
      "☁️": <Cloud sx={{ fontSize: 40, color: "#78909C" }} />,
      "🌧️": <WaterDrop sx={{ fontSize: 40, color: "#42A5F5" }} />,
      "🌩️": <Warning sx={{ fontSize: 40, color: "#EF5350" }} />,
    };
    return iconMap[icon] || <WbSunny sx={{ fontSize: 40 }} />;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: "success",
      moderate: "warning",
      high: "error",
      extreme: "error",
    };
    return colors[severity] || "info";
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", bgcolor: "#f5f7fa", minHeight: "100vh" }}>
        <Sidebar />
        <Topbar title="Climate" />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: "260px",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Sidebar />
      <Topbar title="Climate" />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: "260px",
          pt: 3,
          px: 3,
          minHeight: "100vh",
        }}
      >
        <Toolbar />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
            >
              <Box>
                <Typography variant="h4" fontWeight={800} mb={1}>
                  🌤️ Climate Information
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Real-time weather data and forecasts for Wayanad region
                </Typography>
              </Box>
              <Stack direction="row" spacing={2} alignItems="center">
                <FormControl size="small" sx={{ minWidth: 150, bgcolor: "rgba(255,255,255,0.2)" }}>
                  <InputLabel sx={{ color: "white" }}>Location</InputLabel>
                  <Select
                    value={city}
                    label="Location"
                    onChange={(e) => setCity(e.target.value)}
                    sx={{
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255,255,255,0.3)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255,255,255,0.5)",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "white",
                      },
                    }}
                  >
                    {cities.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={fetchAllData}
                  disabled={refreshing}
                  sx={{
                    bgcolor: "white",
                    color: "#667eea",
                    fontWeight: 700,
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.9)",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {refreshing ? "Refreshing..." : "Refresh"}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </motion.div>

        {/* Weather Alerts */}
        {alerts && alerts.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {alerts.map((alert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Alert
                  severity={getSeverityColor(alert.severity)}
                  sx={{ mb: 1, borderRadius: 2 }}
                  icon={<Warning />}
                >
                  <Typography fontWeight={700}>{alert.title}</Typography>
                  <Typography variant="body2">{alert.description}</Typography>
                </Alert>
              </motion.div>
            ))}
          </Box>
        )}

        {/* Current Weather Card */}
        {currentWeather && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    height: "100%",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                          <LocationOn />
                          <Typography variant="h5" fontWeight={700}>
                            {currentWeather.city}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                          <Box>{getWeatherIcon(currentWeather.icon)}</Box>
                          <Box>
                            <Typography variant="h2" fontWeight={800}>
                              {currentWeather.temp}°C
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                              {currentWeather.description}
                            </Typography>
                            {currentWeather.feelsLike && (
                              <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                Feels like {currentWeather.feelsLike}°C
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </Box>
                      <Chip
                        label="Live"
                        color="success"
                        sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                      />
                    </Stack>

                    <Divider sx={{ my: 3, bgcolor: "rgba(255,255,255,0.2)" }} />

                    <Grid container spacing={3}>
                      <Grid item xs={6} sm={4}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <WaterDrop sx={{ fontSize: 28 }} />
                          <Box>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                              Humidity
                            </Typography>
                            <Typography variant="h6" fontWeight={700}>
                              {currentWeather.humidity}%
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Air sx={{ fontSize: 28 }} />
                          <Box>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                              Wind Speed
                            </Typography>
                            <Typography variant="h6" fontWeight={700}>
                              {currentWeather.wind} km/h
                            </Typography>
                            {currentWeather.windDirection && (
                              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                {currentWeather.windDirection}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </Grid>
                      {currentWeather.pressure && (
                        <Grid item xs={6} sm={4}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Thermostat sx={{ fontSize: 28 }} />
                            <Box>
                              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Pressure
                              </Typography>
                              <Typography variant="h6" fontWeight={700}>
                                {currentWeather.pressure} hPa
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>
                      )}
                      {currentWeather.visibility && (
                        <Grid item xs={6} sm={4}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Visibility sx={{ fontSize: 28 }} />
                            <Box>
                              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Visibility
                              </Typography>
                              <Typography variant="h6" fontWeight={700}>
                                {currentWeather.visibility} km
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>
                      )}
                      {currentWeather.uvIndex && (
                        <Grid item xs={6} sm={4}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <WbSunny sx={{ fontSize: 28 }} />
                            <Box>
                              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                UV Index
                              </Typography>
                              <Typography variant="h6" fontWeight={700}>
                                {currentWeather.uvIndex}
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>
                      )}
                      {currentWeather.sunrise && currentWeather.sunset && (
                        <>
                          <Grid item xs={6} sm={4}>
                            <Box>
                              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Sunrise
                              </Typography>
                              <Typography variant="h6" fontWeight={700}>
                                {currentWeather.sunrise}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Box>
                              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Sunset
                              </Typography>
                              <Typography variant="h6" fontWeight={700}>
                                {currentWeather.sunset}
                              </Typography>
                            </Box>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Statistics Card */}
            {stats && (
              <Grid item xs={12} md={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      height: "100%",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" fontWeight={700} mb={2}>
                        📊 30-Day Statistics
                      </Typography>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Average Temperature
                          </Typography>
                          <Typography variant="h5" fontWeight={700} color="primary">
                            {stats.avgTemp}°C
                          </Typography>
                        </Box>
                        <Divider />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Temperature Range
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {stats.minTemp}°C - {stats.maxTemp}°C
                          </Typography>
                        </Box>
                        <Divider />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Average Humidity
                          </Typography>
                          <Typography variant="h6" fontWeight={700} color="primary">
                            {stats.avgHumidity}%
                          </Typography>
                        </Box>
                        <Divider />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Average Wind Speed
                          </Typography>
                          <Typography variant="h6" fontWeight={700} color="primary">
                            {stats.avgWind} km/h
                          </Typography>
                        </Box>
                        {stats.maxWind && (
                          <>
                            <Divider />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Max Wind Speed
                              </Typography>
                              <Typography variant="body1" fontWeight={600}>
                                {stats.maxWind} km/h
                              </Typography>
                            </Box>
                          </>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            )}
          </Grid>
        )}

        {/* 7-Day Forecast */}
        {forecast && forecast.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={3}>
                  📅 7-Day Forecast
                </Typography>
                <Grid container spacing={2}>
                  {forecast.map((day, idx) => (
                    <Grid item xs={6} sm={4} md={12 / 7} key={idx}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: "center",
                          borderRadius: 2,
                          bgcolor: idx === 0 ? "rgba(102, 126, 234, 0.1)" : "transparent",
                          border: idx === 0 ? "2px solid #667eea" : "1px solid #e0e0e0",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          {day.day || new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                        </Typography>
                        <Box sx={{ my: 1 }}>
                          {getWeatherIcon(day.icon)}
                        </Box>
                        <Typography variant="h6" fontWeight={700}>
                          {day.temp}°C
                        </Typography>
                        {day.minTemp && day.maxTemp && (
                          <Typography variant="caption" color="text.secondary">
                            {day.minTemp}° / {day.maxTemp}°
                          </Typography>
                        )}
                        <Typography variant="caption" display="block" mt={0.5}>
                          {day.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Charts Section */}
        {history && history.length > 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} mb={2}>
                      📈 Temperature Trend (7 Days)
                    </Typography>
                    <Box sx={{ width: "100%", height: 300 }}>
                      <ResponsiveContainer>
                        <AreaChart data={history.map((h) => ({
                          date: new Date(h.createdAt || h.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                          temp: h.temp,
                        }))}>
                          <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" stroke="#666" style={{ fontSize: "12px" }} />
                          <YAxis stroke="#666" style={{ fontSize: "12px" }} />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="temp"
                            stroke="#667eea"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorTemp)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} mb={2}>
                      💨 Wind & Humidity (7 Days)
                    </Typography>
                    <Box sx={{ width: "100%", height: 300 }}>
                      <ResponsiveContainer>
                        <BarChart data={history.map((h) => ({
                          date: new Date(h.createdAt || h.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                          humidity: h.humidity,
                          wind: h.wind,
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" stroke="#666" style={{ fontSize: "12px" }} />
                          <YAxis stroke="#666" style={{ fontSize: "12px" }} />
                          <Tooltip />
                          <Bar dataKey="humidity" fill="#4facfe" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="wind" fill="#43e97b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        )}

        <Box sx={{ height: 50 }} />
      </Box>
    </Box>
  );
}
