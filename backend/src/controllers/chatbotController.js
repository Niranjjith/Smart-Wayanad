export const chatbotReply = async (req, res) => {
  const { message } = req.body;
  let reply = "Sorry, I didn’t understand that.";

  if (message.toLowerCase().includes("hospital")) reply = "Nearest hospital is Wayanad Govt Hospital.";
  if (message.toLowerCase().includes("police")) reply = "Nearest police station is Kalpetta Police Station.";
  if (message.toLowerCase().includes("weather")) reply = "Weather looks great today 🌤️.";

  res.json({ reply });
};
