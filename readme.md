🌿 Smart Wayanad — Citizen Safety & District Services Platform

A modern, unified digital platform designed for citizens of Wayanad District (Kerala).
Smart Wayanad provides emergency assistance, transport updates, district resources, climate info, and AI-powered chatbot support — all connected through mobile + web + cloud backend.

This project features:

Flutter Mobile App for citizens

React Admin Dashboard for district authorities

Node.js + Express + MongoDB Backend for central communication

Real-time alerts powered by Socket.IO

📸 Screenshots (Optional)

(Add your screenshots here later)

🚀 Project Architecture
Citizen (Flutter App)
        |
        | REST + Socket.IO
        v
Backend API (Node.js + Express)
        |
        | Mongoose ODM
        v
     MongoDB
        ^
        |
        | REST + Socket.IO
        |
Admin Dashboard (React + Vite)

🧩 Modules Overview
Module	Description
Flutter Mobile App	SOS alerts, bus routes, clinics, hospitals, chatbot, climate data, guidelines
Admin Dashboard (React)	View alerts, manage bus routes, view user logs, climate dashboard
Backend API (Express)	Authentication, bus routes management, alerts, chat, climate, locations
Database	MongoDB: Users, Alerts, Bus Routes, Locations, Chat Logs
⚙️ 1. Installation & Setup
🟢 Clone the Project
git clone https://github.com/your-username/smart-wayanad.git
cd smart-wayanad

🟧 2. Backend Setup (Node.js + Express)
cd backend
npm install


Create a .env file inside backend/:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smartwayanad
JWT_SECRET=supersecretkey123
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=123456
ADMIN_FORCE_RESET=true


Start backend:

npm run dev


Backend will run at:

http://localhost:5000

🟦 3. Admin Dashboard (React + Vite)
cd admin-dashboard
npm install
npm run dev


Open:

http://localhost:5173

🟩 4. Flutter Mobile App
cd flutter_app
flutter pub get
flutter run

🛠 Tech Stack
Layer	Technologies
Frontend (Admin)	React.js, Vite, Material UI, Axios
Mobile App	Flutter (Dart), Google Fonts
Backend	Node.js, Express.js, MongoDB, Socket.IO
Database	MongoDB + Mongoose
Security	JWT, bcryptjs, Helmet, CORS
🧮 ER Diagram (Entity Relationship)
erDiagram
    USER {
        string _id
        string name
        string email
        string password
    }

    BUS_ROUTE {
        string _id
        string routeNo
        string origin
        string destination
        string firstBus
        string lastBus
        string frequencyMin
    }

    HELP_ALERT {
        string _id
        string userId
        string message
        double lat
        double lng
        date createdAt
    }

    CHAT_MESSAGE {
        string _id
        string userId
        string message
        date timestamp
    }

    USER ||--o{ HELP_ALERT : "sends"
    USER ||--o{ CHAT_MESSAGE : "chats"

🔁 DFD (Data Flow Diagram)
🟢 Level 0 — Context
graph TD
Citizen -->|Requests| System[Smart Wayanad System]
Admin -->|Manages| System
System -->|Services| Citizen
System -->|Alerts + Reports| Admin

🟢 Level 1 — High-Level DFD
graph TD
Citizen -->|SOS, Chat, Routes| MobileApp
MobileApp -->|API Calls| Backend
Admin -->|CRUD| Dashboard
Dashboard -->|API CRUD| Backend
Backend -->|Data Operations| MongoDB
Backend -->|Live Events| SocketIO

⚙️ Logical Flow Diagram (LFD)
flowchart TD
A[User Opens App] --> B[Login/Register]
B -->|Success| C[Home Page]
C --> D[Send Help Alert]
C --> E[Bus Route Search]
C --> F[Climate Info]
C --> G[Chatbot Query]

D -->|POST /help| H[Backend → MongoDB]
E -->|GET /bus| H
F -->|GET /climate| H
G -->|SocketIO| H

H --> I[Admin Dashboard Real-Time Updates]

📡 API Overview
Endpoint	Method	Description
/api/auth/login	POST	User/Admin login
/api/users	POST	User registration
/api/bus	GET/POST/PUT/DELETE	Manage bus routes
/api/help	POST/GET	SOS alerts
/api/chat	POST/GET	Chatbot logs
/api/climate	GET	Weather info
/api/location	GET/POST	Hospitals / Clinics / Taxi
📱 Citizen App Features
✔ Emergency SOS (with live location)
✔ Bus Routes with timings
✔ Hospitals / Clinics / Taxi Stands
✔ Climate Information
✔ AI Chatbot
✔ Ecotourism Guidelines
✔ Profile Management
🧑‍💼 Admin Dashboard Features
✔ View Real-Time Alerts (Socket.IO)
✔ Manage Bus Routes (CRUD)
✔ Manage Locations (Hospitals, Clinics, etc.)
✔ View Users / Chat Logs
✔ Climate Dashboard
✔ Secure Login & Session
🔐 Security Implementations

JWT Authentication

Password hashing (bcryptjs)

Helmet for secure headers

CORS for restricted origins

Rate Limiting (optional to add)

☁️ Deployment Guide
🎯 Frontend (React) → Vercel
Build Command: npm run build
Output Directory: dist
Framework: Other

🎯 Backend (Node.js API) → Railway / Render

Supports:
✔ Express
✔ Socket.IO
✔ MongoDB

🌟 Future Enhancements

KSRTC Live Tracking

Push Notifications

Multi-role Admin Panel

Advanced AI / LLM Chatbot

GIS Map Integrations

👨‍💻 Author

Niranjan
📧 Email: admin@smartwayanad.com

🌍 "Empowering Citizens, Digitally."

🧾 License

MIT License — free for academic & public-service use.