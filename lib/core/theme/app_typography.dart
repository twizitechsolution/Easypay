import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

/// Geometric modern typography definitions for Easy Pay
class AppTypography {
  AppTypography._();

  static TextStyle get headingDisplay => GoogleFonts.outfit(
    fontSize: 28,
    fontWeight: FontWeight.w700,
    color: AppColors.textPrimary,
    letterSpacing: -0.5,
  );

  static TextStyle get headingLarge => GoogleFonts.outfit(
    fontSize: 22,
    fontWeight: FontWeight.w700,
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
  );

  static TextStyle get headingMedium => GoogleFonts.outfit(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
  );

  static TextStyle get headingSmall => GoogleFonts.outfit(
    fontSize: 15,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
  );

  static TextStyle get heroBalance => GoogleFonts.outfit(
    fontSize: 32,
    fontWeight: FontWeight.w800,
    color: AppColors.textPrimary,
    letterSpacing: -0.5,
  );

  static TextStyle get bodyLarge => GoogleFonts.inter(
    fontSize: 15,
    fontWeight: FontWeight.w400,
    color: AppColors.textPrimary,
  );

  static TextStyle get bodyMedium => GoogleFonts.inter(
    fontSize: 13,
    fontWeight: FontWeight.w400,
    color: AppColors.textMuted,
  );

  static TextStyle get bodySmall => GoogleFonts.inter(
    fontSize: 11,
    fontWeight: FontWeight.w400,
    color: AppColors.textMuted,
  );

  static TextStyle get buttonLabel => GoogleFonts.outfit(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.3,
    color: AppColors.backgroundPrimary,
  );

  static TextStyle get badgeLabel => GoogleFonts.inter(
    fontSize: 11,
    fontWeight: FontWeight.w700,
    letterSpacing: 0.2,
  );

  static TextStyle get currencySymbol => GoogleFonts.inter(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    color: AppColors.electricCyan,
  );
}
