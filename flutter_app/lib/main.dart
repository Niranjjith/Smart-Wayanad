import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'pages/splash_page.dart';

/// 🏠 Smart Wayanad Main Entry Point
/// Initializes Flutter bindings, theme, and launches the Splash screen.

void main() async {
  // Ensures Flutter engine is initialized before runApp()
  WidgetsFlutterBinding.ensureInitialized();

  // Run the app
  runApp(const SmartWayanadApp());
}

/// 🌿 Root App Widget
class SmartWayanadApp extends StatefulWidget {
  const SmartWayanadApp({super.key});

  @override
  State<SmartWayanadApp> createState() => _SmartWayanadAppState();
}

class _SmartWayanadAppState extends State<SmartWayanadApp> {
  bool _darkMode = false;

  @override
  void initState() {
    super.initState();
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _darkMode = prefs.getBool('darkMode') ?? false;
    });
  }

  void toggleTheme(bool isDark) {
    setState(() {
      _darkMode = isDark;
    });
    SharedPreferences.getInstance().then((prefs) {
      prefs.setBool('darkMode', isDark);
    });
  }

  @override
  Widget build(BuildContext context) {
    // Define a premium unified app theme
    final lightTheme = ThemeData(
      useMaterial3: true, // Modern Material You design
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFF667EEA),
        brightness: Brightness.light,
      ),
      textTheme: GoogleFonts.interTextTheme(),
      appBarTheme: AppBarTheme(
        backgroundColor: const Color(0xFF667EEA),
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.poppins(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: Colors.white,
          letterSpacing: -0.5,
        ),
      ),
      scaffoldBackgroundColor: const Color(0xFFF5F7FA),
      cardTheme: CardThemeData(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        shadowColor: Colors.black.withValues(alpha: 0.1),
      ),
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: const Color(0xFF667EEA),
        foregroundColor: Colors.white,
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF667EEA), width: 2),
        ),
      ),
    );

    // Dark theme - Blue/Black/White theme
    final darkTheme = ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFF2196F3), // Blue
        brightness: Brightness.dark,
      ),
      textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme).apply(
        bodyColor: Colors.white,
        displayColor: Colors.white,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: const Color(0xFF0A0E27), // Dark blue-black
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.poppins(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: Colors.white,
          letterSpacing: -0.5,
        ),
      ),
      scaffoldBackgroundColor: const Color(0xFF0A0E27), // Dark blue-black
      cardTheme: CardThemeData(
        elevation: 2,
        color: const Color(0xFF1A1F3A), // Slightly lighter blue-black
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        shadowColor: Colors.black.withValues(alpha: 0.5),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFF1A1F3A),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF2196F3), width: 1),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF2196F3), width: 1),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF2196F3), width: 2),
        ),
      ),
    );

    return MaterialApp(
      title: 'Smart Wayanad',
      debugShowCheckedModeBanner: false,
      theme: lightTheme,
      darkTheme: darkTheme,
      themeMode: _darkMode ? ThemeMode.dark : ThemeMode.light,

      /// 👇 Initial Page (Splash → Login → Home)
      home: SplashPage(toggleTheme: (isDark) => toggleTheme(isDark)),

      /// Optional: Named routes for cleaner navigation
      routes: {
        '/splash': (_) => const SplashPage(),
        // You can add others like:
        // '/home': (_) => const HomePage(),
        // '/login': (_) => const LoginPage(),
      },
    );
  }
}
