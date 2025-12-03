import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import '../services/api_service.dart';
import 'dart:math' as math;

class IncidentHeatmapPage extends StatefulWidget {
  const IncidentHeatmapPage({super.key});

  @override
  State<IncidentHeatmapPage> createState() => _IncidentHeatmapPageState();
}

class _IncidentHeatmapPageState extends State<IncidentHeatmapPage> {
  final MapController _mapController = MapController();
  List<Map<String, dynamic>> _alerts = [];
  Position? _currentPosition;
  bool _loading = true;
  String _selectedFilter = 'all';

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);
    try {
      final results = await Future.wait([
        ApiService.getAlerts(),
        Geolocator.getCurrentPosition(),
      ]);

      if (mounted) {
        setState(() {
          _alerts = (results[0] as List).cast<Map<String, dynamic>>();
          _currentPosition = results[1] as Position?;
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _loading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error loading data: $e')),
        );
      }
    }
  }

  List<Map<String, dynamic>> get _filteredAlerts {
    if (_selectedFilter == 'all') return _alerts;
    return _alerts.where((a) => a['alertType'] == _selectedFilter).toList();
  }

  Map<String, List<Map<String, dynamic>>> get _clusteredAlerts {
    final clusters = <String, List<Map<String, dynamic>>>{};
    const clusterRadius = 0.01; // ~1km

    for (final alert in _filteredAlerts) {
      if (alert['location'] == null || alert['location']['coordinates'] == null) continue;
      
      final coords = alert['location']['coordinates'];
      final lat = (coords[1] / clusterRadius).round() * clusterRadius;
      final lng = (coords[0] / clusterRadius).round() * clusterRadius;
      final key = '$lat,$lng';

      clusters.putIfAbsent(key, () => []).add(alert);
    }

    return clusters;
  }

  Color _getAlertColor(String? type) {
    switch (type) {
      case 'emergency':
        return Colors.red;
      case 'earthquake':
        return Colors.orange;
      case 'tsunami':
        return Colors.blue;
      case 'flood':
        return Colors.cyan;
      case 'landslide':
        return Colors.brown;
      case 'fire':
        return Colors.red.shade900;
      case 'medical':
        return Colors.pink;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final clusters = _clusteredAlerts;

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: Text(
          'Incident Heatmap',
          style: GoogleFonts.poppins(fontWeight: FontWeight.w700),
        ),
        elevation: 0,
        backgroundColor: const Color(0xFF667EEA),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _loadData,
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Filter Chips
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _FilterChip(
                          label: 'All',
                          selected: _selectedFilter == 'all',
                          onTap: () => setState(() => _selectedFilter = 'all'),
                        ),
                        const SizedBox(width: 8),
                        _FilterChip(
                          label: 'Emergency',
                          selected: _selectedFilter == 'emergency',
                          onTap: () => setState(() => _selectedFilter = 'emergency'),
                        ),
                        const SizedBox(width: 8),
                        _FilterChip(
                          label: 'Medical',
                          selected: _selectedFilter == 'medical',
                          onTap: () => setState(() => _selectedFilter = 'medical'),
                        ),
                        const SizedBox(width: 8),
                        _FilterChip(
                          label: 'Fire',
                          selected: _selectedFilter == 'fire',
                          onTap: () => setState(() => _selectedFilter = 'fire'),
                        ),
                      ],
                    ),
                  ),
                ),

                // Map
                Expanded(
                  child: FlutterMap(
                    mapController: _mapController,
                    options: MapOptions(
                      initialCenter: _currentPosition != null
                          ? LatLng(_currentPosition!.latitude, _currentPosition!.longitude)
                          : LatLng(11.6854, 76.1320), // Wayanad center
                      initialZoom: 12.0,
                    ),
                    children: [
                      TileLayer(
                        urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                        userAgentPackageName: 'com.smartwayanad.app',
                      ),
                      // Current Location Marker
                      if (_currentPosition != null)
                        MarkerLayer(
                          markers: [
                            Marker(
                              point: LatLng(_currentPosition!.latitude, _currentPosition!.longitude),
                              width: 40,
                              height: 40,
                              child: Container(
                                decoration: BoxDecoration(
                                  color: Colors.blue,
                                  shape: BoxShape.circle,
                                  border: Border.all(color: Colors.white, width: 3),
                                ),
                                child: const Icon(Icons.my_location, color: Colors.white, size: 20),
                              ),
                            ),
                          ],
                        ),
                      // Cluster Markers
                      MarkerLayer(
                        markers: clusters.entries.map((entry) {
                          final clusterAlerts = entry.value;
                          final coords = entry.key.split(',');
                          final lat = double.parse(coords[0]);
                          final lng = double.parse(coords[1]);
                          final count = clusterAlerts.length;
                          final primaryType = clusterAlerts.first['alertType'] ?? 'emergency';

                          return Marker(
                            point: LatLng(lat, lng),
                            width: math.max(40.0, 30.0 + count * 5),
                            height: math.max(40.0, 30.0 + count * 5),
                            child: GestureDetector(
                              onTap: () {
                                showDialog(
                                  context: context,
                                  builder: (context) => AlertDialog(
                                    title: Text('Incident Cluster', style: GoogleFonts.poppins()),
                                    content: Column(
                                      mainAxisSize: MainAxisSize.min,
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text('${clusterAlerts.length} incidents in this area', style: GoogleFonts.poppins()),
                                        const SizedBox(height: 8),
                                        ...clusterAlerts.take(5).map((alert) => Padding(
                                          padding: const EdgeInsets.only(bottom: 4),
                                          child: Text(
                                            '• ${alert['message'] ?? 'No message'}',
                                            style: GoogleFonts.poppins(fontSize: 12),
                                          ),
                                        )),
                                      ],
                                    ),
                                    actions: [
                                      TextButton(
                                        onPressed: () => Navigator.pop(context),
                                        child: Text('Close', style: GoogleFonts.poppins()),
                                      ),
                                    ],
                                  ),
                                );
                              },
                              child: Container(
                                decoration: BoxDecoration(
                                  color: _getAlertColor(primaryType).withValues(alpha: 0.8),
                                  shape: BoxShape.circle,
                                  border: Border.all(color: Colors.white, width: 2),
                                ),
                                child: Center(
                                  child: Text(
                                    count > 9 ? '9+' : count.toString(),
                                    style: GoogleFonts.poppins(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w800,
                                      fontSize: count > 9 ? 14 : 16,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                    ],
                  ),
                ),

                // Legend
                Container(
                  padding: const EdgeInsets.all(16),
                  color: Colors.white,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Legend',
                        style: GoogleFonts.poppins(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 16,
                        runSpacing: 8,
                        children: [
                          _LegendItem(color: Colors.red, label: 'Emergency'),
                          _LegendItem(color: Colors.pink, label: 'Medical'),
                          _LegendItem(color: Colors.orange, label: 'Earthquake'),
                          _LegendItem(color: Colors.blue, label: 'Tsunami'),
                          _LegendItem(color: Colors.cyan, label: 'Flood'),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: selected ? const Color(0xFF667EEA) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: selected ? const Color(0xFF667EEA) : Colors.grey.shade300,
          ),
        ),
        child: Text(
          label,
          style: GoogleFonts.poppins(
            color: selected ? Colors.white : Colors.grey.shade700,
            fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
          ),
        ),
      ),
    );
  }
}

class _LegendItem extends StatelessWidget {
  final Color color;
  final String label;

  const _LegendItem({required this.color, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 16,
          height: 16,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 4),
        Text(
          label,
          style: GoogleFonts.poppins(fontSize: 12),
        ),
      ],
    );
  }
}

