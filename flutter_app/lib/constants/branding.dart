import 'package:flutter/material.dart';

/// Shared branding: assets and legacy hero URL (unused on home when [homeHeroAsset] is set).
abstract final class Branding {
  static const String logoAsset = 'assets/LOGO.png';

  /// Full-screen home hero (local asset).
  static const String homeHeroAsset = 'assets/bg.jpg';

  /// Optional remote fallback for other screens.
  static const String wayanadHeroImageUrl =
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Banasura_Hill_Wayanad.jpg/1600px-Banasura_Hill_Wayanad.jpg';
}

/// District app greens — use with [Theme.of(context).colorScheme] where possible.
abstract final class AppPalette {
  static const Color forest = Color(0xFF0F3D24);
  static const Color pine = Color(0xFF14532D);
  static const Color leaf = Color(0xFF1B6B45);
  static const Color mint = Color(0xFF3D9A6A);
  static const Color sage = Color(0xFF8BC9A8);
  static const Color cream = Color(0xFFF4FAF6);
  static const Color deepGreen = Color(0xFF063018);

  /// Scaffold background for feature screens (matches [Theme] scaffold).
  static const Color screenBackground = cream;

  /// Rich green hero for SliverAppBars and large headers.
  static List<Color> get screenHeroGradient => const [
        deepGreen,
        forest,
        leaf,
      ];

  /// Compact two-stop gradient (cards, chips, camera badge).
  static List<Color> get accentGradient => const [pine, leaf];
}
