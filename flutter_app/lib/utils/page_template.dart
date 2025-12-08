import 'package:flutter/material.dart';
import '../utils/app_theme.dart';
import '../widgets/animated_page.dart';
import '../widgets/animated_card.dart';

/// 📄 Standard Page Template
/// Use this as a base for all pages to ensure consistent UI
class StandardPage extends StatelessWidget {
  final String title;
  final Widget body;
  final List<Widget>? actions;
  final bool showBackButton;
  final Widget? floatingActionButton;
  final PreferredSizeWidget? bottom;

  const StandardPage({
    super.key,
    required this.title,
    required this.body,
    this.actions,
    this.showBackButton = true,
    this.floatingActionButton,
    this.bottom,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      backgroundColor: isDark ? AppTheme.darkBackgroundColor : AppTheme.backgroundColor,
      appBar: AppBar(
        title: Text(
          title,
          style: AppTheme.headingSmall.copyWith(
            color: Colors.white,
          ),
        ),
        backgroundColor: isDark ? AppTheme.darkPrimaryColor : AppTheme.primaryColor,
        elevation: 0,
        automaticallyImplyLeading: showBackButton,
        actions: actions,
        bottom: bottom,
      ),
      body: AnimatedPage(
        child: body,
      ),
      floatingActionButton: floatingActionButton,
    );
  }
}

/// 📄 Standard Scrollable Page Template
class StandardScrollablePage extends StatelessWidget {
  final String title;
  final List<Widget> children;
  final List<Widget>? actions;
  final EdgeInsets? padding;
  final bool showBackButton;
  final Widget? floatingActionButton;

  const StandardScrollablePage({
    super.key,
    required this.title,
    required this.children,
    this.actions,
    this.padding,
    this.showBackButton = true,
    this.floatingActionButton,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      backgroundColor: isDark ? AppTheme.darkBackgroundColor : AppTheme.backgroundColor,
      appBar: AppBar(
        title: Text(
          title,
          style: AppTheme.headingSmall.copyWith(
            color: Colors.white,
          ),
        ),
        backgroundColor: isDark ? AppTheme.darkPrimaryColor : AppTheme.primaryColor,
        elevation: 0,
        automaticallyImplyLeading: showBackButton,
        actions: actions,
      ),
      body: AnimatedPage(
        child: SingleChildScrollView(
          padding: padding ?? const EdgeInsets.all(AppTheme.paddingLarge),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: children,
          ),
        ),
      ),
      floatingActionButton: floatingActionButton,
    );
  }
}

/// 📄 Standard List Page Template
class StandardListPage extends StatelessWidget {
  final String title;
  final List<Widget> items;
  final List<Widget>? actions;
  final bool showBackButton;
  final Widget? emptyWidget;
  final bool isLoading;

  const StandardListPage({
    super.key,
    required this.title,
    required this.items,
    this.actions,
    this.showBackButton = true,
    this.emptyWidget,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      backgroundColor: isDark ? AppTheme.darkBackgroundColor : AppTheme.backgroundColor,
      appBar: AppBar(
        title: Text(
          title,
          style: AppTheme.headingSmall.copyWith(
            color: Colors.white,
          ),
        ),
        backgroundColor: isDark ? AppTheme.darkPrimaryColor : AppTheme.primaryColor,
        elevation: 0,
        automaticallyImplyLeading: showBackButton,
        actions: actions,
      ),
      body: AnimatedPage(
        child: isLoading
            ? const Center(child: CircularProgressIndicator())
            : items.isEmpty
                ? (emptyWidget ?? Center(
                    child: Text(
                      'No items found',
                      style: AppTheme.bodyLarge.copyWith(
                        color: isDark ? AppTheme.darkTextSecondary : AppTheme.textSecondary,
                      ),
                    ),
                  ))
                : ListView.builder(
                    padding: const EdgeInsets.all(AppTheme.paddingMedium),
                    itemCount: items.length,
                    itemBuilder: (context, index) {
                      return AnimatedCard(
                        animationDelay: index * 50,
                        child: items[index],
                      );
                    },
                  ),
      ),
    );
  }
}











