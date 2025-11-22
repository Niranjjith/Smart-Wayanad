import Chat from "../models/Chat.js";
import Location from "../models/Location.js";
import BusRoute from "../models/BusRoute.js";
import Alert from "../models/Alert.js";

// 🧠 AI-Powered Chatbot with NLP and Context Awareness
export const chatbotReply = async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const userMessage = message.toLowerCase().trim();
    let reply = "";
    let intent = "general";
    let confidence = 0.8;

    // 🧠 NLP-based Intent Recognition
    const intents = {
      greeting: ["hi", "hello", "hey", "namaste", "good morning", "good evening"],
      emergency: ["help", "emergency", "sos", "urgent", "danger", "accident"],
      hospital: ["hospital", "doctor", "medical", "clinic", "ambulance", "health"],
      police: ["police", "station", "crime", "theft", "complaint"],
      bus: ["bus", "route", "transport", "travel", "schedule", "timing"],
      weather: ["weather", "rain", "temperature", "climate", "forecast"],
      location: ["location", "where", "address", "place", "nearby"],
      taxi: ["taxi", "cab", "auto", "rickshaw", "transport"],
      helpline: ["helpline", "contact", "phone", "number", "call"],
      thanks: ["thanks", "thank you", "appreciate"],
    };

    // Detect intent
    for (const [key, keywords] of Object.entries(intents)) {
      if (keywords.some((keyword) => userMessage.includes(keyword))) {
        intent = key;
        confidence = 0.9;
        break;
      }
    }

    // 🎯 Context-Aware Responses
    switch (intent) {
      case "greeting":
        reply = "Hello! 👋 I'm your Smart Wayanad AI Assistant. How can I help you today? I can assist with emergencies, bus routes, hospitals, weather, and more!";
        break;

      case "emergency":
        reply = "🚨 For immediate emergency assistance, please use the SOS button in the app. Your location will be automatically shared with emergency services. You can also call: Police (100), Ambulance (108), Fire (101).";
        break;

      case "hospital":
        try {
          const hospitals = await Location.find({ type: "hospital" }).limit(3);
          if (hospitals.length > 0) {
            reply = "🏥 Here are nearby hospitals:\n";
            hospitals.forEach((h, i) => {
              reply += `${i + 1}. ${h.name} - ${h.contact || "N/A"}\n`;
            });
            reply += "\nFor emergency medical help, call 108 or use the SOS feature.";
          } else {
            reply = "🏥 For medical emergencies, call 108 (Ambulance) or use the SOS feature in the app. I can help you find hospitals - please check the Hospitals section.";
          }
        } catch (err) {
          reply = "🏥 For medical emergencies, call 108 or use the SOS feature. Check the Hospitals section for details.";
        }
        break;

      case "police":
        try {
          const police = await Location.find({ type: "police" }).limit(2);
          if (police.length > 0) {
            reply = "🚔 Police Stations:\n";
            police.forEach((p, i) => {
              reply += `${i + 1}. ${p.name} - ${p.contact || "100"}\n`;
            });
            reply += "\nFor emergencies, call 100 immediately!";
          } else {
            reply = "🚔 For police assistance, call 100 (Emergency) or use the SOS feature. Check the Helpline section for more contacts.";
          }
        } catch (err) {
          reply = "🚔 For police emergencies, call 100 immediately or use the SOS feature.";
        }
        break;

      case "bus":
        try {
          const routes = await BusRoute.find({ isActive: true }).limit(5);
          if (routes.length > 0) {
            reply = "🚌 Available Bus Routes:\n";
            routes.slice(0, 5).forEach((r, i) => {
              reply += `${i + 1}. Route ${r.routeNo}: ${r.origin} → ${r.destination}\n`;
            });
            reply += "\nCheck the Bus Routes section for complete schedules and sub-routes!";
          } else {
            reply = "🚌 Bus route information is being updated. Please check the Bus Routes section for the latest schedules.";
          }
        } catch (err) {
          reply = "🚌 Please check the Bus Routes section for route information and schedules.";
        }
        break;

      case "weather":
        reply = "🌤️ For current weather and climate information, please check the Weather section in the app. I can tell you that Wayanad typically has a pleasant climate. For detailed forecasts, use the Climate feature!";
        break;

      case "location":
        reply = "📍 I can help you find locations! Please specify what you're looking for:\n• Hospitals\n• Police Stations\n• Taxi Stands\n• Clinics\n• Bus Routes\n\nOr use the Locations section in the app for detailed information.";
        break;

      case "taxi":
        try {
          const taxis = await Location.find({ type: "taxi" }).limit(3);
          if (taxis.length > 0) {
            reply = "🚕 Taxi Stands:\n";
            taxis.forEach((t, i) => {
              reply += `${i + 1}. ${t.name} - ${t.contact || "N/A"}\n`;
            });
            reply += "\nCheck the Taxi Stands section for more options.";
          } else {
            reply = "🚕 Please check the Taxi Stands section for available taxi services and contact information.";
          }
        } catch (err) {
          reply = "🚕 Check the Taxi Stands section for taxi services.";
        }
        break;

      case "helpline":
        reply = "📞 Emergency Helplines:\n• Police: 100\n• Ambulance: 108\n• Fire: 101\n• Women Helpline: 1091\n• Child Helpline: 1098\n\nCheck the Helpline section for more contacts!";
        break;

      case "thanks":
        reply = "You're welcome! 😊 If you need anything else, just ask. Stay safe!";
        break;

      default:
        // 🧠 Smart fallback with suggestions
        const suggestions = [];
        if (userMessage.includes("how") || userMessage.includes("what")) {
          reply = "I can help you with:\n• Emergency services (SOS)\n• Bus routes and schedules\n• Hospital and clinic locations\n• Weather information\n• Police stations\n• Taxi stands\n• Helpline numbers\n\nWhat would you like to know?";
        } else if (userMessage.includes("where")) {
          reply = "I can help you find locations! Try asking about:\n• Hospitals near me\n• Police stations\n• Bus routes\n• Taxi stands\n\nOr use the Locations section in the app.";
        } else {
          reply = "I'm here to help! 🤖 Try asking about:\n• Emergency services\n• Bus routes\n• Hospitals\n• Weather\n• Police stations\n• Or use the SOS button for immediate help!";
        }
    }

    // Save chat log
    try {
      await Chat.create({
        user: userId || "Guest",
        message: message,
        response: reply,
        intent: intent,
        confidence: confidence,
      });
    } catch (err) {
      console.error("Error saving chat:", err);
    }

    res.json({
      reply,
      intent,
      confidence,
      suggestions: [
        "Bus routes",
        "Hospitals",
        "Emergency SOS",
        "Weather",
      ],
    });
  } catch (err) {
    console.error("❌ Chatbot error:", err);
    res.status(500).json({
      reply: "I'm having trouble processing that. Please try again or use the app features directly.",
      intent: "error",
    });
  }
};

// 📊 Get Chat Analytics
export const getChatAnalytics = async (req, res) => {
  try {
    const totalChats = await Chat.countDocuments();
    const intents = await Chat.aggregate([
      { $group: { _id: "$intent", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    
    res.json({
      totalChats,
      intents,
      popularQueries: await Chat.aggregate([
        { $group: { _id: "$message", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
