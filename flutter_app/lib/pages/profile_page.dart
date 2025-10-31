import 'package:flutter/material.dart';

class ProfilePage extends StatelessWidget {
  final Map user;
  const ProfilePage({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    final name = user['name'] ?? 'User';
    final email = user['email'] ?? '—';
    final phone = user['phone'] ?? '—';

    return Scaffold(
      appBar: AppBar(title: const Text("Profile")),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const CircleAvatar(
              radius: 40,
              child: Icon(Icons.person, size: 40),
            ),
            const SizedBox(height: 16),
            Text(
              name,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(email),
            Text(phone),
            const Spacer(),
            ElevatedButton(
              onPressed: () => Navigator.popUntil(context, (r) => r.isFirst),
              style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(48)),
              child: const Text("Logout"),
            ),
          ],
        ),
      ),
    );
  }
}
