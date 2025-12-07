import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'auth_page.dart';
import 'dart:math' as math;

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage>
    with TickerProviderStateMixin {
  late AnimationController _logoController;
  late AnimationController _backgroundController;
  late Animation<double> _logoScale;
  late Animation<double> _logoRotation;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();

    // Logo animation
    _logoController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    );

    _logoScale = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _logoController,
        curve: Curves.elasticOut,
      ),
    );

    _logoRotation = Tween<double>(begin: 0.0, end: 2 * math.pi).animate(
      CurvedAnimation(
        parent: _logoController,
        curve: Curves.easeInOut,
      ),
    );

    // Background animation
    _backgroundController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat();

    // Fade and slide animations
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _logoController,
        curve: const Interval(0.5, 1.0, curve: Curves.easeIn),
      ),
    );

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.5),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _logoController,
        curve: const Interval(0.5, 1.0, curve: Curves.easeOut),
      ),
    );

    _logoController.forward();
  }

  @override
  void dispose() {
    _logoController.dispose();
    _backgroundController.dispose();
    super.dispose();
  }

  void _navigateToLogin() {
    Navigator.pushReplacement(
      context,
      PageRouteBuilder(
        transitionDuration: const Duration(milliseconds: 1000),
        pageBuilder: (_, __, ___) => const AuthPage(initialMode: AuthMode.login),
        transitionsBuilder: (_, anim, __, child) {
          return FadeTransition(
            opacity: anim,
            child: SlideTransition(
              position: Tween<Offset>(
                begin: const Offset(0, 0.2),
                end: Offset.zero,
              ).animate(CurvedAnimation(
                parent: anim,
                curve: Curves.easeOutCubic,
              )),
              child: child,
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final screen = MediaQuery.of(context).size;

    return Scaffold(
      body: AnimatedBuilder(
        animation: _backgroundController,
        builder: (context, child) {
          return Container(
            width: screen.width,
            height: screen.height,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF667EEA),
                  const Color(0xFF764BA2),
                  const Color(0xFFF093FB),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                stops: [
                  0.0,
                  0.5 + 0.3 * math.sin(_backgroundController.value * 2 * math.pi),
                  1.0,
                ],
              ),
            ),
            child: Stack(
              children: [
                // Animated background circles
                ...List.generate(5, (index) {
                  return Positioned(
                    left: screen.width * (0.2 + index * 0.15),
                    top: screen.height * (0.1 + index * 0.2),
                    child: Transform.rotate(
                      angle: _backgroundController.value * (index + 1) * 0.5,
                      child: Container(
                        width: 100 + index * 50,
                        height: 100 + index * 50,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white.withValues(
                            alpha: 0.05 + index * 0.02,
                          ),
                        ),
                      ),
                    ),
                  );
                }),
                // Main content
                Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Logo with animation
                      ScaleTransition(
                        scale: _logoScale,
                        child: RotationTransition(
                          turns: _logoRotation,
                          child: Container(
                            width: 140,
                            height: 140,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: LinearGradient(
                                colors: [
                                  Colors.white.withValues(alpha: 0.3),
                                  Colors.white.withValues(alpha: 0.1),
                                ],
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.2),
                                  blurRadius: 30,
                                  offset: const Offset(0, 15),
                                ),
                              ],
                            ),
                            child: const Icon(
                              Icons.public_rounded,
                              color: Colors.white,
                              size: 80,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 40),
                      // Title with fade and slide
                      FadeTransition(
                        opacity: _fadeAnimation,
                        child: SlideTransition(
                          position: _slideAnimation,
                          child: Column(
                            children: [
                              Text(
                                'Smart Wayanad',
                                style: GoogleFonts.poppins(
                                  color: Colors.white,
                                  fontSize: 42,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: -1,
                                  shadows: [
                                    Shadow(
                                      color: Colors.black.withValues(alpha: 0.3),
                                      offset: const Offset(0, 2),
                                      blurRadius: 10,
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 12),
                              Text(
                                'Your Smart District Companion',
                                style: GoogleFonts.poppins(
                                  color: Colors.white.withValues(alpha: 0.9),
                                  fontSize: 18,
                                  fontWeight: FontWeight.w500,
                                  letterSpacing: 0.5,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 80),
                      // Get Started Button
                      FadeTransition(
                        opacity: _fadeAnimation,
                        child: SlideTransition(
                          position: _slideAnimation,
                          child: _AnimatedButton(
                            onPressed: _navigateToLogin,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

// Animated Button Widget
class _AnimatedButton extends StatefulWidget {
  final VoidCallback onPressed;

  const _AnimatedButton({required this.onPressed});

  @override
  State<_AnimatedButton> createState() => _AnimatedButtonState();
}

class _AnimatedButtonState extends State<_AnimatedButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _controller.forward(),
      onTapUp: (_) {
        _controller.reverse();
        widget.onPressed();
      },
      onTapCancel: () => _controller.reverse(),
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 50, vertical: 18),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(30),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.2),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Get Started',
                style: GoogleFonts.poppins(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF667EEA),
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(width: 12),
              const Icon(
                Icons.arrow_forward_rounded,
                color: Color(0xFF667EEA),
                size: 24,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
