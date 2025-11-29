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

    // 🧠 NLP-based Intent Recognition (English + Malayalam)
    const intents = {
      greeting: ["hi", "hello", "hey", "namaste", "good morning", "good evening", "നമസ്കാരം", "വണക്കം", "ഹലോ"],
      emergency: ["help", "emergency", "sos", "urgent", "danger", "accident", "സഹായം", "അടിയന്തരം", "ആപത്ത്"],
      hospital: ["hospital", "doctor", "medical", "clinic", "ambulance", "health", "ആശുപത്രി", "ഡോക്ടർ", "വൈദ്യം"],
      police: ["police", "station", "crime", "theft", "complaint", "പോലീസ്", "തുറസ്സാക്കൽ", "പരാതി"],
      bus: ["bus", "route", "transport", "travel", "schedule", "timing", "ബസ്", "വഴി", "സമയം"],
      weather: ["weather", "rain", "temperature", "climate", "forecast", "കാലാവസ്ഥ", "മഴ", "താപനില"],
      location: ["location", "where", "address", "place", "nearby", "സ്ഥലം", "വിലാസം", "എവിടെ"],
      taxi: ["taxi", "cab", "auto", "rickshaw", "transport", "ടാക്സി", "ഓട്ടോ"],
      helpline: ["helpline", "contact", "phone", "number", "call", "ഹെൽപ്പ്‌ലൈൻ", "ഫോൺ", "കോൾ"],
      thanks: ["thanks", "thank you", "appreciate", "നന്ദി", "വളരെ നന്ദി"],
      about: ["about", "tell me", "information", "details", "wayanad", "district", "പറ്റി", "വിവരം", "വയനാട്"],
      tourist: ["tourist", "places", "visit", "attractions", "sightseeing", "പ്രധാന", "സന്ദർശന", "സ്ഥലങ്ങൾ"],
      besttime: ["best time", "when to visit", "season", "monsoon", "ഏത് സമയം", "മഴക്കാലം", "സീസൺ"],
      howtoreach: ["how to reach", "how to come", "transport", "way", "എങ്ങനെ", "വഴി", "എത്താം"],
      culture: ["culture", "tribes", "traditions", "festivals", "സംസ്കാരം", "ഗോത്രങ്ങൾ", "ഉത്സവങ്ങൾ"],
      food: ["food", "cuisine", "dishes", "restaurants", "ഭക്ഷണം", "പാചകം", "റെസ്റ്റോറന്റ്"],
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
        // Detect language preference
        const isMalayalam = userMessage.includes("നമസ്കാരം") || userMessage.includes("വണക്കം");
        reply = isMalayalam
          ? "നമസ്കാരം! 👋 ഞാൻ നിങ്ങളുടെ സ്മാർട്ട് വയനാട് AI അസിസ്റ്റന്റ് ആണ്. എങ്ങനെ സഹായിക്കാം? അടിയന്തര സേവനങ്ങൾ, ബസ് റൂട്ടുകൾ, ആശുപത്രികൾ, കാലാവസ്ഥ തുടങ്ങിയവയിൽ എനിക്ക് സഹായിക്കാം!"
          : "Hello! 👋 I'm your Smart Wayanad AI Assistant. How can I help you today? I can assist with emergencies, bus routes, hospitals, weather, and more!";
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

      case "about":
        reply = `🌿 **About Wayanad District:**

**Location & Geography:**
• Located in the Western Ghats, Kerala, India
• Area: 2,131 sq km
• Headquarters: Kalpetta
• Altitude: 700-2100 meters above sea level
• Known as the "Green Paradise" of Kerala

**Key Facts:**
• Formed in 1980 (youngest district in Kerala)
• Borders: Karnataka (North & East), Kozhikode & Malappuram (South & West)
• Population: ~8.17 lakhs (2011 census)
• Literacy Rate: 89.32%
• Official Language: Malayalam

**Natural Features:**
• Dense forests covering 80% of the area
• Rich biodiversity with many endangered species
• Several wildlife sanctuaries and national parks
• Numerous waterfalls and rivers
• Coffee, tea, and spice plantations

**Economy:**
• Agriculture: Coffee, tea, pepper, cardamom, rubber
• Tourism: Major source of income
• Handicrafts: Bamboo products, tribal artifacts

**Administrative Divisions:**
• 3 Taluks: Mananthavady, Sulthan Bathery, Vythiri
• 4 Municipalities: Kalpetta, Mananthavady, Sulthan Bathery, Panamaram
• 49 Grama Panchayats

Would you like to know more about specific aspects like tourist places, culture, or how to reach?`;
        break;

      case "tourist":
        reply = `🏞️ **Famous Tourist Places in Wayanad:**

**Nature & Wildlife:**
1. **Edakkal Caves** - Ancient rock carvings, 6000+ years old
2. **Chembra Peak** - Highest peak (2100m), heart-shaped lake
3. **Banasura Sagar Dam** - Largest earth dam in India
4. **Soochipara Falls** - Beautiful 3-tier waterfall
5. **Kuruva Island** - River island with rich biodiversity
6. **Pookode Lake** - Freshwater lake surrounded by forests
7. **Meenmutty Falls** - Three-tier waterfall, 300m high

**Wildlife Sanctuaries:**
8. **Wayanad Wildlife Sanctuary** - Home to elephants, tigers, leopards
9. **Tholpetty Wildlife Sanctuary** - Elephant sightings
10. **Muthanga Wildlife Sanctuary** - Part of Nilgiri Biosphere

**Historical & Cultural:**
11. **Edakkal Caves** - Prehistoric cave paintings
12. **Pazhassi Raja Museum** - History of Wayanad
13. **Thirunelli Temple** - Ancient temple in Brahmagiri hills
14. **Jain Temple, Sulthan Bathery** - 13th-century temple

**Plantations & Spice Gardens:**
15. **Spice Plantations** - Guided tours
16. **Coffee Estates** - Experience coffee cultivation
17. **Tea Gardens** - Scenic tea plantations

**Adventure Activities:**
• Trekking (Chembra Peak, Neelimala)
• Bamboo rafting (Kuruva Island)
• Rock climbing
• Camping

**Best Time to Visit:** October to May (avoid monsoon: June-September)`;
        break;

      case "besttime":
        reply = `📅 **Best Time to Visit Wayanad:**

**Peak Season (October - May):**
• **October - February:** 
  - Pleasant weather, 15-25°C
  - Perfect for sightseeing and trekking
  - Clear skies, minimal rainfall
  - Best time for wildlife spotting

• **March - May:**
  - Summer season, 20-30°C
  - Good for outdoor activities
  - Slightly warmer but still comfortable
  - Waterfalls may have less water

**Monsoon Season (June - September):**
• Heavy rainfall (3000-4000mm annually)
• Lush green landscapes
• Waterfalls at their best
• Some areas may be inaccessible
• Not ideal for trekking or outdoor activities

**Climate:**
• Tropical climate with high humidity
• Average temperature: 18-28°C
• Annual rainfall: ~3000mm
• Cool evenings throughout the year

**Recommendation:**
🎯 **Best months:** November to February (winter)
🌿 **For greenery:** July-August (monsoon)
☀️ **For activities:** October-May (dry season)

**What to Pack:**
• Light woolens (Nov-Feb)
• Rain gear (Jun-Sep)
• Comfortable trekking shoes
• Insect repellent
• Camera for scenic views!`;
        break;

      case "howtoreach":
        reply = `🚗 **How to Reach Wayanad:**

**By Air:**
• **Nearest Airport:** Calicut International Airport (Kozhikode)
  - Distance: ~100 km from Kalpetta
  - Flight time: 2.5-3 hours from major cities
  - From airport: Taxi/bus to Wayanad (2-3 hours)

**By Train:**
• **Nearest Railway Station:** Kozhikode Railway Station
  - Distance: ~110 km from Kalpetta
  - Well-connected to major cities
  - From station: Bus/taxi to Wayanad (2.5-3 hours)

**By Road:**
• **From Bangalore:** ~280 km (6-7 hours)
  - Route: Bangalore → Mysore → Gundlupet → Wayanad
  - Good road conditions, scenic drive

• **From Kochi:** ~280 km (6-7 hours)
  - Route: Kochi → Thrissur → Palakkad → Wayanad

• **From Kozhikode:** ~110 km (2.5-3 hours)
  - Route: Kozhikode → Thamarassery → Kalpetta
  - Most common route

• **From Mysore:** ~120 km (3-4 hours)
  - Route: Mysore → Gundlupet → Wayanad
  - Scenic route through forests

**Local Transport:**
• **Buses:** KSRTC and private buses connect all major towns
• **Taxis:** Available from airports/railway stations
• **Auto-rickshaws:** For local travel
• **Car Rental:** Available in Kalpetta and major towns

**Important Routes:**
• NH 766 (Kozhikode - Kollegal)
• State Highway 29 (connects major towns)
• Ghat roads: Beautiful but winding, drive carefully

**Tips:**
• Book accommodation in advance (peak season)
• Carry valid ID proof
• Keep emergency contacts handy
• Download offline maps (network can be weak in hills)`;
        break;

      case "culture":
        reply = `🎭 **Culture & Traditions of Wayanad:**

**Tribal Communities:**
Wayanad is home to several indigenous tribes:
• **Paniyas** - Largest tribal community
• **Adiyas** - Traditional agricultural workers
• **Kurichiyas** - Known for archery skills
• **Kurumas** - Pottery and basket making
• **Kattunayakans** - Forest dwellers, honey collectors

**Festivals:**
• **Onam** - Harvest festival (August-September)
• **Vishu** - New Year (April)
• **Puthari** - Tribal harvest festival
• **Karivela** - Tribal festival
• **Theyyam** - Ritualistic dance form

**Traditional Arts:**
• **Tribal Dances:** Folk dances with traditional music
• **Handicrafts:** Bamboo products, cane furniture
• **Traditional Medicine:** Herbal remedies
• **Cuisine:** Tribal and local Kerala dishes

**Languages:**
• **Malayalam** - Official language
• **Tribal Languages:** Various dialects
• **English** - Widely understood in tourist areas

**Religious Diversity:**
• Hindus (majority)
• Muslims
• Christians
• Tribal religions

**Traditional Practices:**
• Agriculture-based lifestyle
• Forest conservation practices
• Traditional healing methods
• Community-based decision making

**Cultural Sites:**
• Tribal museums
• Ancient temples
• Heritage sites
• Cultural centers`;
        break;

      case "food":
        reply = `🍽️ **Food & Cuisine of Wayanad:**

**Traditional Dishes:**
• **Kerala Sadya** - Traditional vegetarian feast
• **Appam & Stew** - Rice pancakes with vegetable stew
• **Puttu & Kadala** - Steamed rice cake with chickpeas
• **Kerala Parotta** - Layered flatbread
• **Fish Curry** - Traditional spicy fish preparation
• **Beef Fry** - Popular non-vegetarian dish
• **Chicken Curry** - Spiced chicken preparation

**Local Specialties:**
• **Bamboo Rice** - Unique rice variety
• **Tribal Cuisine** - Traditional tribal dishes
• **Wild Honey** - Collected from forests
• **Coffee** - Fresh Wayanad coffee
• **Spices** - Fresh pepper, cardamom, cinnamon

**Famous Snacks:**
• **Banana Chips** - Crispy banana snacks
• **Kozhukatta** - Sweet rice dumplings
• **Unniyappam** - Sweet rice fritters
• **Achappam** - Rose cookies

**Beverages:**
• **Fresh Coffee** - Wayanad is famous for coffee
• **Tender Coconut** - Fresh coconut water
• **Buttermilk** - Traditional drink
• **Kashayam** - Herbal tea

**Where to Eat:**
• **Local Restaurants:** Traditional Kerala cuisine
• **Resort Restaurants:** Multi-cuisine options
• **Street Food:** Local snacks and fast food
• **Plantation Cafes:** Coffee and snacks

**Food Tips:**
• Try local tribal cuisine if available
• Fresh spices are great souvenirs
• Coffee plantations offer fresh coffee
• Ask for less spice if you can't handle heat
• Try bamboo rice - unique to the region!`;
        break;

      default:
        // 🧠 Smart fallback with suggestions
        if (userMessage.includes("wayanad") || userMessage.includes("district") || userMessage.includes("about")) {
          reply = `🌿 **Wayanad District Information:**

Wayanad is a beautiful hill district in Kerala, India, located in the Western Ghats. Here's what you should know:

**Quick Facts:**
• Area: 2,131 sq km
• Headquarters: Kalpetta
• Altitude: 700-2100m above sea level
• Known as: "Green Paradise" of Kerala

**Popular Attractions:**
• Edakkal Caves (ancient rock carvings)
• Chembra Peak (highest point)
• Banasura Sagar Dam
• Soochipara Falls
• Wayanad Wildlife Sanctuary

**Best Time to Visit:** October to May

**How to Reach:**
• Nearest Airport: Calicut (100 km)
• Nearest Railway: Kozhikode (110 km)
• Well-connected by road from major cities

Ask me about:
• Tourist places
• Best time to visit
• How to reach
• Culture & traditions
• Food & cuisine
• Emergency services
• Bus routes
• Hospitals & more!`;
        } else if (userMessage.includes("how") || userMessage.includes("what")) {
          reply = `I can help you with comprehensive information about Wayanad! 🌿

**District Information:**
• About Wayanad district
• Tourist places & attractions
• Best time to visit
• How to reach Wayanad
• Culture & traditions
• Food & cuisine

**Services:**
• 🚨 Emergency services (SOS)
• 🚌 Bus routes and schedules
• 🏥 Hospital and clinic locations
• 🌤️ Weather information
• 🚔 Police stations
• 🚕 Taxi stands
• 📞 Helpline numbers

What would you like to know?`;
        } else if (userMessage.includes("where")) {
          reply = `I can help you find locations in Wayanad! 📍

**Tourist Places:**
• Edakkal Caves
• Chembra Peak
• Banasura Sagar Dam
• Soochipara Falls
• Wildlife Sanctuaries

**Services:**
• Hospitals near me
• Police stations
• Bus routes
• Taxi stands
• Clinics

**Useful Commands:**
• "Tell me about Wayanad"
• "Tourist places"
• "How to reach"
• "Best time to visit"
• "Emergency help"

Or use the Locations section in the app for detailed maps!`;
        } else if (userMessage.includes("tourist") || userMessage.includes("visit") || userMessage.includes("places")) {
          reply = `🏞️ **Top Tourist Places in Wayanad:**

1. **Edakkal Caves** - Ancient rock carvings (6000+ years)
2. **Chembra Peak** - Highest peak with heart-shaped lake
3. **Banasura Sagar Dam** - Largest earth dam in India
4. **Soochipara Falls** - Beautiful 3-tier waterfall
5. **Kuruva Island** - River island with rich biodiversity
6. **Pookode Lake** - Scenic freshwater lake
7. **Wayanad Wildlife Sanctuary** - See elephants, tigers
8. **Meenmutty Falls** - 300m high waterfall

**Adventure Activities:**
• Trekking
• Bamboo rafting
• Rock climbing
• Camping

Ask "Tell me about tourist places" for detailed information!`;
        } else {
          reply = `I'm your Smart Wayanad AI Assistant! 🤖 I can help you with:

**🌿 District Information:**
• About Wayanad district
• Tourist places & attractions
• Best time to visit
• How to reach
• Culture & traditions
• Food & cuisine

**🚨 Services:**
• Emergency services (SOS)
• Bus routes
• Hospitals & clinics
• Weather information
• Police stations
• Taxi stands
• Helpline numbers

**Quick Questions:**
Try asking:
• "Tell me about Wayanad"
• "Tourist places"
• "Best time to visit"
• "How to reach Wayanad"
• "Emergency help"

Or use the SOS button for immediate emergency assistance!`;
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
