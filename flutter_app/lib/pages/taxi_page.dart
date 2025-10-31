import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class TaxiPage extends StatelessWidget {
  const TaxiPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Taxi Stands")),
      body: Center(
        child: Text(
          "Nearby taxi and auto stands will be listed here.",
          textAlign: TextAlign.center,
          style: GoogleFonts.poppins(fontSize: 16),
        ),
      ),
    );
  }
}
