import mongoose from "mongoose";
import dotenv from "dotenv";
import BusRoute from "./src/models/BusRoute.js";

dotenv.config();

const sampleBusRoutes = [
  // Inter-district routes (Wayanad to major cities)
  {
    routeNo: "KSRTC-101",
    origin: "Kalpetta",
    destination: "Kozhikode",
    firstBus: "05:30",
    lastBus: "21:00",
    frequencyMin: "30",
    description: "Main route connecting Wayanad district headquarters to Kozhikode city",
    distance: 72,
    estimatedTime: 120,
    popularity: 95,
    alternativeNames: ["Kalpetta-Kozhikode", "Wayanad-Kozhikode"],
    subRoutes: [
      {
        subRouteNo: "101-A",
        origin: "Kalpetta",
        destination: "Kozhikode",
        firstBus: "05:30",
        lastBus: "21:00",
        frequencyMin: "30",
        via: "Vythiri, Lakkidi, Thamarassery"
      },
      {
        subRouteNo: "101-B",
        origin: "Kalpetta",
        destination: "Kozhikode",
        firstBus: "06:00",
        lastBus: "20:30",
        frequencyMin: "45",
        via: "Meppadi, Vythiri, Lakkidi"
      }
    ]
  },
  {
    routeNo: "KSRTC-102",
    origin: "Sulthan Bathery",
    destination: "Mysore",
    firstBus: "05:00",
    lastBus: "20:00",
    frequencyMin: "60",
    description: "Connects Wayanad to Karnataka state capital Mysore",
    distance: 95,
    estimatedTime: 150,
    popularity: 85,
    alternativeNames: ["Bathery-Mysore", "Wayanad-Mysore"],
    subRoutes: [
      {
        subRouteNo: "102-A",
        origin: "Sulthan Bathery",
        destination: "Mysore",
        firstBus: "05:00",
        lastBus: "20:00",
        frequencyMin: "60",
        via: "Gundlupet, Nanjangud"
      }
    ]
  },
  {
    routeNo: "KSRTC-103",
    origin: "Mananthavady",
    destination: "Kozhikode",
    firstBus: "05:15",
    lastBus: "20:30",
    frequencyMin: "45",
    description: "Northern Wayanad route to Kozhikode",
    distance: 85,
    estimatedTime: 135,
    popularity: 80,
    alternativeNames: ["Mananthavady-Kozhikode"],
    subRoutes: [
      {
        subRouteNo: "103-A",
        origin: "Mananthavady",
        destination: "Kozhikode",
        firstBus: "05:15",
        lastBus: "20:30",
        frequencyMin: "45",
        via: "Thirunelli, Panamaram, Kalpetta, Vythiri"
      }
    ]
  },
  {
    routeNo: "KSRTC-104",
    origin: "Kalpetta",
    destination: "Bangalore",
    firstBus: "06:00",
    lastBus: "18:00",
    frequencyMin: "180",
    description: "Long-distance route to Bangalore",
    distance: 280,
    estimatedTime: 420,
    popularity: 70,
    alternativeNames: ["Kalpetta-Bangalore", "Wayanad-Bangalore"],
    subRoutes: [
      {
        subRouteNo: "104-A",
        origin: "Kalpetta",
        destination: "Bangalore",
        firstBus: "06:00",
        lastBus: "18:00",
        frequencyMin: "180",
        via: "Sulthan Bathery, Mysore, Mandya"
      }
    ]
  },
  {
    routeNo: "KSRTC-105",
    origin: "Kalpetta",
    destination: "Ooty",
    firstBus: "06:30",
    lastBus: "17:00",
    frequencyMin: "120",
    description: "Scenic route to Ooty via Gudalur",
    distance: 110,
    estimatedTime: 180,
    popularity: 65,
    alternativeNames: ["Kalpetta-Ooty", "Wayanad-Ooty"],
    subRoutes: [
      {
        subRouteNo: "105-A",
        origin: "Kalpetta",
        destination: "Ooty",
        firstBus: "06:30",
        lastBus: "17:00",
        frequencyMin: "120",
        via: "Sulthan Bathery, Gudalur"
      }
    ]
  },

  // Intra-district routes (within Wayanad)
  {
    routeNo: "WYN-201",
    origin: "Kalpetta",
    destination: "Sulthan Bathery",
    firstBus: "05:00",
    lastBus: "22:00",
    frequencyMin: "20",
    description: "Most frequent route connecting two major towns",
    distance: 28,
    estimatedTime: 45,
    popularity: 98,
    alternativeNames: ["Kalpetta-Bathery"],
    subRoutes: [
      {
        subRouteNo: "201-A",
        origin: "Kalpetta",
        destination: "Sulthan Bathery",
        firstBus: "05:00",
        lastBus: "22:00",
        frequencyMin: "20",
        via: "Ambalavayal"
      },
      {
        subRouteNo: "201-B",
        origin: "Kalpetta",
        destination: "Sulthan Bathery",
        firstBus: "05:15",
        lastBus: "21:45",
        frequencyMin: "25",
        via: "Direct route"
      }
    ]
  },
  {
    routeNo: "WYN-202",
    origin: "Kalpetta",
    destination: "Mananthavady",
    firstBus: "05:30",
    lastBus: "21:30",
    frequencyMin: "30",
    description: "Connects district headquarters to northern Wayanad",
    distance: 32,
    estimatedTime: 50,
    popularity: 90,
    alternativeNames: ["Kalpetta-Mananthavady"],
    subRoutes: [
      {
        subRouteNo: "202-A",
        origin: "Kalpetta",
        destination: "Mananthavady",
        firstBus: "05:30",
        lastBus: "21:30",
        frequencyMin: "30",
        via: "Panamaram"
      }
    ]
  },
  {
    routeNo: "WYN-203",
    origin: "Sulthan Bathery",
    destination: "Mananthavady",
    firstBus: "06:00",
    lastBus: "20:30",
    frequencyMin: "45",
    description: "Connects northern and central Wayanad",
    distance: 38,
    estimatedTime: 60,
    popularity: 75,
    alternativeNames: ["Bathery-Mananthavady"],
    subRoutes: [
      {
        subRouteNo: "203-A",
        origin: "Sulthan Bathery",
        destination: "Mananthavady",
        firstBus: "06:00",
        lastBus: "20:30",
        frequencyMin: "45",
        via: "Pulpally, Panamaram"
      }
    ]
  },
  {
    routeNo: "WYN-204",
    origin: "Kalpetta",
    destination: "Vythiri",
    firstBus: "05:15",
    lastBus: "22:15",
    frequencyMin: "15",
    description: "Short frequent route to tourist destination",
    distance: 12,
    estimatedTime: 20,
    popularity: 92,
    alternativeNames: ["Kalpetta-Vythiri"],
    subRoutes: [
      {
        subRouteNo: "204-A",
        origin: "Kalpetta",
        destination: "Vythiri",
        firstBus: "05:15",
        lastBus: "22:15",
        frequencyMin: "15",
        via: "Direct"
      }
    ]
  },
  {
    routeNo: "WYN-205",
    origin: "Kalpetta",
    destination: "Meppadi",
    firstBus: "05:45",
    lastBus: "21:00",
    frequencyMin: "30",
    description: "Route to Meppadi town",
    distance: 18,
    estimatedTime: 30,
    popularity: 85,
    alternativeNames: ["Kalpetta-Meppadi"],
    subRoutes: [
      {
        subRouteNo: "205-A",
        origin: "Kalpetta",
        destination: "Meppadi",
        firstBus: "05:45",
        lastBus: "21:00",
        frequencyMin: "30",
        via: "Direct"
      }
    ]
  },
  {
    routeNo: "WYN-206",
    origin: "Sulthan Bathery",
    destination: "Ambalavayal",
    firstBus: "06:00",
    lastBus: "20:00",
    frequencyMin: "40",
    description: "Route to Ambalavayal",
    distance: 15,
    estimatedTime: 25,
    popularity: 70,
    alternativeNames: ["Bathery-Ambalavayal"],
    subRoutes: [
      {
        subRouteNo: "206-A",
        origin: "Sulthan Bathery",
        destination: "Ambalavayal",
        firstBus: "06:00",
        lastBus: "20:00",
        frequencyMin: "40",
        via: "Direct"
      }
    ]
  },
  {
    routeNo: "WYN-207",
    origin: "Mananthavady",
    destination: "Thirunelli",
    firstBus: "07:00",
    lastBus: "18:00",
    frequencyMin: "90",
    description: "Route to Thirunelli temple",
    distance: 32,
    estimatedTime: 50,
    popularity: 60,
    alternativeNames: ["Mananthavady-Thirunelli"],
    subRoutes: [
      {
        subRouteNo: "207-A",
        origin: "Mananthavady",
        destination: "Thirunelli",
        firstBus: "07:00",
        lastBus: "18:00",
        frequencyMin: "90",
        via: "Kambalakkad"
      }
    ]
  },
  {
    routeNo: "WYN-208",
    origin: "Kalpetta",
    destination: "Pulpally",
    firstBus: "06:30",
    lastBus: "19:30",
    frequencyMin: "60",
    description: "Route to Pulpally",
    distance: 35,
    estimatedTime: 55,
    popularity: 65,
    alternativeNames: ["Kalpetta-Pulpally"],
    subRoutes: [
      {
        subRouteNo: "208-A",
        origin: "Kalpetta",
        destination: "Pulpally",
        firstBus: "06:30",
        lastBus: "19:30",
        frequencyMin: "60",
        via: "Sulthan Bathery"
      }
    ]
  },
  {
    routeNo: "WYN-209",
    origin: "Mananthavady",
    destination: "Panamaram",
    firstBus: "06:00",
    lastBus: "20:00",
    frequencyMin: "45",
    description: "Route to Panamaram",
    distance: 20,
    estimatedTime: 30,
    popularity: 75,
    alternativeNames: ["Mananthavady-Panamaram"],
    subRoutes: [
      {
        subRouteNo: "209-A",
        origin: "Mananthavady",
        destination: "Panamaram",
        firstBus: "06:00",
        lastBus: "20:00",
        frequencyMin: "45",
        via: "Direct"
      }
    ]
  },
  {
    routeNo: "WYN-210",
    origin: "Kalpetta",
    destination: "Kambalakkad",
    firstBus: "07:00",
    lastBus: "19:00",
    frequencyMin: "90",
    description: "Route to Kambalakkad",
    distance: 40,
    estimatedTime: 65,
    popularity: 55,
    alternativeNames: ["Kalpetta-Kambalakkad"],
    subRoutes: [
      {
        subRouteNo: "210-A",
        origin: "Kalpetta",
        destination: "Kambalakkad",
        firstBus: "07:00",
        lastBus: "19:00",
        frequencyMin: "90",
        via: "Mananthavady"
      }
    ]
  },
  {
    routeNo: "WYN-211",
    origin: "Sulthan Bathery",
    destination: "Gudalur",
    firstBus: "06:00",
    lastBus: "19:00",
    frequencyMin: "60",
    description: "Route to Gudalur (Tamil Nadu border)",
    distance: 45,
    estimatedTime: 70,
    popularity: 70,
    alternativeNames: ["Bathery-Gudalur"],
    subRoutes: [
      {
        subRouteNo: "211-A",
        origin: "Sulthan Bathery",
        destination: "Gudalur",
        firstBus: "06:00",
        lastBus: "19:00",
        frequencyMin: "60",
        via: "Direct"
      }
    ]
  },
  {
    routeNo: "WYN-212",
    origin: "Vythiri",
    destination: "Lakkidi",
    firstBus: "05:30",
    lastBus: "21:30",
    frequencyMin: "30",
    description: "Route through scenic Lakkidi ghat",
    distance: 8,
    estimatedTime: 15,
    popularity: 88,
    alternativeNames: ["Vythiri-Lakkidi"],
    subRoutes: [
      {
        subRouteNo: "212-A",
        origin: "Vythiri",
        destination: "Lakkidi",
        firstBus: "05:30",
        lastBus: "21:30",
        frequencyMin: "30",
        via: "Direct"
      }
    ]
  },
  {
    routeNo: "WYN-213",
    origin: "Kalpetta",
    destination: "Thamarassery",
    firstBus: "05:00",
    lastBus: "21:00",
    frequencyMin: "45",
    description: "Route to Thamarassery (Kozhikode district)",
    distance: 55,
    estimatedTime: 90,
    popularity: 80,
    alternativeNames: ["Kalpetta-Thamarassery"],
    subRoutes: [
      {
        subRouteNo: "213-A",
        origin: "Kalpetta",
        destination: "Thamarassery",
        firstBus: "05:00",
        lastBus: "21:00",
        frequencyMin: "45",
        via: "Vythiri, Lakkidi"
      }
    ]
  },
  {
    routeNo: "WYN-214",
    origin: "Mananthavady",
    destination: "Kuttiady",
    firstBus: "06:30",
    lastBus: "19:30",
    frequencyMin: "90",
    description: "Route to Kuttiady",
    distance: 48,
    estimatedTime: 75,
    popularity: 60,
    alternativeNames: ["Mananthavady-Kuttiady"],
    subRoutes: [
      {
        subRouteNo: "214-A",
        origin: "Mananthavady",
        destination: "Kuttiady",
        firstBus: "06:30",
        lastBus: "19:30",
        frequencyMin: "90",
        via: "Panamaram, Kalpetta"
      }
    ]
  },
  {
    routeNo: "WYN-215",
    origin: "Sulthan Bathery",
    destination: "Nenmeni",
    firstBus: "07:00",
    lastBus: "18:00",
    frequencyMin: "120",
    description: "Route to Nenmeni",
    distance: 22,
    estimatedTime: 35,
    popularity: 50,
    alternativeNames: ["Bathery-Nenmeni"],
    subRoutes: [
      {
        subRouteNo: "215-A",
        origin: "Sulthan Bathery",
        destination: "Nenmeni",
        firstBus: "07:00",
        lastBus: "18:00",
        frequencyMin: "120",
        via: "Direct"
      }
    ]
  },
  {
    routeNo: "WYN-216",
    origin: "Kalpetta",
    destination: "Kappad",
    firstBus: "06:00",
    lastBus: "20:00",
    frequencyMin: "60",
    description: "Route to Kappad",
    distance: 25,
    estimatedTime: 40,
    popularity: 65,
    alternativeNames: ["Kalpetta-Kappad"],
    subRoutes: [
      {
        subRouteNo: "216-A",
        origin: "Kalpetta",
        destination: "Kappad",
        firstBus: "06:00",
        lastBus: "20:00",
        frequencyMin: "60",
        via: "Meppadi"
      }
    ]
  },
  {
    routeNo: "WYN-217",
    origin: "Mananthavady",
    destination: "Kozhikode",
    firstBus: "05:00",
    lastBus: "20:00",
    frequencyMin: "60",
    description: "Direct route from Mananthavady to Kozhikode",
    distance: 85,
    estimatedTime: 135,
    popularity: 75,
    alternativeNames: ["Mananthavady-Kozhikode-Direct"],
    subRoutes: [
      {
        subRouteNo: "217-A",
        origin: "Mananthavady",
        destination: "Kozhikode",
        firstBus: "05:00",
        lastBus: "20:00",
        frequencyMin: "60",
        via: "Thirunelli, Panamaram, Kalpetta, Vythiri"
      }
    ]
  },
  {
    routeNo: "WYN-218",
    origin: "Sulthan Bathery",
    destination: "Kozhikode",
    firstBus: "05:30",
    lastBus: "21:00",
    frequencyMin: "45",
    description: "Route from Bathery to Kozhikode",
    distance: 78,
    estimatedTime: 125,
    popularity: 82,
    alternativeNames: ["Bathery-Kozhikode"],
    subRoutes: [
      {
        subRouteNo: "218-A",
        origin: "Sulthan Bathery",
        destination: "Kozhikode",
        firstBus: "05:30",
        lastBus: "21:00",
        frequencyMin: "45",
        via: "Kalpetta, Vythiri, Lakkidi"
      }
    ]
  },
  {
    routeNo: "WYN-219",
    origin: "Kalpetta",
    destination: "Wayanad Wildlife Sanctuary",
    firstBus: "08:00",
    lastBus: "17:00",
    frequencyMin: "120",
    description: "Tourist route to wildlife sanctuary",
    distance: 15,
    estimatedTime: 25,
    popularity: 55,
    alternativeNames: ["Kalpetta-Wildlife-Sanctuary"],
    subRoutes: [
      {
        subRouteNo: "219-A",
        origin: "Kalpetta",
        destination: "Wayanad Wildlife Sanctuary",
        firstBus: "08:00",
        lastBus: "17:00",
        frequencyMin: "120",
        via: "Muthanga"
      }
    ]
  },
  {
    routeNo: "WYN-220",
    origin: "Kalpetta",
    destination: "Edakkal Caves",
    firstBus: "07:30",
    lastBus: "17:30",
    frequencyMin: "90",
    description: "Tourist route to Edakkal Caves",
    distance: 20,
    estimatedTime: 30,
    popularity: 58,
    alternativeNames: ["Kalpetta-Edakkal"],
    subRoutes: [
      {
        subRouteNo: "220-A",
        origin: "Kalpetta",
        destination: "Edakkal Caves",
        firstBus: "07:30",
        lastBus: "17:30",
        frequencyMin: "90",
        via: "Ambalavayal"
      }
    ]
  },
  {
    routeNo: "WYN-221",
    origin: "Mananthavady",
    destination: "Kuruva Island",
    firstBus: "08:00",
    lastBus: "16:00",
    frequencyMin: "180",
    description: "Tourist route to Kuruva Island",
    distance: 38,
    estimatedTime: 60,
    popularity: 50,
    alternativeNames: ["Mananthavady-Kuruva"],
    subRoutes: [
      {
        subRouteNo: "221-A",
        origin: "Mananthavady",
        destination: "Kuruva Island",
        firstBus: "08:00",
        lastBus: "16:00",
        frequencyMin: "180",
        via: "Pulpally"
      }
    ]
  },
  {
    routeNo: "WYN-222",
    origin: "Kalpetta",
    destination: "Chembra Peak",
    firstBus: "07:00",
    lastBus: "16:00",
    frequencyMin: "120",
    description: "Tourist route to Chembra Peak",
    distance: 22,
    estimatedTime: 35,
    popularity: 52,
    alternativeNames: ["Kalpetta-Chembra"],
    subRoutes: [
      {
        subRouteNo: "222-A",
        origin: "Kalpetta",
        destination: "Chembra Peak",
        firstBus: "07:00",
        lastBus: "16:00",
        frequencyMin: "120",
        via: "Meppadi"
      }
    ]
  },
  {
    routeNo: "WYN-223",
    origin: "Sulthan Bathery",
    destination: "Banasura Sagar Dam",
    firstBus: "08:00",
    lastBus: "17:00",
    frequencyMin: "120",
    description: "Tourist route to Banasura Sagar Dam",
    distance: 30,
    estimatedTime: 45,
    popularity: 48,
    alternativeNames: ["Bathery-Banasura"],
    subRoutes: [
      {
        subRouteNo: "223-A",
        origin: "Sulthan Bathery",
        destination: "Banasura Sagar Dam",
        firstBus: "08:00",
        lastBus: "17:00",
        frequencyMin: "120",
        via: "Pulpally"
      }
    ]
  },
  {
    routeNo: "WYN-224",
    origin: "Kalpetta",
    destination: "Pookode Lake",
    firstBus: "07:00",
    lastBus: "18:00",
    frequencyMin: "60",
    description: "Tourist route to Pookode Lake",
    distance: 10,
    estimatedTime: 18,
    popularity: 68,
    alternativeNames: ["Kalpetta-Pookode"],
    subRoutes: [
      {
        subRouteNo: "224-A",
        origin: "Kalpetta",
        destination: "Pookode Lake",
        firstBus: "07:00",
        lastBus: "18:00",
        frequencyMin: "60",
        via: "Vythiri"
      }
    ]
  },
  {
    routeNo: "WYN-225",
    origin: "Mananthavady",
    destination: "Kozhikode",
    firstBus: "05:15",
    lastBus: "19:30",
    frequencyMin: "90",
    description: "Alternative route via Thirunelli",
    distance: 92,
    estimatedTime: 145,
    popularity: 45,
    alternativeNames: ["Mananthavady-Kozhikode-Via-Thirunelli"],
    subRoutes: [
      {
        subRouteNo: "225-A",
        origin: "Mananthavady",
        destination: "Kozhikode",
        firstBus: "05:15",
        lastBus: "19:30",
        frequencyMin: "90",
        via: "Thirunelli, Kuttiady"
      }
    ]
  }
];

const seedBusRoutes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing routes (optional - comment out if you want to keep existing)
    // await BusRoute.deleteMany({});
    // console.log("✅ Cleared existing routes");

    // Insert sample routes
    const insertedRoutes = [];
    for (const route of sampleBusRoutes) {
      try {
        const existing = await BusRoute.findOne({ routeNo: route.routeNo });
        if (existing) {
          console.log(`⏭️  Route ${route.routeNo} already exists, skipping...`);
          continue;
        }
        const newRoute = await BusRoute.create(route);
        insertedRoutes.push(newRoute.routeNo);
        console.log(`✅ Added route: ${route.routeNo} - ${route.origin} to ${route.destination}`);
      } catch (err) {
        if (err.code === 11000) {
          console.log(`⏭️  Route ${route.routeNo} already exists, skipping...`);
        } else {
          console.error(`❌ Error adding route ${route.routeNo}:`, err.message);
        }
      }
    }

    console.log(`\n✅ Successfully seeded ${insertedRoutes.length} bus routes!`);
    console.log(`📋 Routes added: ${insertedRoutes.join(", ")}`);
    
    const totalRoutes = await BusRoute.countDocuments();
    console.log(`📊 Total routes in database: ${totalRoutes}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedBusRoutes();
