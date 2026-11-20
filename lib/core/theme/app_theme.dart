import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'app_colors.dart';
import 'app_typography.dart';

class AppTheme {
  AppTheme._();

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: AppColors.backgroundPrimary,
      primaryColor: AppColors.primaryBlue,
      cardColor: AppColors.surfaceElevated,
      dividerColor: AppColors.borderSubtle,
      
      colorScheme: const ColorScheme.light(
        primary: AppColors.primaryBlue,
        onPrimary: Colors.white,
        secondary: AppColors.bachatGreen,
        onSecondary: Colors.white,
        surface: AppColors.surfaceElevated,
        onSurface: AppColors.textPrimary,
        error: AppColors.errorRed,
        onError: Colors.white,
      ),

      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
        scrolledUnderElevation: 0,
        systemOverlayStyle: SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.light,
          systemNavigationBarColor: Colors.white,
          systemNavigationBarIconBrightness: Brightness.dark,
        ),
        titleTextStyle: TextStyle(
          color: AppColors.textPrimary,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
        iconTheme: IconThemeData(color: AppColors.textPrimary),
      ),

      cardTheme: CardTheme(
        color: AppColors.surfaceElevated,
        elevation: 1,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.borderSubtle, width: 1),
        ),
      ),

      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Colors.white,
        selectedItemColor: AppColors.primaryBlue,
        unselectedItemColor: AppColors.textMuted,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
    );
  }

  // Alias for darkTheme for compatibility
  static ThemeData get darkTheme => lightTheme;
}
