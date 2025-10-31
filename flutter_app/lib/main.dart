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
    // Define a unified app theme
    final theme = ThemeData(
      useMaterial3: true, // Modern Material You design
      colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
      textTheme: GoogleFonts.interTextTheme(),
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.green.shade800,
        foregroundColor: Colors.white,
        elevation: 0,
        titleTextStyle: GoogleFonts.poppins(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: Colors.white,
        ),
      ),
      scaffoldBackgroundColor: Colors.white,
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
