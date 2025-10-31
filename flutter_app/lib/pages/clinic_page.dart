import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ClinicPage extends StatelessWidget {
  const ClinicPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Clinics")),
      body: Center(
        child: Text(
          "Nearby clinics and healthcare centers will appear here.",
          textAlign: TextAlign.center,
          style: GoogleFonts.poppins(fontSize: 16),
        ),
      ),
    );
  }
}
