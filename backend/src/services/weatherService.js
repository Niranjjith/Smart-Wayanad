// Real weather data via Open-Meteo (free, no API key)
// https://open-meteo.com/en/docs

const TIMEZONE = "Asia/Kolkata";

const WAYANAD_COORDS = {
  Wayanad: { lat: 11.6854, lon: 76.132 },
  Kalpetta: { lat: 11.6854, lon: 76.132 },
  Mananthavady: { lat: 11.8, lon: 76.0 },
  "Sultan Bathery": { lat: 11.6612, lon: 76.2635 },
  "Sulthan Bathery": { lat: 11.6612, lon: 76.2635 },
  Vythiri: { lat: 11.55, lon: 76.0833 },
  Meppadi: { lat: 11.5667, lon: 76.1333 },
};

function getCoords(city = "Wayanad") {
  return WAYANAD_COORDS[city] || WAYANAD_COORDS.Wayanad;
}

// WMO Weather codes -> icon + description
function wmoToDisplay(code) {
  const map = {
    0: { icon: "☀️", description: "Clear sky" },
    1: { icon: "🌤️", description: "Mainly clear" },
    2: { icon: "⛅", description: "Partly cloudy" },
    3: { icon: "☁️", description: "Overcast" },
    45: { icon: "🌫️", description: "Foggy" },
    48: { icon: "🌫️", description: "Depositing rime fog" },
    51: { icon: "🌧️", description: "Light drizzle" },
    53: { icon: "🌧️", description: "Moderate drizzle" },
    55: { icon: "🌧️", description: "Dense drizzle" },
    61: { icon: "🌧️", description: "Slight rain" },
    63: { icon: "🌧️", description: "Moderate rain" },
    65: { icon: "🌧️", description: "Heavy rain" },
    66: { icon: "🌧️", description: "Light freezing rain" },
    67: { icon: "🌧️", description: "Heavy freezing rain" },
    71: { icon: "🌨️", description: "Slight snow" },
    73: { icon: "🌨️", description: "Moderate snow" },
    75: { icon: "🌨️", description: "Heavy snow" },
    77: { icon: "🌨️", description: "Snow grains" },
    80: { icon: "🌦️", description: "Slight rain showers" },
    81: { icon: "🌦️", description: "Moderate rain showers" },
    82: { icon: "🌦️", description: "Violent rain showers" },
    85: { icon: "🌨️", description: "Slight snow showers" },
    86: { icon: "🌨️", description: "Heavy snow showers" },
    95: { icon: "🌩️", description: "Thunderstorm" },
    96: { icon: "🌩️", description: "Thunderstorm with slight hail" },
    99: { icon: "🌩️", description: "Thunderstorm with heavy hail" },
  };
  return map[code] || { icon: "⛅", description: "Unknown" };
}

function windDirection(degrees) {
  if (degrees == null) return null;
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const i = Math.round(degrees / 45) % 8;
  return dirs[i];
}

/**
 * Fetch current weather + 7-day forecast from Open-Meteo
 */
export async function fetchOpenMeteoWeather(city = "Wayanad") {
  const { lat, lon } = getCoords(city);
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set("timezone", TIMEZONE);
  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,cloud_cover,is_day"
  );
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset"
  );
  url.searchParams.set("forecast_days", "7");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  return res.json();
}

/**
 * Map Open-Meteo response to app format (current + forecast + optional alerts from rules)
 */
export function mapToAppWeather(city, data) {
  const current = data.current;
  const daily = data.daily;
  const code = current?.weather_code ?? 0;
  const { icon, description } = wmoToDisplay(code);

  const currentWeather = {
    city,
    temp: Math.round((current?.temperature_2m ?? 0) * 10) / 10,
    feelsLike: Math.round((current?.temperature_2m ?? 0) * 10) / 10,
    humidity: current?.relative_humidity_2m ?? 0,
    wind: Math.round((current?.wind_speed_10m ?? 0) * 10) / 10,
    windDirection: windDirection(current?.wind_direction_10m),
    pressure: current?.surface_pressure ? Math.round(current.surface_pressure) : null,
    visibility: null,
    uvIndex: null,
    description,
    icon,
    code: current?.weather_code,
    sunrise: daily?.sunrise?.[0] ? daily.sunrise[0].slice(11, 16) : "06:15",
    sunset: daily?.sunset?.[0] ? daily.sunset[0].slice(11, 16) : "18:45",
  };

  const forecast = [];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 0; i < (daily?.time?.length ?? 0); i++) {
    const codeDay = daily.weather_code?.[i] ?? 0;
    const { icon: dayIcon, description: dayDesc } = wmoToDisplay(codeDay);
    forecast.push({
      date: daily.time[i],
      day: days[new Date(daily.time[i]).getDay()],
      temp: daily.temperature_2m_max?.[i] ?? 0,
      minTemp: daily.temperature_2m_min?.[i] ?? 0,
      maxTemp: daily.temperature_2m_max?.[i] ?? 0,
      description: dayDesc,
      icon: dayIcon,
      humidity: null,
      wind: null,
    });
  }

  const alerts = buildRuleBasedAlerts(currentWeather, forecast);

  return {
    ...currentWeather,
    forecast,
    alerts,
  };
}

function buildRuleBasedAlerts(current, forecast) {
  const alerts = [];
  if (current.wind >= 40) {
    alerts.push({
      type: "warning",
      title: "Strong wind",
      description: "Wind speed is high. Secure loose objects and avoid travel in hilly areas if possible.",
      severity: "moderate",
    });
  }
  if (current.temp >= 35) {
    alerts.push({
      type: "advisory",
      title: "High temperature",
      description: "Stay hydrated and avoid prolonged sun exposure.",
      severity: "low",
    });
  }
  const heavyRainCode = [61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
  const todayCode = current.code;
  if (heavyRainCode.includes(todayCode)) {
    alerts.push({
      type: "warning",
      title: "Rain / Storm",
      description: "Rain or storm expected. Landslide-prone areas may be affected. Check transport before travel.",
      severity: "moderate",
    });
  }
  return alerts;
}
