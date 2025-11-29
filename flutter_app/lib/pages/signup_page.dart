import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';
import 'home_page.dart';
import 'login_page.dart';
import 'dart:math' as math;

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage>
    with TickerProviderStateMixin {
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _confirmPassword = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _loading = false;
  bool _showPassword = false;
  bool _showConfirmPassword = false;

  late AnimationController _backgroundController;
  late AnimationController _formController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    
    _backgroundController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 10),
    )..repeat();

    _formController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _formController,
        curve: Curves.easeIn,
      ),
    );
    
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _formController,
        curve: Curves.easeOutCubic,
      ),
    );
    
    _formController.forward();
  }

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _password.dispose();
    _confirmPassword.dispose();
    _backgroundController.dispose();
    _formController.dispose();
    super.dispose();
  }

  Future<void> _signup() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _loading = true);

    try {
      final res = await ApiService.registerUser(
        _name.text.trim(),
        _email.text.trim(),
        _password.text.trim(),
      );

      if (res != null && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Welcome ${_name.text}! 🎉"),
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
        setState(() => _loading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AnimatedBuilder(
        animation: _backgroundController,
        builder: (context, child) {
          return Container(
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
                    left: MediaQuery.of(context).size.width *
                        (0.1 + index * 0.2),
                    top: MediaQuery.of(context).size.height *
                        (0.1 + index * 0.15),
                    child: Transform.rotate(
                      angle: _backgroundController.value * (index + 1) * 0.5,
                      child: Container(
                        width: 80 + index * 40,
                        height: 80 + index * 40,
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
                // Form content
                SafeArea(
                  child: Center(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.all(24.0),
                      child: FadeTransition(
                        opacity: _fadeAnimation,
                        child: SlideTransition(
                          position: _slideAnimation,
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              // Logo and Title - Outside card, on gradient background
                              Column(
                                children: [
                                  Container(
                                    width: 80,
                                    height: 80,
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [
                                          Colors.white.withValues(alpha: 0.2),
                                          Colors.white.withValues(alpha: 0.1),
                                        ],
                                      ),
                                      shape: BoxShape.circle,
                                      border: Border.all(
                                        color: Colors.white.withValues(alpha: 0.3),
                                        width: 2,
                                      ),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.white.withValues(alpha: 0.2),
                                          blurRadius: 20,
                                          offset: const Offset(0, 10),
                                        ),
                                      ],
                                    ),
                                    child: const Icon(
                                      Icons.person_add_rounded,
                                      color: Colors.white,
                                      size: 40,
                                    ),
                                  ),
                                  const SizedBox(height: 24),
                                  Text(
                                    'Smart Wayanad',
                                    style: GoogleFonts.poppins(
                                      fontSize: 32,
                                      fontWeight: FontWeight.w800,
                                      color: Colors.white,
                                      letterSpacing: -0.5,
                                      shadows: [
                                        Shadow(
                                          color: Colors.black.withValues(alpha: 0.2),
                                          offset: const Offset(0, 2),
                                          blurRadius: 4,
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    'Create Your Account',
                                    style: GoogleFonts.poppins(
                                      fontSize: 16,
                                      color: Colors.white,
                                      fontWeight: FontWeight.w500,
                                      shadows: [
                                        Shadow(
                                          color: Colors.black.withValues(alpha: 0.2),
                                          offset: const Offset(0, 1),
                                          blurRadius: 3,
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 40),
                              // Form Card
                              Container(
                                constraints: const BoxConstraints(maxWidth: 400),
                                child: Card(
                                  elevation: 20,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(30),
                                  ),
                                  child: Padding(
                                    padding: const EdgeInsets.all(32.0),
                                    child: Form(
                                      key: _formKey,
                                      child: Column(
                                        mainAxisSize: MainAxisSize.min,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.stretch,
                                        children: [
                                          const SizedBox(height: 20),
                                          // Name Field
                                          TextFormField(
                                            controller: _name,
                                            style: GoogleFonts.poppins(
                                              fontSize: 16,
                                              color: const Color(0xFF1A1A1A),
                                            ),
                                            decoration: InputDecoration(
                                              labelText: "Full Name",
                                              labelStyle: GoogleFonts.poppins(
                                                color: const Color(0xFF757575),
                                                fontSize: 16,
                                              ),
                                              prefixIcon: const Icon(
                                                Icons.person_outline,
                                                color: Color(0xFF667EEA),
                                              ),
                                              border: OutlineInputBorder(
                                                borderRadius:
                                                    BorderRadius.circular(16),
                                                borderSide: const BorderSide(
                                                  color: Color(0xFFE0E0E0),
                                                  width: 1.5,
                                                ),
                                              ),
                                              enabledBorder: OutlineInputBorder(
                                                borderRadius:
                                                    BorderRadius.circular(16),
                                                borderSide: const BorderSide(
                                                  color: Color(0xFFE0E0E0),
                                                  width: 1.5,
                                                ),
                                              ),
                                              focusedBorder: OutlineInputBorder(
                                                borderRadius:
                                                    BorderRadius.circular(16),
                                                borderSide: const BorderSide(
                                                  color: Color(0xFF667EEA),
                                                  width: 2,
                                                ),
                                              ),
                                              filled: true,
                                              fillColor: Colors.white,
                                            ),
                                            validator: (value) {
                                              if (value == null || value.isEmpty) {
                                                return 'Please enter your name';
                                              }
                                              return null;
                                            },
                                          ),
                                          const SizedBox(height: 20),
                                          // Email Field
                                          TextFormField(
                                            controller: _email,
                                            keyboardType: TextInputType.emailAddress,
                                            style: GoogleFonts.poppins(
                                              fontSize: 16,
                                              color: const Color(0xFF1A1A1A),
                                            ),
                                            decoration: InputDecoration(
                                              labelText: "Email",
                                              labelStyle: GoogleFonts.poppins(
                                                color: const Color(0xFF757575),
                                                fontSize: 16,
                                              ),
                                              prefixIcon: const Icon(
                                                Icons.email_outlined,
                                                color: Color(0xFF667EEA),
                                              ),
                                              border: OutlineInputBorder(
                                                borderRadius:
                                                    BorderRadius.circular(16),
                                                borderSide: const BorderSide(
                                                  color: Color(0xFFE0E0E0),
                                                  width: 1.5,
                                                ),
                                              ),
                                              enabledBorder: OutlineInputBorder(
                                                borderRadius:
                                                    BorderRadius.circular(16),
                                                borderSide: const BorderSide(
                                                  color: Color(0xFFE0E0E0),
                                                  width: 1.5,
                                                ),
                                              ),
                                              focusedBorder: OutlineInputBorder(
                                                borderRadius:
                                                    BorderRadius.circular(16),
                                                borderSide: const BorderSide(
                                                  color: Color(0xFF667EEA),
                                                  width: 2,
                                                ),
                                              ),
                                              filled: true,
                                              fillColor: Colors.white,
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
                                          const SizedBox(height: 20),
                                          // Password Field
                                          TextFormField(
                                            controller: _password,
                                            obscureText: !_showPassword,
                                            style: GoogleFonts.poppins(
                                              fontSize: 16,
                                              color: const Color(0xFF1A1A1A),
                                            ),
                                            decoration: InputDecoration(
                                              labelText: "Password",
                                              labelStyle: GoogleFonts.poppins(
                                                color: const Color(0xFF757575),
                                                fontSize: 16,
                                              ),
                                              prefixIcon: const Icon(
                                                Icons.lock_outline,
                                                color: Color(0xFF667EEA),
                                              ),
                                              suffixIcon: IconButton(
                                                icon: Icon(
                                                  _showPassword
                                                      ? Icons.visibility_off
                                                      : Icons.visibility,
                                                ),
                                                color: const Color(0xFF757575),
                                                onPressed: () => setState(
                                                  () => _showPassword =
                                                      !_showPassword,
                                                ),
                                              ),
                                              border: OutlineInputBorder(
                                                borderRadius:
                                                    BorderRadius.circular(16),
                                                borderSide: const BorderSide(
                                                  color: Color(0xFFE0E0E0),
                                                  width: 1.5,
                                                ),
                                              ),
                                              enabledBorder: OutlineInputBorder(
                                                borderRadius:
                                                    BorderRadius.circular(16),
                                                borderSide: const BorderSide(
                                                  color: Color(0xFFE0E0E0),
                                                  width: 1.5,
                                                ),
                                              ),
                                              focusedBorder: OutlineInputBorder(
                                                borderRadius:
                                                    BorderRadius.circular(16),
                                                borderSide: const BorderSide(
                                                  color: Color(0xFF667EEA),
                                                  width: 2,
                                                ),
                                              ),
                                              filled: true,
                                              fillColor: Colors.white,
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
                                          const SizedBox(height: 20),
                                          // Confirm Password Field
                                          TextFormField(
                                            controller: _confirmPassword,
                                            obscureText: !_showConfirmPassword,
                                            style: GoogleFonts.poppins(
                                              fontSize: 16,
                                              color: const Color(0xFF1A1A1A),
                                            ),
                                            decoration: InputDecoration(
                                              labelText: "Confirm Password",
                                              labelStyle: GoogleFonts.poppins(
                                                color: const Color(0xFF757575),
                                                fontSize: 16,
                                              ),
                                              prefixIcon: const Icon(
                                                Icons.lock_outline,
                                                color: Color(0xFF667EEA),
                                              ),
                                              suffixIcon: IconButton(
                                                icon: Icon(
                                                  _showConfirmPassword
                                                      ? Icons.visibility_off
                                                      : Icons.visibility,
                                                ),
                                                color: const Color(0xFF757575),
                                                onPressed: () => setState(
                                                  () => _showConfirmPassword =
                                                      !_showConfirmPassword,
                                                ),
                                              ),
                                              border: OutlineInputBorder(
                                                borderRadius:
                                                    BorderRadius.circular(16),
                                                borderSide: const BorderSide(
                                                  color: Color(0xFFE0E0E0),
                                                  width: 1.5,
                                                ),
                                              ),
                                              enabledBorder: OutlineInputBorder(
                                                borderRadius:
                                                    BorderRadius.circular(16),
                                                borderSide: const BorderSide(
                                                  color: Color(0xFFE0E0E0),
                                                  width: 1.5,
                                                ),
                                              ),
                                              focusedBorder: OutlineInputBorder(
                                                borderRadius:
                                                    BorderRadius.circular(16),
                                                borderSide: const BorderSide(
                                                  color: Color(0xFF667EEA),
                                                  width: 2,
                                                ),
                                              ),
                                              filled: true,
                                              fillColor: Colors.white,
                                            ),
                                            validator: (value) {
                                              if (value == null || value.isEmpty) {
                                                return 'Please confirm your password';
                                              }
                                              if (value != _password.text) {
                                                return 'Passwords do not match';
                                              }
                                              return null;
                                            },
                                          ),
                                          const SizedBox(height: 32),
                                          // Signup Button
                                          _loading
                                              ? const Center(
                                                  child: CircularProgressIndicator(
                                                    color: Color(0xFF667EEA),
                                                  ),
                                                )
                                              : Container(
                                                  height: 56,
                                                  decoration: BoxDecoration(
                                                    gradient: LinearGradient(
                                                      colors: [
                                                        const Color(0xFF667EEA),
                                                        const Color(0xFF764BA2),
                                                      ],
                                                    ),
                                                    borderRadius:
                                                        BorderRadius.circular(16),
                                                    boxShadow: [
                                                      BoxShadow(
                                                        color: const Color(0xFF667EEA)
                                                            .withValues(alpha: 0.4),
                                                        blurRadius: 15,
                                                        offset: const Offset(0, 8),
                                                      ),
                                                    ],
                                                  ),
                                                  child: ElevatedButton(
                                                    onPressed: _signup,
                                                    style: ElevatedButton.styleFrom(
                                                      backgroundColor:
                                                          Colors.transparent,
                                                      shadowColor:
                                                          Colors.transparent,
                                                      shape: RoundedRectangleBorder(
                                                        borderRadius:
                                                            BorderRadius.circular(
                                                                16),
                                                      ),
                                                    ),
                                                    child: Text(
                                                      "Create Account",
                                                      style: GoogleFonts.poppins(
                                                        fontSize: 18,
                                                        fontWeight: FontWeight.w700,
                                                        color: Colors.white,
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                          const SizedBox(height: 24),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
      // Login Link - Outside card, on gradient background
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                "Already have an account? ",
                style: GoogleFonts.poppins(
                  color: Colors.white,
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  shadows: [
                    Shadow(
                      color: Colors.black.withValues(alpha: 0.2),
                      offset: const Offset(0, 1),
                      blurRadius: 3,
                    ),
                  ],
                ),
              ),
              TextButton(
                onPressed: () => Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const LoginPage(),
                  ),
                ),
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                ),
                child: Text(
                  "Login",
                  style: GoogleFonts.poppins(
                    color: Colors.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    decoration: TextDecoration.underline,
                    shadows: [
                      Shadow(
                        color: Colors.black.withValues(alpha: 0.2),
                        offset: const Offset(0, 1),
                        blurRadius: 3,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
