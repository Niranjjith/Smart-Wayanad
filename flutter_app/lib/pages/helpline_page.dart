import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class HelplinePage extends StatelessWidget {
  const HelplinePage({super.key});

  // ✅ Sample Helpline Data
  final List<Map<String, String>> helplines = const [
    {
      "title": "Emergency",
      "number": "112",
      "description": "National emergency response number"
    },
    {
      "title": "Police",
      "number": "100",
      "description": "Immediate police assistance"
    },
    {
      "title": "Fire & Rescue",
      "number": "101",
      "description": "Fire emergencies and rescue operations"
    },
    {
      "title": "Ambulance",
      "number": "102",
      "description": "Medical emergencies"
    },
    {
      "title": "Disaster Management",
      "number": "1077",
      "description": "Disaster response and helpline"
    },
    {
      "title": "Women Helpline",
      "number": "1091",
      "description": "Women’s safety and emergency support"
    },
    {
      "title": "Child Helpline",
      "number": "1098",
      "description": "Children in distress"
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Helpline Numbers")),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: helplines.length,
        itemBuilder: (context, index) {
          final item = helplines[index];
          return Card(
            elevation: 3,
            margin: const EdgeInsets.only(bottom: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: ListTile(
              contentPadding: const EdgeInsets.all(16),
              leading: CircleAvatar(
                backgroundColor: Colors.blue.shade100,
                child: const Icon(Icons.phone, color: Colors.blue),
              ),
              title: Text(
                item["title"]!,
                style: GoogleFonts.poppins(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),
              subtitle: Text(
                item["description"]!,
                style: GoogleFonts.poppins(fontSize: 14),
              ),
              trailing: Text(
                item["number"]!,
                style: GoogleFonts.poppins(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.green,
                ),
              ),
              onTap: () {
                // 📞 TODO: Add call functionality
              },
            ),
          );
        },
      ),
    );
  }
}
