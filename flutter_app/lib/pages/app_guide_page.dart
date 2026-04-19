import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/branding.dart';

class AppGuidePage extends StatelessWidget {
  const AppGuidePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppPalette.screenBackground,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200,
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
                    colors: AppPalette.accentGradient,
                  ),
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(
                                Icons.menu_book_rounded,
                                color: Colors.white,
                                size: 28,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'App Guide',
                                    style: GoogleFonts.poppins(
                                      color: Colors.white,
                                      fontSize: 28,
                                      fontWeight: FontWeight.w800,
                                      letterSpacing: -0.5,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Complete guide to using Smart Wayanad',
                                    style: GoogleFonts.poppins(
                                      color: Colors.white.withValues(alpha: 0.9),
                                      fontSize: 14,
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
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _GuideSection(
                    icon: Icons.home_rounded,
                    title: 'Getting Started',
                    color: AppPalette.leaf,
                    items: [
                      _GuideItem(
                        title: 'Welcome to Smart Wayanad',
                        description:
                            'Smart Wayanad is your all-in-one digital platform for accessing district services, emergency assistance, transportation, and more.',
                      ),
                      _GuideItem(
                        title: 'Home Screen',
                        description:
                            'The home screen provides quick access to all features. Use the bottom navigation to switch between Home, SOS, and Profile.',
                      ),
                      _GuideItem(
                        title: 'Feature Cards',
                        description:
                            'Tap on any feature card to access services like Bus Routes, Smart Route Finder, AI Chatbot, Weather, and more.',
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  _GuideSection(
                    icon: Icons.emergency_rounded,
                    title: 'Emergency SOS',
                    color: const Color(0xFFF5576C),
                    items: [
                      _GuideItem(
                        title: 'How to Use SOS',
                        description:
                            'Tap the red SOS button in the bottom navigation. Your location will be automatically shared with emergency services.',
                      ),
                      _GuideItem(
                        title: 'Live Location Sharing',
                        description:
                            'Your location updates every 30 seconds until the alert is resolved. This helps emergency services find you quickly.',
                      ),
                      _GuideItem(
                        title: 'Emergency Contacts',
                        description:
                            'Police: 100 | Ambulance: 108 | Fire: 101 | Women Helpline: 1091 | Child Helpline: 1098',
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  _GuideSection(
                    icon: Icons.directions_bus_rounded,
                    title: 'Transportation',
                    color: AppPalette.mint,
                    items: [
                      _GuideItem(
                        title: 'Bus Routes',
                        description:
                            'View all available bus routes with schedules, timings, and sub-routes. Search by route number or location.',
                      ),
                      _GuideItem(
                        title: 'Smart Route Finder',
                        description:
                            'Search for routes using natural language (e.g., "routes to Kalpetta"). Get the best route recommendations with road status information.',
                      ),
                      _GuideItem(
                        title: 'Route Information',
                        description:
                            'Each route shows first bus, last bus, frequency, distance, estimated time, and current road status.',
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  _GuideSection(
                    icon: Icons.smart_toy_rounded,
                    title: 'AI Chatbot',
                    color: AppPalette.pine,
                    items: [
                      _GuideItem(
                        title: 'Ask Anything',
                        description:
                            'The AI chatbot can help you with emergency services, bus routes, hospitals, weather, police stations, and more.',
                      ),
                      _GuideItem(
                        title: 'Supported Languages',
                        description:
                            'Chatbot supports both English and Malayalam. Ask questions in your preferred language.',
                      ),
                      _GuideItem(
                        title: 'Example Queries',
                        description:
                            'Try: "Where is the nearest hospital?", "Bus routes to Mananthavady", "Weather today", "Police station contact"',
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  _GuideSection(
                    icon: Icons.location_on_rounded,
                    title: 'Location Services',
                    color: AppPalette.forest,
                    items: [
                      _GuideItem(
                        title: 'Hospitals & Clinics',
                        description:
                            'Find nearby hospitals and clinics with contact information and addresses.',
                      ),
                      _GuideItem(
                        title: 'Taxi Stands',
                        description:
                            'Locate taxi stands and get contact numbers for booking rides.',
                      ),
                      _GuideItem(
                        title: 'Helplines',
                        description:
                            'Access all emergency helpline numbers and contact information.',
                      ),
                      _GuideItem(
                        title: 'AR Navigation',
                        description:
                            'Use AR Navigation to find nearby services using your camera with real-time overlays.',
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  _GuideSection(
                    icon: Icons.wb_sunny_rounded,
                    title: 'Weather & Climate',
                    color: const Color(0xFFC9A227),
                    items: [
                      _GuideItem(
                        title: 'Current Weather',
                        description:
                            'View real-time weather conditions including temperature, humidity, wind speed, and conditions.',
                      ),
                      _GuideItem(
                        title: '7-Day Forecast',
                        description:
                            'Get weather forecasts for the next 7 days to plan your activities.',
                      ),
                      _GuideItem(
                        title: 'Weather Alerts',
                        description:
                            'Receive alerts about severe weather conditions and warnings.',
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  _GuideSection(
                    icon: Icons.person_rounded,
                    title: 'Profile & Settings',
                    color: AppPalette.leaf,
                    items: [
                      _GuideItem(
                        title: 'Edit Profile',
                        description:
                            'Update your name, email, phone number, and profile photo from the Profile page.',
                      ),
                      _GuideItem(
                        title: 'Change Password',
                        description:
                            'Update your password securely from the Edit Profile section.',
                      ),
                      _GuideItem(
                        title: 'Settings',
                        description:
                            'Toggle dark mode, notifications, and language preferences.',
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  _GuideSection(
                    icon: Icons.help_outline_rounded,
                    title: 'Tips & Tricks',
                    color: AppPalette.mint,
                    items: [
                      _GuideItem(
                        title: 'Quick Access',
                        description:
                            'Use the bottom navigation for quick access to Home, SOS, and Profile.',
                      ),
                      _GuideItem(
                        title: 'Search Features',
                        description:
                            'Most pages have search functionality. Use it to quickly find what you need.',
                      ),
                      _GuideItem(
                        title: 'Voice Reporting',
                        description:
                            'Report incidents using voice commands from the Profile page.',
                      ),
                      _GuideItem(
                        title: 'Incident Heatmap',
                        description:
                            'View incident heatmaps to see areas with high activity and stay informed.',
                      ),
                    ],
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

class _GuideSection extends StatelessWidget {
  final IconData icon;
  final String title;
  final Color color;
  final List<_GuideItem> items;

  const _GuideSection({
    required this.icon,
    required this.title,
    required this.color,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [color, color.withValues(alpha: 0.7)],
              ),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(20),
                topRight: Radius.circular(20),
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: Colors.white, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Text(
                    title,
                    style: GoogleFonts.poppins(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: items.asMap().entries.map((entry) {
                final index = entry.key;
                final item = entry.value;
                return Column(
                  children: [
                    if (index > 0) const Divider(height: 32),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: color.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Center(
                            child: Text(
                              '${index + 1}',
                              style: GoogleFonts.poppins(
                                color: color,
                                fontWeight: FontWeight.w700,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.title,
                                style: GoogleFonts.poppins(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.grey.shade900,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                item.description,
                                style: GoogleFonts.poppins(
                                  fontSize: 14,
                                  color: Colors.grey.shade600,
                                  height: 1.6,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}

class _GuideItem {
  final String title;
  final String description;

  _GuideItem({required this.title, required this.description});
}



