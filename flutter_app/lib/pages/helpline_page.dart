import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class HelplinePage extends StatelessWidget {
  const HelplinePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Helpline Numbers")),
      body: Center(
        child: Text(
          "List of Emergency and Helpline Numbers will appear here.",
          textAlign: TextAlign.center,
          style: GoogleFonts.poppins(fontSize: 16),
        ),
      ),
    );
  }
}
