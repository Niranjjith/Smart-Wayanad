# 🎨 UI Consistency Guide

## Overview
This guide explains how to use the new unified UI system for consistent design and animations across all app screens.

## 📁 New Files Created

### 1. `lib/utils/app_theme.dart`
- **Purpose**: Centralized theme constants and styling
- **Contains**: Colors, spacing, text styles, input decorations, button styles
- **Usage**: Import and use `AppTheme` constants throughout the app

### 2. `lib/widgets/animated_page.dart`
- **Purpose**: Reusable page animation wrapper
- **Components**:
  - `AnimatedPage`: Wraps content with fade and slide animations
  - `AppPageRoute`: Custom page route with smooth transitions

### 3. `lib/widgets/animated_card.dart`
- **Purpose**: Reusable animated card widget
- **Components**:
  - `AnimatedCard`: Card with fade, slide, and scale animations
  - `FeatureCard`: Specialized card for feature buttons

### 4. `lib/utils/page_template.dart`
- **Purpose**: Standard page templates
- **Components**:
  - `StandardPage`: Basic page template
  - `StandardScrollablePage`: Scrollable page template
  - `StandardListPage`: List page template

## ✅ Updated Pages

1. ✅ **Login Page** - Uses new theme and animations
2. ✅ **Signup Page** - Uses new theme and animations

## 🔄 How to Update Other Pages

### Step 1: Import Required Files
```dart
import '../utils/app_theme.dart';
import '../widgets/animated_page.dart';
import '../widgets/animated_card.dart';
import '../utils/page_template.dart';
```

### Step 2: Replace Scaffold Background
```dart
// OLD
backgroundColor: Colors.grey.shade50,

// NEW
backgroundColor: isDark ? AppTheme.darkBackgroundColor : AppTheme.backgroundColor,
```

### Step 3: Wrap Content with AnimatedPage
```dart
// OLD
body: SingleChildScrollView(...)

// NEW
body: AnimatedPage(
  child: SingleChildScrollView(...)
)
```

### Step 4: Use AppTheme for Colors and Styles
```dart
// OLD
Text('Title', style: GoogleFonts.poppins(fontSize: 24))

// NEW
Text('Title', style: AppTheme.headingMedium)
```

### Step 5: Use AnimatedCard for Cards
```dart
// OLD
Card(child: ...)

// NEW
AnimatedCard(
  animationDelay: index * 50,
  child: ...
)
```

### Step 6: Use AppPageRoute for Navigation
```dart
// OLD
Navigator.push(context, MaterialPageRoute(...))

// NEW
Navigator.push(context, AppPageRoute(page: YourPage()))
```

## 📋 Checklist for Each Page

- [ ] Import theme and animation files
- [ ] Replace hardcoded colors with AppTheme constants
- [ ] Wrap body content with AnimatedPage
- [ ] Replace Cards with AnimatedCard
- [ ] Use AppTheme text styles
- [ ] Use AppTheme spacing constants
- [ ] Use AppPageRoute for navigation
- [ ] Test animations and transitions
- [ ] Ensure dark mode support

## 🎯 Example: Updating a Simple Page

```dart
import 'package:flutter/material.dart';
import '../utils/app_theme.dart';
import '../widgets/animated_page.dart';
import '../widgets/animated_card.dart';

class MyPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      backgroundColor: isDark ? AppTheme.darkBackgroundColor : AppTheme.backgroundColor,
      appBar: AppBar(
        title: Text('My Page', style: AppTheme.headingSmall.copyWith(color: Colors.white)),
        backgroundColor: isDark ? AppTheme.darkPrimaryColor : AppTheme.primaryColor,
      ),
      body: AnimatedPage(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppTheme.paddingLarge),
          child: Column(
            children: [
              AnimatedCard(
                animationDelay: 0,
                child: Text('Content', style: AppTheme.bodyLarge),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

## 🎨 Color Usage

- **Primary**: `AppTheme.primaryColor` (Light) / `AppTheme.darkPrimaryColor` (Dark)
- **Background**: `AppTheme.backgroundColor` (Light) / `AppTheme.darkBackgroundColor` (Dark)
- **Card**: `AppTheme.cardColor` (Light) / `AppTheme.darkCardColor` (Dark)
- **Text Primary**: `AppTheme.textPrimary` (Light) / `AppTheme.darkTextPrimary` (Dark)
- **Text Secondary**: `AppTheme.textSecondary` (Light) / `AppTheme.darkTextSecondary` (Dark)

## 📏 Spacing

- Small: `AppTheme.paddingSmall` (8px)
- Medium: `AppTheme.paddingMedium` (16px)
- Large: `AppTheme.paddingLarge` (24px)
- XLarge: `AppTheme.paddingXLarge` (32px)

## 🔤 Text Styles

- Heading Large: `AppTheme.headingLarge`
- Heading Medium: `AppTheme.headingMedium`
- Heading Small: `AppTheme.headingSmall`
- Body Large: `AppTheme.bodyLarge`
- Body Medium: `AppTheme.bodyMedium`
- Body Small: `AppTheme.bodySmall`

## ⏱️ Animation Durations

- Fast: `AppTheme.animationFast` (200ms)
- Medium: `AppTheme.animationMedium` (400ms)
- Slow: `AppTheme.animationSlow` (600ms)
- Page Transition: `AppTheme.animationPageTransition` (300ms)

## 🎬 Animation Delays

Use staggered delays for list items:
```dart
AnimatedCard(animationDelay: index * 50, ...)
```

This creates a cascading animation effect.

## 🌙 Dark Mode Support

Always check theme brightness:
```dart
final isDark = Theme.of(context).brightness == Brightness.dark;
```

Then use appropriate colors:
```dart
color: isDark ? AppTheme.darkPrimaryColor : AppTheme.primaryColor
```




