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
  bool _darkMode = false;
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
      _darkMode = prefs.getBool('darkMode') ?? false;
      _notifications = prefs.getBool('notifications') ?? true;
      _language = prefs.getString('language') ?? 'en';
    });
  }

  Future<void> _saveSettings() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('darkMode', _darkMode);
    await prefs.setBool('notifications', _notifications);
    await prefs.setString('language', _language);
    
    // Notify app to update theme
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Settings saved! ${_darkMode ? "Restart app to apply dark mode." : ""}'),
          backgroundColor: Colors.green,
        ),
      );
      // Reload the app theme
      Navigator.pop(context);
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
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final profilePhotoUrl = _getProfilePhotoUrl();
    final name = widget.user['name'] ?? 'User';

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0A0E27) : const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: Text(
          'Settings',
          style: GoogleFonts.poppins(fontWeight: FontWeight.w700),
        ),
        elevation: 0,
        backgroundColor: isDark ? const Color(0xFF0A0E27) : const Color(0xFF667EEA),
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
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
                      color: isDark ? const Color(0xFF2196F3) : const Color(0xFF667EEA),
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
                              color: isDark ? const Color(0xFF1A1F3A) : Colors.grey.shade200,
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
                              color: isDark ? const Color(0xFF1A1F3A) : Colors.grey.shade200,
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
                          )
                        : Container(
                            color: isDark ? const Color(0xFF1A1F3A) : Colors.grey.shade200,
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
                    color: isDark ? Colors.white : Colors.grey.shade900,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  widget.user['email'] ?? '',
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    color: isDark ? Colors.white70 : Colors.grey.shade600,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),

          // Appearance Section
          _SectionHeader(title: 'Appearance', isDark: isDark),
          _SettingCard(
            title: 'Dark Mode',
            subtitle: 'Switch to blue/black/white theme',
            leading: Icon(
              Icons.dark_mode_rounded,
              color: isDark ? const Color(0xFF2196F3) : const Color(0xFF667EEA),
            ),
            trailing: Switch(
              value: _darkMode,
              onChanged: (val) => setState(() => _darkMode = val),
              activeColor: isDark ? const Color(0xFF2196F3) : const Color(0xFF667EEA),
            ),
            isDark: isDark,
          ),
          const SizedBox(height: 16),

          // Notifications Section
          _SectionHeader(title: 'Notifications', isDark: isDark),
          _SettingCard(
            title: 'Push Notifications',
            subtitle: 'Receive alerts and updates',
            leading: Icon(
              Icons.notifications_rounded,
              color: isDark ? const Color(0xFF2196F3) : const Color(0xFF667EEA),
            ),
            trailing: Switch(
              value: _notifications,
              onChanged: (val) => setState(() => _notifications = val),
              activeColor: isDark ? const Color(0xFF2196F3) : const Color(0xFF667EEA),
            ),
            isDark: isDark,
          ),
          const SizedBox(height: 16),

          // Language Section
          _SectionHeader(title: 'Language', isDark: isDark),
          _SettingCard(
            title: 'App Language',
            subtitle: 'Choose your preferred language',
            leading: Icon(
              Icons.language_rounded,
              color: isDark ? const Color(0xFF2196F3) : const Color(0xFF667EEA),
            ),
            trailing: DropdownButton<String>(
              value: _language,
              dropdownColor: isDark ? const Color(0xFF1A1F3A) : Colors.white,
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
            isDark: isDark,
          ),
          const SizedBox(height: 32),

          // Save Button
          ElevatedButton(
            onPressed: _saveSettings,
            style: ElevatedButton.styleFrom(
              backgroundColor: isDark ? const Color(0xFF2196F3) : const Color(0xFF667EEA),
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
        color: isDark ? const Color(0xFF1A1F3A) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.05),
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
                    color: isDark ? Colors.white : Colors.grey.shade900,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    color: isDark ? Colors.white70 : Colors.grey.shade600,
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


