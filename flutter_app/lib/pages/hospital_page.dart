import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

class HospitalPage extends StatelessWidget {
  const HospitalPage({super.key});

  // ✅ Sample Hospital Data
  final List<Map<String, dynamic>> hospitals = const [
    {
      "name": "DM Wayanad Institute of Medical Sciences",
      "address": "Meppadi, Wayanad, Kerala",
      "phone": "04936 305000",
      "beds": 12,
      "totalBeds": 40
    },
    {
      "name": "Fathima Matha Mission Hospital",
      "address": "Kalpetta, Wayanad, Kerala",
      "phone": "04936 203204",
      "beds": 8,
      "totalBeds": 25
    },
    {
      "name": "IQRAA Hospital",
      "address": "Mananthavady, Wayanad, Kerala",
      "phone": "04935 240111",
      "beds": 5,
      "totalBeds": 20
    },
    {
      "name": "Assumption Hospital",
      "address": "Sulthan Bathery, Wayanad, Kerala",
      "phone": "04936 220322",
      "beds": 3,
      "totalBeds": 18
    },
  ];

  // 📞 Call the hospital
  void callNumber(String number) async {
    final Uri url = Uri(scheme: 'tel', path: number);
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  // 📍 Open Google Maps
  void openMap(String query) async {
    final Uri url = Uri.parse("https://www.google.com/maps/search/?api=1&query=$query");
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final isTablet = width > 600;

    return Scaffold(
      appBar: AppBar(title: const Text("Hospitals")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: LayoutBuilder(
          builder: (context, constraints) {
            return GridView.count(
              crossAxisCount: isTablet ? 2 : 1,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              childAspectRatio: isTablet ? 2.5 : 1.7,
              children: hospitals.map((hospital) {
                final double bedUsage =
                    hospital["beds"] / hospital["totalBeds"];

                final Color bedColor = bedUsage > 0.6
                    ? Colors.red
                    : bedUsage > 0.3
                        ? Colors.orange
                        : Colors.green;

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
                        Text(
                          hospital["name"],
                          style: GoogleFonts.poppins(
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          hospital["address"],
                          style: GoogleFonts.poppins(fontSize: 14),
                        ),
                        const SizedBox(height: 12),

                        // 🛏️ Bed availability indicator
                        Row(
                          children: [
                            Text(
                              "${hospital["beds"]} / ${hospital["totalBeds"]} Beds Available",
                              style: GoogleFonts.poppins(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Container(
                              width: 14,
                              height: 14,
                              decoration: BoxDecoration(
                                color: bedColor,
                                shape: BoxShape.circle,
                              ),
                            ),
                          ],
                        ),

                        const Spacer(),

                        // Buttons row
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            ElevatedButton.icon(
                              onPressed: () => callNumber(hospital["phone"]),
                              icon: const Icon(Icons.call),
                              label: const Text("Call"),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.green,
                              ),
                            ),
                            OutlinedButton.icon(
                              onPressed: () => openMap(hospital["name"]),
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
            );
          },
        ),
      ),
    );
  }
}
