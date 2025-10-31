import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/feature_button.dart';
import 'help_page.dart';
import 'climate_page.dart';
import 'chatbot_page.dart';
import 'bus_routes_page.dart';
import 'profile_page.dart';
import 'splash_page.dart';

class HomePage extends StatelessWidget {
  final Map user;
  const HomePage({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    final features = [
      {
        "title": "Send Help Alert",
        "icon": Icons.emergency_rounded,
        "color": const Color(0xFFE53935),
        "page": HelpPage(user: user)
      },
      {
        "title": "Bus Routes",
        "icon": Icons.directions_bus_rounded,
        "color": const Color(0xFF1E88E5),
        "page": const BusRoutesPage()
      },
      {
        "title": "Climate Info",
        "icon": Icons.cloud_rounded,
        "color": const Color(0xFF43A047),
        "page": const ClimatePage()
      },
      {
        "title": "Chatbot",
        "icon": Icons.chat_bubble_rounded,
        "color": const Color(0xFF8E24AA),
        "page": const ChatbotPage()
      },
      {
        "title": "Profile",
        "icon": Icons.person_rounded,
        "color": const Color(0xFFFFA000),
        "page": ProfilePage(user: user)
      },
    ];

    final rules = [
      "Respect and follow local environmental laws and wildlife protection norms.",
      "Avoid littering, plastic use, and dumping waste in natural areas.",
      "Always carry valid ID and report suspicious activities to nearby authorities.",
      "Follow safe driving speeds and obey local transport rules.",
      "Support eco-tourism and local businesses responsibly.",
      "Maintain cleanliness in public spaces and tourist spots.",
      "In emergencies, use 'Send Help Alert' for immediate assistance.",
      "Stay updated about weather alerts and route changes.",
    ];

    return Scaffold(
      backgroundColor: Colors.white,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.green.shade800.withOpacity(0.9),
        elevation: 0,
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
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.white, Colors.green.shade50],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 🌿 Welcome Banner
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: Colors.green.shade800,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.green.withOpacity(0.2),
                          blurRadius: 10,
                          offset: const Offset(2, 4),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        const CircleAvatar(
                          radius: 30,
                          backgroundColor: Colors.white,
                          child: Icon(Icons.public, color: Colors.green, size: 30),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Text(
                            "Welcome, ${user['name'] ?? 'Citizen'} 👋\nExplore Smart Wayanad Services",
                            style: GoogleFonts.poppins(
                              color: Colors.white,
                              fontWeight: FontWeight.w500,
                              fontSize: 16,
                              height: 1.4,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 25),

                  // 🧭 Features Grid
                  Text(
                    "Quick Access",
                    style: GoogleFonts.poppins(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: Colors.green.shade900,
                    ),
                  ),
                  const SizedBox(height: 12),
                  GridView.builder(
                    physics: const NeverScrollableScrollPhysics(),
                    shrinkWrap: true,
                    itemCount: features.length,
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      childAspectRatio: 0.9,
                      crossAxisSpacing: 14,
                      mainAxisSpacing: 14,
                    ),
                    itemBuilder: (_, i) {
                      final feature = features[i];
                      return _FeatureCard(
                        title: feature['title'] as String,
                        icon: feature['icon'] as IconData,
                        color: feature['color'] as Color,
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => feature['page'] as Widget,
                            ),
                          );
                        },
                      );
                    },
                  ),
                  const SizedBox(height: 30),

                  // 📜 District Guidelines
                  Text(
                    "Wayanad District Guidelines",
                    style: GoogleFonts.poppins(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: Colors.green.shade900,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.green.shade50,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.green.shade200),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        for (int i = 0; i < rules.length; i++)
                          Padding(
                            padding: const EdgeInsets.only(bottom: 10),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  "•  ",
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: Colors.green.shade700,
                                    height: 1.5,
                                  ),
                                ),
                                Expanded(
                                  child: Text(
                                    rules[i],
                                    style: GoogleFonts.poppins(
                                      fontSize: 14,
                                      color: Colors.green.shade900,
                                      height: 1.5,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 30),

                  // Footer
                  Center(
                    child: Text(
                      "© 2025 Smart Wayanad | Developed by Niranjan",
                      style: GoogleFonts.poppins(
                        fontSize: 12,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// 🌿 Feature Card (clean white-green glass look)
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
      borderRadius: BorderRadius.circular(16),
      splashColor: color.withOpacity(0.2),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: color.withOpacity(0.2)),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.green.withOpacity(0.08),
              blurRadius: 10,
              offset: const Offset(2, 4),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircleAvatar(
              radius: 26,
              backgroundColor: color.withOpacity(0.1),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(height: 8),
            Text(
              title,
              textAlign: TextAlign.center,
              style: GoogleFonts.poppins(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: Colors.green.shade900,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
