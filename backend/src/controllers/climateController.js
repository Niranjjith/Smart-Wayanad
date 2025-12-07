// backend/src/controllers/climateController.js
import Climate from "../models/Climate.js";

// Helper function to generate realistic weather data
const generateWeatherData = (city = "Wayanad") => {
  const baseTemp = 22 + Math.random() * 8; // 22-30°C
  const descriptions = [
    "Partly cloudy with mild breeze",
    "Sunny and pleasant",
    "Light rain expected",
    "Clear skies",
    "Overcast conditions",
    "Misty morning, clearing later",
    "Sunny with occasional clouds",
  ];
  
  const icons = ["☀️", "⛅", "🌤️", "🌦️", "☁️", "🌧️", "🌩️"];
  
  const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
  const randomIcon = icons[Math.floor(Math.random() * icons.length)];

  return {
    city,
    temp: Math.round(baseTemp * 10) / 10,
    feelsLike: Math.round((baseTemp - 2 + Math.random() * 4) * 10) / 10,
    humidity: Math.round(65 + Math.random() * 15), // 65-80%
    wind: Math.round((3 + Math.random() * 5) * 10) / 10, // 3-8 km/h
    windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
    pressure: Math.round(1010 + Math.random() * 10), // 1010-1020 hPa
    visibility: Math.round(8 + Math.random() * 4), // 8-12 km
    uvIndex: Math.round(5 + Math.random() * 5), // 5-10
    description: randomDesc,
    icon: randomIcon,
    code: Math.floor(Math.random() * 10),
    sunrise: "06:15",
    sunset: "18:45",
    coordinates: {
      lat: 11.6854 + (Math.random() - 0.5) * 0.1,
      lon: 76.1320 + (Math.random() - 0.5) * 0.1,
    },
  };
};

// Generate 7-day forecast
const generateForecast = () => {
  const forecast = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const baseTemp = 20 + Math.random() * 10;
    const descriptions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Clear"];
    
    forecast.push({
      date: date.toISOString().split("T")[0],
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      temp: Math.round(baseTemp),
      minTemp: Math.round(baseTemp - 5),
      maxTemp: Math.round(baseTemp + 3),
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      icon: ["☀️", "⛅", "☁️", "🌦️", "🌤️"][Math.floor(Math.random() * 5)],
      humidity: Math.round(60 + Math.random() * 20),
      wind: Math.round((2 + Math.random() * 6) * 10) / 10,
    });
  }
  
  return forecast;
};

// Generate weather alerts
const generateAlerts = () => {
  const alerts = [];
  const alertTypes = [
    {
      type: "warning",
      title: "Heavy Rain Warning",
      description: "Heavy rainfall expected in the next 24 hours. Stay indoors if possible.",
      severity: "moderate",
    },
    {
      type: "advisory",
      title: "High UV Index",
      description: "UV index is high today. Use sunscreen and avoid prolonged sun exposure.",
      severity: "low",
    },
  ];
  
  // Randomly include 0-2 alerts
  const numAlerts = Math.floor(Math.random() * 3);
  for (let i = 0; i < numAlerts; i++) {
    const alert = { ...alertTypes[Math.floor(Math.random() * alertTypes.length)] };
    const startTime = new Date();
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 24);
    alert.startTime = startTime;
    alert.endTime = endTime;
    alerts.push(alert);
  }
  
  return alerts;
};

// GET /api/climate/current - Get current weather
export async function getClimate(req, res) {
  try {
    const { city = "Wayanad" } = req.query;

    // Generate current weather data
    const currentWeather = generateWeatherData(city);
    const forecast = generateForecast();
    const alerts = generateAlerts();

    const climateData = {
      ...currentWeather,
      forecast,
      alerts,
    };

    // Save to database (optional - for historical tracking)
    await Climate.create(climateData);

    res.json(climateData);
  } catch (error) {
    console.error("❌ Climate fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch climate data",
      details: error.message,
    });
  }
}

// GET /api/climate/forecast - Get weather forecast
export async function getForecast(req, res) {
  try {
    const { city = "Wayanad", days = 7 } = req.query;
    const forecast = generateForecast().slice(0, parseInt(days));
    
    res.json({
      city,
      forecast,
    });
  } catch (error) {
    console.error("❌ Forecast fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch forecast",
      details: error.message,
    });
  }
}

// GET /api/climate/history - Get historical weather data
export async function getHistory(req, res) {
  try {
    const { city = "Wayanad", days = 7 } = req.query;
    const limit = parseInt(days);
    
    // Get historical data from database
    const history = await Climate.find({ city })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("temp humidity wind description createdAt")
      .lean();

    // If no history, generate sample data
    if (history.length === 0) {
      const sampleHistory = [];
      for (let i = limit - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const weather = generateWeatherData(city);
        sampleHistory.push({
          ...weather,
          createdAt: date,
        });
      }
      return res.json({ city, history: sampleHistory });
    }

    res.json({ city, history });
  } catch (error) {
    console.error("❌ History fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch history",
      details: error.message,
    });
  }
}

// GET /api/climate/alerts - Get weather alerts
export async function getAlerts(req, res) {
  try {
    const { city = "Wayanad" } = req.query;
    const alerts = generateAlerts();
    
    res.json({
      city,
      alerts,
    });
  } catch (error) {
    console.error("❌ Alerts fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch alerts",
      details: error.message,
    });
  }
}

// GET /api/climate/stats - Get weather statistics
export async function getStats(req, res) {
  try {
    const { city = "Wayanad", days = 30 } = req.query;
    const limit = parseInt(days);
    
    const history = await Climate.find({ city })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("temp humidity wind")
      .lean();

    if (history.length === 0) {
      // Generate sample stats
      const temps = Array.from({ length: limit }, () => 22 + Math.random() * 8);
      const humidities = Array.from({ length: limit }, () => 65 + Math.random() * 15);
      const winds = Array.from({ length: limit }, () => 3 + Math.random() * 5);

      return res.json({
        city,
        stats: {
          avgTemp: Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10) / 10,
          maxTemp: Math.round(Math.max(...temps) * 10) / 10,
          minTemp: Math.round(Math.min(...temps) * 10) / 10,
          avgHumidity: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length),
          avgWind: Math.round((winds.reduce((a, b) => a + b, 0) / winds.length) * 10) / 10,
          maxWind: Math.round(Math.max(...winds) * 10) / 10,
        },
      });
    }

    const temps = history.map((h) => h.temp);
    const humidities = history.map((h) => h.humidity);
    const winds = history.map((h) => h.wind);

    res.json({
      city,
      stats: {
        avgTemp: Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10) / 10,
        maxTemp: Math.round(Math.max(...temps) * 10) / 10,
        minTemp: Math.round(Math.min(...temps) * 10) / 10,
        avgHumidity: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length),
        avgWind: Math.round((winds.reduce((a, b) => a + b, 0) / winds.length) * 10) / 10,
        maxWind: Math.round(Math.max(...winds) * 10) / 10,
      },
    });
  } catch (error) {
    console.error("❌ Stats fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch stats",
      details: error.message,
    });
  }
}
