import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

/// 🌿 Smart Wayanad API Service
/// Handles all backend communication between Flutter app ↔ Node.js backend.
class ApiService {
  static const _mobileBase = "http://192.168.1.2:5000/api";
  static const _desktopBase = "http://localhost:5000/api";

  static String get _baseUrl =>
      (Platform.isWindows || Platform.isMacOS) ? _desktopBase : _mobileBase;

  // ---------------------------------------------------------------------------
  // 🧩 GENERIC HELPERS
  // ---------------------------------------------------------------------------

  static Future<Map<String, dynamic>?> _post(String endpoint, Map body) async {
    try {
      final res = await http.post(
        Uri.parse("$_baseUrl/$endpoint"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(body),
      );

      if (res.statusCode == 200 || res.statusCode == 201) {
        final data = jsonDecode(res.body);
        if (data is Map<String, dynamic>) return data;
        if (data is List) return {"success": true, "data": data};
        return {"success": true, "data": data};
      }

      print("❌ POST /$endpoint → ${res.statusCode}: ${res.body}");
      try {
        final errorData = jsonDecode(res.body);
        if (errorData is Map<String, dynamic>) {
          throw Exception(errorData['message'] ?? 'Request failed');
        }
      } catch (_) {
        // If parsing fails, use the raw body or default message
      }
      throw Exception('Request failed with status ${res.statusCode}');
    } catch (e) {
      print("⚠️ POST /$endpoint error: $e");
      rethrow;
    }
  }

  static Future<dynamic> _get(String endpoint) async {
    try {
      final res = await http.get(Uri.parse("$_baseUrl/$endpoint"));

      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      }

      print("❌ GET /$endpoint → ${res.statusCode}: ${res.body}");
    } catch (e) {
      print("⚠️ GET /$endpoint error: $e");
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // 👤 USER MANAGEMENT
  // ---------------------------------------------------------------------------

  static Future<Map<String, dynamic>?> registerUser(
      String name, String email, String password) async {
    return await _post("users", {
      "name": name,
      "email": email,
      "password": password,
    });
  }

  static Future<Map<String, dynamic>?> loginUser(
      String email, String password) async {
    return await _post("auth/login", {
      "email": email,
      "password": password,
    });
  }

  static Future<List<dynamic>> getUsers() async {
    final data = await _get("users");
    return data is List ? data : [];
  }

  // ---------------------------------------------------------------------------
  // 🚨 HELP ALERTS
  // ---------------------------------------------------------------------------

  static Future<bool> sendHelp({
    required String name,
    required String message,
    required double lat,
    required double lng,
    String phone = "",
  }) async {
    try {
      final res = await _post("help", {
        "name": name,
        "phone": phone,
        "message": message,
        "lat": lat,
        "lng": lng,
      });
      return res != null;
    } catch (e) {
      print("Error sending help: $e");
      return false;
    }
  }

  static Future<List<dynamic>> getAlerts() async {
    final data = await _get("help");
    return data is List ? data : [];
  }

  static Future<bool> updateLiveLocation({
    required double lat,
    required double lng,
    String? alertId,
  }) async {
    try {
      final res = await _post("help/live-location", {
        "lat": lat,
        "lng": lng,
        "alertId": alertId,
      });
      return res != null;
    } catch (e) {
      print("Error updating live location: $e");
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // 🚌 BUS ROUTES
  // ---------------------------------------------------------------------------

  static Future<List<dynamic>> getBusRoutes() async {
    final data = await _get("bus");
    return data is List ? data : [];
  }

  // ---------------------------------------------------------------------------
  // 🌤 CLIMATE INFO
  // ---------------------------------------------------------------------------

  static Future<Map<String, dynamic>?> getClimate(
      [String city = "Wayanad"]) async {
    final data = await _get("climate/current?city=$city");
    return data is Map<String, dynamic> ? data : null;
  }

  // ---------------------------------------------------------------------------
  // 💬 CHATBOT
  // ---------------------------------------------------------------------------

  static Future<List<dynamic>> getChatLogs() async {
    final data = await _get("chat");
    return data is List ? data : [];
  }

  static Future<Map<String, dynamic>?> sendChat(
      String user, String message) async {
    return await _post("chat", {"user": user, "message": message});
  }

  // AI Chatbot
  static Future<Map<String, dynamic>?> sendChatbotMessage(
      String message, String? userId) async {
    try {
      return await _post("chatbot", {"message": message, "userId": userId});
    } catch (e) {
      print("Chatbot error: $e");
      return null;
    }
  }

  // Analytics
  static Future<Map<String, dynamic>?> getAlertPredictions() async {
    final data = await _get("analytics/alerts/predictions");
    return data is Map<String, dynamic> ? data : null;
  }

  static Future<Map<String, dynamic>?> getRouteRecommendations(
      String origin, String destination) async {
    final data = await _get(
        "analytics/routes/recommendations?origin=$origin&destination=$destination");
    return data is Map<String, dynamic> ? data : null;
  }

  static Future<Map<String, dynamic>?> detectAnomalies() async {
    final data = await _get("analytics/alerts/anomalies");
    return data is Map<String, dynamic> ? data : null;
  }

  // ---------------------------------------------------------------------------
  // 🏥 LOCATIONS (Hospitals, Clinics, Taxi, Helpline)
  // ---------------------------------------------------------------------------

  static Future<List<dynamic>> getAllLocations() async {
    final data = await _get("location");
    return data is List ? data : [];
  }

  static Future<List<dynamic>> getLocationsByType(String type) async {
    final data = await _get("location/$type");
    return data is List ? data : [];
  }

  static Future<Map<String, dynamic>?> addLocation({
    required String name,
    required String type,
    required String contact,
    required String address,
    double? latitude,
    double? longitude,
  }) async {
    return await _post("location", {
      "name": name,
      "type": type,
      "contact": contact,
      "address": address,
      "latitude": latitude,
      "longitude": longitude,
    });
  }

  // ---------------------------------------------------------------------------
  // 🧭 UTILITIES
  // ---------------------------------------------------------------------------

  static Future<bool> pingServer() async {
    try {
      final res = await http.get(Uri.parse(_baseUrl));
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }
}
