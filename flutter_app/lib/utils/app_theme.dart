import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// 🎨 Shared UI Theme Constants for Consistent Design
class AppTheme {
  // Colors - Light Theme
  static const Color primaryColor = Color(0xFF667EEA);
  static const Color secondaryColor = Color(0xFF764BA2);
  static const Color backgroundColor = Color(0xFFF5F7FA);
  static const Color cardColor = Colors.white;
  static const Color textPrimary = Color(0xFF1A1F3A);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color borderColor = Color(0xFFE5E7EB);
  
  // Colors - Dark Theme
  static const Color darkPrimaryColor = Color(0xFF2196F3);
  static const Color darkBackgroundColor = Color(0xFF0A0E27);
  static const Color darkCardColor = Color(0xFF1A1F3A);
  static const Color darkTextPrimary = Colors.white;
  static const Color darkTextSecondary = Color(0xFF9CA3AF);
  static const Color darkBorderColor = Color(0xFF374151);
  
  // Accent Colors
  static const Color successColor = Color(0xFF10B981);
  static const Color errorColor = Color(0xFFEF4444);
  static const Color warningColor = Color(0xFFF59E0B);
  static const Color infoColor = Color(0xFF3B82F6);
  
  // Spacing
  static const double paddingSmall = 8.0;
  static const double paddingMedium = 16.0;
  static const double paddingLarge = 24.0;
  static const double paddingXLarge = 32.0;
  
  // Border Radius
  static const double radiusSmall = 8.0;
  static const double radiusMedium = 12.0;
  static const double radiusLarge = 16.0;
  static const double radiusXLarge = 20.0;
  
  // Animation Durations
  static const Duration animationFast = Duration(milliseconds: 200);
  static const Duration animationMedium = Duration(milliseconds: 400);
  static const Duration animationSlow = Duration(milliseconds: 600);
  static const Duration animationPageTransition = Duration(milliseconds: 300);
  
  // Text Styles
  static TextStyle get headingLarge => GoogleFonts.poppins(
    fontSize: 28,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.5,
  );
  
  static TextStyle get headingMedium => GoogleFonts.poppins(
    fontSize: 22,
    fontWeight: FontWeight.w600,
    letterSpacing: -0.3,
  );
  
  static TextStyle get headingSmall => GoogleFonts.poppins(
    fontSize: 18,
    fontWeight: FontWeight.w600,
  );
  
  static TextStyle get bodyLarge => GoogleFonts.inter(
    fontSize: 16,
    fontWeight: FontWeight.w400,
  );
  
  static TextStyle get bodyMedium => GoogleFonts.inter(
    fontSize: 14,
    fontWeight: FontWeight.w400,
  );
  
  static TextStyle get bodySmall => GoogleFonts.inter(
    fontSize: 12,
    fontWeight: FontWeight.w400,
  );
  
  // Card Style
  static BoxDecoration cardDecoration(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return BoxDecoration(
      color: isDark ? darkCardColor : cardColor,
      borderRadius: BorderRadius.circular(radiusLarge),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(isDark ? 0.3 : 0.05),
          blurRadius: 10,
          offset: const Offset(0, 2),
        ),
      ],
    );
  }
  
  // Input Decoration
  static InputDecoration inputDecoration({
    required BuildContext context,
    required String label,
    IconData? prefixIcon,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return InputDecoration(
      labelText: label,
      prefixIcon: prefixIcon != null ? Icon(prefixIcon) : null,
      filled: true,
      fillColor: isDark ? darkCardColor : backgroundColor,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusMedium),
        borderSide: BorderSide(color: isDark ? darkBorderColor : borderColor),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusMedium),
        borderSide: BorderSide(color: isDark ? darkBorderColor : borderColor),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusMedium),
        borderSide: BorderSide(
          color: isDark ? darkPrimaryColor : primaryColor,
          width: 2,
        ),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      labelStyle: bodyMedium.copyWith(
        color: isDark ? darkTextSecondary : textSecondary,
      ),
    );
  }
  
  // Button Style
  static ButtonStyle primaryButtonStyle(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return ElevatedButton.styleFrom(
      backgroundColor: isDark ? darkPrimaryColor : primaryColor,
      foregroundColor: Colors.white,
      elevation: 0,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radiusMedium),
      ),
    );
  }
  
  // Gradient Colors
  static List<Color> getGradientColors(String type, BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    switch (type) {
      case 'primary':
        return isDark
            ? [darkPrimaryColor, const Color(0xFF1976D2)]
            : [primaryColor, secondaryColor];
      case 'success':
        return [successColor, const Color(0xFF059669)];
      case 'error':
        return [errorColor, const Color(0xFFDC2626)];
      case 'warning':
        return [warningColor, const Color(0xFFD97706)];
      case 'info':
        return [infoColor, const Color(0xFF2563EB)];
      default:
        return isDark
            ? [darkPrimaryColor, const Color(0xFF1976D2)]
            : [primaryColor, secondaryColor];
    }
  }
}




