import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'core/theme/app_theme.dart';
import 'features/navigation/main_navigation_wrapper.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Edge-to-edge transparent navigation bar and status bar
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Colors.transparent,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  runApp(const EasyPayApp());
}

class EasyPayApp extends StatelessWidget {
  const EasyPayApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Easy Pay',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const MainNavigationWrapper(),
    );
  }
}
