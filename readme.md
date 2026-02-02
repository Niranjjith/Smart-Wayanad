# 🌿 Smart Wayanad

<div align="center">

**A Modern Digital Platform for Citizen Safety & District Services**

[![Flutter](https://img.shields.io/badge/Flutter-3.0+-02569B?logo=flutter)](https://flutter.dev)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.4-47A248?logo=mongodb)](https://www.mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*Empowering Citizens, Digitally.*

[Features](#-features) • [Installation](#-installation--setup) • [Screenshots](#-screenshots) • [Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Project Architecture](#-project-architecture)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Configuration](#-configuration)
- [Running the Project](#-running-the-project)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Security](#-security)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 Overview

**Smart Wayanad** is a civic-oriented prototype platform designed for citizens of Wayanad District, Kerala. It provides emergency assistance, transport information, district resources, climate-triggered advisories, and a Guided Civic Assistant through a unified mobile and web interface.

Smart Wayanad is a civic-tech prototype that demonstrates how emergency reporting, offline-tolerant civic data access, and role-governed administrative response workflows can be designed and integrated into a single platform for a geographically sensitive district.

### Key Highlights

- 🚨 **Emergency SOS** - Persist-first emergency pipeline with GPS location tracking and auditable status transitions
- 🚌 **Bus Routes** - Complete bus route management with sub-routes
- 🏥 **Healthcare** - Hospitals, clinics, and medical facilities directory
- 🌤️ **Disaster Readiness** - Weather-triggered informational advisories based on predefined rules for Wayanad
- 🧭 **Guided Civic Assistant** - Rule-driven, government-approved responses with full logging (no AI hallucinations)
- 📍 **Location Services** - Taxi stands, helplines, and essential services
- 📶 **Offline-Cached Core Data** - Bus routes, hospitals, and helplines cached for low-connectivity terrain
- 📊 **Operations Dashboard** - Geographic grouping of incidents with resolved vs pending status
- 🔄 **Event-Driven Updates** - Event-driven updates for connected clients using Socket.IO

---

## ✨ Features

### 📱 Citizen Mobile App (Flutter)

#### Core Features
- ✅ **Emergency SOS** - Persist-first SOS alerts with GPS location and status lifecycle (PENDING → RECEIVED → IN_PROGRESS → CLOSED)
- ✅ **Bus Routes** - Search and view bus routes with expandable sub-routes
- ✅ **Healthcare Directory** - Find hospitals, clinics, and medical facilities
- ✅ **Disaster Readiness Advisories** - Weather-triggered warnings with local guidance
- ✅ **Guided Civic Assistant** - Deterministic, rule-based civic help with Malayalam support
- ✅ **Location Services** - Access taxi stands, helplines, and emergency contacts
- ✅ **Offline Cache** - Bus routes, hospitals, and helplines available even with limited connectivity
- ✅ **Profile Management** - Update profile, photo, and settings
- ✅ **Real-Time Notifications** - Get alerts and updates instantly

#### Advanced Features
- ✅ **Voice Reporting** - Report incidents using voice commands
- ✅ **Geographic Grouping of Incidents** - Map view grouped by area, showing counts, resolved vs pending, and recent failures
- ✅ **Smart Route Finder** - Rule-based route recommendations using current conditions
- ✅ **Dark Mode** - Beautiful dark theme support
- ✅ **Multi-language** - English and Malayalam support

### 🖥️ Admin Dashboard (React)

#### Dashboard Features
- ✅ **Real-Time Dashboard** - Live operational statistics and indicators
- ✅ **Help Alerts Management** - Monitor, acknowledge, and progress SOS alerts through defined lifecycle states
- ✅ **Bus Route Management** - Full CRUD operations for routes and sub-routes
- ✅ **Location Management** - Manage hospitals, clinics, taxi stands, and helplines
- ✅ **User Management** - View and manage user accounts
- ✅ **Role-Based Access** - Operator, Supervisor, and Auditor roles with scoped permissions
- ✅ **Civic Assistant Logs** - Monitor and audit civic assistant conversations
- ✅ **Disaster Readiness Dashboard** - Weather-triggered informational advisories
- ✅ **Send Alerts** - Broadcast emergency alerts to all users
- ✅ **Profile Settings** - Update admin profile, username, password, and photo

#### Advanced Features
- ✅ **Rule- and Threshold-Based Alert Summaries** - Simple rule + threshold checks for operational awareness
- ✅ **Event-Driven Updates** - Event-driven updates for connected clients using Socket.IO
- ✅ **Data Export** - Export data in JSON format
- ✅ **System Status** - Monitor API, database, and WebSocket status

### 🔧 Backend API (Node.js + Express)

- ✅ **RESTful API** - Complete REST API for all services
- ✅ **Real-Time Communication** - Socket.IO-based updates for connected clients
- ✅ **Authentication** - JWT-based secure authentication
- ✅ **Database Management** - MongoDB with Mongoose ODM
- ✅ **SOS Workflow Engine** - Persist-first emergency pipeline with auditable status transitions
- ✅ **Role-Based Access Control** - Enforced roles for operators, supervisors, and auditors
- ✅ **File Upload** - Profile photo upload with base64 encoding
- ✅ **Error Handling** - Comprehensive error handling and validation
- ✅ **Security** - Helmet.js, CORS, and input validation

---

## 📸 Screenshots

### Admin Dashboard

<div align="center">

#### Admin Dashboard Overview
![Admin Dashboard](backend/Screenshots/admin%20page.png)

*Modern admin dashboard with real-time statistics, charts, and management tools*

#### System Screenshot
![System Screenshot](backend/Screenshots/Screenshot%202025-12-03%20112431.png)

*Complete system interface showing all features and components*

</div>

### System Architecture

<div align="center">

#### Data Flow Diagram (DFD)
![Data Flow Diagram](backend/Screenshots/Dfd%20diagram.png)

*Complete data flow architecture showing system interactions*

#### Entity Relationship Diagram (ERD)
![ER Diagram](backend/Screenshots/ER%20diagram.png)

*Database schema and entity relationships*

</div>

---

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Smart Wayanad Platform                    │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ Flutter App  │      │ Admin Panel  │      │   Backend    │
│  (Citizens)  │      │   (React)    │      │ (Node.js)    │
│              │      │              │      │              │
│ • SOS        │      │ • Dashboard  │      │ • REST API   │
│ • Bus Routes │      │ • Analytics  │      │ • Socket.IO  │
│ • Chatbot    │      │ • Management │      │ • Auth       │
│ • Profile    │      │ • Settings   │      │ • Database   │
└──────────────┘      └──────────────┘      └──────────────┘
        │                     │                     │
        │  REST + Socket.IO   │  REST + Socket.IO   │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │    MongoDB      │
                    │   Database      │
                    │                 │
                    │ • Users         │
                    │ • Alerts        │
                    │ • Routes        │
                    │ • Locations     │
                    │ • Climate       │
                    │ • Chats         │
                    └─────────────────┘
```

### Data Flow

1. **Citizen App** → Sends requests via REST API and Socket.IO
2. **Admin Dashboard** → Manages data via REST API
3. **Backend** → Processes requests, manages database, broadcasts updates
4. **MongoDB** → Stores all application data
5. **Socket.IO** → Real-time bidirectional communication

---

## 🛠️ Tech Stack

### Frontend (Admin Dashboard)
- **Framework**: React 19.1
- **Build Tool**: Vite 6.0
- **UI Library**: Material-UI (MUI) 7.3
- **Animations**: Framer Motion 12.23
- **Charts**: Recharts 3.3
- **HTTP Client**: Axios 1.13
- **Routing**: React Router DOM 7.9
- **Real-Time**: Socket.IO Client 4.8
- **Notifications**: React Toastify

### Mobile App (Flutter)
- **Framework**: Flutter 3.0+
- **Language**: Dart 3.0+
- **State Management**: Provider 6.1
- **HTTP Client**: HTTP 1.2
- **Location**: Geolocator 13.0
- **Fonts**: Google Fonts 6.2
- **Image Picker**: image_picker
- **Caching**: cached_network_image
- **Storage**: shared_preferences

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.19
- **Database**: MongoDB 8.4
- **ODM**: Mongoose 8.4
- **Authentication**: JWT (jsonwebtoken 9.0)
- **Security**: Helmet 7.1, CORS 2.8
- **Real-Time**: Socket.IO 4.8
- **Utilities**: bcryptjs 3.0, morgan 1.10

---

## 📦 Installation & Setup

### Prerequisites

- **Node.js** 18+ and npm
- **Flutter** 3.0+ and Dart SDK
- **MongoDB** 6.0+ (local or cloud instance)
- **Git** for version control

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/smart-wayanad.git
cd smart-wayanad
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://127.0.0.1:27017/smartwayanad

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Admin Configuration
ADMIN_EMAIL=admin@smartwayanad.com
ADMIN_PASSWORD=your_secure_password
ADMIN_FORCE_RESET=false
```

### Step 3: Admin Dashboard Setup

```bash
cd admin-dashboard
npm install
```

### Step 4: Flutter App Setup

```bash
cd flutter_app
flutter pub get
```

**Note**: Update the API base URL in `lib/services/api_service.dart`:

```dart
static const _mobileBase = "http://YOUR_IP_ADDRESS:5000/api";
static const _desktopBase = "http://localhost:5000/api";
```

Replace `YOUR_IP_ADDRESS` with your local network IP for mobile testing.

---

## ⚙️ Configuration

### MongoDB Setup

1. **Local MongoDB**:
   ```bash
   # Install MongoDB locally or use Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. **MongoDB Atlas** (Cloud):
   - Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster and get connection string
   - Update `MONGO_URI` in `.env` file

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/smartwayanad` |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `ADMIN_EMAIL` | Admin account email | Required |
| `ADMIN_PASSWORD` | Admin account password | Required |
| `ADMIN_FORCE_RESET` | Force admin account reset on startup | `false` |

---

## 🚀 Running the Project

### Start MongoDB

```bash
# If using local MongoDB
mongod

# Or using Docker
docker start mongodb
```

### Start Backend Server

```bash
cd backend
npm run dev
# or
node server.js
```

Backend will run at: **http://localhost:5000**

### Start Admin Dashboard

```bash
cd admin-dashboard
npm run dev
```

Admin Dashboard will open at: **http://localhost:5173**

**Default Admin Credentials:**
- Email: `admin@smartwayanad.com` (or as set in `.env`)
- Password: (as set in `.env`)

### Run Flutter App

```bash
cd flutter_app
flutter run
```

**For specific platforms:**
```bash
flutter run -d windows    # Windows
flutter run -d android    # Android
flutter run -d ios        # iOS (macOS only)
flutter run -d chrome     # Web
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User/Admin login | No |
| GET | `/auth/profile` | Get user profile | Yes |
| PUT | `/auth/profile` | Update user profile | Yes |

### Bus Routes Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/bus` | Get all bus routes | No |
| GET | `/bus/:id` | Get single route | No |
| POST | `/bus` | Create new route | Yes (Admin) |
| PUT | `/bus/:id` | Update route | Yes (Admin) |
| DELETE | `/bus/:id` | Delete route | Yes (Admin) |
| POST | `/bus/:id/subroutes` | Add sub-route | Yes (Admin) |
| PUT | `/bus/:id/subroutes/:subRouteId` | Update sub-route | Yes (Admin) |
| DELETE | `/bus/:id/subroutes/:subRouteId` | Delete sub-route | Yes (Admin) |

### Help Alerts Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/help` | Create SOS alert (persisted with status `PENDING`) | No |
| POST | `/help/admin` | Broadcast admin alert | Yes (Admin) |
| GET | `/help` | Get all alerts with status and history | Yes (Admin) |
| POST | `/help/live-location` | Update live location | No |

### Location Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/location` | Get all locations | No |
| GET | `/location/:type` | Get locations by type | No |
| POST | `/location` | Add location | Yes (Admin) |

### Climate Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/climate/current?city=Wayanad` | Get current weather | No |
| GET | `/climate/forecast?city=Wayanad&days=7` | Get weather forecast | No |
| GET | `/climate/history?city=Wayanad&days=7` | Get historical data | No |
| GET | `/climate/alerts?city=Wayanad` | Get weather alerts | No |
| GET | `/climate/stats?city=Wayanad&days=30` | Get weather statistics | No |

### Civic Assistant Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/chatbot` | Send message to Guided Civic Assistant (rule-based responses only) | No |
| GET | `/chatbot/analytics` | Get assistant usage and rule hit statistics | Yes (Admin) |
| GET | `/chat` | Get assistant conversation logs | Yes (Admin) |
| POST | `/chat` | Send chat message | No |

### Risk Monitoring Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/analytics/alerts/predictions` | Get threshold-based alert summaries (no ML predictions) | No |
| GET | `/analytics/alerts/anomalies` | Rule-defined anomaly flags over SOS volume and patterns | No |
| GET | `/analytics/routes/recommendations` | Route recommendations based on rules and thresholds | No |

### Example API Request

```bash
# Get all bus routes
curl http://localhost:5000/api/bus

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Update Profile (with auth token)
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "profilePhoto": "data:image/jpeg;base64,..."
  }'
```

---

## 📁 Project Structure

```
smart-wayanad/
│
├── backend/                    # Node.js Backend
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Route controllers
│   │   │   ├── adminController.js
│   │   │   ├── alertController.js
│   │   │   ├── analyticsController.js
│   │   │   ├── authController.js
│   │   │   ├── busController.js
│   │   │   ├── chatbotController.js
│   │   │   ├── climateController.js
│   │   │   ├── locationController.js
│   │   │   └── userController.js
│   │   ├── middleware/        # Auth middleware
│   │   ├── models/            # Mongoose models
│   │   │   ├── Admin.js
│   │   │   ├── Alert.js
│   │   │   ├── BusRoute.js
│   │   │   ├── Chat.js
│   │   │   ├── Climate.js
│   │   │   ├── Location.js
│   │   │   └── User.js
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   │   └── realtimeService.js
│   │   └── utils/             # Utility functions
│   ├── Screenshots/           # Project screenshots
│   ├── server.js              # Server entry point
│   └── package.json
│
├── admin-dashboard/            # React Admin Panel
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── context/           # React context
│   │   ├── layout/            # Layout components
│   │   │   ├── Sidebar.jsx
│   │   │   └── Topbar.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── HelpAlerts.jsx
│   │   │   ├── BusRoutes.jsx
│   │   │   ├── Climate.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── ...
│   │   ├── routes/            # Route configuration
│   │   ├── services/          # API services
│   │   └── main.jsx           # Entry point
│   └── package.json
│
├── flutter_app/                # Flutter Mobile App
│   ├── lib/
│   │   ├── pages/             # App screens
│   │   │   ├── auth_page.dart
│   │   │   ├── home_page.dart
│   │   │   ├── profile_page.dart
│   │   │   ├── edit_profile_page.dart
│   │   │   └── ...
│   │   ├── services/          # API services
│   │   │   └── api_service.dart
│   │   ├── widgets/           # Reusable widgets
│   │   └── main.dart          # Entry point
│   └── pubspec.yaml
│
└── README.md                   # This file
```

---

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String,
  profilePhoto: String (base64),
  settings: {
    darkMode: Boolean,
    notifications: Boolean,
    language: String
  }
}
```

### Alert Model
```javascript
{
  name: String,
  phone: String,
  message: String,
  lat: Number,
  lng: Number,
  alertType: String,
  status: String (PENDING, RECEIVED, IN_PROGRESS, CLOSED)
}
```

### BusRoute Model
```javascript
{
  routeNo: String,
  origin: String,
  destination: String,
  firstBus: String,
  lastBus: String,
  frequencyMin: Number,
  subRoutes: [{
    name: String,
    stops: [String]
  }]
}
```

### Location Model
```javascript
{
  name: String,
  type: String (hospital, clinic, taxi, police, helpline),
  contact: String,
  address: String,
  latitude: Number,
  longitude: Number
}
```

### Climate Model
```javascript
{
  city: String,
  temp: Number,
  humidity: Number,
  wind: Number,
  description: String,
  forecast: [Object],
  alerts: [Object]
}
```

### Chat Model
```javascript
{
  user: String,
  message: String,
  response: String,
  intent: String,      // mapped to predefined civic intents / decision-tree nodes
  confidence: Number   // rule match strength for audit (no ML prediction)
}
```

---

## 🔐 Security

### Implemented Security Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Password Hashing** - bcryptjs for password encryption
- ✅ **Helmet.js** - Security headers protection
- ✅ **CORS** - Cross-origin resource sharing configuration
- ✅ **Input Validation** - Request validation and sanitization
- ✅ **Error Handling** - Secure error messages
- ✅ **Token Storage** - Secure token management
- ✅ **Role-Based Access Control** - Operator, Supervisor, and Auditor roles with scoped permissions
- ✅ **Action Logging** - Immutable history of SOS and admin actions with timestamps

### Security Best Practices

1. **Change Default Credentials**: Update admin email and password in production
2. **Use Strong JWT Secret**: Generate a strong random string for `JWT_SECRET`
3. **Enable HTTPS**: Use SSL/TLS certificates in production
4. **Environment Variables**: Never commit `.env` files to version control
5. **Rate Limiting**: Consider adding rate limiting for API endpoints
6. **Database Security**: Use MongoDB authentication and network restrictions

---

## ☁️ Deployment

### Backend Deployment (Railway / Render)

1. **Create Account**: Sign up at [Railway](https://railway.app) or [Render](https://render.com)
2. **Connect Repository**: Link your GitHub repository
3. **Set Environment Variables**: Add all variables from `.env` file
4. **Deploy**: Platform will automatically deploy on push

**Build Command**: `npm install && npm start`  
**Start Command**: `node server.js`

### Admin Dashboard Deployment (Vercel)

1. **Create Account**: Sign up at [Vercel](https://vercel.com)
2. **Import Project**: Connect your GitHub repository
3. **Configure Build**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Framework: Other
4. **Set Environment Variables**: Add API base URL
5. **Deploy**: Automatic deployment on push

### Flutter App Deployment

**Android (Google Play Store)**:
```bash
cd flutter_app
flutter build appbundle
# Upload to Google Play Console
```

**iOS (App Store)**:
```bash
cd flutter_app
flutter build ios
# Upload via Xcode or App Store Connect
```

**Web**:
```bash
cd flutter_app
flutter build web
# Deploy to Firebase Hosting, Netlify, or Vercel
```

---

## 🌟 Key Features in Detail

### 🚨 Emergency SOS System
- Persist-first SOS storage with status lifecycle (PENDING → RECEIVED → IN_PROGRESS → CLOSED)
- GPS location tracking tied to each alert
- Event-driven location updates (on movement and SOS state changes)
- Automatic alert broadcasting to authorized operators
- Full audit trail of acknowledgements and actions

### 🚌 Bus Route Management
- Complete route information with sub-routes
- Expandable sub-route details
- Search and filter functionality
- Real-time route updates
- Admin can add/edit/delete routes

### 🧭 Guided Civic Assistant
- Deterministic decision trees with predefined civic responses
- Intent recognition using rule-based matching (greeting, emergency, hospital, police, bus, weather, etc.)
- Regional language support (English + Malayalam)
- Fully logged and auditable conversations
- No external AI model calls; responses come from curated content
- Real-time database integration for logging and analytics

### 🌤️ Disaster Readiness & Climate
- Current weather conditions
- 7-day weather forecast
- Historical weather data
- Weather alerts and warnings
- Weather-triggered informational civic advisories (landslide, transport, safety)
- Interactive charts and graphs
- Multiple location support

### 📊 Admin Dashboard
- Real-time statistics and indicators
- Interactive charts and visualizations
- User-friendly interface
- Role-bound actions (operator, supervisor, auditor)
- Profile management (username, password, photo)
- System status monitoring
- Data export functionality

---

## 🎯 Future Enhancements

- [ ] **KSRTC Live Tracking** - Real-time bus location tracking
- [ ] **Push Notifications** - Firebase Cloud Messaging integration
- [ ] **Role Policy Refinement** - More granular permissions and approval flows on top of existing roles
- [ ] **Extended Civic Content Packs** - More curated, government-approved assistant content (still deterministic)
- [ ] **GIS Map Integration** - Interactive maps with route visualization
- [ ] **Deeper Offline Capabilities** - Advanced sync and conflict resolution for fully offline use
- [ ] **Multi-language Support** - Full Malayalam translation
- [ ] **Analytics Dashboard** - Advanced usage statistics and insights
- [ ] **Payment Integration** - For premium features
- [ ] **Social Features** - Community forums and discussions

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/AmazingFeature`
3. **Commit Changes**: `git commit -m 'Add some AmazingFeature'`
4. **Push to Branch**: `git push origin feature/AmazingFeature`
5. **Open Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Write clear commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**Free for academic and public-service use.**

---

## 👨‍💻 Author

**Niranjan**

- 📧 Email: niranjjithbathery@gmail.com
- 🌐 Website: [arjith.vercel.app](https://arjith.vercel.app)
- 💼 LinkedIn: [www.linkedin.com/in/niranjan-a-r-674799281](www.linkedin.com/in/niranjan-a-r-674799281)

---

## 🙏 Acknowledgments

- Wayanad District Administration
- Kerala State Road Transport Corporation (KSRTC)
- All contributors and testers
- Open source community

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/your-username/smart-wayanad/issues)
- **Email**: support@smartwayanad.com
- **Documentation**: [Full Documentation](https://docs.smartwayanad.com)

---

<div align="center">

**🌍 Empowering Citizens, Digitally.**

Made with ❤️ for Wayanad

[⬆ Back to Top](#-smart-wayanad)

</div>
