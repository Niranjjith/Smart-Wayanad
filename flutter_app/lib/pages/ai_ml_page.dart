import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'dart:io';
import 'dart:math' as math;
import 'dart:async';

class AIMLPage extends StatefulWidget {
  const AIMLPage({super.key});

  @override
  State<AIMLPage> createState() => _AIMLPageState();
}

class _AIMLPageState extends State<AIMLPage> with TickerProviderStateMixin {
  bool _loading = true;
  Map<String, dynamic>? _predictions;
  Map<String, dynamic>? _anomalies;
  Timer? _refreshTimer;
  IO.Socket? _socket;
  late AnimationController _pulseController;
  late AnimationController _rotationController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
    
    _rotationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 10),
    )..repeat();
    
    loadData();
    setupSocket();
    // Auto-refresh every 30 seconds
    _refreshTimer = Timer.periodic(const Duration(seconds: 30), (_) => loadData());
  }

  void setupSocket() {
    try {
      // Use the same base URL logic as API service
      final baseUrl = (Platform.isWindows || Platform.isMacOS) 
          ? 'http://localhost:5000' 
          : 'http://192.168.1.2:5000';
      _socket = IO.io(baseUrl, <String, dynamic>{
        'transports': ['websocket'],
        'autoConnect': true,
      });

      _socket!.onConnect((_) {
        print('✅ Connected to real-time server');
        _socket!.emit('analytics:subscribe');
      });

      _socket!.on('analytics:update', (data) {
        if (mounted && data != null) {
          setState(() {
            // Update real-time data
            if (data['riskLevel'] != null) {
              _predictions = {
                ...?_predictions,
                'predictions': {
                  ...?_predictions?['predictions'],
                  'riskLevel': data['riskLevel'],
                },
                'totalAlerts': data['totalAlerts'] ?? _predictions?['totalAlerts'],
              };
            }
          });
        }
      });

      _socket!.on('alert:new', (_) {
        loadData(); // Reload on new alert
      });

      _socket!.onDisconnect((_) {
        print('❌ Disconnected from real-time server');
      });
    } catch (e) {
      print('Socket connection error: $e');
    }
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    _socket?.disconnect();
    _socket?.dispose();
    _pulseController.dispose();
    _rotationController.dispose();
    super.dispose();
  }

  Future<void> loadData() async {
    setState(() => _loading = true);
    try {
      final [predictions, anomalies] = await Future.wait([
        ApiService.getAlertPredictions(),
        ApiService.detectAnomalies(),
      ]);
      
      if (mounted) {
        setState(() {
          _predictions = predictions;
          _anomalies = anomalies;
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _loading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load AI data: $e')),
        );
      }
    }
  }

  Color _getRiskColor(String? risk) {
    switch (risk) {
      case 'high':
        return Colors.red;
      case 'medium':
        return Colors.orange;
      case 'low':
        return Colors.blue;
      default:
        return Colors.green;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: CustomScrollView(
        slivers: [
          // Premium App Bar
          SliverAppBar(
            expandedHeight: 220,
            floating: false,
            pinned: true,
            elevation: 0,
            backgroundColor: Colors.transparent,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.white),
              onPressed: () => Navigator.pop(context),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      const Color(0xFF667EEA),
                      const Color(0xFF764BA2),
                      const Color(0xFFF093FB),
                    ],
                  ),
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(
                                Icons.psychology_rounded,
                                color: Colors.white,
                                size: 28,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'AI/ML Features',
                                    style: GoogleFonts.poppins(
                                      color: Colors.white,
                                      fontSize: 28,
                                      fontWeight: FontWeight.w800,
                                      letterSpacing: -0.5,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Real-time predictions & analytics',
                                    style: GoogleFonts.poppins(
                                      color: Colors.white.withValues(alpha: 0.9),
                                      fontSize: 14,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.refresh_rounded, color: Colors.white),
                              onPressed: loadData,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),

          // Content
          if (_loading)
            SliverFillRemaining(
              child: Center(
                child: CircularProgressIndicator(
                  color: const Color(0xFF667EEA),
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.all(20.0),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  // Risk Assessment Card
                  if (_predictions != null) ...[
                    _RiskCard(
                      riskLevel: _predictions!['predictions']?['riskLevel'] ?? 'normal',
                      expectedAlerts: _predictions!['predictions']?['expectedAlertsToday'] ?? 0,
                      totalAlerts: _predictions!['totalAlerts'] ?? 0,
                      pulseController: _pulseController,
                    ),
                    const SizedBox(height: 20),
                  ],

                  // Predictions Card
                  if (_predictions != null) ...[
                    _PredictionsCard(predictions: _predictions!),
                    const SizedBox(height: 20),
                  ],

                  // Anomalies Card
                  if (_anomalies != null) ...[
                    _AnomaliesCard(anomalies: _anomalies!),
                    const SizedBox(height: 20),
                  ],

                  // High Risk Areas
                  if (_predictions?['highRiskAreas'] != null &&
                      (_predictions!['highRiskAreas'] as List).isNotEmpty) ...[
                    Text(
                      "High Risk Areas (ML-Detected)",
                      style: GoogleFonts.poppins(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: Colors.grey.shade900,
                      ),
                    ),
                    const SizedBox(height: 16),
                    ...(_predictions!['highRiskAreas'] as List).map((area) => _RiskAreaCard(area: area)),
                  ],
                ]),
              ),
            ),
        ],
      ),
    );
  }
}

class _RiskCard extends StatelessWidget {
  final String riskLevel;
  final int expectedAlerts;
  final int totalAlerts;
  final AnimationController pulseController;

  const _RiskCard({
    required this.riskLevel,
    required this.expectedAlerts,
    required this.totalAlerts,
    required this.pulseController,
  });

  @override
  Widget build(BuildContext context) {
    final riskColor = {
      'high': Colors.red,
      'medium': Colors.orange,
      'low': Colors.blue,
    }[riskLevel] ?? Colors.green;

    return AnimatedBuilder(
      animation: pulseController,
      builder: (context, child) {
        return Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                riskColor,
                riskColor.withValues(alpha: 0.8),
              ],
            ),
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: riskColor.withValues(alpha: 0.4 + pulseController.value * 0.2),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.psychology_rounded, color: Colors.white, size: 32),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Real-Time Risk Assessment',
                      style: GoogleFonts.poppins(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Text(
                riskLevel.toUpperCase(),
                style: GoogleFonts.poppins(
                  color: Colors.white,
                  fontSize: 36,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _StatItem(
                    label: 'Total Alerts',
                    value: totalAlerts.toString(),
                    color: Colors.white,
                  ),
                  _StatItem(
                    label: 'Expected Today',
                    value: expectedAlerts.toString(),
                    color: Colors.white,
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}

class _StatItem extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _StatItem({
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          value,
          style: GoogleFonts.poppins(
            color: color,
            fontSize: 24,
            fontWeight: FontWeight.w800,
          ),
        ),
        Text(
          label,
          style: GoogleFonts.poppins(
            color: color.withValues(alpha: 0.9),
            fontSize: 12,
          ),
        ),
      ],
    );
  }
}

class _PredictionsCard extends StatelessWidget {
  final Map<String, dynamic> predictions;

  const _PredictionsCard({required this.predictions});

  @override
  Widget build(BuildContext context) {
    final peakHours = predictions['peakHours'] as List? ?? [];
    final nextPeak = predictions['predictions']?['nextPeakHour'] ?? 12;

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      const Color(0xFF4FACFE),
                      const Color(0xFF00F2FE),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.trending_up_rounded, color: Colors.white, size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  'ML Predictions',
                  style: GoogleFonts.poppins(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    color: Colors.grey.shade900,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          if (peakHours.isNotEmpty) ...[
            Text(
              'Peak Hours',
              style: GoogleFonts.poppins(
                fontSize: 14,
                color: Colors.grey.shade600,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: peakHours.map((hour) {
                final isNext = hour == nextPeak;
                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: isNext ? const Color(0xFF4FACFE) : Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    '$hour:00',
                    style: GoogleFonts.poppins(
                      color: isNext ? Colors.white : Colors.grey.shade700,
                      fontWeight: isNext ? FontWeight.w700 : FontWeight.w500,
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 16),
          ],
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.blue.shade50,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                const Icon(Icons.schedule_rounded, color: Color(0xFF4FACFE)),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Next peak hour: $nextPeak:00',
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Colors.grey.shade900,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _AnomaliesCard extends StatelessWidget {
  final Map<String, dynamic> anomalies;

  const _AnomaliesCard({required this.anomalies});

  @override
  Widget build(BuildContext context) {
    final anomalyList = anomalies['anomalies'] as List? ?? [];
    final riskAssessment = anomalies['riskAssessment'] as Map? ?? {};

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.red.shade400,
                      Colors.red.shade600,
                    ],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.warning_rounded, color: Colors.white, size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  'Anomaly Detection',
                  style: GoogleFonts.poppins(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    color: Colors.grey.shade900,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: anomalyList.isEmpty ? Colors.green : Colors.red,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  '${anomalyList.length}',
                  style: GoogleFonts.poppins(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: (riskAssessment['level'] == 'high' ? Colors.red : Colors.green).shade50,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: (riskAssessment['level'] == 'high' ? Colors.red : Colors.green).shade200,
                width: 2,
              ),
            ),
            child: Row(
              children: [
                Icon(
                  riskAssessment['level'] == 'high' ? Icons.error_rounded : Icons.check_circle_rounded,
                  color: riskAssessment['level'] == 'high' ? Colors.red : Colors.green,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    riskAssessment['message'] ?? 'All systems normal',
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey.shade900,
                    ),
                  ),
                ),
              ],
            ),
          ),
          if (anomalyList.isNotEmpty) ...[
            const SizedBox(height: 16),
            ...anomalyList.map((anomaly) => Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.red.shade50,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.red.shade200),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        anomaly['message'] ?? 'Anomaly detected',
                        style: GoogleFonts.poppins(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: Colors.red.shade900,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Hour: ${anomaly['hour']}:00 | Count: ${anomaly['count']}',
                        style: GoogleFonts.poppins(
                          fontSize: 12,
                          color: Colors.red.shade700,
                        ),
                      ),
                    ],
                  ),
                )),
          ],
        ],
      ),
    );
  }
}

class _RiskAreaCard extends StatelessWidget {
  final Map<String, dynamic> area;

  const _RiskAreaCard({required this.area});

  @override
  Widget build(BuildContext context) {
    final riskLevel = area['riskLevel'] ?? 'low';
    final riskColor = {
      'high': Colors.red,
      'medium': Colors.orange,
      'low': Colors.blue,
    }[riskLevel] ?? Colors.grey;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: riskColor.shade200, width: 2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: riskColor.shade50,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(Icons.location_on_rounded, color: riskColor, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${area['coordinates'][0]}, ${area['coordinates'][1]}',
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: Colors.grey.shade900,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${area['alertCount']} alerts detected',
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    color: Colors.grey.shade600,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: riskColor,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              riskLevel.toUpperCase(),
              style: GoogleFonts.poppins(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

