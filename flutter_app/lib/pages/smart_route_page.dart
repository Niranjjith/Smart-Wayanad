import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/branding.dart';
import '../services/api_service.dart';
import 'dart:math' as math;

class SmartRoutePage extends StatefulWidget {
  const SmartRoutePage({super.key});

  @override
  State<SmartRoutePage> createState() => _SmartRoutePageState();
}

class _SmartRoutePageState extends State<SmartRoutePage> {
  final _queryController = TextEditingController();
  final _originController = TextEditingController();
  final _destinationController = TextEditingController();
  bool _loading = false;
  List _recommendations = [];
  Map? _bestRoute;
  int _totalRoutes = 0;
  int _totalRoutesInSystem = 0;
  bool _useQuerySearch = true; // Toggle between query and origin-destination

  Future<void> _searchRoutes() async {
    if (_useQuerySearch) {
      if (_queryController.text.trim().isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text("Please enter a search query"),
            backgroundColor: Colors.orange,
          ),
        );
        return;
      }
    } else {
      if (_originController.text.trim().isEmpty ||
          _destinationController.text.trim().isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text("Please enter both origin and destination"),
            backgroundColor: Colors.orange,
          ),
        );
        return;
      }
    }

    setState(() => _loading = true);
    try {
      final data = await ApiService.getRouteRecommendations(
        origin: _useQuerySearch ? null : _originController.text.trim(),
        destination: _useQuerySearch ? null : _destinationController.text.trim(),
        query: _useQuerySearch ? _queryController.text.trim() : null,
      );
      
      if (data != null && mounted) {
        setState(() {
          _recommendations = data['recommendations'] ?? [];
          _bestRoute = data['bestRoute'];
          _totalRoutes = data['totalRoutes'] ?? data['totalMatches'] ?? 0;
          _totalRoutesInSystem = data['totalRoutesInSystem'] ?? 0;
        });
        
        if (_recommendations.isEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text("No routes found. Try different search terms."),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Error: ${e.toString()}"),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  @override
  void dispose() {
    _queryController.dispose();
    _originController.dispose();
    _destinationController.dispose();
    super.dispose();
  }

  String _getRoadStatusColor(String status) {
    switch (status) {
      case 'normal':
        return '#10B981'; // Green
      case 'slow':
        return '#F59E0B'; // Orange
      case 'maintenance':
        return '#EF4444'; // Red
      case 'under_construction':
        return '#DC2626'; // Dark Red
      case 'blocked':
        return '#991B1B'; // Very Dark Red
      default:
        return '#6B7280'; // Gray
    }
  }

  String _getRoadStatusLabel(String status) {
    switch (status) {
      case 'normal':
        return 'Normal';
      case 'slow':
        return 'Slow Traffic';
      case 'maintenance':
        return 'Maintenance';
      case 'under_construction':
        return 'Under Construction';
      case 'blocked':
        return 'Blocked';
      default:
        return 'Unknown';
    }
  }

  IconData _getRoadStatusIcon(String status) {
    switch (status) {
      case 'normal':
        return Icons.check_circle_rounded;
      case 'slow':
        return Icons.slow_motion_video_rounded;
      case 'maintenance':
        return Icons.construction_rounded;
      case 'under_construction':
        return Icons.engineering_rounded;
      case 'blocked':
        return Icons.block_rounded;
      default:
        return Icons.help_outline_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppPalette.screenBackground,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200,
            floating: false,
            pinned: true,
            elevation: 0,
            backgroundColor: Colors.transparent,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      AppPalette.leaf,
                      AppPalette.mint,
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
                                Icons.route_rounded,
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
                                    'Smart Route Finder',
                                    style: GoogleFonts.poppins(
                                      color: Colors.white,
                                      fontSize: 28,
                                      fontWeight: FontWeight.w800,
                                      letterSpacing: -0.5,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'AI-powered route search & recommendations',
                                    style: GoogleFonts.poppins(
                                      color: Colors.white.withValues(alpha: 0.9),
                                      fontSize: 14,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
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
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                children: [
                  // Search Mode Toggle
                  Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
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
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _useQuerySearch = true),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              decoration: BoxDecoration(
                                color: _useQuerySearch
                                    ? const Color(0xFF43E97B)
                                    : Colors.transparent,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Center(
                                child: Text(
                                  "Search Query",
                                  style: GoogleFonts.poppins(
                                    color: _useQuerySearch
                                        ? Colors.white
                                        : Colors.grey.shade600,
                                    fontWeight: FontWeight.w600,
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _useQuerySearch = false),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              decoration: BoxDecoration(
                                color: !_useQuerySearch
                                    ? const Color(0xFF43E97B)
                                    : Colors.transparent,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Center(
                                child: Text(
                                  "Origin-Destination",
                                  style: GoogleFonts.poppins(
                                    color: !_useQuerySearch
                                        ? Colors.white
                                        : Colors.grey.shade600,
                                    fontWeight: FontWeight.w600,
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  
                  // Search Form
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.05),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        if (_useQuerySearch) ...[
                          TextField(
                            controller: _queryController,
                            decoration: InputDecoration(
                              labelText: "Search routes (e.g., 'routes to Kalpetta', 'buses from Mananthavady')",
                              prefixIcon: const Icon(Icons.search_rounded),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                              filled: true,
                              fillColor: Colors.grey.shade50,
                            ),
                            onSubmitted: (_) => _searchRoutes(),
                          ),
                        ] else ...[
                          TextField(
                            controller: _originController,
                            decoration: InputDecoration(
                              labelText: "From (Origin)",
                              prefixIcon: const Icon(Icons.location_on_rounded),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                              filled: true,
                              fillColor: Colors.grey.shade50,
                            ),
                          ),
                          const SizedBox(height: 16),
                          TextField(
                            controller: _destinationController,
                            decoration: InputDecoration(
                              labelText: "To (Destination)",
                              prefixIcon: const Icon(Icons.location_on_rounded),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                              filled: true,
                              fillColor: Colors.grey.shade50,
                            ),
                            onSubmitted: (_) => _searchRoutes(),
                          ),
                        ],
                        const SizedBox(height: 20),
                        Container(
                          width: double.infinity,
                          height: 56,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                const Color(0xFF43E97B),
                                const Color(0xFF38F9D7),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFF43E97B).withValues(alpha: 0.4),
                                blurRadius: 15,
                                offset: const Offset(0, 8),
                              ),
                            ],
                          ),
                          child: ElevatedButton(
                            onPressed: _loading ? null : _searchRoutes,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.transparent,
                              shadowColor: Colors.transparent,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                            ),
                            child: _loading
                                ? const CircularProgressIndicator(
                                    color: Colors.white,
                                  )
                                : Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      const Icon(Icons.search_rounded,
                                          color: Colors.white),
                                      const SizedBox(width: 12),
                                      Text(
                                        "Find Routes",
                                        style: GoogleFonts.poppins(
                                          color: Colors.white,
                                          fontSize: 18,
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                    ],
                                  ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  // Statistics Card
                  if (_totalRoutes > 0 || _totalRoutesInSystem > 0) ...[
                    const SizedBox(height: 20),
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            const Color(0xFF43E97B).withValues(alpha: 0.1),
                            const Color(0xFF38F9D7).withValues(alpha: 0.1),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: const Color(0xFF43E97B).withValues(alpha: 0.3),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _StatItem(
                            icon: Icons.route_rounded,
                            label: "Routes Found",
                            value: _totalRoutes.toString(),
                            color: const Color(0xFF43E97B),
                          ),
                          Container(
                            width: 1,
                            height: 40,
                            color: Colors.grey.shade300,
                          ),
                          _StatItem(
                            icon: Icons.directions_bus_rounded,
                            label: "Total Routes",
                            value: _totalRoutesInSystem.toString(),
                            color: const Color(0xFF38F9D7),
                          ),
                        ],
                      ),
                    ),
                  ],
                  
                  // Best Route Card
                  if (_bestRoute != null) ...[
                    const SizedBox(height: 20),
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            const Color(0xFF43E97B),
                            const Color(0xFF38F9D7),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF43E97B).withValues(alpha: 0.4),
                            blurRadius: 20,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.white.withValues(alpha: 0.3),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Icon(
                                  Icons.star_rounded,
                                  color: Colors.white,
                                  size: 24,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  "Best Recommended Route",
                                  style: GoogleFonts.poppins(
                                    color: Colors.white,
                                    fontSize: 20,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          _RouteInfoCard(
                            route: _bestRoute!,
                            isBest: true,
                            getRoadStatusColor: _getRoadStatusColor,
                            getRoadStatusLabel: _getRoadStatusLabel,
                            getRoadStatusIcon: _getRoadStatusIcon,
                          ),
                        ],
                      ),
                    ),
                  ],
                  
                  const SizedBox(height: 24),
                  
                  // All Routes
                  if (_recommendations.isNotEmpty) ...[
                    Row(
                      children: [
                        Text(
                          "All Available Routes",
                          style: GoogleFonts.poppins(
                            fontSize: 20,
                            fontWeight: FontWeight.w800,
                            color: Colors.grey.shade900,
                          ),
                        ),
                        const Spacer(),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFF43E97B).withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            "${_recommendations.length} routes",
                            style: GoogleFonts.poppins(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: const Color(0xFF43E97B),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    ..._recommendations.asMap().entries.map((entry) {
                      final index = entry.key;
                      final route = entry.value;
                      final isBest = _bestRoute != null && 
                                    route['routeNo'] == _bestRoute!['routeNo'];
                      return _RouteRecommendationCard(
                        route: route,
                        index: index + 1,
                        isBest: isBest,
                        getRoadStatusColor: _getRoadStatusColor,
                        getRoadStatusLabel: _getRoadStatusLabel,
                        getRoadStatusIcon: _getRoadStatusIcon,
                      );
                    }),
                  ] else if (!_loading) ...[
                    Container(
                      padding: const EdgeInsets.all(40),
                      child: Column(
                        children: [
                          Icon(
                            Icons.route_rounded,
                            size: 80,
                            color: Colors.grey.shade300,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            _useQuerySearch
                                ? "Search for routes in Wayanad\n(e.g., 'routes to Kalpetta', 'buses from Mananthavady')"
                                : "Enter origin and destination to find routes",
                            style: GoogleFonts.poppins(
                              fontSize: 16,
                              color: Colors.grey.shade600,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _StatItem({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, color: color, size: 28),
        const SizedBox(height: 8),
        Text(
          value,
          style: GoogleFonts.poppins(
            fontSize: 24,
            fontWeight: FontWeight.w800,
            color: color,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: GoogleFonts.poppins(
            fontSize: 12,
            color: Colors.grey.shade600,
          ),
        ),
      ],
    );
  }
}

class _RouteInfoCard extends StatelessWidget {
  final Map route;
  final bool isBest;
  final Function(String) getRoadStatusColor;
  final Function(String) getRoadStatusLabel;
  final Function(String) getRoadStatusIcon;

  const _RouteInfoCard({
    required this.route,
    required this.isBest,
    required this.getRoadStatusColor,
    required this.getRoadStatusLabel,
    required this.getRoadStatusIcon,
  });

  @override
  Widget build(BuildContext context) {
    final roadStatus = route['roadStatus'] ?? 'normal';
    final statusColor = Color(int.parse(
      getRoadStatusColor(roadStatus).replaceFirst('#', '0xFF'),
    ));
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Route ${route['routeNo'] ?? '--'}",
                      style: GoogleFonts.poppins(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: Colors.grey.shade900,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(
                          Icons.location_on_rounded,
                          size: 16,
                          color: Colors.grey.shade600,
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            "${route['origin'] ?? '--'} → ${route['destination'] ?? '--'}",
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              color: Colors.grey.shade700,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Road Status
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: statusColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: statusColor.withValues(alpha: 0.3)),
            ),
            child: Row(
              children: [
                Icon(
                  getRoadStatusIcon(roadStatus),
                  color: statusColor,
                  size: 20,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Road Status: ${getRoadStatusLabel(roadStatus)}",
                        style: GoogleFonts.poppins(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: statusColor,
                        ),
                      ),
                      if (route['roadStatusMessage'] != null &&
                          route['roadStatusMessage'].toString().isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          route['roadStatusMessage'],
                          style: GoogleFonts.poppins(
                            fontSize: 12,
                            color: Colors.grey.shade600,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),
          // Route Details
          if (route['firstBus'] != null ||
              route['lastBus'] != null ||
              route['frequencyMin'] != null ||
              route['estimatedTime'] != null ||
              route['distance'] != null) ...[
            const SizedBox(height: 12),
            Wrap(
              spacing: 12,
              runSpacing: 8,
              children: [
                if (route['firstBus'] != null)
                  _DetailChip(
                    icon: Icons.schedule_rounded,
                    label: "First Bus",
                    value: route['firstBus'],
                  ),
                if (route['lastBus'] != null)
                  _DetailChip(
                    icon: Icons.schedule_rounded,
                    label: "Last Bus",
                    value: route['lastBus'],
                  ),
                if (route['frequencyMin'] != null)
                  _DetailChip(
                    icon: Icons.timer_rounded,
                    label: "Frequency",
                    value: "${route['frequencyMin']} min",
                  ),
                if (route['estimatedTime'] != null && route['estimatedTime'] > 0)
                  _DetailChip(
                    icon: Icons.access_time_rounded,
                    label: "Est. Time",
                    value: "${route['estimatedTime']} min",
                  ),
                if (route['distance'] != null && route['distance'] > 0)
                  _DetailChip(
                    icon: Icons.straighten_rounded,
                    label: "Distance",
                    value: "${route['distance']} km",
                  ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _RouteRecommendationCard extends StatelessWidget {
  final Map route;
  final int index;
  final bool isBest;
  final Function(String) getRoadStatusColor;
  final Function(String) getRoadStatusLabel;
  final Function(String) getRoadStatusIcon;

  const _RouteRecommendationCard({
    required this.route,
    required this.index,
    required this.isBest,
    required this.getRoadStatusColor,
    required this.getRoadStatusLabel,
    required this.getRoadStatusIcon,
  });

  @override
  Widget build(BuildContext context) {
    final roadStatus = route['roadStatus'] ?? 'normal';
    final statusColor = Color(int.parse(
      getRoadStatusColor(roadStatus).replaceFirst('#', '0xFF'),
    ));
    final confidence = route['confidence'] ?? 0.0;
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isBest
              ? const Color(0xFF43E97B)
              : const Color(0xFF43E97B).withValues(alpha: 0.3),
          width: isBest ? 3 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: isBest
                ? const Color(0xFF43E97B).withValues(alpha: 0.2)
                : Colors.black.withValues(alpha: 0.05),
            blurRadius: isBest ? 15 : 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: isBest
                          ? [const Color(0xFF43E97B), const Color(0xFF38F9D7)]
                          : [Colors.grey.shade300, Colors.grey.shade400],
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    "#$index",
                    style: GoogleFonts.poppins(
                      color: Colors.white,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    "Route ${route['routeNo'] ?? '--'}",
                    style: GoogleFonts.poppins(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: Colors.grey.shade900,
                    ),
                  ),
                ),
                if (isBest)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF43E97B), Color(0xFF38F9D7)],
                      ),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.star_rounded, color: Colors.white, size: 16),
                        const SizedBox(width: 4),
                        Text(
                          "BEST",
                          style: GoogleFonts.poppins(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  )
                else
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.green.shade50,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      "${(confidence * 100).toInt()}% match",
                      style: GoogleFonts.poppins(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: Colors.green.shade700,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "From",
                        style: GoogleFonts.poppins(
                          fontSize: 12,
                          color: Colors.grey.shade600,
                        ),
                      ),
                      Text(
                        route['origin'] ?? '--',
                        style: GoogleFonts.poppins(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: Colors.grey.shade900,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(Icons.arrow_forward_rounded, color: Colors.grey.shade400),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        "To",
                        style: GoogleFonts.poppins(
                          fontSize: 12,
                          color: Colors.grey.shade600,
                        ),
                      ),
                      Text(
                        route['destination'] ?? '--',
                        style: GoogleFonts.poppins(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: Colors.grey.shade900,
                        ),
                        textAlign: TextAlign.right,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Road Status
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: statusColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: statusColor.withValues(alpha: 0.3)),
              ),
              child: Row(
                children: [
                  Icon(
                    getRoadStatusIcon(roadStatus),
                    color: statusColor,
                    size: 18,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      "Road: ${getRoadStatusLabel(roadStatus)}",
                      style: GoogleFonts.poppins(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: statusColor,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            if (route['firstBus'] != null ||
                route['lastBus'] != null ||
                route['frequencyMin'] != null) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey.shade50,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    if (route['firstBus'] != null)
                      _ScheduleItem(
                        icon: Icons.schedule_rounded,
                        label: "First",
                        value: route['firstBus'],
                      ),
                    if (route['lastBus'] != null)
                      _ScheduleItem(
                        icon: Icons.schedule_rounded,
                        label: "Last",
                        value: route['lastBus'],
                      ),
                    if (route['frequencyMin'] != null)
                      _ScheduleItem(
                        icon: Icons.timer_rounded,
                        label: "Every",
                        value: "${route['frequencyMin']} min",
                      ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _DetailChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _DetailChip({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: Colors.grey.shade600),
          const SizedBox(width: 6),
          Text(
            "$label: $value",
            style: GoogleFonts.poppins(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: Colors.grey.shade700,
            ),
          ),
        ],
      ),
    );
  }
}

class _ScheduleItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _ScheduleItem({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 16, color: Colors.grey.shade600),
        const SizedBox(width: 4),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: GoogleFonts.poppins(
                fontSize: 10,
                color: Colors.grey.shade600,
              ),
            ),
            Text(
              value,
              style: GoogleFonts.poppins(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Colors.grey.shade900,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
