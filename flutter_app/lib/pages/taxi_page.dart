import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

class TaxiPage extends StatelessWidget {
  const TaxiPage({super.key});

  // ✅ Sample Taxi Stand Data
  final List<Map<String, dynamic>> taxiStands = const [
    {
      "name": "Kalpetta Taxi Stand",
      "address": "Kalpetta, Wayanad",
      "phone": "04936 222444",
      "rating": 4.4,
      "availability": "24/7 Service"
    },
    {
      "name": "Mananthavady Auto Stand",
      "address": "Mananthavady Town",
      "phone": "04935 243243",
      "rating": 4.1,
      "availability": "Open until 10 PM"
    },
    {
      "name": "Sulthan Bathery Taxi Junction",
      "address": "Sulthan Bathery, Wayanad",
      "phone": "04936 225522",
      "rating": 4.6,
      "availability": "24/7 Service"
    },
    {
      "name": "Meppadi Auto Stand",
      "address": "Meppadi Main Road",
      "phone": "04936 235235",
      "rating": 4.2,
      "availability": "Closes at 11 PM"
    },
  ];

  // 📞 Call taxi stand
  void callNumber(String number) async {
    final Uri url = Uri(scheme: 'tel', path: number);
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  // 📍 Open Google Maps
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
      appBar: AppBar(title: const Text("Taxi Stands")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: GridView.count(
          crossAxisCount: isTablet ? 2 : 1,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          childAspectRatio: isTablet ? 2.6 : 1.7,
          children: taxiStands.map((taxi) {
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
                    // Name
                    Text(
                      taxi["name"],
                      style: GoogleFonts.poppins(
                        fontSize: 20,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 6),

                    // Address
                    Text(
                      taxi["address"],
                      style: GoogleFonts.poppins(fontSize: 14),
                    ),

                    const SizedBox(height: 10),

                    // ⭐ Rating + Availability
                    Row(
                      children: [
                        Icon(Icons.star, color: Colors.orange.shade400, size: 20),
                        const SizedBox(width: 4),
                        Text(
                          taxi["rating"].toString(),
                          style: GoogleFonts.poppins(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Text(
                          taxi["availability"],
                          style: GoogleFonts.poppins(
                            fontSize: 14,
                            color: Colors.green,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),

                    const Spacer(),

                    // Buttons
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        ElevatedButton.icon(
                          onPressed: () => callNumber(taxi["phone"]),
                          icon: const Icon(Icons.call),
                          label: const Text("Call"),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                          ),
                        ),
                        OutlinedButton.icon(
                          onPressed: () => openMap(taxi["name"]),
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
