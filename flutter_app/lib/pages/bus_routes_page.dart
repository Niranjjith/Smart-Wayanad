import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';

/// 🚌 Premium Bus Routes Page with Sub-Routes Support
class BusRoutesPage extends StatefulWidget {
  const BusRoutesPage({super.key});

  @override
  State<BusRoutesPage> createState() => _BusRoutesPageState();
}

class _BusRoutesPageState extends State<BusRoutesPage> {
  List routes = [];
  List filteredRoutes = [];
  bool loading = true;
  String query = "";
  Set<String> expandedRoutes = {};

  Future<void> _load() async {
    setState(() => loading = true);
    try {
      final data = await ApiService.getBusRoutes();
      setState(() {
        routes = data;
        filteredRoutes = routes.where((r) => r['isActive'] != false).toList();
        loading = false;
      });
    } catch (e) {
      setState(() => loading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load routes: $e')),
        );
      }
    }
  }

  @override
  void initState() {
    super.initState();
    _load();
  }

  void _filterRoutes(String q) {
    setState(() {
      query = q.toLowerCase();
      if (q.isEmpty) {
        filteredRoutes = routes.where((r) => r['isActive'] != false).toList();
      } else {
        filteredRoutes = routes.where((r) {
          if (r['isActive'] == false) return false;
          final routeNo = r['routeNo']?.toString().toLowerCase() ?? '';
          final origin = r['origin']?.toString().toLowerCase() ?? '';
          final destination = r['destination']?.toString().toLowerCase() ?? '';
          final description = r['description']?.toString().toLowerCase() ?? '';
          
          // Also search in sub-routes
          final subRoutes = r['subRoutes'] as List? ?? [];
          final hasMatchingSubRoute = subRoutes.any((sr) {
            final srNo = sr['subRouteNo']?.toString().toLowerCase() ?? '';
            final srOrigin = sr['origin']?.toString().toLowerCase() ?? '';
            final srDest = sr['destination']?.toString().toLowerCase() ?? '';
            return srNo.contains(query) || srOrigin.contains(query) || srDest.contains(query);
          });
          
          return routeNo.contains(query) ||
              origin.contains(query) ||
              destination.contains(query) ||
              description.contains(query) ||
              hasMatchingSubRoute;
        }).toList();
      }
    });
  }

  void _toggleExpand(String routeId) {
    setState(() {
      if (expandedRoutes.contains(routeId)) {
        expandedRoutes.remove(routeId);
      } else {
        expandedRoutes.add(routeId);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: CustomScrollView(
        slivers: [
          // Premium App Bar with Gradient
          SliverAppBar(
            expandedHeight: 180,
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
                      const Color(0xFF667EEA),
                      const Color(0xFF764BA2),
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
                                color: Colors.white.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(
                                Icons.directions_bus_rounded,
                                color: Colors.white,
                                size: 28,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Bus Routes',
                                    style: GoogleFonts.poppins(
                                      color: Colors.white,
                                      fontSize: 28,
                                      fontWeight: FontWeight.w800,
                                      letterSpacing: -0.5,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Find your perfect route',
                                    style: GoogleFonts.poppins(
                                      color: Colors.white.withOpacity(0.9),
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

          // Search Bar
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 10,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: TextField(
                  onChanged: _filterRoutes,
                  decoration: InputDecoration(
                    hintText: "Search by route, origin, or destination...",
                    hintStyle: GoogleFonts.poppins(
                      color: Colors.grey.shade500,
                      fontSize: 15,
                    ),
                    prefixIcon: Icon(
                      Icons.search_rounded,
                      color: const Color(0xFF667EEA),
                    ),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 16,
                    ),
                  ),
                ),
              ),
            ),
          ),

          // Routes List
          loading
              ? SliverFillRemaining(
                  child: Center(
                    child: CircularProgressIndicator(
                      color: const Color(0xFF667EEA),
                    ),
                  ),
                )
              : filteredRoutes.isEmpty
                  ? SliverFillRemaining(
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.directions_bus_outlined,
                              size: 80,
                              color: Colors.grey.shade300,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              "No routes found",
                              style: GoogleFonts.poppins(
                                fontSize: 18,
                                color: Colors.grey.shade600,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              query.isEmpty
                                  ? "Routes will appear here"
                                  : "Try a different search term",
                              style: GoogleFonts.poppins(
                                fontSize: 14,
                                color: Colors.grey.shade500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    )
                  : SliverPadding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      sliver: SliverList(
                        delegate: SliverChildBuilderDelegate(
                          (context, index) {
                            final route = filteredRoutes[index];
                            return _PremiumRouteCard(
                              route: route,
                              isExpanded: expandedRoutes.contains(route['_id']),
                              onToggleExpand: () => _toggleExpand(route['_id']),
                            );
                          },
                          childCount: filteredRoutes.length,
                        ),
                      ),
                    ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _load,
        backgroundColor: const Color(0xFF667EEA),
        child: const Icon(Icons.refresh_rounded, color: Colors.white),
      ),
    );
  }
}

/// Premium Route Card with Sub-Routes
class _PremiumRouteCard extends StatelessWidget {
  final Map route;
  final bool isExpanded;
  final VoidCallback onToggleExpand;

  const _PremiumRouteCard({
    required this.route,
    required this.isExpanded,
    required this.onToggleExpand,
  });

  @override
  Widget build(BuildContext context) {
    final subRoutes = route['subRoutes'] as List? ?? [];
    final hasSubRoutes = subRoutes.isNotEmpty;
    final isActive = route['isActive'] != false;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isActive
              ? const Color(0xFF667EEA).withOpacity(0.2)
              : Colors.grey.shade300,
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 15,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          // Main Route Info
          InkWell(
            onTap: hasSubRoutes ? onToggleExpand : null,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      // Route Number Badge
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF667EEA), Color(0xFF764BA2)],
                          ),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          'Route ${route['routeNo'] ?? '--'}',
                          style: GoogleFonts.poppins(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      // Status Chip
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: isActive
                              ? Colors.green.shade50
                              : Colors.grey.shade200,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          isActive ? 'Active' : 'Inactive',
                          style: GoogleFonts.poppins(
                            color: isActive
                                ? Colors.green.shade700
                                : Colors.grey.shade700,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      const Spacer(),
                      // Sub-routes count
                      if (hasSubRoutes)
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFF667EEA).withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.route,
                                size: 14,
                                color: const Color(0xFF667EEA),
                              ),
                              const SizedBox(width: 4),
                              Text(
                                '${subRoutes.length}',
                                style: GoogleFonts.poppins(
                                  color: const Color(0xFF667EEA),
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      if (hasSubRoutes) const SizedBox(width: 8),
                      // Expand Icon
                      if (hasSubRoutes)
                        Icon(
                          isExpanded
                              ? Icons.expand_less_rounded
                              : Icons.expand_more_rounded,
                          color: const Color(0xFF667EEA),
                        ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // Origin & Destination
                  Row(
                    children: [
                      Expanded(
                        child: _LocationRow(
                          icon: Icons.location_on_rounded,
                          iconColor: const Color(0xFF667EEA),
                          text: route['origin'] ?? '--',
                          label: 'From',
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        child: Icon(
                          Icons.arrow_forward_rounded,
                          color: Colors.grey.shade400,
                          size: 20,
                        ),
                      ),
                      Expanded(
                        child: _LocationRow(
                          icon: Icons.location_on_rounded,
                          iconColor: const Color(0xFFF5576C),
                          text: route['destination'] ?? '--',
                          label: 'To',
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // Schedule Info
                  if (route['firstBus'] != null ||
                      route['lastBus'] != null ||
                      route['frequencyMin'] != null)
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade50,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          if (route['firstBus'] != null) ...[
                            _ScheduleItem(
                              icon: Icons.schedule_rounded,
                              label: 'First',
                              value: route['firstBus'],
                            ),
                            const SizedBox(width: 16),
                          ],
                          if (route['lastBus'] != null) ...[
                            _ScheduleItem(
                              icon: Icons.schedule_rounded,
                              label: 'Last',
                              value: route['lastBus'],
                            ),
                            const SizedBox(width: 16),
                          ],
                          if (route['frequencyMin'] != null)
                            _ScheduleItem(
                              icon: Icons.timer_rounded,
                              label: 'Every',
                              value: '${route['frequencyMin']} min',
                            ),
                        ],
                      ),
                    ),
                  // Description
                  if (route['description'] != null &&
                      route['description'].toString().isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Text(
                      route['description'],
                      style: GoogleFonts.poppins(
                        fontSize: 13,
                        color: Colors.grey.shade700,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),

          // Sub-Routes Section
          if (hasSubRoutes && isExpanded)
            Container(
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: const BorderRadius.vertical(
                  bottom: Radius.circular(20),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
                    child: Row(
                      children: [
                        Icon(
                          Icons.route_rounded,
                          size: 18,
                          color: const Color(0xFF667EEA),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Sub-Routes',
                          style: GoogleFonts.poppins(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: Colors.grey.shade800,
                          ),
                        ),
                      ],
                    ),
                  ),
                  ...subRoutes.asMap().entries.map((entry) {
                    final index = entry.key;
                    final subRoute = entry.value;
                    return _SubRouteCard(
                      subRoute: subRoute,
                      isLast: index == subRoutes.length - 1,
                    );
                  }),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

/// Location Row Widget
class _LocationRow extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String text;
  final String label;

  const _LocationRow({
    required this.icon,
    required this.iconColor,
    required this.text,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.poppins(
            fontSize: 11,
            color: Colors.grey.shade600,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 4),
        Row(
          children: [
            Icon(icon, size: 18, color: iconColor),
            const SizedBox(width: 6),
            Expanded(
              child: Text(
                text,
                style: GoogleFonts.poppins(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: Colors.grey.shade900,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

/// Schedule Item Widget
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
        const SizedBox(width: 6),
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
                fontSize: 13,
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

/// Sub-Route Card Widget
class _SubRouteCard extends StatelessWidget {
  final Map subRoute;
  final bool isLast;

  const _SubRouteCard({
    required this.subRoute,
    required this.isLast,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.fromLTRB(20, 0, 20, isLast ? 16 : 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFF667EEA).withOpacity(0.2),
          width: 1.5,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Sub-route number
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF667EEA),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  subRoute['subRouteNo'] ?? '--',
                  style: GoogleFonts.poppins(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  "${subRoute['origin'] ?? '--'} → ${subRoute['destination'] ?? '--'}",
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey.shade900,
                  ),
                ),
              ),
            ],
          ),
          // Via stops
          if (subRoute['via'] != null &&
              subRoute['via'].toString().isNotEmpty) ...[
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(
                  Icons.place_rounded,
                  size: 14,
                  color: Colors.grey.shade600,
                ),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    'Via: ${subRoute['via']}',
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      color: Colors.grey.shade700,
                    ),
                  ),
                ),
              ],
            ),
          ],
          // Schedule
          if (subRoute['firstBus'] != null ||
              subRoute['lastBus'] != null ||
              subRoute['frequencyMin'] != null) ...[
            const SizedBox(height: 12),
            Wrap(
              spacing: 16,
              runSpacing: 8,
              children: [
                if (subRoute['firstBus'] != null)
                  _SubRouteScheduleItem(
                    icon: Icons.schedule_rounded,
                    label: 'First',
                    value: subRoute['firstBus'],
                  ),
                if (subRoute['lastBus'] != null)
                  _SubRouteScheduleItem(
                    icon: Icons.schedule_rounded,
                    label: 'Last',
                    value: subRoute['lastBus'],
                  ),
                if (subRoute['frequencyMin'] != null)
                  _SubRouteScheduleItem(
                    icon: Icons.timer_rounded,
                    label: 'Every',
                    value: '${subRoute['frequencyMin']} min',
                  ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

/// Sub-Route Schedule Item
class _SubRouteScheduleItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _SubRouteScheduleItem({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: Colors.grey.shade600),
        const SizedBox(width: 4),
        Text(
          '$label: ',
          style: GoogleFonts.poppins(
            fontSize: 11,
            color: Colors.grey.shade600,
          ),
        ),
        Text(
          value,
          style: GoogleFonts.poppins(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: Colors.grey.shade900,
          ),
        ),
      ],
    );
  }
}
