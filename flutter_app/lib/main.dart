import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'pages/splash_page.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const SmartWayanadApp());
}

class SmartWayanadApp extends StatelessWidget {
  const SmartWayanadApp({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
      textTheme: GoogleFonts.interTextTheme(),
    );
    return MaterialApp(
      title: 'Smart Wayanad',
      debugShowCheckedModeBanner: false,
      theme: theme,
      home: const SplashPage(),
    );
  }
}
