import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/profile_image_widget.dart';
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
import 'incident_heatmap_page.dart';
import 'app_guide_page.dart';
import '../services/api_service.dart';
import '../constants/branding.dart';

class HomePage extends StatefulWidget {
  final Map user;
  const HomePage({super.key, required this.user});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> with TickerProviderStateMixin {
  int _selectedIndex = 0;
  late AnimationController _pulseController;
  late AnimationController _fadeController;
  late Animation<double> _pulseAnimation;
  late Animation<double> _fadeAnimation;
  bool _isServerOnline = false;
  late Map _currentUser;
  /// Darkens the Wayanad hero when pointer hovers (desktop / web).
  bool _heroPointerInside = false;
  
  @override
  void initState() {
    super.initState();
    _currentUser = widget.user;
    _checkServerStatus();

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
    
    _fadeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..forward();
    
    _pulseAnimation = Tween<double>(begin: 0.98, end: 1.02).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
    
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _fadeController, curve: Curves.easeOut),
    );
  }
  
  void updateUser(Map newUser) {
    setState(() {
      _currentUser = newUser;
    });
  }

  Future<void> _checkServerStatus() async {
    final isOnline = await ApiService.pingServer();
    if (mounted) {
      setState(() => _isServerOnline = isOnline);
    }
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _fadeController.dispose();
    super.dispose();
  }

  String _getProfilePhotoUrl() {
    final profilePhoto = _currentUser['profilePhoto'];
    if (profilePhoto != null && profilePhoto.toString().isNotEmpty) {
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
    final user = _currentUser;
    final media = MediaQuery.of(context);
    final screenW = media.size.width;
    final padH = screenW >= 400 ? 20.0 : 16.0;
    final gridCols = screenW < 360 ? 3 : 4;
    final gridAspect = gridCols == 3 ? 0.78 : 0.82;
    final heroH = (media.size.height * 0.26).clamp(200.0, 268.0);
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    final profilePhotoUrl = _getProfilePhotoUrl();
    final firstName = user["name"]?.split(" ")[0] ?? "Citizen";

    // Organized feature categories
    final quickAccess = [
      {
        "title": "Bus Routes",
        "icon": Icons.directions_bus_rounded,
        "color": AppPalette.leaf,
        "page": const BusRoutesPage(),
      },
      {
        "title": "Smart Route",
        "icon": Icons.route_rounded,
        "color": AppPalette.mint,
        "page": const SmartRoutePage(),
        "badge": "AI",
      },
      {
        "title": "Chatbot",
        "icon": Icons.smart_toy_rounded,
        "color": AppPalette.pine,
        "page": ChatbotPage(user: user),
        "badge": "AI",
      },
      {
        "title": "Weather",
        "icon": Icons.wb_sunny_rounded,
        "color": const Color(0xFFD4A017),
        "page": const ClimatePage(),
        "badge": "Live",
      },
    ];

    final services = [
      {
        "title": "Hospitals",
        "icon": Icons.local_hospital_rounded,
        "color": const Color(0xFF2D6A4F),
        "page": const HospitalPage(),
      },
      {
        "title": "Clinics",
        "icon": Icons.healing_rounded,
        "color": const Color(0xFF40916C),
        "page": const ClinicPage(),
      },
      {
        "title": "Helpline",
        "icon": Icons.phone_in_talk_rounded,
        "color": AppPalette.leaf,
        "page": const HelplinePage(),
      },
      {
        "title": "Taxi",
        "icon": Icons.local_taxi_rounded,
        "color": const Color(0xFF52796F),
        "page": const TaxiPage(),
      },
    ];

    final advanced = [
      {
        "title": "AI/ML",
        "icon": Icons.psychology_rounded,
        "color": const Color(0xFF1B5E20),
        "page": const AIMLPage(),
        "badge": "NEW",
      },
      {
        "title": "AR Nav",
        "icon": Icons.camera_alt_rounded,
        "color": AppPalette.mint,
        "page": const ARNavigationPage(),
        "badge": "NEW",
      },
      {
        "title": "Heatmap",
        "icon": Icons.map_rounded,
        "color": const Color(0xFF2E8B57),
        "page": const IncidentHeatmapPage(),
        "badge": "Live",
      },
      {
        "title": "Voice",
        "icon": Icons.mic_rounded,
        "color": const Color(0xFF0F4C3A),
        "page": HelpPage(user: user),
      },
    ];

    return Scaffold(
      backgroundColor: colorScheme.surfaceContainerLowest,
      body: FadeTransition(
        opacity: _fadeAnimation,
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            // Modern App Bar
            SliverAppBar(
              expandedHeight: heroH,
              floating: false,
              pinned: true,
              elevation: 0,
              backgroundColor: AppPalette.pine,
              surfaceTintColor: Colors.transparent,
              flexibleSpace: FlexibleSpaceBar(
                background: MouseRegion(
                  onEnter: (_) =>
                      setState(() => _heroPointerInside = true),
                  onExit: (_) =>
                      setState(() => _heroPointerInside = false),
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      Image.asset(
                        Branding.homeHeroAsset,
                        fit: BoxFit.cover,
                        alignment: Alignment.center,
                        errorBuilder: (_, __, ___) => Container(
                          decoration: const BoxDecoration(
                            gradient: LinearGradient(
                              colors: [AppPalette.pine, AppPalette.leaf],
                            ),
                          ),
                        ),
                      ),
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 240),
                        curve: Curves.easeOut,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              AppPalette.deepGreen.withValues(
                                alpha: _heroPointerInside ? 0.82 : 0.62,
                              ),
                              AppPalette.forest.withValues(
                                alpha: _heroPointerInside ? 0.90 : 0.74,
                              ),
                            ],
                          ),
                        ),
                      ),
                      SafeArea(
                        child: Padding(
                          padding: EdgeInsets.fromLTRB(padH, 10, padH, 22),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Flexible(
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 10,
                                        vertical: 6,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.white.withValues(alpha: 0.2),
                                        borderRadius: BorderRadius.circular(20),
                                        border: Border.all(
                                          color: Colors.white.withValues(alpha: 0.35),
                                          width: 1.5,
                                        ),
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Container(
                                            width: 8,
                                            height: 8,
                                            decoration: BoxDecoration(
                                              color: _isServerOnline
                                                  ? AppPalette.mint
                                                  : Colors.redAccent,
                                              shape: BoxShape.circle,
                                            ),
                                          ),
                                          const SizedBox(width: 6),
                                          Flexible(
                                            child: Text(
                                              _isServerOnline ? 'Online' : 'Offline',
                                              style: GoogleFonts.poppins(
                                                color: Colors.white,
                                                fontSize: 10,
                                                fontWeight: FontWeight.w600,
                                              ),
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                  const Spacer(),
                                  Material(
                                    color: Colors.transparent,
                                    child: InkWell(
                                      onTap: () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (_) =>
                                                const NotificationsPage(),
                                          ),
                                        );
                                      },
                                      borderRadius: BorderRadius.circular(12),
                                      child: Container(
                                        padding: const EdgeInsets.all(10),
                                        decoration: BoxDecoration(
                                          color: Colors.white.withValues(alpha: 0.22),
                                          borderRadius: BorderRadius.circular(12),
                                        ),
                                        child: const Icon(
                                          Icons.notifications_outlined,
                                          color: Colors.white,
                                          size: 22,
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Material(
                                    color: Colors.transparent,
                                    child: InkWell(
                                      onTap: () {
                                        Navigator.pushAndRemoveUntil(
                                          context,
                                          MaterialPageRoute(
                                            builder: (_) => const SplashPage(),
                                          ),
                                          (route) => false,
                                        );
                                      },
                                      borderRadius: BorderRadius.circular(12),
                                      child: Container(
                                        padding: const EdgeInsets.all(10),
                                        decoration: BoxDecoration(
                                          color: Colors.white.withValues(alpha: 0.22),
                                          borderRadius: BorderRadius.circular(12),
                                        ),
                                        child: const Icon(
                                          Icons.logout_rounded,
                                          color: Colors.white,
                                          size: 22,
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              Expanded(
                                child: LayoutBuilder(
                                  builder: (context, box) {
                                    // Hero bottom must fit in remaining height (short windows / text scale).
                                    final tight = box.maxHeight < 138;
                                    final titleSize = tight ? 22.0 : 30.0;
                                    final subtitleSize = tight ? 12.0 : 14.0;
                                    final gapTitle = tight ? 4.0 : 8.0;
                                    final gapBeforeRow = tight ? 10.0 : 20.0;
                                    final avatar = tight ? 52.0 : 64.0;
                                    final helloSize = tight ? 18.0 : 22.0;
                                    final hintSize = tight ? 11.5 : 13.0;
                                    final initialSize = tight ? 22.0 : 26.0;
                                    return FittedBox(
                                      fit: BoxFit.scaleDown,
                                      alignment: Alignment.bottomLeft,
                                      child: SizedBox(
                                        width: box.maxWidth,
                                        child: Column(
                                          mainAxisAlignment: MainAxisAlignment.end,
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Text(
                                              'Smart Wayanad',
                                              style: GoogleFonts.poppins(
                                                color: Colors.white,
                                                fontSize: titleSize,
                                                fontWeight: FontWeight.w800,
                                                height: 1.05,
                                                letterSpacing: -0.9,
                                                shadows: const [
                                                  Shadow(
                                                    color: Color(0x66000000),
                                                    blurRadius: 14,
                                                    offset: Offset(0, 2),
                                                  ),
                                                ],
                                              ),
                                            ),
                                            SizedBox(height: gapTitle),
                                            Text(
                                              'Wayanad · Safety, routes & services in one place',
                                              style: GoogleFonts.poppins(
                                                color: AppPalette.sage
                                                    .withValues(alpha: 0.98),
                                                fontSize: subtitleSize,
                                                fontWeight: FontWeight.w600,
                                                height: 1.35,
                                              ),
                                            ),
                                            SizedBox(height: gapBeforeRow),
                                            Row(
                                              children: [
                                                ScaleTransition(
                                                  scale: _pulseAnimation,
                                                  child: Container(
                                                    width: avatar,
                                                    height: avatar,
                                                    decoration: BoxDecoration(
                                                      shape: BoxShape.circle,
                                                      border: Border.all(
                                                        color: Colors.white,
                                                        width: tight ? 2.5 : 3,
                                                      ),
                                                      boxShadow: [
                                                        BoxShadow(
                                                          color: Colors.black
                                                              .withValues(
                                                                  alpha: 0.25),
                                                          blurRadius: 16,
                                                          spreadRadius: 1,
                                                        ),
                                                      ],
                                                    ),
                                                    child: ClipOval(
                                                      child: profilePhotoUrl
                                                              .isNotEmpty
                                                          ? ProfileImageWidget(
                                                              imageUrl:
                                                                  profilePhotoUrl,
                                                              fallbackText:
                                                                  user["name"] ??
                                                                      "User",
                                                              size: avatar,
                                                              fit: BoxFit.cover,
                                                            )
                                                          : Container(
                                                              decoration:
                                                                  BoxDecoration(
                                                                gradient:
                                                                    LinearGradient(
                                                                  colors: [
                                                                    AppPalette
                                                                        .mint
                                                                        .withValues(
                                                                            alpha:
                                                                                0.5),
                                                                    AppPalette
                                                                        .leaf
                                                                        .withValues(
                                                                            alpha:
                                                                                0.35),
                                                                  ],
                                                                ),
                                                              ),
                                                              child: Center(
                                                                child: Text(
                                                                  (user["name"]?[0] ??
                                                                          "U")
                                                                      .toUpperCase(),
                                                                  style: GoogleFonts
                                                                      .poppins(
                                                                    color: Colors
                                                                        .white,
                                                                    fontSize:
                                                                        initialSize,
                                                                    fontWeight:
                                                                        FontWeight
                                                                            .w800,
                                                                  ),
                                                                ),
                                                              ),
                                                            ),
                                                    ),
                                                  ),
                                                ),
                                                SizedBox(
                                                    width: tight ? 12 : 16),
                                                Expanded(
                                                  child: Column(
                                                    crossAxisAlignment:
                                                        CrossAxisAlignment
                                                            .start,
                                                    mainAxisSize:
                                                        MainAxisSize.min,
                                                    children: [
                                                      Text(
                                                        "Hello, $firstName! 👋",
                                                        style:
                                                            GoogleFonts.poppins(
                                                          color: Colors.white,
                                                          fontSize: helloSize,
                                                          fontWeight:
                                                              FontWeight.w800,
                                                          letterSpacing: -0.4,
                                                        ),
                                                      ),
                                                      SizedBox(
                                                          height:
                                                              tight ? 2 : 4),
                                                      Text(
                                                        "How can we help you today?",
                                                        style:
                                                            GoogleFonts.poppins(
                                                          color: Colors.white
                                                              .withValues(
                                                                  alpha: 0.92),
                                                          fontSize: hintSize,
                                                          fontWeight:
                                                              FontWeight.w500,
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
                                    );
                                  },
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Quick Stats
            SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.fromLTRB(padH, 20, padH, 16),
                child: Row(
                  children: [
                    Expanded(
                      child: _ModernStatCard(
                        icon: Icons.directions_bus_rounded,
                        value: "50+",
                        label: "Routes",
                        gradient: const [AppPalette.leaf, AppPalette.pine],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _ModernStatCard(
                        icon: Icons.local_hospital_rounded,
                        value: "20+",
                        label: "Hospitals",
                        gradient: const [Color(0xFF2E8B57), AppPalette.leaf],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _ModernStatCard(
                        icon: Icons.wb_sunny_rounded,
                        value: "24°C",
                        label: "Weather",
                        gradient: const [AppPalette.mint, Color(0xFF1B6B45)],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Quick Access Section
            SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.fromLTRB(padH, 8, padH, 12),
                child: Row(
                  children: [
                    Text(
                      "Quick Access",
                      style: theme.textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.4,
                      ),
                    ),
                    const Spacer(),
                    Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const AppGuidePage(),
                            ),
                          );
                        },
                        borderRadius: BorderRadius.circular(8),
                        child: Padding(
                          padding: const EdgeInsets.all(4),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.help_outline_rounded,
                                size: 16,
                                color: Colors.grey.shade600,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                "Guide",
                                style: GoogleFonts.poppins(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.grey.shade600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Quick Access Grid
            SliverPadding(
              padding: EdgeInsets.symmetric(horizontal: padH),
              sliver: SliverGrid(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: gridCols,
                  childAspectRatio: gridAspect,
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                ),
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final feature = quickAccess[index];
                    return _ModernFeatureCard(
                      title: feature["title"] as String,
                      icon: feature["icon"] as IconData,
                      color: feature["color"] as Color,
                      badge: feature["badge"] as String?,
                      onTap: () {
                        final page = feature["page"] as Widget;
                        if (page is HelpPage) {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => HelpPage(user: _currentUser),
                            ),
                          );
                        } else {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => page),
                          );
                        }
                      },
                    );
                  },
                  childCount: quickAccess.length,
                ),
              ),
            ),

            // Services Section
            SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.fromLTRB(padH, 24, padH, 12),
                child: Text(
                  "Services",
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.4,
                  ),
                ),
              ),
            ),

            SliverPadding(
              padding: EdgeInsets.symmetric(horizontal: padH),
              sliver: SliverGrid(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: gridCols,
                  childAspectRatio: gridAspect,
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                ),
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final feature = services[index];
                    return _ModernFeatureCard(
                      title: feature["title"] as String,
                      icon: feature["icon"] as IconData,
                      color: feature["color"] as Color,
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => feature["page"] as Widget),
                        );
                      },
                    );
                  },
                  childCount: services.length,
                ),
              ),
            ),

            // Advanced Features
            SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.fromLTRB(padH, 24, padH, 12),
                child: Row(
                  children: [
                    Text(
                      "Advanced",
                      style: theme.textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.4,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [AppPalette.leaf, AppPalette.mint],
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        "NEW",
                        style: GoogleFonts.poppins(
                          fontSize: 9,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            SliverPadding(
              padding: EdgeInsets.symmetric(horizontal: padH),
              sliver: SliverGrid(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: gridCols,
                  childAspectRatio: gridAspect,
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                ),
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final feature = advanced[index];
                    return _ModernFeatureCard(
                      title: feature["title"] as String,
                      icon: feature["icon"] as IconData,
                      color: feature["color"] as Color,
                      badge: feature["badge"] as String?,
                      onTap: () {
                        final page = feature["page"] as Widget;
                        if (page is HelpPage) {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => HelpPage(user: _currentUser),
                            ),
                          );
                        } else {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => page),
                          );
                        }
                      },
                    );
                  },
                  childCount: advanced.length,
                ),
              ),
            ),

            // District Guidelines
            SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.fromLTRB(padH, 24, padH, 12),
                child: Row(
                  children: [
                    Container(
                      width: 4,
                      height: 24,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [AppPalette.leaf, AppPalette.mint],
                        ),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      "District Guidelines",
                      style: theme.textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.4,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.fromLTRB(padH, 0, padH, 112),
                child: _ModernGuidelinesCard(),
              ),
            ),
          ],
        ),
      ),

      // Bottom Navigation
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: colorScheme.surface,
          border: Border(
            top: BorderSide(
              color: AppPalette.leaf.withValues(alpha: 0.18),
            ),
          ),
          boxShadow: [
            BoxShadow(
              color: AppPalette.leaf.withValues(alpha: 0.08),
              blurRadius: 18,
              offset: const Offset(0, -3),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: EdgeInsets.fromLTRB(padH, 6, padH, 6),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                // Home
                Expanded(
                  child: _ModernNavItem(
                    icon: Icons.home_rounded,
                    label: "Home",
                    isSelected: _selectedIndex == 0,
                    onTap: () => setState(() => _selectedIndex = 0),
                  ),
                ),
                // SOS Button
                SizedBox(
                  width: 60,
                  height: 60,
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      customBorder: const CircleBorder(),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => HelpPage(user: _currentUser),
                          ),
                        );
                      },
                      child: Ink(
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFFE53935), Color(0xFFC62828)],
                          ),
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFFE53935).withValues(alpha: 0.45),
                              blurRadius: 16,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: const Center(
                          child: Icon(
                            Icons.sos_rounded,
                            color: Colors.white,
                            size: 28,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                // Profile
                Expanded(
                  child: _ModernNavItem(
                    icon: Icons.person_rounded,
                    label: "Profile",
                    isSelected: _selectedIndex == 2,
                    onTap: () async {
                      setState(() => _selectedIndex = 2);
                      final updatedUser = await Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ProfilePage(user: _currentUser),
                        ),
                      );
                      if (updatedUser != null && mounted) {
                        setState(() {
                          _currentUser = Map<String, dynamic>.from(
                            updatedUser is Map ? updatedUser : _currentUser,
                          );
                        });
                      }
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// Modern Stat Card
class _ModernStatCard extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  final List<Color> gradient;

  const _ModernStatCard({
    required this.icon,
    required this.value,
    required this.label,
    required this.gradient,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: gradient,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: gradient[0].withValues(alpha: 0.3),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.25),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: Colors.white, size: 24),
          ),
          Flexible(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  value,
                  style: GoogleFonts.poppins(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                    letterSpacing: -0.5,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  label,
                  style: GoogleFonts.poppins(
                    fontSize: 11,
                    color: Colors.white.withValues(alpha: 0.9),
                    fontWeight: FontWeight.w500,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// Modern Feature Card — Material ripple, readable labels, 48dp-friendly tap area
class _ModernFeatureCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color color;
  final String? badge;
  final VoidCallback onTap;

  const _ModernFeatureCard({
    required this.title,
    required this.icon,
    required this.color,
    this.badge,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final onCard = theme.colorScheme.onSurface;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        splashColor: color.withValues(alpha: 0.12),
        highlightColor: color.withValues(alpha: 0.06),
        child: Ink(
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: color.withValues(alpha: 0.12),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Stack(
            children: [
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                height: 56,
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        color.withValues(alpha: 0.14),
                        color.withValues(alpha: 0.04),
                      ],
                    ),
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(20),
                      topRight: Radius.circular(20),
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: color.withValues(alpha: 0.14),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(
                            icon,
                            color: color,
                            size: 22,
                          ),
                        ),
                        if (badge != null)
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  color,
                                  color.withValues(alpha: 0.75),
                                ],
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              badge!,
                              style: GoogleFonts.poppins(
                                color: Colors.white,
                                fontSize: 8,
                                fontWeight: FontWeight.w700,
                                height: 1,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      title,
                      style: GoogleFonts.poppins(
                        color: onCard,
                        fontSize: 12.5,
                        height: 1.25,
                        fontWeight: FontWeight.w700,
                        letterSpacing: -0.2,
                      ),
                      maxLines: 2,
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

// Modern Navigation Item
class _ModernNavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _ModernNavItem({
    required this.icon,
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final primary = scheme.primary;
    final selected = isSelected;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Semantics(
          button: true,
          label: label,
          selected: selected,
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 4),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  icon,
                  color: selected ? primary : Colors.grey.shade500,
                  size: 24,
                ),
                const SizedBox(height: 2),
                Text(
                  label,
                  style: GoogleFonts.poppins(
                    fontSize: 10,
                    height: 1.15,
                    fontWeight: selected ? FontWeight.w700 : FontWeight.w600,
                    color: selected ? primary : Colors.grey.shade600,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// Modern Guidelines Card
class _ModernGuidelinesCard extends StatelessWidget {
  static const List<Map<String, String>> guidelines = [
    {
      "icon": "🌿",
      "title": "Respect Nature",
      "description": "Protect natural habitats & wildlife",
    },
    {
      "icon": "🚯",
      "title": "Keep Clean",
      "description": "Avoid littering in eco-sensitive zones",
    },
    {
      "icon": "🚗",
      "title": "Drive Safely",
      "description": "Follow traffic rules & speed limits",
    },
    {
      "icon": "🤝",
      "title": "Support Local",
      "description": "Promote eco-tourism & local businesses",
    },
    {
      "icon": "🚨",
      "title": "Emergency SOS",
      "description": "Use SOS button for immediate help",
    },
    {
      "icon": "🌤️",
      "title": "Stay Updated",
      "description": "Check weather alerts regularly",
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppPalette.mint.withValues(alpha: 0.1),
            AppPalette.sage.withValues(alpha: 0.12),
          ],
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: AppPalette.leaf.withValues(alpha: 0.22),
          width: 1.5,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppPalette.leaf, AppPalette.mint],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.info_outline_rounded,
                  color: Colors.white,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Text(
                "District Guidelines",
                style: GoogleFonts.poppins(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: Colors.grey.shade900,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
              ...guidelines.map((guideline) => Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 42,
                      height: 42,
                      decoration: BoxDecoration(
                        color: AppPalette.mint.withValues(alpha: 0.16),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Center(
                        child: Text(
                          guideline["icon"]!,
                          style: const TextStyle(fontSize: 22),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            guideline["title"]!,
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: Colors.grey.shade900,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 3),
                          Text(
                            guideline["description"]!,
                            style: GoogleFonts.poppins(
                              fontSize: 12,
                              color: Colors.grey.shade600,
                              height: 1.3,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }
}
