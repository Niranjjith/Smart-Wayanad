// backend/src/controllers/climateController.js
import Climate from "../models/Climate.js";
import { fetchOpenMeteoWeather, mapToAppWeather } from "../services/weatherService.js";

// GET /api/climate/current - Get current weather (real data from Open-Meteo)
export async function getClimate(req, res) {
  try {
    const { city = "Wayanad" } = req.query;
    const normalizedCity = String(city).trim() || "Wayanad";

    const data = await fetchOpenMeteoWeather(normalizedCity);
    const climateData = mapToAppWeather(normalizedCity, data);

    // Save current snapshot to DB for history/stats (only current fields)
    await Climate.create({
      city: normalizedCity,
      temp: climateData.temp,
      feelsLike: climateData.feelsLike,
      humidity: climateData.humidity,
      wind: climateData.wind,
      windDirection: climateData.windDirection,
      pressure: climateData.pressure,
      visibility: climateData.visibility,
      uvIndex: climateData.uvIndex,
      description: climateData.description,
      icon: climateData.icon,
      code: climateData.code,
      sunrise: climateData.sunrise,
      sunset: climateData.sunset,
      forecast: climateData.forecast,
      alerts: climateData.alerts,
    }).catch((err) => console.warn("Climate save (history):", err.message));

    res.json(climateData);
  } catch (error) {
    console.error("❌ Climate fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch climate data",
      details: error.message,
    });
  }
}

// GET /api/climate/forecast - Get weather forecast (real data from Open-Meteo)
export async function getForecast(req, res) {
  try {
    const { city = "Wayanad", days = 7 } = req.query;
    const normalizedCity = String(city).trim() || "Wayanad";
    const data = await fetchOpenMeteoWeather(normalizedCity);
    const mapped = mapToAppWeather(normalizedCity, data);
    const forecast = (mapped.forecast || []).slice(0, parseInt(days, 10) || 7);

    res.json({
      city: normalizedCity,
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

// GET /api/climate/history - Get historical weather data (from DB, real over time)
export async function getHistory(req, res) {
  try {
    const { city = "Wayanad", days = 7 } = req.query;
    const limit = Math.min(parseInt(days, 10) || 7, 30);
    const normalizedCity = String(city).trim() || "Wayanad";

    const history = await Climate.find({ city: normalizedCity })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("temp humidity wind description createdAt")
      .lean();

    res.json({ city: normalizedCity, history });
  } catch (error) {
    console.error("❌ History fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch history",
      details: error.message,
    });
  }
}

// GET /api/climate/alerts - Get weather alerts (rule-based from real current weather)
export async function getAlerts(req, res) {
  try {
    const { city = "Wayanad" } = req.query;
    const normalizedCity = String(city).trim() || "Wayanad";
    const data = await fetchOpenMeteoWeather(normalizedCity);
    const mapped = mapToAppWeather(normalizedCity, data);

    res.json({
      city: normalizedCity,
      alerts: mapped.alerts || [],
    });
  } catch (error) {
    console.error("❌ Alerts fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch alerts",
      details: error.message,
    });
  }
}

// GET /api/climate/stats - Get weather statistics (from DB, real over time)
export async function getStats(req, res) {
  try {
    const { city = "Wayanad", days = 30 } = req.query;
    const limit = Math.min(parseInt(days, 10) || 30, 90);
    const normalizedCity = String(city).trim() || "Wayanad";

    const history = await Climate.find({ city: normalizedCity })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("temp humidity wind")
      .lean();

    if (history.length === 0) {
      return res.json({ city: normalizedCity, stats: null });
    }

    const temps = history.map((h) => h.temp).filter((t) => t != null);
    const humidities = history.map((h) => h.humidity).filter((h) => h != null);
    const winds = history.map((h) => h.wind).filter((w) => w != null);

    const sum = (a, b) => a + b;
    res.json({
      city: normalizedCity,
      stats: {
        avgTemp: temps.length ? Math.round((temps.reduce(sum, 0) / temps.length) * 10) / 10 : null,
        maxTemp: temps.length ? Math.round(Math.max(...temps) * 10) / 10 : null,
        minTemp: temps.length ? Math.round(Math.min(...temps) * 10) / 10 : null,
        avgHumidity: humidities.length ? Math.round(humidities.reduce(sum, 0) / humidities.length) : null,
        avgWind: winds.length ? Math.round((winds.reduce(sum, 0) / winds.length) * 10) / 10 : null,
        maxWind: winds.length ? Math.round(Math.max(...winds) * 10) / 10 : null,
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
