import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'pages/splash_page.dart';
import 'theme/app_mobile_theme.dart';

/// Smart Wayanad — mobile-first Material 3 theme and entry.

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const SmartWayanadApp());
}

/// Slightly softer, mobile-friendly scrolling on all platforms.
class _MobileScrollBehavior extends MaterialScrollBehavior {
  @override
  ScrollPhysics getScrollPhysics(BuildContext context) {
    return const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics());
  }

  @override
  Set<PointerDeviceKind> get dragDevices => {
        PointerDeviceKind.touch,
        PointerDeviceKind.mouse,
        PointerDeviceKind.stylus,
        PointerDeviceKind.trackpad,
      };
}

class SmartWayanadApp extends StatelessWidget {
  const SmartWayanadApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smart Wayanad',
      debugShowCheckedModeBanner: false,
      theme: AppMobileTheme.light(),
      themeMode: ThemeMode.light,
      scrollBehavior: _MobileScrollBehavior(),
      home: const SplashPage(),
      routes: {
        '/splash': (_) => const SplashPage(),
      },
    );
  }
}
