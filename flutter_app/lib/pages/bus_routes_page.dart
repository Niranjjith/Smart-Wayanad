import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';

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

  Future<void> _load() async {
    setState(() => loading = true);
    final data = await ApiService.getBusRoutes();
    setState(() {
      routes = data;
      filteredRoutes = routes;
      loading = false;
    });
  }

  @override
  void initState() {
    super.initState();
    _load();
  }

  void _filterRoutes(String q) {
    setState(() {
      query = q;
      filteredRoutes = routes
          .where((r) =>
              (r['routeNo']?.toString().toLowerCase().contains(q.toLowerCase()) ??
                  false) ||
              (r['origin']?.toString().toLowerCase().contains(q.toLowerCase()) ??
                  false) ||
              (r['destination']
                      ?.toString()
                      .toLowerCase()
                      .contains(q.toLowerCase()) ??
                  false))
          .toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          "Bus Routes",
          style: GoogleFonts.poppins(
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: true,
        backgroundColor: const Color(0xFF2E7D32),
        elevation: 0,
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator(color: Colors.green))
          : Column(
              children: [
                // 🔍 Search Bar
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: TextField(
                    onChanged: _filterRoutes,
                    decoration: InputDecoration(
                      hintText: "Search by route, origin, or destination...",
                      hintStyle: GoogleFonts.poppins(
                          color: Colors.grey.shade600, fontSize: 15),
                      prefixIcon:
                          const Icon(Icons.search, color: Colors.green),
                      filled: true,
                      fillColor: Colors.green.shade50,
                      contentPadding:
                          const EdgeInsets.symmetric(horizontal: 18, vertical: 0),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(25),
                        borderSide:
                            BorderSide(color: Colors.green.shade200, width: 1),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(25),
                        borderSide:
                            const BorderSide(color: Colors.green, width: 1.2),
                      ),
                    ),
                  ),
                ),

                // 🚌 Routes List
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _load,
                    color: Colors.green,
                    child: filteredRoutes.isEmpty
                        ? Center(
                            child: Text(
                              "No routes found",
                              style: GoogleFonts.poppins(
                                  fontSize: 16,
                                  color: Colors.grey.shade600,
                                  fontWeight: FontWeight.w500),
                            ),
                          )
                        : ListView.builder(
                            physics: const AlwaysScrollableScrollPhysics(),
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            itemCount: filteredRoutes.length,
                            itemBuilder: (_, i) {
                              final r = filteredRoutes[i];
                              return _BusRouteCard(route: r);
                            },
                          ),
                  ),
                ),
              ],
            ),
    );
  }
}

// 🌿 Individual Route Card (clean white + green)
class _BusRouteCard extends StatelessWidget {
  final Map route;
  const _BusRouteCard({required this.route});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 4,
      shadowColor: Colors.green.withOpacity(0.2),
      child: ListTile(
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        leading: CircleAvatar(
          backgroundColor: Colors.green.shade100,
          radius: 26,
          child: const Icon(Icons.directions_bus, color: Colors.green, size: 26),
        ),
        title: Text(
          "Route ${route['routeNo'] ?? '--'}",
          style: GoogleFonts.poppins(
            color: Colors.green.shade900,
            fontSize: 17,
            fontWeight: FontWeight.w600,
          ),
        ),
        subtitle: Text(
          "${route['origin'] ?? '--'} → ${route['destination'] ?? '--'}\n"
          "First Bus: ${route['firstBus'] ?? '--'} | Last Bus: ${route['lastBus'] ?? '--'} | Every ${route['frequencyMin'] ?? '--'} min",
          style: GoogleFonts.poppins(
            color: Colors.grey.shade700,
            fontSize: 13.5,
            height: 1.4,
          ),
        ),
        trailing: const Icon(Icons.chevron_right, color: Colors.green),
      ),
    );
  }
}
