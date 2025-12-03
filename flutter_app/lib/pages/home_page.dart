import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'dart:math' as math;
import 'dart:io';

// Import pages
import 'help_page.dart';
import 'climate_page.dart';
import 'chatbot_page.dart';
import 'bus_routes_page.dart';
import 'profile_page.dart';
import 'splash_page.dart';
import 'helpline_page.dart';
import 'hospital_page.dart';
import 'taxi_page.dart';
import 'clinic_page.dart';
import 'notifications_page.dart';
import 'smart_route_page.dart';
import 'ai_ml_page.dart';
import 'ar_navigation_page.dart';
import 'voice_report_page.dart';
import 'incident_heatmap_page.dart';
import '../services/api_service.dart';

class HomePage extends StatefulWidget {
  final Map user;
  const HomePage({super.key, required this.user});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> with TickerProviderStateMixin {
  int _selectedIndex = 0;
  late AnimationController _pulseController;
  late AnimationController _slideController;
  late Animation<double> _pulseAnimation;
  late Animation<Offset> _slideAnimation;
  bool _isServerOnline = false;

  @override
  void initState() {
    super.initState();
    _checkServerStatus();
    
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
    
    _slideController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    )..forward();
    
    _pulseAnimation = Tween<double>(begin: 0.95, end: 1.05).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
    
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _slideController, curve: Curves.easeOut));
  }

  Future<void> _checkServerStatus() async {
    final isOnline = await ApiService.pingServer();
    setState(() => _isServerOnline = isOnline);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _slideController.dispose();
    super.dispose();
  }

  void _onItemTapped(int index) {
    if (index == 1) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => const NotificationsPage()),
      );
    } else if (index == 2) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => ProfilePage(user: widget.user)),
      );
    }
    setState(() => _selectedIndex = 0);
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
    final user = widget.user;
    final size = MediaQuery.of(context).size;
    // Always use light theme
    const isDark = false;
    final profilePhotoUrl = _getProfilePhotoUrl();

    // Premium feature cards - smaller and more compact
    final List<Map<String, dynamic>> features = [
      {
        "title": "SOS",
        "icon": Icons.sos_rounded,
        "gradient": [const Color(0xFFE53935), const Color(0xFFC62828)],
        "page": HelpPage(user: user),
        "badge": "24/7",
      },
      {
        "title": "Bus Routes",
        "icon": Icons.directions_bus_rounded,
        "gradient": [const Color(0xFF667EEA), const Color(0xFF764BA2)],
        "page": const BusRoutesPage(),
      },
      {
        "title": "Smart Route",
        "icon": Icons.route_rounded,
        "gradient": [const Color(0xFF43E97B), const Color(0xFF38F9D7)],
        "page": const SmartRoutePage(),
        "badge": "AI",
      },
      {
        "title": "AI/ML",
        "icon": Icons.psychology_rounded,
        "gradient": [const Color(0xFF667EEA), const Color(0xFF764BA2)],
        "page": const AIMLPage(),
        "badge": "NEW",
      },
      {
        "title": "AR Nav",
        "icon": Icons.camera_alt_rounded,
        "gradient": [const Color(0xFF4FACFE), const Color(0xFF00F2FE)],
        "page": const ARNavigationPage(),
        "badge": "NEW",
      },
      {
        "title": "Voice",
        "icon": Icons.mic_rounded,
        "gradient": [const Color(0xFFF5576C), const Color(0xFFFA709A)],
        "page": HelpPage(user: user), // Redirect to SOS for voice reporting
        "badge": null,
      },
      {
        "title": "Heatmap",
        "icon": Icons.map_rounded,
        "gradient": [const Color(0xFF43E97B), const Color(0xFF38F9D7)],
        "page": const IncidentHeatmapPage(),
        "badge": "Live",
      },
      {
        "title": "Weather",
        "icon": Icons.wb_sunny_rounded,
        "gradient": [const Color(0xFFF093FB), const Color(0xFFF5576C)],
        "page": const ClimatePage(),
        "badge": "Live",
      },
      {
        "title": "Chatbot",
        "icon": Icons.smart_toy_rounded,
        "gradient": [const Color(0xFF4FACFE), const Color(0xFF00F2FE)],
        "page": const ChatbotPage(),
        "badge": "AI",
      },
      {
        "title": "Helpline",
        "icon": Icons.phone_in_talk_rounded,
        "gradient": [const Color(0xFF43E97B), const Color(0xFF38F9D7)],
        "page": const HelplinePage(),
      },
      {
        "title": "Hospitals",
        "icon": Icons.local_hospital_rounded,
        "gradient": [const Color(0xFFFA709A), const Color(0xFFFEE140)],
        "page": const HospitalPage(),
      },
      {
        "title": "Clinics",
        "icon": Icons.healing_rounded,
        "gradient": [const Color(0xFF30CFD0), const Color(0xFF330867)],
        "page": const ClinicPage(),
      },
      {
        "title": "Taxi",
        "icon": Icons.local_taxi_rounded,
        "gradient": [const Color(0xFFA8EDEA), const Color(0xFFFED6E3)],
        "page": const TaxiPage(),
      },
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      extendBodyBehindAppBar: true,
      body: CustomScrollView(
        slivers: [
          // Premium App Bar with Profile Photo
          SliverAppBar(
            expandedHeight: 240,
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
                      const Color(0xFF667EEA),
                      const Color(0xFF764BA2),
                      const Color(0xFFF093FB),
                    ],
                  ),
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        // Status indicator
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 5,
                              ),
                              decoration: BoxDecoration(
                                color: _isServerOnline
                                    ? Colors.green.withValues(alpha: 0.2)
                                    : Colors.red.withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: _isServerOnline ? Colors.green : Colors.red,
                                  width: 1.5,
                                ),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    width: 6,
                                    height: 6,
                                    decoration: BoxDecoration(
                                      color: _isServerOnline ? Colors.green : Colors.red,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  Text(
                                    _isServerOnline ? 'Online' : 'Offline',
                                    style: GoogleFonts.poppins(
                                      color: Colors.white,
                                      fontSize: 11,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const Spacer(),
                            IconButton(
                              icon: const Icon(Icons.logout_rounded, color: Colors.white, size: 22),
                              onPressed: () {
                                Navigator.pushAndRemoveUntil(
                                  context,
                                  MaterialPageRoute(builder: (_) => const SplashPage()),
                                  (route) => false,
                                );
                              },
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        // Welcome section with profile photo
                        Row(
                          children: [
                            ScaleTransition(
                              scale: _pulseAnimation,
                              child: Container(
                                width: 60,
                                height: 60,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: Colors.white.withValues(alpha: 0.5),
                                    width: 2.5,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withValues(alpha: 0.2),
                                      blurRadius: 10,
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
                                            color: Colors.white.withValues(alpha: 0.2),
                                            child: Center(
                                              child: CircularProgressIndicator(
                                                strokeWidth: 2,
                                                valueColor: AlwaysStoppedAnimation<Color>(
                                                  Colors.white.withValues(alpha: 0.5),
                                                ),
                                              ),
                                            ),
                                          ),
                                          errorWidget: (context, url, error) => Container(
                                            color: Colors.white.withValues(alpha: 0.2),
                                            child: Center(
                                              child: Text(
                                                (user["name"]?[0] ?? "U").toUpperCase(),
                                                style: GoogleFonts.poppins(
                                                  color: Colors.white,
                                                  fontSize: 24,
                                                  fontWeight: FontWeight.w800,
                                                ),
                                              ),
                                            ),
                                          ),
                                        )
                                      : Container(
                                          color: Colors.white.withValues(alpha: 0.2),
                                          child: Center(
                                            child: Text(
                                              (user["name"]?[0] ?? "U").toUpperCase(),
                                              style: GoogleFonts.poppins(
                                                color: Colors.white,
                                                fontSize: 24,
                                                fontWeight: FontWeight.w800,
                                              ),
                                            ),
                                          ),
                                        ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "Hello, ${user["name"]?.split(" ")[0] ?? "Citizen"} 👋",
                                    style: GoogleFonts.poppins(
                                      color: Colors.white,
                                      fontSize: 22,
                                      fontWeight: FontWeight.w800,
                                      letterSpacing: -0.5,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    "Welcome to Smart Wayanad",
                                    style: GoogleFonts.poppins(
                                      color: Colors.white.withValues(alpha: 0.9),
                                      fontSize: 13,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
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

          // Quick Stats Section - Compact
          SliverToBoxAdapter(
            child: SlideTransition(
              position: _slideAnimation,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12),
                child: Row(
                  children: [
                    Expanded(
                      child: _StatCard(
                        icon: Icons.directions_bus_rounded,
                        value: "50+",
                        label: "Routes",
                        color: const Color(0xFF667EEA),
                        isDark: false,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: _StatCard(
                        icon: Icons.local_hospital_rounded,
                        value: "20+",
                        label: "Hospitals",
                        color: const Color(0xFFF5576C),
                        isDark: false,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: _StatCard(
                        icon: Icons.wb_sunny_rounded,
                        value: "24°C",
                        label: "Weather",
                        color: const Color(0xFF4FACFE),
                        isDark: false,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Services Section Header
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8),
              child: Row(
                children: [
                  Text(
                    "Services",
                    style: GoogleFonts.poppins(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: Colors.grey.shade900,
                    ),
                  ),
                  const Spacer(),
                  TextButton.icon(
                    onPressed: _checkServerStatus,
                    icon: Icon(Icons.refresh_rounded, size: 16, color: Colors.grey.shade700),
                    label: Text(
                      "Refresh",
                      style: GoogleFonts.poppins(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Colors.grey.shade700,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Features Grid - Smaller, more compact
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                childAspectRatio: 0.95,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final feature = features[index];
                  return _PremiumFeatureCard(
                    title: feature["title"],
                    icon: feature["icon"],
                    gradient: feature["gradient"],
                    badge: feature["badge"],
                    isDark: false,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => feature["page"] as Widget,
                        ),
                      );
                    },
                  );
                },
                childCount: features.length,
              ),
            ),
          ),

          // District Guidelines
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "District Guidelines",
                    style: GoogleFonts.poppins(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: Colors.grey.shade900,
                    ),
                  ),
                  const SizedBox(height: 12),
                  const _GuidelinesCard(isDark: false),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
        ],
      ),

      // Premium Bottom Navigation
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              const Color(0xFF667EEA),
              const Color(0xFF764BA2),
            ],
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 20,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: BottomNavigationBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          selectedItemColor: Colors.white,
          unselectedItemColor: Colors.white.withValues(alpha: 0.6),
          currentIndex: _selectedIndex,
          onTap: _onItemTapped,
          type: BottomNavigationBarType.fixed,
          selectedFontSize: 11,
          unselectedFontSize: 11,
          items: [
            BottomNavigationBarItem(
              icon: Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: _selectedIndex == 0
                      ? Colors.white.withValues(alpha: 0.2)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.home_rounded, size: 22),
              ),
              label: "Home",
            ),
            BottomNavigationBarItem(
              icon: Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: _selectedIndex == 1
                      ? Colors.white.withValues(alpha: 0.2)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.notifications_rounded, size: 22),
              ),
              label: "Alerts",
            ),
            BottomNavigationBarItem(
              icon: Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: _selectedIndex == 2
                      ? Colors.white.withValues(alpha: 0.2)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.person_rounded, size: 22),
              ),
              label: "Profile",
            ),
          ],
        ),
      ),
    );
  }
}

// Premium Feature Card Widget - Smaller and more compact
class _PremiumFeatureCard extends StatefulWidget {
  final String title;
  final IconData icon;
  final List<Color> gradient;
  final String? badge;
  final bool isDark;
  final VoidCallback onTap;

  const _PremiumFeatureCard({
    required this.title,
    required this.icon,
    required this.gradient,
    this.badge,
    required this.isDark,
    required this.onTap,
  });

  @override
  State<_PremiumFeatureCard> createState() => _PremiumFeatureCardState();
}

class _PremiumFeatureCardState extends State<_PremiumFeatureCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  bool _isPressed = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 150),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) {
        setState(() => _isPressed = true);
        _controller.forward();
      },
      onTapUp: (_) {
        setState(() => _isPressed = false);
        _controller.reverse();
        widget.onTap();
      },
      onTapCancel: () {
        setState(() => _isPressed = false);
        _controller.reverse();
      },
      child: ScaleTransition(
        scale: Tween<double>(begin: 1.0, end: 0.95).animate(
          CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
        ),
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: widget.gradient,
            ),
            borderRadius: BorderRadius.circular(18),
            boxShadow: [
              BoxShadow(
                color: widget.gradient[0].withValues(alpha: 0.4),
                blurRadius: 12,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Stack(
            children: [
              // Decorative circles
              Positioned(
                top: -15,
                right: -15,
                child: Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white.withValues(alpha: 0.1),
                  ),
                ),
              ),
              // Content
              Padding(
                padding: const EdgeInsets.all(14.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(
                            widget.icon,
                            color: Colors.white,
                            size: 22,
                          ),
                        ),
                        if (widget.badge != null)
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.3),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              widget.badge!,
                              style: GoogleFonts.poppins(
                                color: Colors.white,
                                fontSize: 8,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                      ],
                    ),
                    Text(
                      widget.title,
                      style: GoogleFonts.poppins(
                        color: Colors.white,
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        letterSpacing: -0.3,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Stat Card Widget - Compact
class _StatCard extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  final Color color;
  final bool isDark;

  const _StatCard({
    required this.icon,
    required this.value,
    required this.label,
    required this.color,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: GoogleFonts.poppins(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: Colors.grey.shade900,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: GoogleFonts.poppins(
              fontSize: 11,
              color: Colors.grey.shade600,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

// Guidelines Card Widget
class _GuidelinesCard extends StatelessWidget {
  final bool isDark;
  static const List<String> rules = [
    "Respect natural habitats & wildlife",
    "Avoid littering in eco-sensitive zones",
    "Drive safely & follow traffic rules",
    "Support eco-tourism & local businesses",
    "Use SOS for immediate emergency assistance",
    "Stay updated about weather alerts",
  ];

  const _GuidelinesCard({required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            const Color(0xFF43E97B).withValues(alpha: 0.1),
            const Color(0xFF38F9D7).withValues(alpha: 0.1),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: const Color(0xFF43E97B).withValues(alpha: 0.3),
          width: 1.5,
        ),
      ),
      child: Column(
        children: rules
            .map((rule) => Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        margin: const EdgeInsets.only(top: 6),
                        width: 5,
                        height: 5,
                        decoration: BoxDecoration(
                          color: const Color(0xFF43E97B),
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          rule,
                          style: GoogleFonts.poppins(
                            fontSize: 13,
                            color: Colors.grey.shade800,
                            fontWeight: FontWeight.w500,
                            height: 1.4,
                          ),
                        ),
                      ),
                    ],
                  ),
                ))
            .toList(),
      ),
    );
  }
}
