import 'package:flutter/material.dart';
import '../utils/app_theme.dart';

/// 🎴 Reusable Animated Card Widget
/// Provides consistent card styling with smooth animations
class AnimatedCard extends StatefulWidget {
  final Widget child;
  final EdgeInsets? padding;
  final EdgeInsets? margin;
  final VoidCallback? onTap;
  final Color? backgroundColor;
  final double? elevation;
  final Duration animationDuration;
  final int animationDelay;

  const AnimatedCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.onTap,
    this.backgroundColor,
    this.elevation,
    this.animationDuration = const Duration(milliseconds: 400),
    this.animationDelay = 0,
  });

  @override
  State<AnimatedCard> createState() => _AnimatedCardState();
}

class _AnimatedCardState extends State<AnimatedCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.animationDuration,
    );
    
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeOut,
      ),
    );
    
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.1),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeOutCubic,
      ),
    );
    
    _scaleAnimation = Tween<double>(begin: 0.95, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeOutBack,
      ),
    );
    
    // Delay animation start
    Future.delayed(Duration(milliseconds: widget.animationDelay), () {
      if (mounted) {
        _controller.forward();
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardDecoration = AppTheme.cardDecoration(context);
    
    Widget card = Container(
      padding: widget.padding ?? const EdgeInsets.all(AppTheme.paddingLarge),
      margin: widget.margin ?? const EdgeInsets.symmetric(
        horizontal: AppTheme.paddingMedium,
        vertical: AppTheme.paddingSmall,
      ),
      decoration: BoxDecoration(
        color: widget.backgroundColor ?? cardDecoration.color,
        borderRadius: BorderRadius.circular(AppTheme.radiusLarge),
        boxShadow: cardDecoration.boxShadow,
      ),
      child: widget.child,
    );

    if (widget.onTap != null) {
      card = InkWell(
        onTap: widget.onTap,
        borderRadius: BorderRadius.circular(AppTheme.radiusLarge),
        child: card,
      );
    }

    return FadeTransition(
      opacity: _fadeAnimation,
      child: SlideTransition(
        position: _slideAnimation,
        child: ScaleTransition(
          scale: _scaleAnimation,
          child: card,
        ),
      ),
    );
  }
}

/// 🎴 Feature Card Widget
class FeatureCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final List<Color> gradientColors;
  final VoidCallback onTap;
  final String? badge;
  final int animationDelay;

  const FeatureCard({
    super.key,
    required this.title,
    required this.icon,
    required this.gradientColors,
    required this.onTap,
    this.badge,
    this.animationDelay = 0,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedCard(
      animationDelay: animationDelay,
      onTap: onTap,
      padding: const EdgeInsets.all(AppTheme.paddingLarge),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Stack(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: gradientColors,
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
                ),
                child: Icon(icon, color: Colors.white, size: 28),
              ),
              if (badge != null)
                Positioned(
                  right: -4,
                  top: -4,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 6,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: AppTheme.errorColor,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      badge!,
                      style: AppTheme.bodySmall.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                        fontSize: 10,
                      ),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: AppTheme.paddingMedium),
          Text(
            title,
            style: AppTheme.bodyMedium.copyWith(
              fontWeight: FontWeight.w600,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}









