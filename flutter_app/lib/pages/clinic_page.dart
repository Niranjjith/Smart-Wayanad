import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

class ClinicPage extends StatelessWidget {
  const ClinicPage({super.key});

  // ✅ Sample Clinic Data
  final List<Map<String, dynamic>> clinics = const [
    {
      "name": "City Care Clinic",
      "address": "Kalpetta, Wayanad",
      "phone": "04936 220100",
      "rating": 4.5,
      "availability": "Open Now"
    },
    {
      "name": "LifeCare Medical Center",
      "address": "Mananthavady, Wayanad",
      "phone": "04935 242424",
      "rating": 4.2,
      "availability": "Closes at 8 PM"
    },
    {
      "name": "Ashwini Family Clinic",
      "address": "Sulthan Bathery, Wayanad",
      "phone": "04936 227727",
      "rating": 4.7,
      "availability": "Open Now"
    },
    {
      "name": "Modern Health Clinic",
      "address": "Meppadi, Wayanad",
      "phone": "04936 235678",
      "rating": 4.3,
      "availability": "Closes at 9 PM"
    },
  ];

  // 📞 Call clinic
  void callNumber(String number) async {
    final Uri url = Uri(scheme: 'tel', path: number);
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  // 📍 View on map
  void openMap(String query) async {
    final Uri url = Uri.parse(
        "https://www.google.com/maps/search/?api=1&query=${Uri.encodeComponent(query)}");
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final isTablet = width > 600;

    return Scaffold(
      appBar: AppBar(title: const Text("Clinics")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: GridView.count(
          crossAxisCount: isTablet ? 2 : 1,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          childAspectRatio: isTablet ? 2.6 : 1.7,
          children: clinics.map((clinic) {
            return Card(
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Clinic name
                    Text(
                      clinic["name"],
                      style: GoogleFonts.poppins(
                        fontSize: 20,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 6),

                    // Clinic address
                    Text(
                      clinic["address"],
                      style: GoogleFonts.poppins(fontSize: 14),
                    ),

                    const SizedBox(height: 10),

                    // ⭐ Ratings + Availability
                    Row(
                      children: [
                        Icon(Icons.star, color: Colors.orange.shade400, size: 20),
                        const SizedBox(width: 4),
                        Text(
                          clinic["rating"].toString(),
                          style: GoogleFonts.poppins(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Text(
                          clinic["availability"],
                          style: GoogleFonts.poppins(
                            fontSize: 14,
                            color: Colors.green,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),

                    const Spacer(),

                    // Action buttons
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        ElevatedButton.icon(
                          onPressed: () => callNumber(clinic["phone"]),
                          icon: const Icon(Icons.call),
                          label: const Text("Call"),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                          ),
                        ),
                        OutlinedButton.icon(
                          onPressed: () => openMap(clinic["name"]),
                          icon: const Icon(Icons.location_on),
                          label: const Text("Map"),
                        ),
                      ],
                    )
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}
