import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'dart:io';
import '../main.dart';
import '../services/api_service.dart';

class SettingsPage extends StatefulWidget {
  final Map user;
  const SettingsPage({super.key, required this.user});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool _notifications = true;
  String _language = "en";

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _notifications = prefs.getBool('notifications') ?? true;
      _language = prefs.getString('language') ?? 'en';
    });
  }

  Future<void> _saveSettings() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('notifications', _notifications);
    await prefs.setString('language', _language);
    
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Settings saved!'),
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(10)),
          ),
        ),
      );
    }
  }

  String _getProfilePhotoUrl() {
    final profilePhoto = widget.user['profilePhoto'];
    if (profilePhoto != null && profilePhoto.toString().isNotEmpty) {
      final baseUrl = (Platform.isWindows || Platform.isMacOS) 
          ? "http://localhost:5000" 
          : "http://192.168.1.2:5000";
      return "$baseUrl$profilePhoto";
    }
    return '';
  }

  @override
  Widget build(BuildContext context) {
    const isDark = false;
    final profilePhotoUrl = _getProfilePhotoUrl();
    final name = widget.user['name'] ?? 'User';

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: Text(
          'Settings',
          style: GoogleFonts.poppins(fontWeight: FontWeight.w700),
        ),
        elevation: 0,
        backgroundColor: const Color(0xFF667EEA),
        foregroundColor: Colors.white,
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Profile Photo Section
          Center(
            child: Column(
              children: [
                Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: const Color(0xFF667EEA),
                      width: 3,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.2),
                        blurRadius: 15,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: ClipOval(
                    child: profilePhotoUrl.isNotEmpty
                        ? CachedNetworkImage(
                            imageUrl: profilePhotoUrl,
                            fit: BoxFit.cover,
                            placeholder: (context, url) => Container(
                              color: Colors.grey.shade200,
                              child: Center(
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  valueColor: AlwaysStoppedAnimation<Color>(
                                    isDark ? const Color(0xFF2196F3) : const Color(0xFF667EEA),
                                  ),
                                ),
                              ),
                            ),
                            errorWidget: (context, url, error) => Container(
                              color: Colors.grey.shade200,
                              child: Center(
                                child: Text(
                                  name[0].toUpperCase(),
                                  style: GoogleFonts.poppins(
                                    color: Colors.grey.shade700,
                                    fontSize: 36,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                              ),
                            ),
                          )
                        : Container(
                            color: Colors.grey.shade200,
                            child: Center(
                              child: Text(
                                name[0].toUpperCase(),
                                style: GoogleFonts.poppins(
                                  color: isDark ? Colors.white : Colors.grey.shade700,
                                  fontSize: 36,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                          ),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  name,
                  style: GoogleFonts.poppins(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: Colors.grey.shade900,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  widget.user['email'] ?? '',
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    color: Colors.grey.shade600,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),

          // Appearance Section - Removed dark mode toggle

          // Notifications Section
          _SectionHeader(title: 'Notifications', isDark: false),
          _SettingCard(
            title: 'Push Notifications',
            subtitle: 'Receive alerts and updates',
            leading: Icon(
              Icons.notifications_rounded,
              color: const Color(0xFF667EEA),
            ),
            trailing: Switch(
              value: _notifications,
              onChanged: (val) => setState(() => _notifications = val),
              activeColor: const Color(0xFF667EEA),
            ),
            isDark: false,
          ),
          const SizedBox(height: 16),

          // Language Section
          _SectionHeader(title: 'Language', isDark: false),
          _SettingCard(
            title: 'App Language',
            subtitle: 'Choose your preferred language',
            leading: Icon(
              Icons.language_rounded,
              color: const Color(0xFF667EEA),
            ),
            trailing: DropdownButton<String>(
              value: _language,
              dropdownColor: Colors.white,
              style: GoogleFonts.poppins(
                color: isDark ? Colors.white : Colors.grey.shade900,
              ),
              items: [
                DropdownMenuItem(
                  value: 'en',
                  child: Text('English', style: GoogleFonts.poppins()),
                ),
                DropdownMenuItem(
                  value: 'ml',
                  child: Text('മലയാളം (Malayalam)', style: GoogleFonts.poppins()),
                ),
              ],
              onChanged: (val) => setState(() => _language = val ?? 'en'),
            ),
            isDark: false,
          ),
          const SizedBox(height: 32),

          // Save Button
          ElevatedButton(
            onPressed: _saveSettings,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF667EEA),
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: Text(
              'Save Settings',
              style: GoogleFonts.poppins(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  final bool isDark;
  const _SectionHeader({required this.title, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12, top: 8),
      child: Text(
        title,
        style: GoogleFonts.poppins(
          fontSize: 14,
          fontWeight: FontWeight.w700,
          color: isDark ? Colors.white70 : Colors.grey.shade600,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}

class _SettingCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final Widget leading;
  final Widget trailing;
  final bool isDark;

  const _SettingCard({
    required this.title,
    required this.subtitle,
    required this.leading,
    required this.trailing,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          leading,
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: Colors.grey.shade900,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    color: Colors.grey.shade600,
                  ),
                ),
              ],
            ),
          ),
          trailing,
        ],
      ),
    );
  }
}


