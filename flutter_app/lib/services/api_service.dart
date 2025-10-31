import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

/// Smart Wayanad API Service
/// Connects Flutter app ↔ Node.js backend.
/// Supports: signup, login, help alerts, bus routes, chatbot, climate

class ApiService {
  // 🟢 Change this to YOUR system's IP address (from ipconfig)
  // Example: "http://192.168.1.2:5000/api"
  static String baseUrl = "http://192.168.1.2:5000/api";

  /// Automatically select correct base URL for desktop/mobile
  static String get fullBaseUrl {
    if (Platform.isWindows || Platform.isMacOS) {
      return "http://localhost:5000/api";
    }
    return baseUrl;
  }

  // ----------------- USER ENDPOINTS -----------------

  /// 🔹 Register a new user
  static Future<Map?> registerUser(String name, String email, String password) async {
    try {
      final res = await http.post(
        Uri.parse("$fullBaseUrl/users"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "name": name,
          "email": email,
          "password": password,
        }),
      );

      if (res.statusCode == 201) {
        return jsonDecode(res.body);
      } else {
        print("❌ Register failed: ${res.statusCode} ${res.body}");
      }
    } catch (e) {
      print("❌ registerUser error: $e");
    }
    return null;
  }

  /// 🔹 Login existing user (email + password)
  static Future<Map?> loginUser(String email, String password) async {
    try {
      final res = await http.post(
        Uri.parse("$fullBaseUrl/auth/login"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "email": email,
          "password": password,
        }),
      );

      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      } else {
        print("❌ Login failed: ${res.statusCode} ${res.body}");
      }
    } catch (e) {
      print("❌ loginUser error: $e");
    }
    return null;
  }

  /// 🔹 Fetch all registered users
  static Future<List> getUsers() async {
    try {
      final res = await http.get(Uri.parse("$fullBaseUrl/users"));
      if (res.statusCode == 200) return jsonDecode(res.body);
    } catch (e) {
      print("❌ getUsers error: $e");
    }
    return [];
  }

  // ----------------- HELP ALERTS -----------------
  /// 🔹 Send SOS help alert
  static Future<bool> sendHelp({
    required String name,
    required String message,
    required double lat,
    required double lng,
  }) async {
    try {
      final res = await http.post(
        Uri.parse("$fullBaseUrl/help"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "name": name,
          "message": message,
          "location": {"lat": lat, "lng": lng},
        }),
      );
      return res.statusCode == 201 || res.statusCode == 200;
    } catch (e) {
      print("❌ sendHelp error: $e");
      return false;
    }
  }

  // ----------------- BUS ROUTES -----------------
  /// 🔹 Get all bus routes
  static Future<List> getBusRoutes() async {
    try {
      final res = await http.get(Uri.parse("$fullBaseUrl/bus"));
      if (res.statusCode == 200) return jsonDecode(res.body);
    } catch (e) {
      print("❌ getBusRoutes error: $e");
    }
    return [];
  }

  // ----------------- CLIMATE -----------------
  /// 🔹 Get current weather data
  static Future<Map?> getClimate([String city = "Wayanad"]) async {
    try {
      final res = await http.get(Uri.parse("$fullBaseUrl/climate/current?city=$city"));
      if (res.statusCode == 200) return jsonDecode(res.body);
    } catch (e) {
      print("❌ getClimate error: $e");
    }
    return null;
  }

  // ----------------- CHATBOT -----------------
  /// 🔹 Fetch all chat logs
  static Future<List> getChatLogs() async {
    try {
      final res = await http.get(Uri.parse("$fullBaseUrl/chat"));
      if (res.statusCode == 200) return jsonDecode(res.body);
    } catch (e) {
      print("❌ getChatLogs error: $e");
    }
    return [];
  }

  /// 🔹 Send message to chatbot
  static Future<Map?> sendChat(String user, String message) async {
    try {
      final res = await http.post(
        Uri.parse("$fullBaseUrl/chat"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"user": user, "message": message}),
      );
      if (res.statusCode == 201 || res.statusCode == 200) {
        return jsonDecode(res.body);
      }
    } catch (e) {
      print("❌ sendChat error: $e");
    }
    return null;
  }
}
