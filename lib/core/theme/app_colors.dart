import 'package:flutter/material.dart';

/// Design tokens matching the authentic Bachat Pay fintech application:
/// Deep Royal Navy Header, Crisp White Surface Cards, Emerald Bachat Accents
class AppColors {
  AppColors._();

  // Background & Surfaces
  static const Color backgroundPrimary = Color(0xFFF4F6F9); // Light Gray Surface
  static const Color backgroundSecondary = Color(0xFFFFFFFF); // Pure White Surface
  static const Color surfaceElevated = Color(0xFFFFFFFF); // Elevated White Card
  static const Color surfaceCard = Color(0xFFFFFFFF);
  static const Color borderSubtle = Color(0xFFE2E8F0); // Delicate Light Border
  static const Color borderActive = Color(0xFF3B82F6);

  // Authentic Bachat Pay Royal Navy & Blue
  static const Color primaryNavy = Color(0xFF1E3A8A); // Deep Royal Navy
  static const Color primaryBlue = Color(0xFF0D47A1); // Authentic Fintech Blue
  static const Color royalLight = Color(0xFF2563EB);

  // Bachat Green (Instant Cashback Badges & Chips)
  static const Color bachatGreen = Color(0xFF059669);
  static const Color bachatGreenLight = Color(0xFFECFDF5);
  static const Color cyberEmerald = Color(0xFF059669); // Alias for compatibility
  static const Color electricCyan = Color(0xFF2563EB); // Alias for compatibility

  // Accent Colors
  static const Color warningOrange = Color(0xFFEA580C);
  static const Color accentAmber = Color(0xFFF59E0B);
  static const Color errorRed = Color(0xFFDC2626);

  // Text Colors
  static const Color textPrimary = Color(0xFF0F172A); // High Contrast Dark Slate
  static const Color textSecondary = Color(0xFF475569); // Medium Slate
  static const Color textMuted = Color(0xFF94A3B8); // Muted Slate
  static const Color textWhite = Color(0xFFFFFFFF);

  // Authentic Bachat Pay Gradients
  static const LinearGradient primaryNavyGradient = LinearGradient(
    colors: [Color(0xFF1E3A8A), Color(0xFF0D47A1), Color(0xFF1565C0)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient primaryCyanGradient = primaryNavyGradient;

  static const LinearGradient emeraldGradient = LinearGradient(
    colors: [Color(0xFF059669), Color(0xFF10B981)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
