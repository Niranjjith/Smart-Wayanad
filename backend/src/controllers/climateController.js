// backend/src/controllers/climateController.js

export async function getClimate(req, res) {
  try {
    const { city = "Wayanad" } = req.query;

    // ✅ Mock/sample climate data (always works)
    const sampleClimate = {
      city,
      temp: 26,            // temperature in °C
      humidity: 72,        // %
      wind: 5.4,           // km/h
      description: "Partly cloudy with mild breeze",
      code: 2              // mock weather code
    };

    res.json(sampleClimate);

  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch climate data",
      details: error.message,
    });
  }
}
