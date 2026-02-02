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

// Simple in-memory cache (last successful response per city)
const weatherCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getCachedWeather(city) {
  const cached = weatherCache.get(city);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCachedWeather(city, data) {
  weatherCache.set(city, { data, timestamp: Date.now() });
}

/**
 * Fetch current weather + 7-day forecast from Open-Meteo with retry and fallback
 * Reduced retries to ensure fallback returns before axios timeout (20s)
 */
export async function fetchOpenMeteoWeather(city = "Wayanad", retries = 1) {
  // Check cache first
  const cached = getCachedWeather(city);
  if (cached) {
    console.log(`✅ Using cached weather for ${city}`);
    return cached;
  }

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

  // Try with timeout and retries
  // Use shorter timeout on first attempt to fail fast if network is down
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      // First attempt: 3s (fail fast), subsequent: 5s
      const timeoutMs = attempt === 0 ? 3000 : 5000;
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeoutMs);

      const res = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      }).catch((fetchError) => {
        clearTimeout(timeoutId);
        throw fetchError;
      });
      
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Open-Meteo HTTP ${res.status}`);
      }

      const data = await res.json();
      
      // Cache successful response
      setCachedWeather(city, data);
      console.log(`✅ Fetched fresh weather for ${city}`);
      return data;
    } catch (error) {
      const isLastAttempt = attempt === retries;
      const isTimeout = error.name === 'AbortError' || 
                       error.code === 'UND_ERR_CONNECT_TIMEOUT' ||
                       error.message?.includes('timeout');
      
      if (isLastAttempt) {
        console.warn(`⚠️ Open-Meteo API failed after ${retries + 1} attempts for ${city}:`, error.message || error.code);
        
        // Return cached data even if expired, or generate fallback
        const expiredCache = weatherCache.get(city);
        if (expiredCache) {
          const ageMinutes = Math.round((Date.now() - expiredCache.timestamp) / 60000);
          console.log(`⚠️ Using expired cache for ${city} (${ageMinutes} min old)`);
          return expiredCache.data;
        }
        
        // Generate reasonable fallback data
        console.log(`⚠️ Generating fallback weather data for ${city}`);
        const fallback = generateFallbackWeather(city);
        // Cache fallback so we don't regenerate every request
        setCachedWeather(city, fallback);
        return fallback;
      }
      
      // Wait before retry (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt), 3000);
      if (isTimeout) {
        console.log(`⚠️ Timeout on attempt ${attempt + 1}/${retries + 1} for ${city}, retrying in ${delay}ms...`);
      } else {
        console.log(`⚠️ Error on attempt ${attempt + 1}/${retries + 1} for ${city}: ${error.message}, retrying in ${delay}ms...`);
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // Should never reach here, but just in case
  console.warn(`⚠️ Unexpected: fetchOpenMeteoWeather exhausted retries without returning`);
  return generateFallbackWeather(city);
}

export function generateFallbackWeather(city) {
  // Generate reasonable fallback based on typical Wayanad climate
  const now = new Date();
  const baseTemp = 24 + Math.sin((now.getHours() - 6) / 12 * Math.PI) * 4; // 20-28°C range
  
  return {
    _isFallback: true, // Flag to indicate this is fallback data
    current: {
      temperature_2m: baseTemp,
      relative_humidity_2m: 70,
      weather_code: 2, // Partly cloudy
      wind_speed_10m: 5,
      wind_direction_10m: 180,
      surface_pressure: 1013,
      cloud_cover: 40,
      is_day: now.getHours() >= 6 && now.getHours() < 18 ? 1 : 0,
    },
    daily: {
      time: Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() + i);
        return d.toISOString().split('T')[0];
      }),
      weather_code: [2, 1, 0, 2, 1, 0, 1],
      temperature_2m_max: [28, 27, 29, 28, 27, 29, 28],
      temperature_2m_min: [20, 19, 21, 20, 19, 21, 20],
      sunrise: Array(7).fill("06:15"),
      sunset: Array(7).fill("18:45"),
    },
  };
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
  const heavyRainCodes = [61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
  const stormCodes = [95, 96, 99];
  const todayCode = current.code;
  const tomorrowCode = forecast?.[1]?.code ?? null;

  // Heavy Rain → Landslide Advisory + Transport Warning + Helpline Banner
  if (heavyRainCodes.includes(todayCode) || heavyRainCodes.includes(tomorrowCode)) {
    const isHeavy = [65, 66, 67, 82, 95, 96, 99].includes(todayCode);
    
    alerts.push({
      type: "warning",
      title: isHeavy ? "⚠️ Heavy Rain Warning" : "🌧️ Rain Advisory",
      description: isHeavy 
        ? "Heavy rainfall expected. Landslide-prone areas in Wayanad hills are at risk. Avoid travel to hilly regions."
        : "Rain expected. Exercise caution in hilly areas.",
      severity: isHeavy ? "high" : "moderate",
      category: "landslide",
      helpline: {
        show: true,
        number: "1077",
        label: "Disaster Management Helpline",
        message: "Call 1077 for emergency assistance"
      },
      transportWarning: {
        show: true,
        message: "Bus routes through hilly areas may be delayed or cancelled. Check route status before travel."
      }
    });

    // Transport warning
    alerts.push({
      type: "advisory",
      title: "🚌 Transport Advisory",
      description: "Heavy rain may affect bus routes through Wayanad hills. Check route status and allow extra travel time.",
      severity: "moderate",
      category: "transport",
      action: "Check bus route status before traveling"
    });
  }

  // Thunderstorm → Multiple advisories
  if (stormCodes.includes(todayCode)) {
    alerts.push({
      type: "warning",
      title: "🌩️ Thunderstorm Warning",
      description: "Thunderstorm expected. Stay indoors, avoid open areas, and unplug electrical devices.",
      severity: "high",
      category: "storm",
      helpline: {
        show: true,
        number: "100",
        label: "Emergency Services",
        message: "Call 100 for immediate help"
      }
    });
  }

  // Strong Wind → Landslide risk in hills
  if (current.wind >= 40) {
    alerts.push({
      type: "warning",
      title: "💨 Strong Wind Advisory",
      description: "High wind speeds detected. Landslide-prone areas may be affected. Secure loose objects and avoid hilly travel.",
      severity: "moderate",
      category: "wind",
      transportWarning: {
        show: true,
        message: "High winds may affect bus services on elevated routes."
      }
    });
  }

  // High Temperature → Heat advisory
  if (current.temp >= 35) {
    alerts.push({
      type: "advisory",
      title: "🌡️ High Temperature Advisory",
      description: "Stay hydrated, avoid prolonged sun exposure, and check on elderly neighbors.",
      severity: "low",
      category: "heat",
      helpline: {
        show: true,
        number: "108",
        label: "Medical Emergency",
        message: "Call 108 for medical emergencies"
      }
    });
  }

  // Check forecast for upcoming heavy rain (next 2 days)
  const upcomingHeavyRain = forecast?.slice(0, 2).some(day => 
    heavyRainCodes.includes(day.code)
  );
  if (upcomingHeavyRain && !heavyRainCodes.includes(todayCode)) {
    alerts.push({
      type: "advisory",
      title: "📅 Upcoming Rain Alert",
      description: "Heavy rain forecasted in the next 48 hours. Prepare for possible transport disruptions and avoid unnecessary travel to hilly areas.",
      severity: "moderate",
      category: "forecast",
      transportWarning: {
        show: true,
        message: "Plan ahead - bus routes may be affected"
      }
    });
  }

  return alerts;
}
