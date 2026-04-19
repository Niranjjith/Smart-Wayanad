import Chat from "../models/Chat.js";
import Alert from "../models/Alert.js";

/**
 * Inserts demo chats and alerts when collections are empty so the admin
 * Chatbot and AI/ML pages show working charts without manual setup.
 * Disable with SEED_DEMO_DATA=false in .env
 */
export default async function seedDemoDataIfNeeded() {
  if (process.env.SEED_DEMO_DATA === "false") {
    return;
  }

  const chatCount = await Chat.countDocuments();
  if (chatCount === 0) {
    const now = Date.now();
    const day = 86400000;
    const samples = [
      {
        user: "priya@demo.app",
        message: "Hello",
        response:
          "Hello! 👋 I'm your Smart Wayanad AI Assistant. How can I help you today? I can assist with emergencies, bus routes, hospitals, weather, and more!",
        intent: "greeting",
        confidence: 0.9,
        sentiment: "positive",
        createdAt: new Date(now - day * 1),
      },
      {
        user: "priya@demo.app",
        message: "Bus route from Kalpetta to Sultan Bathery",
        response:
          "🚌 Available Bus Routes:\n1. Route SW-12: Kalpetta → Sultan Bathery\n\nCheck the Bus Routes section for complete schedules and sub-routes!",
        intent: "bus",
        confidence: 0.9,
        sentiment: "neutral",
        createdAt: new Date(now - day * 1 + 120000),
      },
      {
        user: "rahul@wayanad.org",
        message: "Nearest hospital",
        response:
          "🏥 Here are nearby hospitals:\n1. District Hospital Kalpetta\n\nFor emergency medical help, call 108 or use the SOS feature.",
        intent: "hospital",
        confidence: 0.9,
        sentiment: "neutral",
        createdAt: new Date(now - day * 2),
      },
      {
        user: "Guest",
        message: "Emergency help",
        response:
          "🚨 For immediate emergency assistance, please use the SOS button in the app. You can also call: Police (100), Ambulance (108), Fire (101).",
        intent: "emergency",
        confidence: 0.9,
        sentiment: "negative",
        createdAt: new Date(now - day * 2 + 60000),
      },
      {
        user: "meera@gmail.com",
        message: "Weather today in Wayanad",
        response:
          "🌤️ For current weather and climate information, please check the Weather section in the app.",
        intent: "weather",
        confidence: 0.9,
        sentiment: "neutral",
        createdAt: new Date(now - day * 3),
      },
      {
        user: "meera@gmail.com",
        message: "Thank you",
        response: "You're welcome! 😊 If you need anything else, just ask. Stay safe!",
        intent: "thanks",
        confidence: 0.9,
        sentiment: "positive",
        createdAt: new Date(now - day * 3 + 90000),
      },
      {
        user: "anil.k@demo.app",
        message: "Police station near me",
        response:
          "🚔 For police assistance, call 100 (Emergency) or use the SOS feature. Check the Helpline section for more contacts.",
        intent: "police",
        confidence: 0.9,
        sentiment: "neutral",
        createdAt: new Date(now - day * 4),
      },
      {
        user: "anil.k@demo.app",
        message: "Taxi stand",
        response:
          "🚕 Please check the Taxi Stands section for available taxi services and contact information.",
        intent: "taxi",
        confidence: 0.9,
        sentiment: "neutral",
        createdAt: new Date(now - day * 4 + 45000),
      },
      {
        user: "Guest",
        message: "Where is Mananthavady",
        response:
          "📍 I can help you find locations! Try the Locations section in the app for detailed information.",
        intent: "location",
        confidence: 0.85,
        sentiment: "neutral",
        createdAt: new Date(now - day * 5),
      },
      {
        user: "sos_tester@local",
        message: "Helpline numbers",
        response:
          "📞 Emergency Helplines:\n• Police: 100\n• Ambulance: 108\n• Fire: 101\n• Women Helpline: 1091",
        intent: "helpline",
        confidence: 0.9,
        sentiment: "neutral",
        createdAt: new Date(now - day * 6),
      },
      {
        user: "sos_tester@local",
        message: "What can you do?",
        response:
          "I can help you with:\n• Emergency services (SOS)\n• Bus routes and schedules\n• Hospital and clinic locations\n• Weather information",
        intent: "general",
        confidence: 0.8,
        sentiment: "neutral",
        createdAt: new Date(now - day * 6 + 180000),
      },
      {
        user: "priya@demo.app",
        message: "നമസ്കാരം",
        response:
          "നമസ്കാരം! 👋 ഞാൻ നിങ്ങളുടെ സ്മാർട്ട് വയനാട് AI അസിസ്റ്റന്റ് ആണ്. എങ്ങനെ സഹായിക്കാം?",
        intent: "greeting",
        confidence: 0.9,
        sentiment: "positive",
        createdAt: new Date(now - 3600000),
      },
    ];

    await Chat.insertMany(samples);
    console.log("✅ Demo chat logs seeded (empty DB)");
  }

  const alertCount = await Alert.countDocuments();
  if (alertCount === 0) {
    const now = new Date();
    const baseLng = 76.083;
    const baseLat = 11.685;
    const alerts = [];

    for (let d = 0; d < 7; d++) {
      const dayStart = new Date(now);
      dayStart.setDate(dayStart.getDate() - d);
      dayStart.setHours(10, 0, 0, 0);

      alerts.push({
        name: `Demo Resident ${d + 1}`,
        phone: `98765432${d}0`,
        message: "Road slip reported — request verification",
        status: d < 2 ? "pending" : "resolved",
        alertType: ["landslide", "flood", "medical", "emergency", "fire", "other"][d % 6],
        source: "user",
        priority: d === 0 ? "high" : "medium",
        location: {
          type: "Point",
          coordinates: [baseLng + d * 0.02, baseLat + (d % 3) * 0.015],
        },
        createdAt: new Date(dayStart.getTime()),
      });
    }

    const spikeHour = new Date(now);
    spikeHour.setHours(15, 0, 0, 0);
    for (let k = 0; k < 6; k++) {
      alerts.push({
        name: "Cluster spike sample",
        phone: "9800000000",
        message: "Localized incident reports (demo analytics)",
        status: "pending",
        alertType: "emergency",
        source: "user",
        priority: "high",
        location: {
          type: "Point",
          coordinates: [baseLng + 0.05, baseLat + 0.02],
        },
        createdAt: new Date(spikeHour.getTime() + k * 120000),
      });
    }

    await Alert.insertMany(alerts);
    console.log("✅ Demo alerts seeded for AI/ML analytics (empty DB)");
  }
}
