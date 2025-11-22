import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'pages/splash_page.dart';

/// 🏠 Smart Wayanad Main Entry Point
/// Initializes Flutter bindings, theme, and launches the Splash screen.

void main() {
  // Ensures Flutter engine is initialized before runApp()
  WidgetsFlutterBinding.ensureInitialized();

  // Run the app
  runApp(const SmartWayanadApp());
}

/// 🌿 Root App Widget
class SmartWayanadApp extends StatelessWidget {
  const SmartWayanadApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Define a premium unified app theme
    final theme = ThemeData(
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

    return MaterialApp(
      title: 'Smart Wayanad',
      debugShowCheckedModeBanner: false,
      theme: theme,

      /// 👇 Initial Page (Splash → Login → Home)
      home: const SplashPage(),

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
