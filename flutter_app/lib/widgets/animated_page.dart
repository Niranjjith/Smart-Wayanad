import 'package:flutter/material.dart';

/// 🎬 Reusable Animated Page Wrapper
/// Provides consistent fade and slide animations for page transitions
class AnimatedPage extends StatefulWidget {
  final Widget child;
  final Duration duration;
  final Curve curve;
  final Offset slideOffset;

  const AnimatedPage({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 400),
    this.curve = Curves.easeOutCubic,
    this.slideOffset = const Offset(0, 0.05),
  });

  @override
  State<AnimatedPage> createState() => _AnimatedPageState();
}

class _AnimatedPageState extends State<AnimatedPage>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
    );
    
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: widget.curve,
      ),
    );
    
    _slideAnimation = Tween<Offset>(
      begin: widget.slideOffset,
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: widget.curve,
      ),
    );
    
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: SlideTransition(
        position: _slideAnimation,
        child: widget.child,
      ),
    );
  }
}

/// 🎬 Page Transition Builder for Navigation
class AppPageRoute<T> extends PageRouteBuilder<T> {
  final Widget page;
  final Duration transitionDuration;

  AppPageRoute({
    required this.page,
    this.transitionDuration = const Duration(milliseconds: 300),
  }) : super(
          pageBuilder: (context, animation, secondaryAnimation) => page,
          transitionDuration: transitionDuration,
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            const begin = Offset(0.0, 0.05);
            const end = Offset.zero;
            const curve = Curves.easeOutCubic;

            var tween = Tween(begin: begin, end: end).chain(
              CurveTween(curve: curve),
            );

            return FadeTransition(
              opacity: animation,
              child: SlideTransition(
                position: animation.drive(tween),
                child: child,
              ),
            );
          },
        );
}









