import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

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

class HomePage extends StatefulWidget {
  final Map user;
  const HomePage({super.key, required this.user});

  @override
  State<HomePage> createState() => _HomePageState();
}

// ============================================================================

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

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

  @override
  Widget build(BuildContext context) {
    final user = widget.user;

    // -----------------------------------------------------------------------
    // FIXED STRONGLY TYPED FEATURES LIST
    // -----------------------------------------------------------------------
    final List<Map<String, Object>> features = [
      {
        "title": "SOS Emergency",
        "icon": Icons.sos,
        "color": Colors.red,
        "page": HelpPage(user: user),
      },
      {
        "title": "Bus Routes",
        "icon": Icons.directions_bus_rounded,
        "color": Colors.blue,
        "page": const BusRoutesPage(),
      },
      {
        "title": "Weather",
        "icon": Icons.cloud_rounded,
        "color": Colors.green,
        "page": const ClimatePage(),
      },
      {
        "title": "Chatbot",
        "icon": Icons.smart_toy_rounded,
        "color": Colors.deepPurple,
        "page": const ChatbotPage(),
      },
      {
        "title": "Helpline",
        "icon": Icons.call_rounded,
        "color": Colors.teal,
        "page": const HelplinePage(),
      },
      {
        "title": "Hospitals",
        "icon": Icons.local_hospital_rounded,
        "color": Colors.redAccent,
        "page": const HospitalPage(),
      },
      {
        "title": "Clinics",
        "icon": Icons.healing_rounded,
        "color": Colors.green,
        "page": const ClinicPage(),
      },
      {
        "title": "Taxi Stands",
        "icon": Icons.local_taxi_rounded,
        "color": Colors.indigo,
        "page": const TaxiPage(),
      },
      {
        "title": "My Profile",
        "icon": Icons.person_rounded,
        "color": Colors.orange,
        "page": ProfilePage(user: user),
      },
    ];

    // District rules
    final List<String> rules = [
      "Respect natural habitats & wildlife.",
      "Avoid littering, especially in eco-sensitive zones.",
      "Drive safely & follow traffic rules.",
      "Support eco-tourism & local businesses.",
      "Use SOS for immediate emergency assistance.",
      "Stay updated about weather alerts.",
    ];

    return Scaffold(
      backgroundColor: Colors.white,
      extendBodyBehindAppBar: true,

      // -------------------------------------------------------------------
      // TOP APP BAR
      // -------------------------------------------------------------------
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        centerTitle: true,
        title: Text(
          "Smart Wayanad",
          style: GoogleFonts.poppins(
            color: Colors.white,
            fontWeight: FontWeight.w700,
            fontSize: 22,
          ),
        ),
        actions: [
          IconButton(
            tooltip: "Logout",
            icon: const Icon(Icons.logout, color: Colors.white),
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

      // -------------------------------------------------------------------
      // BODY
      // -------------------------------------------------------------------
      body: Stack(
        children: [
          // Green gradient header background
          Container(
            height: 260,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Colors.green.shade800,
                  Colors.green.shade600,
                  Colors.green.shade400,
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
          ),

          SafeArea(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: Column(
                children: [
                  const SizedBox(height: 15),

                  // ------------------------------------------------------
                  // WELCOME CARD
                  // ------------------------------------------------------
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        color: Colors.white.withOpacity(0.2),
                        border: Border.all(color: Colors.white30, width: 1),
                      ),
                      child: Row(
                        children: [
                          const CircleAvatar(
                            radius: 34,
                            backgroundColor: Colors.white,
                            child: Icon(Icons.account_circle,
                                size: 40, color: Colors.green),
                          ),
                          const SizedBox(width: 15),
                          Expanded(
                            child: Text(
                              "Hello, ${user["name"] ?? "Citizen"} 👋\nWelcome to Smart Wayanad",
                              style: GoogleFonts.poppins(
                                color: Colors.white,
                                fontWeight: FontWeight.w600,
                                fontSize: 16,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 30),

                  // ------------------------------------------------------
                  // FEATURE GRID
                  // ------------------------------------------------------
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18),
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        "Explore Services",
                        style: GoogleFonts.poppins(
                          color: Colors.green.shade900,
                          fontWeight: FontWeight.w700,
                          fontSize: 18,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 15),

                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18),
                    child: GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: features.length,
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 3,
                        childAspectRatio: 0.95,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                      ),
                      itemBuilder: (_, index) {
                        final f = features[index];

                        return _FeatureCard(
                          title: f["title"] as String,
                          icon: f["icon"] as IconData,
                          color: f["color"] as Color,
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (_) => f["page"] as Widget),
                          ),
                        );
                      },
                    ),
                  ),

                  const SizedBox(height: 30),

                  // ------------------------------------------------------
                  // DISTRICT RULES BOX
                  // ------------------------------------------------------
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18),
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        "District Guidelines",
                        style: GoogleFonts.poppins(
                          color: Colors.green.shade900,
                          fontWeight: FontWeight.w700,
                          fontSize: 18,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 10),

                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16),
                        color: Colors.green.shade50,
                        border: Border.all(color: Colors.green.shade200),
                      ),
                      child: Column(
                        children: rules
                            .map((rule) => Padding(
                                  padding: const EdgeInsets.only(bottom: 8),
                                  child: Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        "•  ",
                                        style: TextStyle(
                                            color: Colors.green.shade900,
                                            fontSize: 16),
                                      ),
                                      Expanded(
                                        child: Text(
                                          rule,
                                          style: GoogleFonts.poppins(
                                            fontSize: 14,
                                            color: Colors.green.shade900,
                                            height: 1.4,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ))
                            .toList(),
                      ),
                    ),
                  ),

                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
        ],
      ),

      // -------------------------------------------------------------------
      // BOTTOM NAV
      // -------------------------------------------------------------------
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.green.shade900,
          boxShadow: [
            BoxShadow(
              blurRadius: 10,
              color: Colors.black26,
              offset: const Offset(0, -2),
            )
          ],
        ),
        child: BottomNavigationBar(
          backgroundColor: Colors.green.shade900,
          selectedItemColor: Colors.white,
          unselectedItemColor: Colors.white70,
          currentIndex: _selectedIndex,
          onTap: _onItemTapped,
          items: const [
            BottomNavigationBarItem(
                icon: Icon(Icons.home_rounded), label: "Home"),
            BottomNavigationBarItem(
                icon: Icon(Icons.notifications_rounded), label: "Alerts"),
            BottomNavigationBarItem(
                icon: Icon(Icons.person_rounded), label: "Profile"),
          ],
        ),
      ),
    );
  }
}

// ============================================================================
// FEATURE CARD WIDGET
// ============================================================================

class _FeatureCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _FeatureCard({
    required this.title,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 15),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          color: Colors.white,
          border: Border.all(color: color.withOpacity(0.2)),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.15),
              blurRadius: 12,
              offset: const Offset(2, 4),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircleAvatar(
              radius: 26,
              backgroundColor: color.withOpacity(0.15),
              child: Icon(icon, color: color, size: 26),
            ),
            const SizedBox(height: 10),
            Text(
              title,
              textAlign: TextAlign.center,
              style: GoogleFonts.poppins(
                fontSize: 13,
                color: Colors.black87,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
