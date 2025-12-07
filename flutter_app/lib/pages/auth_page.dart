import 'package:flutter/material.dart';
import 'dart:math' as math;
import '../services/api_service.dart';
import '../utils/app_theme.dart';
import '../widgets/animated_page.dart';
import 'home_page.dart';

class AuthPage extends StatefulWidget {
  const AuthPage({super.key, this.initialMode = AuthMode.login});

  final AuthMode initialMode;

  @override
  State<AuthPage> createState() => _AuthPageState();
}

enum AuthMode { login, signup }

class _AuthPageState extends State<AuthPage> with SingleTickerProviderStateMixin {
  late AnimationController _flipController;
  late Animation<double> _flipAnimation;
  AuthMode _currentMode = AuthMode.login;
  bool _isFlipped = false;

  // Login Controllers
  final _loginEmail = TextEditingController();
  final _loginPassword = TextEditingController();
  final _loginFormKey = GlobalKey<FormState>();
  bool _loginLoading = false;
  bool _showLoginPassword = false;

  // Signup Controllers
  final _signupName = TextEditingController();
  final _signupEmail = TextEditingController();
  final _signupPassword = TextEditingController();
  final _signupConfirmPassword = TextEditingController();
  final _signupFormKey = GlobalKey<FormState>();
  bool _signupLoading = false;
  bool _showSignupPassword = false;
  bool _showSignupConfirmPassword = false;

  @override
  void initState() {
    super.initState();
    _currentMode = widget.initialMode;
    _isFlipped = widget.initialMode == AuthMode.signup;
    
    _flipController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );

    _flipAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _flipController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _flipController.dispose();
    _loginEmail.dispose();
    _loginPassword.dispose();
    _signupName.dispose();
    _signupEmail.dispose();
    _signupPassword.dispose();
    _signupConfirmPassword.dispose();
    super.dispose();
  }

  void _flipCard() {
    if (_isFlipped) {
      _flipController.reverse();
    } else {
      _flipController.forward();
    }
    setState(() {
      _isFlipped = !_isFlipped;
      _currentMode = _isFlipped ? AuthMode.signup : AuthMode.login;
    });
  }

  Future<void> _handleLogin() async {
    if (!_loginFormKey.currentState!.validate()) return;

    setState(() => _loginLoading = true);

    try {
      final res = await ApiService.loginUser(
        _loginEmail.text.trim(),
        _loginPassword.text.trim(),
      );

      if (res != null && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Welcome back ${res['name']}! 🎉"),
            backgroundColor: Colors.green,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        );
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (_) => HomePage(user: res)),
          (r) => false,
        );
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text("Invalid email or password"),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Error: ${e.toString()}"),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _loginLoading = false);
      }
    }
  }

  Future<void> _handleSignup() async {
    if (!_signupFormKey.currentState!.validate()) return;

    setState(() => _signupLoading = true);

    try {
      final res = await ApiService.registerUser(
        _signupName.text.trim(),
        _signupEmail.text.trim(),
        _signupPassword.text.trim(),
      );

      if (res != null && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Welcome ${_signupName.text}! 🎉"),
            backgroundColor: Colors.green,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        );
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (_) => HomePage(user: res)),
          (route) => false,
        );
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text("Signup failed. Please try again."),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Error: ${e.toString()}"),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _signupLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppTheme.primaryColor.withOpacity(0.1),
              AppTheme.secondaryColor.withOpacity(0.05),
              AppTheme.backgroundColor,
            ],
          ),
        ),
        child: SafeArea(
          child: AnimatedPage(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(AppTheme.paddingLarge),
                child: Container(
                  constraints: const BoxConstraints(maxWidth: 420),
                  child: AnimatedBuilder(
                    animation: _flipAnimation,
                    builder: (context, child) {
                      final angle = _flipAnimation.value * math.pi;
                      final isFront = _flipAnimation.value < 0.5;
                      
                      // Show front card (login) when angle is less than 90 degrees
                      // Show back card (signup) when angle is 90+ degrees
                      return Transform(
                        alignment: Alignment.center,
                        transform: Matrix4.identity()
                          ..setEntry(3, 2, 0.001)
                          ..rotateY(angle),
                        child: isFront
                            ? _buildLoginCard()
                            : Transform(
                                alignment: Alignment.center,
                                transform: Matrix4.identity()..rotateY(math.pi),
                                child: _buildSignupCard(),
                              ),
                      );
                    },
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLoginCard() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primaryColor.withOpacity(0.2),
            blurRadius: 30,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.paddingXLarge),
        child: Form(
          key: _loginFormKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Logo and Title
              Column(
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [AppTheme.primaryColor, AppTheme.secondaryColor],
                      ),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.primaryColor.withOpacity(0.3),
                          blurRadius: 20,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.login_rounded,
                      color: Colors.white,
                      size: 40,
                    ),
                  ),
                  const SizedBox(height: AppTheme.paddingLarge),
                  Text(
                    'Smart Wayanad',
                    style: AppTheme.headingLarge.copyWith(
                      color: AppTheme.textPrimary,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: AppTheme.paddingSmall),
                  Text(
                    'Welcome Back 👋',
                    style: AppTheme.bodyMedium.copyWith(
                      color: AppTheme.textSecondary,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppTheme.paddingXLarge),

              // Email Field
              TextFormField(
                controller: _loginEmail,
                keyboardType: TextInputType.emailAddress,
                style: AppTheme.bodyLarge.copyWith(color: AppTheme.textPrimary),
                decoration: AppTheme.inputDecoration(
                  context: context,
                  label: "Email",
                  prefixIcon: Icons.email_outlined,
                ).copyWith(
                  prefixIconColor: AppTheme.primaryColor,
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your email';
                  }
                  if (!value.contains('@')) {
                    return 'Please enter a valid email';
                  }
                  return null;
                },
              ),
              const SizedBox(height: AppTheme.paddingMedium),

              // Password Field
              TextFormField(
                controller: _loginPassword,
                obscureText: !_showLoginPassword,
                style: AppTheme.bodyLarge.copyWith(color: AppTheme.textPrimary),
                decoration: AppTheme.inputDecoration(
                  context: context,
                  label: "Password",
                  prefixIcon: Icons.lock_outline,
                ).copyWith(
                  prefixIconColor: AppTheme.primaryColor,
                  suffixIcon: IconButton(
                    icon: Icon(
                      _showLoginPassword ? Icons.visibility_off : Icons.visibility,
                      color: AppTheme.textSecondary,
                    ),
                    onPressed: () => setState(() => _showLoginPassword = !_showLoginPassword),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your password';
                  }
                  if (value.length < 6) {
                    return 'Password must be at least 6 characters';
                  }
                  return null;
                },
              ),
              const SizedBox(height: AppTheme.paddingXLarge),

              // Login Button
              _loginLoading
                  ? Center(
                      child: CircularProgressIndicator(
                        color: AppTheme.primaryColor,
                      ),
                    )
                  : Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [AppTheme.primaryColor, AppTheme.secondaryColor],
                        ),
                        borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.primaryColor.withOpacity(0.4),
                            blurRadius: 15,
                            offset: const Offset(0, 5),
                          ),
                        ],
                      ),
                      child: ElevatedButton(
                        onPressed: _handleLogin,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.transparent,
                          shadowColor: Colors.transparent,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
                          ),
                        ),
                        child: Text(
                          "Login",
                          style: AppTheme.bodyLarge.copyWith(
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ),

              const SizedBox(height: AppTheme.paddingLarge),

              // Signup Link
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    "Don't have an account? ",
                    style: AppTheme.bodyMedium.copyWith(
                      color: AppTheme.textSecondary,
                    ),
                  ),
                  GestureDetector(
                    onTap: _flipCard,
                    child: Text(
                      "Sign Up",
                      style: AppTheme.bodyMedium.copyWith(
                        color: AppTheme.primaryColor,
                        fontWeight: FontWeight.w700,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSignupCard() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: AppTheme.secondaryColor.withOpacity(0.2),
            blurRadius: 30,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.paddingXLarge),
        child: Form(
          key: _signupFormKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Logo and Title
              Column(
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [AppTheme.secondaryColor, AppTheme.primaryColor],
                      ),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.secondaryColor.withOpacity(0.3),
                          blurRadius: 20,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.person_add_rounded,
                      color: Colors.white,
                      size: 40,
                    ),
                  ),
                  const SizedBox(height: AppTheme.paddingLarge),
                  Text(
                    'Create Account',
                    style: AppTheme.headingLarge.copyWith(
                      color: AppTheme.textPrimary,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: AppTheme.paddingSmall),
                  Text(
                    'Join Smart Wayanad 🚀',
                    style: AppTheme.bodyMedium.copyWith(
                      color: AppTheme.textSecondary,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppTheme.paddingXLarge),

              // Name Field
              TextFormField(
                controller: _signupName,
                style: AppTheme.bodyLarge.copyWith(color: AppTheme.textPrimary),
                decoration: AppTheme.inputDecoration(
                  context: context,
                  label: "Full Name",
                  prefixIcon: Icons.person_outline,
                ).copyWith(
                  prefixIconColor: AppTheme.secondaryColor,
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your name';
                  }
                  return null;
                },
              ),
              const SizedBox(height: AppTheme.paddingMedium),

              // Email Field
              TextFormField(
                controller: _signupEmail,
                keyboardType: TextInputType.emailAddress,
                style: AppTheme.bodyLarge.copyWith(color: AppTheme.textPrimary),
                decoration: AppTheme.inputDecoration(
                  context: context,
                  label: "Email",
                  prefixIcon: Icons.email_outlined,
                ).copyWith(
                  prefixIconColor: AppTheme.secondaryColor,
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your email';
                  }
                  if (!value.contains('@')) {
                    return 'Please enter a valid email';
                  }
                  return null;
                },
              ),
              const SizedBox(height: AppTheme.paddingMedium),

              // Password Field
              TextFormField(
                controller: _signupPassword,
                obscureText: !_showSignupPassword,
                style: AppTheme.bodyLarge.copyWith(color: AppTheme.textPrimary),
                decoration: AppTheme.inputDecoration(
                  context: context,
                  label: "Password",
                  prefixIcon: Icons.lock_outline,
                ).copyWith(
                  prefixIconColor: AppTheme.secondaryColor,
                  suffixIcon: IconButton(
                    icon: Icon(
                      _showSignupPassword ? Icons.visibility_off : Icons.visibility,
                      color: AppTheme.textSecondary,
                    ),
                    onPressed: () => setState(() => _showSignupPassword = !_showSignupPassword),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a password';
                  }
                  if (value.length < 6) {
                    return 'Password must be at least 6 characters';
                  }
                  return null;
                },
              ),
              const SizedBox(height: AppTheme.paddingMedium),

              // Confirm Password Field
              TextFormField(
                controller: _signupConfirmPassword,
                obscureText: !_showSignupConfirmPassword,
                style: AppTheme.bodyLarge.copyWith(color: AppTheme.textPrimary),
                decoration: AppTheme.inputDecoration(
                  context: context,
                  label: "Confirm Password",
                  prefixIcon: Icons.lock_outline,
                ).copyWith(
                  prefixIconColor: AppTheme.secondaryColor,
                  suffixIcon: IconButton(
                    icon: Icon(
                      _showSignupConfirmPassword ? Icons.visibility_off : Icons.visibility,
                      color: AppTheme.textSecondary,
                    ),
                    onPressed: () => setState(() => _showSignupConfirmPassword = !_showSignupConfirmPassword),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please confirm your password';
                  }
                  if (value != _signupPassword.text) {
                    return 'Passwords do not match';
                  }
                  return null;
                },
              ),
              const SizedBox(height: AppTheme.paddingXLarge),

              // Signup Button
              _signupLoading
                  ? Center(
                      child: CircularProgressIndicator(
                        color: AppTheme.secondaryColor,
                      ),
                    )
                  : Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [AppTheme.secondaryColor, AppTheme.primaryColor],
                        ),
                        borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.secondaryColor.withOpacity(0.4),
                            blurRadius: 15,
                            offset: const Offset(0, 5),
                          ),
                        ],
                      ),
                      child: ElevatedButton(
                        onPressed: _handleSignup,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.transparent,
                          shadowColor: Colors.transparent,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
                          ),
                        ),
                        child: Text(
                          "Create Account",
                          style: AppTheme.bodyLarge.copyWith(
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ),

              const SizedBox(height: AppTheme.paddingLarge),

              // Login Link
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    "Already have an account? ",
                    style: AppTheme.bodyMedium.copyWith(
                      color: AppTheme.textSecondary,
                    ),
                  ),
                  GestureDetector(
                    onTap: _flipCard,
                    child: Text(
                      "Login",
                      style: AppTheme.bodyMedium.copyWith(
                        color: AppTheme.secondaryColor,
                        fontWeight: FontWeight.w700,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

