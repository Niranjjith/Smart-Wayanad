import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:camera/camera.dart';
import 'package:geolocator/geolocator.dart';
import 'dart:math' as math;

class ARNavigationPage extends StatefulWidget {
  const ARNavigationPage({super.key});

  @override
  State<ARNavigationPage> createState() => _ARNavigationPageState();
}

class _ARNavigationPageState extends State<ARNavigationPage> {
  CameraController? _controller;
  List<CameraDescription>? _cameras;
  bool _isInitialized = false;
  Position? _currentPosition;
  List<Map<String, dynamic>> _nearbyServices = [];

  @override
  void initState() {
    super.initState();
    _initializeCamera();
    _getCurrentLocation();
  }

  Future<void> _initializeCamera() async {
    try {
      _cameras = await availableCameras();
      if (_cameras != null && _cameras!.isNotEmpty) {
        _controller = CameraController(
          _cameras![0],
          ResolutionPreset.high,
        );
        await _controller!.initialize();
        if (mounted) {
          setState(() => _isInitialized = true);
        }
      }
    } catch (e) {
      print('Camera initialization error: $e');
    }
  }

  Future<void> _getCurrentLocation() async {
    try {
      final position = await Geolocator.getCurrentPosition();
      setState(() => _currentPosition = position);
      _loadNearbyServices(position);
    } catch (e) {
      print('Location error: $e');
    }
  }

  void _loadNearbyServices(Position position) {
    // Mock nearby services - replace with actual API call
    setState(() {
      _nearbyServices = [
        {
          'name': 'District Hospital',
          'type': 'hospital',
          'distance': 0.5,
          'bearing': 45,
          'icon': Icons.local_hospital_rounded,
        },
        {
          'name': 'Police Station',
          'type': 'police',
          'distance': 0.8,
          'bearing': 120,
          'icon': Icons.local_police_rounded,
        },
        {
          'name': 'Fire Station',
          'type': 'fire',
          'distance': 1.2,
          'bearing': 200,
          'icon': Icons.fire_truck_rounded,
        },
        {
          'name': 'Bus Stand',
          'type': 'bus',
          'distance': 0.3,
          'bearing': 90,
          'icon': Icons.directions_bus_rounded,
        },
      ];
    });
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Camera Preview
          if (_isInitialized && _controller != null)
            SizedBox(
              width: double.infinity,
              height: double.infinity,
              child: CameraPreview(_controller!),
            )
          else
            Container(
              color: Colors.black,
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const CircularProgressIndicator(color: Colors.white),
                    const SizedBox(height: 16),
                    Text(
                      'Initializing AR Camera...',
                      style: GoogleFonts.poppins(color: Colors.white),
                    ),
                  ],
                ),
              ),
            ),

          // AR Overlay
          if (_isInitialized)
            ..._nearbyServices.map((service) => _ARMarker(
                  service: service,
                  screenWidth: MediaQuery.of(context).size.width,
                  screenHeight: MediaQuery.of(context).size.height,
                )),

          // Top Info Bar
          SafeArea(
            child: Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.7),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.location_on_rounded, color: Colors.white),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _currentPosition != null
                              ? '${_currentPosition!.latitude.toStringAsFixed(4)}, ${_currentPosition!.longitude.toStringAsFixed(4)}'
                              : 'Getting location...',
                          style: GoogleFonts.poppins(color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${_nearbyServices.length} services nearby',
                    style: GoogleFonts.poppins(
                      color: Colors.white70,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Bottom Services List
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              height: 200,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black.withValues(alpha: 0.9),
                  ],
                ),
              ),
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                itemCount: _nearbyServices.length,
                itemBuilder: (context, index) {
                  final service = _nearbyServices[index];
                  return Container(
                    width: 150,
                    margin: const EdgeInsets.only(right: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.9),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(service['icon'], color: const Color(0xFF667EEA)),
                        const SizedBox(height: 8),
                        Text(
                          service['name'],
                          style: GoogleFonts.poppins(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                          ),
                          textAlign: TextAlign.center,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${service['distance']} km',
                          style: GoogleFonts.poppins(
                            fontSize: 10,
                            color: Colors.grey.shade600,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ARMarker extends StatelessWidget {
  final Map<String, dynamic> service;
  final double screenWidth;
  final double screenHeight;

  const _ARMarker({
    required this.service,
    required this.screenWidth,
    required this.screenHeight,
  });

  @override
  Widget build(BuildContext context) {
    // Calculate position based on bearing (simplified AR positioning)
    final bearing = service['bearing'] as double;
    final distance = service['distance'] as double;
    
    // Convert bearing to screen coordinates (simplified)
    final angle = (bearing * math.pi) / 180;
    final centerX = screenWidth / 2;
    final centerY = screenHeight / 2;
    final radius = math.min(screenWidth, screenHeight) * 0.3;
    
    final x = centerX + radius * math.cos(angle) * (1 / (distance + 0.1));
    final y = centerY + radius * math.sin(angle) * (1 / (distance + 0.1));

    return Positioned(
      left: x - 30,
      top: y - 30,
      child: GestureDetector(
        onTap: () {
          showDialog(
            context: context,
            builder: (context) => AlertDialog(
              title: Text(service['name'], style: GoogleFonts.poppins()),
              content: Text(
                'Distance: ${service['distance']} km\nDirection: ${service['bearing'].toStringAsFixed(0)}°',
                style: GoogleFonts.poppins(),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text('Close', style: GoogleFonts.poppins()),
                ),
                ElevatedButton(
                  onPressed: () {
                    // TODO: Open navigation
                    Navigator.pop(context);
                  },
                  child: Text('Navigate', style: GoogleFonts.poppins()),
                ),
              ],
            ),
          );
        },
        child: Container(
          width: 60,
          height: 60,
          decoration: BoxDecoration(
            color: const Color(0xFF667EEA).withValues(alpha: 0.8),
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white, width: 3),
          ),
          child: Icon(
            service['icon'],
            color: Colors.white,
            size: 30,
          ),
        ),
      ),
    );
  }
}


