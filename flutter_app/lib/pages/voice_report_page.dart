import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:geolocator/geolocator.dart';
import '../constants/branding.dart';
import 'dart:io' show Platform;
import 'dart:async';

class VoiceReportPage extends StatefulWidget {
  final Map user;
  const VoiceReportPage({super.key, required this.user});

  @override
  State<VoiceReportPage> createState() => _VoiceReportPageState();
}

class _VoiceReportPageState extends State<VoiceReportPage> {
  bool _isRecording = false;
  String? _audioPath;
  Duration _duration = Duration.zero;
  Position? _location;
  bool _locationEnabled = true;
  Timer? _durationTimer;

  @override
  void initState() {
    super.initState();
    _getLocation();
  }

  @override
  void dispose() {
    _durationTimer?.cancel();
    super.dispose();
  }

  Future<void> _getLocation() async {
    try {
      final position = await Geolocator.getCurrentPosition();
      setState(() => _location = position);
    } catch (e) {
      print('Location error: $e');
    }
  }

  Future<void> _startRecording() async {
    // Voice recording not available on Windows/Linux
    if (Platform.isWindows || Platform.isLinux) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Voice recording is not available on Windows/Linux. Please use the SOS feature for text-based reporting.'),
          duration: const Duration(seconds: 3),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    // Simulate recording for demo purposes
    setState(() {
      _isRecording = true;
      _audioPath = 'recording.m4a';
      _duration = Duration.zero;
    });
    _updateDuration();
  }

  void _updateDuration() {
    if (_isRecording) {
      _durationTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
        if (mounted && _isRecording) {
          setState(() {
            _duration = Duration(seconds: _duration.inSeconds + 1);
          });
        } else {
          timer.cancel();
        }
      });
    }
  }

  Future<void> _stopRecording() async {
    _durationTimer?.cancel();
    setState(() {
      _isRecording = false;
    });
  }

  String _formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, '0');
    final minutes = twoDigits(duration.inMinutes.remainder(60));
    final seconds = twoDigits(duration.inSeconds.remainder(60));
    return '$minutes:$seconds';
  }

  Future<void> _submitReport() async {
    if (Platform.isWindows || Platform.isLinux) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Voice reporting is not available on Windows/Linux. Please use the SOS feature for text-based reporting.'),
          duration: const Duration(seconds: 3),
        ),
      );
      Navigator.pop(context);
      return;
    }

    if (_audioPath == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please record a voice message first')),
      );
      return;
    }

    try {
      // TODO: Upload audio file and send report
      await Future.delayed(const Duration(seconds: 1));

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Voice report submitted successfully! 🎉'),
            backgroundColor: AppPalette.leaf,
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error submitting report: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isUnsupported = Platform.isWindows || Platform.isLinux;

    return Scaffold(
      backgroundColor: AppPalette.screenBackground,
      appBar: AppBar(
        title: Text(
          'Voice Report',
          style: GoogleFonts.poppins(fontWeight: FontWeight.w700),
        ),
        elevation: 0,
        backgroundColor: AppPalette.pine,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          Expanded(
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Warning for unsupported platforms
                  if (isUnsupported)
                    Container(
                      margin: const EdgeInsets.all(20),
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.orange.shade50,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.orange.shade200),
                      ),
                      child: Column(
                        children: [
                          Icon(Icons.info_rounded, color: Colors.orange, size: 48),
                          const SizedBox(height: 12),
                          Text(
                            'Voice Recording Not Available',
                            style: GoogleFonts.poppins(
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                              color: Colors.orange.shade900,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Voice recording is not supported on Windows/Linux. Please use the SOS feature for text-based emergency reporting.',
                            textAlign: TextAlign.center,
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              color: Colors.orange.shade800,
                            ),
                          ),
                        ],
                      ),
                    )
                  else ...[
                    // Recording Indicator
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      width: _isRecording ? 200 : 150,
                      height: _isRecording ? 200 : 150,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: _isRecording ? Colors.red : AppPalette.leaf,
                        boxShadow: _isRecording
                            ? [
                                BoxShadow(
                                  color: Colors.red.withValues(alpha: 0.5),
                                  blurRadius: 30,
                                  spreadRadius: 10,
                                ),
                              ]
                            : [],
                      ),
                      child: Icon(
                        _isRecording ? Icons.mic_rounded : Icons.mic_none_rounded,
                        size: 80,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 32),
                    Text(
                      _isRecording ? 'Recording...' : 'Tap to Record',
                      style: GoogleFonts.poppins(
                        fontSize: 24,
                        fontWeight: FontWeight.w700,
                        color: Colors.grey.shade900,
                      ),
                    ),
                    if (_isRecording) ...[
                      const SizedBox(height: 16),
                      Text(
                        _formatDuration(_duration),
                        style: GoogleFonts.poppins(
                          fontSize: 32,
                          fontWeight: FontWeight.w800,
                          color: Colors.red,
                        ),
                      ),
                    ],
                    if (_audioPath != null && !_isRecording) ...[
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.check_circle_rounded, color: AppPalette.leaf),
                          const SizedBox(width: 8),
                          Text(
                            'Recording saved',
                            style: GoogleFonts.poppins(color: AppPalette.leaf),
                          ),
                        ],
                      ),
                    ],
                  ],
                ],
              ),
            ),
          ),

          // Location Info
          if (_location != null && _locationEnabled)
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 10,
                  ),
                ],
              ),
              child: Row(
                children: [
                  Icon(Icons.location_on_rounded, color: AppPalette.leaf),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Location',
                          style: GoogleFonts.poppins(
                            fontSize: 12,
                            color: Colors.grey.shade600,
                          ),
                        ),
                        Text(
                          '${_location!.latitude.toStringAsFixed(4)}, ${_location!.longitude.toStringAsFixed(4)}',
                          style: GoogleFonts.poppins(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

          // Control Buttons
          Container(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: isUnsupported
                        ? () {
                            Navigator.pop(context);
                            // Navigate to SOS page
                          }
                        : (_isRecording ? _stopRecording : _startRecording),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isUnsupported
                          ? Colors.grey
                          : (_isRecording ? Colors.red : AppPalette.leaf),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          isUnsupported
                              ? Icons.arrow_back_rounded
                              : (_isRecording ? Icons.stop_rounded : Icons.mic_rounded),
                          color: Colors.white,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          isUnsupported
                              ? 'Go to SOS Feature'
                              : (_isRecording ? 'Stop Recording' : 'Start Recording'),
                          style: GoogleFonts.poppins(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                if (_audioPath != null && !_isRecording && !isUnsupported) ...[
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _submitReport,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppPalette.leaf,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        'Submit Report',
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
