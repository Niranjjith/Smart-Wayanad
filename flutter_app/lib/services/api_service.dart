import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

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
          final errorMessage = errorData['message'] ?? 'Request failed';
          // Return error information instead of throwing
          return {
            'error': true,
            'message': errorMessage,
            'statusCode': res.statusCode,
          };
        }
      } catch (_) {
        // If parsing fails, use the raw body or default message
      }
      return {
        'error': true,
        'message': 'Request failed with status ${res.statusCode}',
        'statusCode': res.statusCode,
      };
    } catch (e) {
      print("⚠️ POST /$endpoint error: $e");
      // Handle network errors
      if (e.toString().contains('SocketException') || 
          e.toString().contains('Failed host lookup') ||
          e.toString().contains('Connection refused')) {
        return {
          'error': true,
          'message': 'Cannot connect to server. Please check your internet connection.',
          'statusCode': 0,
        };
      }
      return {
        'error': true,
        'message': e.toString().replaceAll('Exception: ', ''),
        'statusCode': 0,
      };
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
    return await _post("auth/register", {
      "name": name,
      "email": email,
      "password": password,
    });
  }

  static Future<Map<String, dynamic>?> loginUser(
      String email, String password) async {
    final result = await _post("auth/login", {
      "email": email,
      "password": password,
    });
    // Save token if present
    if (result != null && result['token'] != null) {
      await saveToken(result['token']);
    }
    return result;
  }

  static Future<List<dynamic>> getUsers() async {
    final data = await _get("users");
    return data is List ? data : [];
  }

  // Get user profile (requires token)
  static Future<Map<String, dynamic>?> getProfile() async {
    try {
      final token = await _getToken();
      final res = await http.get(
        Uri.parse("$_baseUrl/auth/profile"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
      );

      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      }
      return null;
    } catch (e) {
      print("⚠️ Get profile error: $e");
      return null;
    }
  }

  // Update user profile
  static Future<Map<String, dynamic>?> updateProfile({
    String? name,
    String? email,
    String? password,
    String? phone,
    String? profilePhoto,
  }) async {
    try {
      final token = await _getToken();
      final body = <String, dynamic>{};
      if (name != null) body['name'] = name;
      if (email != null) body['email'] = email;
      if (password != null) body['password'] = password;
      if (phone != null) body['phone'] = phone;
      if (profilePhoto != null) body['profilePhoto'] = profilePhoto;

      final res = await http.put(
        Uri.parse("$_baseUrl/auth/profile"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: jsonEncode(body),
      );

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        return data['user'] ?? data;
      }
      return null;
    } catch (e) {
      print("⚠️ Update profile error: $e");
      return null;
    }
  }

  // Helper to get token from storage
  static Future<String?> _getToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString('token');
    } catch (e) {
      return null;
    }
  }

  // Helper to save token
  static Future<void> saveToken(String token) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', token);
    } catch (e) {
      print("Error saving token: $e");
    }
  }

  // Helper to clear token
  static Future<void> clearToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('token');
    } catch (e) {
      print("Error clearing token: $e");
    }
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
      final result = await _post("chatbot", {
        "message": message,
        "userId": userId ?? "Guest"
      });
      
      // Check for errors
      if (result != null && result['error'] == true) {
        return {
          'reply': result['message'] ?? 'Sorry, I could not process that.',
          'intent': 'error',
          'confidence': 0.0,
        };
      }
      
      return result;
    } catch (e) {
      print("⚠️ Chatbot error: $e");
      return {
        'reply': 'Sorry, I\'m having trouble connecting. Please try again.',
        'intent': 'error',
        'confidence': 0.0,
      };
    }
  }

  // Analytics
  static Future<Map<String, dynamic>?> getAlertPredictions() async {
    final data = await _get("analytics/alerts/predictions");
    return data is Map<String, dynamic> ? data : null;
  }

  static Future<Map<String, dynamic>?> getRouteRecommendations({
    String? origin,
    String? destination,
    String? query,
  }) async {
    String url = "analytics/routes/recommendations?";
    if (query != null && query.isNotEmpty) {
      url += "query=${Uri.encodeComponent(query)}";
    } else if (origin != null && destination != null) {
      url += "origin=${Uri.encodeComponent(origin)}&destination=${Uri.encodeComponent(destination)}";
    } else {
      return null;
    }
    final data = await _get(url);
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
