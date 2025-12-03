import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../utils/app_theme.dart';
import '../widgets/animated_page.dart';
import 'home_page.dart';
import 'login_page.dart';

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _confirmPassword = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _loading = false;
  bool _showPassword = false;
  bool _showConfirmPassword = false;

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _password.dispose();
    _confirmPassword.dispose();
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
      backgroundColor: AppTheme.backgroundColor,
      body: SafeArea(
        child: AnimatedPage(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(AppTheme.paddingLarge),
              child: Container(
                constraints: const BoxConstraints(maxWidth: 400),
                child: Card(
                  elevation: 2,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppTheme.radiusXLarge),
                  ),
                  color: false ? AppTheme.darkCardColor : AppTheme.cardColor,
                  child: Padding(
                    padding: const EdgeInsets.all(AppTheme.paddingXLarge),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // Logo and Title
                          Column(
                            children: [
                              Container(
                                width: 70,
                                height: 70,
                                decoration: BoxDecoration(
                                  color: false 
                                      ? AppTheme.darkPrimaryColor.withOpacity(0.2)
                                      : AppTheme.primaryColor.withOpacity(0.1),
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(
                                  Icons.person_add_rounded,
                                  color: false ? AppTheme.darkPrimaryColor : AppTheme.primaryColor,
                                  size: 36,
                                ),
                              ),
                              const SizedBox(height: AppTheme.paddingLarge),
                              Text(
                                'Create Account',
                                style: AppTheme.headingLarge.copyWith(
                                  color: false ? AppTheme.darkTextPrimary : AppTheme.textPrimary,
                                ),
                              ),
                              const SizedBox(height: AppTheme.paddingSmall),
                              Text(
                                'Join Smart Wayanad',
                                style: AppTheme.bodyMedium.copyWith(
                                  color: false ? AppTheme.darkTextSecondary : AppTheme.textSecondary,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: AppTheme.paddingXLarge),

                          // Name Field
                          TextFormField(
                            controller: _name,
                            style: AppTheme.bodyLarge.copyWith(
                              color: false ? AppTheme.darkTextPrimary : AppTheme.textPrimary,
                            ),
                            decoration: AppTheme.inputDecoration(
                              context: context,
                              label: "Full Name",
                              prefixIcon: Icons.person_outline,
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
                            controller: _email,
                            keyboardType: TextInputType.emailAddress,
                            style: AppTheme.bodyLarge.copyWith(
                              color: false ? AppTheme.darkTextPrimary : AppTheme.textPrimary,
                            ),
                            decoration: AppTheme.inputDecoration(
                              context: context,
                              label: "Email",
                              prefixIcon: Icons.email_outlined,
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
                            controller: _password,
                            obscureText: !_showPassword,
                            style: AppTheme.bodyLarge.copyWith(
                              color: false ? AppTheme.darkTextPrimary : AppTheme.textPrimary,
                            ),
                            decoration: AppTheme.inputDecoration(
                              context: context,
                              label: "Password",
                              prefixIcon: Icons.lock_outline,
                            ).copyWith(
                              suffixIcon: IconButton(
                                icon: Icon(
                                  _showPassword ? Icons.visibility_off : Icons.visibility,
                                  color: false ? AppTheme.darkTextSecondary : AppTheme.textSecondary,
                                ),
                                onPressed: () => setState(() => _showPassword = !_showPassword),
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
                            controller: _confirmPassword,
                            obscureText: !_showConfirmPassword,
                            style: AppTheme.bodyLarge.copyWith(
                              color: false ? AppTheme.darkTextPrimary : AppTheme.textPrimary,
                            ),
                            decoration: AppTheme.inputDecoration(
                              context: context,
                              label: "Confirm Password",
                              prefixIcon: Icons.lock_outline,
                            ).copyWith(
                              suffixIcon: IconButton(
                                icon: Icon(
                                  _showConfirmPassword ? Icons.visibility_off : Icons.visibility,
                                  color: false ? AppTheme.darkTextSecondary : AppTheme.textSecondary,
                                ),
                                onPressed: () => setState(() => _showConfirmPassword = !_showConfirmPassword),
                              ),
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
                          const SizedBox(height: AppTheme.paddingXLarge),

                          // Signup Button
                          _loading
                              ? Center(
                                  child: CircularProgressIndicator(
                                    color: false ? AppTheme.darkPrimaryColor : AppTheme.primaryColor,
                                  ),
                                )
                              : ElevatedButton(
                                  onPressed: _signup,
                                  style: AppTheme.primaryButtonStyle(context),
                                  child: Text(
                                    "Create Account",
                                    style: AppTheme.bodyLarge.copyWith(
                                      fontWeight: FontWeight.w600,
                                      color: Colors.white,
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
                                  color: false ? AppTheme.darkTextSecondary : AppTheme.textSecondary,
                                ),
                              ),
                              TextButton(
                                onPressed: () => Navigator.pushReplacement(
                                  context,
                                  AppPageRoute(page: const LoginPage()),
                                ),
                                style: TextButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(horizontal: 8),
                                ),
                                child: Text(
                                  "Login",
                                  style: AppTheme.bodyMedium.copyWith(
                                    color: false ? AppTheme.darkPrimaryColor : AppTheme.primaryColor,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
