# 🌿 Smart Wayanad — Citizen Safety & Services Platform

Smart Wayanad is an integrated citizen-assistance platform designed for the Wayanad district, Kerala.  
It combines **public transport details**, **emergency alerts**, **climate updates**, and an **AI chatbot** — all accessible via mobile (Flutter app) and an admin web dashboard.

---

## 🚀 Project Overview

| Module | Description |
|--------|--------------|
| **Flutter Mobile App** | For citizens: help alerts, bus routes, climate info, chatbot, and district guidelines |
| **Admin Dashboard (React + MUI)** | For district authorities: manage bus routes, monitor alerts, and user data |
| **Backend API (Node.js + Express + MongoDB)** | Central server that connects mobile + admin modules |

---


⚙️ Installation & Setup
🟢 1. Clone Repository
bash
Copy code
git clone https://github.com/your-username/smart-wayanad.git
cd smart-wayanad
🟢 2. Backend Setup
bash
Copy code
cd backend
npm install
Create a .env file:

bash
Copy code
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smartwayanad
JWT_SECRET=supersecretkey123
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=123456
ADMIN_FORCE_RESET=true
Run backend:

bash
Copy code
npm run dev
🟢 3. Admin Dashboard
bash
Copy code
cd admin-dashboard
npm install
npm run dev
Visit ➡️ http://localhost:5173

🟢 4. Flutter App
bash
Copy code
cd flutter_app
flutter pub get
flutter run
🧱 Tech Stack
Layer	Technologies
Frontend (Admin)	React.js, Vite, Material UI, Axios
Mobile App	Flutter (Dart), Google Fonts, Provider, REST APIs
Backend	Node.js, Express.js, MongoDB, Socket.IO, bcrypt, JWT
Database	MongoDB (Mongoose ORM)
Security	Helmet, CORS, bcrypt, dotenv

🧮 ER (Entity Relationship Diagram)
mermaid
Copy code
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

    USER ||--o{ HELP_ALERT : sends
    USER ||--o{ CHAT_MESSAGE : chats
🔁 DFD (Data Flow Diagram)
🟢 Level 0 — Context Diagram
mermaid
Copy code
graph TD
Citizen -->|Sends Requests| System[Smart Wayanad System]
Admin -->|Manages Data| System
System -->|Provides Services| Citizen
System -->|Reports, Alerts| Admin
🟢 Level 1 — Detailed DFD
mermaid
Copy code
graph TD
Citizen -->|SOS, Chat, Routes| MobileApp
MobileApp -->|API Calls| Backend
Admin -->|CRUD| Dashboard
Dashboard -->|API Requests| Backend
Backend -->|Data Storage| MongoDB
Backend -->|Push Events| SocketIO
⚙️ LFD (Logical Flow Diagram)
mermaid
Copy code
flowchart TD
A[User Opens App] --> B[Login/Register]
B -->|Valid| C[Home Dashboard]
C --> D[Send Help Alert]
C --> E[View Bus Routes]
C --> F[Check Climate Info]
C --> G[Chatbot Interaction]
D -->|API| H[Backend → MongoDB]
E -->|Fetch| H
F -->|Fetch Weather| H
G -->|Socket Message| H
H --> I[Admin Dashboard Updates in Real-Time]
📋 EFE (External Function Explanation)
Function	Description	Access
/api/auth/login	User or admin login using credentials	Public
/api/users	Register and manage user accounts	Public
/api/bus	CRUD operations for bus routes	Admin
/api/help	Citizens send emergency alerts (SOS)	Public
/api/chat	Citizens chat with SmartBot (AI)	Public
/api/climate	Provides real-time weather updates	Public

🧠 Features Summary
🧍 Citizen App (Flutter)
✅ SOS Help Alert
✅ Bus Route Info (searchable)
✅ Live Weather Updates
✅ Smart Chatbot
✅ Profile + Guidelines Page
✅ Clean Green Theme (Smart Wayanad identity)

🧑‍💼 Admin Dashboard (React)
✅ Manage Bus Routes CRUD
✅ View Help Alerts in Real-time
✅ Admin Login + Authentication
✅ Analytics Dashboard (Coming soon)
✅ Manage Users and Chatbot Logs

🛡️ Security
Passwords hashed using bcryptjs

Helmet for HTTP header security

JWT for session management

CORS enabled for both admin and Flutter apps

📈 Future Enhancements
Integration with live KSRTC APIs

District-level admin roles

Push notifications for emergency alerts

Predictive AI chatbot (district info)

👨‍💻 Author
Developed by: Niranjan
📧 admin@smartwayanad.com
🌍 “Empowering Citizens, Digitally.”

🧾 License
This project is licensed under the MIT License — free for educational and open civic use.

