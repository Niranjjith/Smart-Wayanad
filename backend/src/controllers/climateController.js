export async function getClimate(req, res) {
  const { city = "Wayanad" } = req.query;
  // Simulated response (replace with real API if needed)
  const mock = {
    city,
    temp: 25 + Math.floor(Math.random() * 5),
    humidity: 60 + Math.floor(Math.random() * 10),
    wind: 5 + Math.floor(Math.random() * 5),
    description: "Partly cloudy",
  };
  res.json(mock);
}
