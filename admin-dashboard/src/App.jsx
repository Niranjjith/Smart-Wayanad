import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import HelpAlerts from "./pages/HelpAlerts.jsx";
import BusRoutes from "./pages/BusRoutes.jsx";
import Climate from "./pages/Climate.jsx";
import Chatbot from "./pages/Chatbot.jsx";
import SendAlert from "./pages/SendAlert.jsx";
import Analytics from "./pages/Analytics.jsx";
import AIMLFeatures from "./pages/AIMLFeatures.jsx";
import Settings from "./pages/Settings.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ------------------- PUBLIC ROUTES ------------------- */}
          <Route path="/login" element={<Login />} />

          {/* ------------------- PROTECTED ROUTES ------------------- */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <HelpAlerts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/send-alert"
            element={
              <ProtectedRoute>
                <SendAlert />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bus"
            element={
              <ProtectedRoute>
                <BusRoutes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/climate"
            element={
              <ProtectedRoute>
                <Climate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-ml"
            element={
              <ProtectedRoute>
                <AIMLFeatures />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* ------------------- FALLBACK ROUTE ------------------- */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* Toast Notifications */}
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
