import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/location_service.dart';

class HelpPage extends StatefulWidget {
  final Map user;
  const HelpPage({super.key, required this.user});

  @override
  State<HelpPage> createState() => _HelpPageState();
}

class _HelpPageState extends State<HelpPage> {
  final _messageController = TextEditingController();
  bool _loading = false;
  double? _lat;
  double? _lng;

  /// 📍 Get user location
  Future<void> _getLocation() async {
    final allowed = await LocationService.ensurePermission();
    if (!allowed) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please enable location permissions.")),
      );
      return;
    }

    final pos = await LocationService.currentPosition();
    if (pos != null) {
      setState(() {
        _lat = pos.latitude;
        _lng = pos.longitude;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            "Location: ${_lat!.toStringAsFixed(3)}, ${_lng!.toStringAsFixed(3)}",
          ),
        ),
      );
    }
  }

  /// 🚨 Send SOS Help alert
  Future<void> _sendHelp() async {
    if (_messageController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please enter your message")),
      );
      return;
    }

    if (_lat == null || _lng == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please fetch your location first")),
      );
      return;
    }

    setState(() => _loading = true);

    final success = await ApiService.sendHelp(
      name: widget.user['name'],
      message: _messageController.text.trim(),
      lat: _lat!,
      lng: _lng!,
    );

    setState(() => _loading = false);

    if (!success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("❌ Failed to send alert")),
      );
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("✅ Alert sent successfully")),
    );

    _messageController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        backgroundColor: Colors.green[700],
        title: const Text("Emergency Help", style: TextStyle(color: Colors.white)),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Need Immediate Help?",
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            const Text(
              "Send an SOS alert with your location. Admin will be notified instantly.",
              style: TextStyle(color: Colors.black54),
            ),
            const SizedBox(height: 24),

            // Emergency Message Box
            TextField(
              controller: _messageController,
              decoration: const InputDecoration(
                labelText: "Describe your emergency",
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.warning_amber_rounded),
              ),
              minLines: 2,
              maxLines: 5,
            ),

            const SizedBox(height: 24),

            // Get location button
            OutlinedButton.icon(
              onPressed: _getLocation,
              icon: const Icon(Icons.my_location),
              label: Text(
                _lat == null
                    ? "Get My Location"
                    : "Location: ${_lat!.toStringAsFixed(3)}, ${_lng!.toStringAsFixed(3)}",
              ),
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: Colors.green.shade700),
                foregroundColor: Colors.green.shade800,
                minimumSize: const Size.fromHeight(50),
              ),
            ),

            const SizedBox(height: 24),

            // Send Alert Button
            _loading
                ? const Center(child: CircularProgressIndicator())
                : ElevatedButton.icon(
                    onPressed: _sendHelp,
                    icon: const Icon(Icons.sos),
                    label: const Text(
                      "Send Help Alert",
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red[700],
                      foregroundColor: Colors.white,
                      minimumSize: const Size.fromHeight(55),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
          ],
        ),
      ),
    );
  }
}
