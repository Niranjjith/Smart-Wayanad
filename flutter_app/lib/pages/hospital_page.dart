import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class HospitalPage extends StatelessWidget {
  const HospitalPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Hospitals")),
      body: Center(
        child: Text(
          "Nearby hospitals and emergency contacts will appear here.",
          textAlign: TextAlign.center,
          style: GoogleFonts.poppins(fontSize: 16),
        ),
      ),
    );
  }
}
