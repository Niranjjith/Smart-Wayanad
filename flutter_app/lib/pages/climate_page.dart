import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ClimatePage extends StatefulWidget {
  const ClimatePage({super.key});

  @override
  State<ClimatePage> createState() => _ClimatePageState();
}

class _ClimatePageState extends State<ClimatePage> {
  Map? data;
  bool loading = true;

  Future<void> _load() async {
    setState(() => loading = true);
    data = await ApiService.getClimate();
    setState(() => loading = false);
  }

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  Widget build(BuildContext context) {
    final t = data?['temp'];
    final desc = data?['description'];
    final hum = data?['humidity'];
    final wind = data?['wind'];
    final city = data?['city'] ?? "Wayanad";

    return Scaffold(
      appBar: AppBar(title: const Text("Climate Info")),
      body: Center(
        child: loading
            ? const CircularProgressIndicator()
            : Card(
                elevation: 3,
                margin: const EdgeInsets.all(24),
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text("$city", style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text("${t ?? '--'}°C • ${desc ?? '--'}", style: const TextStyle(fontSize: 18)),
                      const SizedBox(height: 8),
                      Text("Humidity: ${hum ?? '--'}%  |  Wind: ${wind ?? '--'} km/h"),
                      const SizedBox(height: 16),
                      ElevatedButton(onPressed: _load, child: const Text("Refresh")),
                    ],
                  ),
                ),
              ),
      ),
    );
  }
}
