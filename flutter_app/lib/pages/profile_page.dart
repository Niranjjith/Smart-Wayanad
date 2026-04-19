import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../constants/branding.dart';
import '../widgets/profile_image_widget.dart';
import 'dart:io';
import 'splash_page.dart';
import 'help_page.dart';
import 'notifications_page.dart';
import 'bus_routes_page.dart';
import 'climate_page.dart';
import 'hospital_page.dart';
import 'clinic_page.dart';
import 'helpline_page.dart';
import 'taxi_page.dart';
import 'edit_profile_page.dart';
import 'settings_page.dart';
import 'ar_navigation_page.dart';
import 'voice_report_page.dart';
import 'incident_heatmap_page.dart';

class ProfilePage extends StatefulWidget {
  final Map user;
  const ProfilePage({super.key, required this.user});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  bool _loading = false;
  late Map _currentUser;
  
  @override
  void initState() {
    super.initState();
    _currentUser = widget.user;
  }
  
  void _refreshUser(Map newUser) {
    setState(() {
      _currentUser = newUser;
    });
  }

  Future<void> _logout() async {
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const SplashPage()),
      (route) => false,
    );
  }

  Future<void> _callNumber(String number) async {
    final uri = Uri.parse('tel:$number');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Cannot call $number')),
      );
    }
  }

  Future<void> _openEmail(String email) async {
    final uri = Uri.parse('mailto:$email');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }


  String _getProfilePhotoUrl() {
    final profilePhoto = _currentUser['profilePhoto'];
    if (profilePhoto != null && profilePhoto.toString().isNotEmpty) {
      // Check if it's already a full URL (base64 or http)
      if (profilePhoto.toString().startsWith('data:image') || 
          profilePhoto.toString().startsWith('http')) {
        return profilePhoto.toString();
      }
      final baseUrl = (Platform.isWindows || Platform.isMacOS) 
          ? "http://localhost:5000" 
          : "http://192.168.1.2:5000";
      return "$baseUrl$profilePhoto";
    }
    return '';
  }

  @override
  Widget build(BuildContext context) {
    final name = _currentUser['name'] ?? 'User';
    final email = _currentUser['email'] ?? '—';
    const isDark = false;
    final profilePhotoUrl = _getProfilePhotoUrl();

    return Scaffold(
      backgroundColor: AppPalette.screenBackground,
      body: CustomScrollView(
        slivers: [
          // Premium App Bar with Profile Photo
          SliverAppBar(
            expandedHeight: 220,
            floating: false,
            pinned: true,
            elevation: 0,
            backgroundColor: Colors.transparent,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      ...AppPalette.screenHeroGradient,
                      AppPalette.mint,
                    ],
                  ),
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Container(
                          width: 100,
                          height: 100,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.5),
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
                                ? ProfileImageWidget(
                                    imageUrl: profilePhotoUrl,
                                    fallbackText: name,
                                    size: 100,
                                    fit: BoxFit.cover,
                                  )
                                : Container(
                                    color: Colors.white.withValues(alpha: 0.2),
                                    child: Center(
                                      child: Text(
                                        name[0].toUpperCase(),
                                        style: GoogleFonts.poppins(
                                          color: Colors.white,
                                          fontSize: 36,
                                          fontWeight: FontWeight.w800,
                                        ),
                                      ),
                                    ),
                                  ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          name,
                          style: GoogleFonts.poppins(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          email,
                          style: GoogleFonts.poppins(
                            color: Colors.white.withValues(alpha: 0.9),
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),

          // Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Quick Actions
                  Text(
                    "Quick Actions",
                    style: GoogleFonts.poppins(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: AppPalette.forest,
                    ),
                  ),
                  const SizedBox(height: 16),
                  GridView.count(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisCount: 3,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 1.1,
                    children: [
                      _ActionButton(
                        icon: Icons.sos_rounded,
                        label: "SOS",
                        color: const Color(0xFFE53935),
                        onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => HelpPage(user: _currentUser),
                          ),
                        ),
                      ),
                      _ActionButton(
                        icon: Icons.notifications_rounded,
                        label: "Alerts",
                        color: AppPalette.leaf,
                        onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const NotificationsPage(),
                          ),
                        ),
                      ),
                      _ActionButton(
                        icon: Icons.directions_bus_rounded,
                        label: "Routes",
                        color: AppPalette.mint,
                        onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const BusRoutesPage(),
                          ),
                        ),
                      ),
                      _ActionButton(
                        icon: Icons.wb_sunny_rounded,
                        label: "Weather",
                        color: AppPalette.forest,
                        onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const ClimatePage(),
                          ),
                        ),
                      ),
                      _ActionButton(
                        icon: Icons.local_hospital_rounded,
                        label: "Hospitals",
                        color: AppPalette.leaf,
                        onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const HospitalPage(),
                          ),
                        ),
                      ),
                      _ActionButton(
                        icon: Icons.healing_rounded,
                        label: "Clinics",
                        color: AppPalette.pine,
                        onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const ClinicPage(),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // Emergency Contacts
                  Text(
                    "Emergency Contacts",
                    style: GoogleFonts.poppins(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: AppPalette.forest,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _EmergencyButton(
                    icon: Icons.local_police_rounded,
                    label: "Police",
                    number: "100",
                    color: AppPalette.forest,
                    onTap: () => _callNumber("100"),
                  ),
                  _EmergencyButton(
                    icon: Icons.local_hospital_rounded,
                    label: "Ambulance",
                    number: "108",
                    color: const Color(0xFFE53935),
                    onTap: () => _callNumber("108"),
                  ),
                  _EmergencyButton(
                    icon: Icons.fire_extinguisher_rounded,
                    label: "Fire Department",
                    number: "101",
                    color: const Color(0xFFE65100),
                    onTap: () => _callNumber("101"),
                  ),
                  _EmergencyButton(
                    icon: Icons.phone_rounded,
                    label: "Women Helpline",
                    number: "1091",
                    color: AppPalette.leaf,
                    onTap: () => _callNumber("1091"),
                  ),
                  _EmergencyButton(
                    icon: Icons.child_care_rounded,
                    label: "Child Helpline",
                    number: "1098",
                    color: AppPalette.mint,
                    onTap: () => _callNumber("1098"),
                  ),
                  const SizedBox(height: 32),

                  // Profile Actions
                  Text(
                    "Profile & Settings",
                    style: GoogleFonts.poppins(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: AppPalette.forest,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _ServiceButton(
                    icon: Icons.edit_rounded,
                    label: "Edit Profile",
                    subtitle: "Update your profile information",
                    color: AppPalette.leaf,
                    onTap: () async {
                      final result = await Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => EditProfilePage(user: _currentUser),
                        ),
                      );
                      if (result != null && mounted) {
                        // Update local state
                        _refreshUser(result);
                        // Return updated user to previous page
                        Navigator.pop(context, result);
                      }
                    },
                  ),
                  _ServiceButton(
                    icon: Icons.settings_rounded,
                    label: "Settings",
                    subtitle: "Dark mode, notifications & more",
                    color: AppPalette.pine,
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => SettingsPage(user: widget.user),
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Advanced Features
                  Text(
                    "Advanced Features",
                    style: GoogleFonts.poppins(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: AppPalette.forest,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _ServiceButton(
                    icon: Icons.camera_alt_rounded,
                    label: "AR Navigation",
                    subtitle: "Find services with AR",
                    color: AppPalette.mint,
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const ARNavigationPage(),
                      ),
                    ),
                  ),
                  _ServiceButton(
                    icon: Icons.mic_rounded,
                    label: "Voice Report",
                    subtitle: "Report incidents with voice",
                    color: AppPalette.forest,
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => VoiceReportPage(user: widget.user),
                      ),
                    ),
                  ),
                  _ServiceButton(
                    icon: Icons.map_rounded,
                    label: "Incident Heatmap",
                    subtitle: "View incident hotspots",
                    color: AppPalette.leaf,
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const IncidentHeatmapPage(),
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),

                  // District Services
                  Text(
                    "District Services",
                    style: GoogleFonts.poppins(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: AppPalette.forest,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _ServiceButton(
                    icon: Icons.call_rounded,
                    label: "Helpline",
                    subtitle: "District helpline numbers",
                    color: AppPalette.mint,
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const HelplinePage(),
                      ),
                    ),
                  ),
                  _ServiceButton(
                    icon: Icons.local_taxi_rounded,
                    label: "Taxi Stands",
                    subtitle: "Find nearby taxi stands",
                    color: AppPalette.pine,
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const TaxiPage(),
                      ),
                    ),
                  ),
                  _ServiceButton(
                    icon: Icons.info_rounded,
                    label: "About Smart Wayanad",
                    subtitle: "Learn more about the app",
                    color: AppPalette.leaf,
                    onTap: () {
                      showDialog(
                        context: context,
                        builder: (_) => AlertDialog(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                          title: Text(
                            "Smart Wayanad",
                            style: GoogleFonts.poppins(
                              fontWeight: FontWeight.w700,
                              color: AppPalette.forest,
                            ),
                          ),
                          content: Text(
                            "A comprehensive digital platform for citizens of Wayanad District, Kerala. Providing emergency assistance, transport information, healthcare services, and more.",
                            style: GoogleFonts.poppins(
                              color: Colors.grey.shade800,
                              height: 1.45,
                            ),
                          ),
                          actions: [
                            FilledButton(
                              onPressed: () => Navigator.pop(context),
                              style: FilledButton.styleFrom(
                                backgroundColor: AppPalette.leaf,
                                foregroundColor: Colors.white,
                              ),
                              child: const Text("Close"),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 32),

                  // Logout Button
                  Container(
                    width: double.infinity,
                    height: 56,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Colors.red.shade400,
                          Colors.red.shade600,
                        ],
                      ),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.red.withValues(alpha: 0.3),
                          blurRadius: 15,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: ElevatedButton(
                      onPressed: _logout,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        shadowColor: Colors.transparent,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.logout_rounded, color: Colors.white),
                          const SizedBox(width: 12),
                          Text(
                            "Logout",
                            style: GoogleFonts.poppins(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ActionButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [color, color.withValues(alpha: 0.8)],
          ),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: color.withValues(alpha: 0.3),
              blurRadius: 10,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: Colors.white, size: 32),
            const SizedBox(height: 8),
            Text(
              label,
              style: GoogleFonts.poppins(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _EmergencyButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final String number;
  final Color color;
  final VoidCallback onTap;

  const _EmergencyButton({
    required this.icon,
    required this.label,
    required this.number,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.3), width: 2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: color, size: 24),
        ),
        title: Text(
          label,
          style: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: Colors.grey.shade900,
          ),
        ),
        subtitle: Text(
          number,
          style: GoogleFonts.poppins(
            fontSize: 14,
            color: color,
            fontWeight: FontWeight.w600,
          ),
        ),
        trailing: IconButton(
          icon: Icon(Icons.call_rounded, color: color),
          onPressed: onTap,
        ),
        onTap: onTap,
      ),
    );
  }
}

class _ServiceButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _ServiceButton({
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppPalette.leaf.withValues(alpha: 0.08),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
        border: Border.all(
          color: AppPalette.leaf.withValues(alpha: 0.1),
        ),
      ),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [color, color.withValues(alpha: 0.82)],
            ),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: Colors.white, size: 24),
        ),
        title: Text(
          label,
          style: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: Colors.grey.shade900,
          ),
        ),
        subtitle: Text(
          subtitle,
          style: GoogleFonts.poppins(
            fontSize: 12,
            color: Colors.grey.shade600,
          ),
        ),
        trailing: Icon(Icons.chevron_right_rounded, color: color),
        onTap: onTap,
      ),
    );
  }
}
