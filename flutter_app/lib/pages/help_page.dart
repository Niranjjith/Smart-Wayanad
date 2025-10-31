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

    final position = await LocationService.currentPosition();
    if (position != null) {
      setState(() {
        _lat = position.latitude;
        _lng = position.longitude;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Location detected (${_lat!.toStringAsFixed(3)}, ${_lng!.toStringAsFixed(3)})")),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Unable to fetch location")),
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
      name: widget.user['name'] ?? 'User',
      message: _messageController.text.trim(),
      lat: _lat!,
      lng: _lng!,
    );

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("✅ Help alert sent successfully!")),
      );
      _messageController.clear();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("❌ Failed to send help alert.")),
      );
    }

    setState(() => _loading = false);
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
            const SizedBox(height: 8),
            const Text(
              "Send an SOS alert with your location and a short message. Admin will be notified immediately.",
              style: TextStyle(color: Colors.black54),
            ),
            const SizedBox(height: 24),
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
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _getLocation,
                    icon: const Icon(Icons.location_on_outlined),
                    label: const Text("Get My Location"),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: Colors.green.shade700),
                      foregroundColor: Colors.green.shade800,
                      minimumSize: const Size.fromHeight(48),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            _loading
                ? const Center(child: CircularProgressIndicator())
                : ElevatedButton.icon(
                    onPressed: _sendHelp,
                    icon: const Icon(Icons.send_rounded),
                    label: const Text(
                      "Send Help Alert",
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green[700],
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
