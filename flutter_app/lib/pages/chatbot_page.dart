import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ChatbotPage extends StatefulWidget {
  const ChatbotPage({super.key});

  @override
  State<ChatbotPage> createState() => _ChatbotPageState();
}

class _ChatbotPageState extends State<ChatbotPage> {
  final _msg = TextEditingController();
  List logs = [];
  bool loading = true;

  Future<void> _load() async {
    setState(() => loading = true);
    logs = await ApiService.getChatLogs();
    setState(() => loading = false);
  }

  Future<void> _send() async {
    final text = _msg.text.trim();
    if (text.isEmpty) return;
    await ApiService.sendChat("user", text);
    _msg.clear();
    _load();
  }

  @override
  void initState() { super.initState(); _load(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Chatbot")),
      body: Column(
        children: [
          Expanded(
            child: loading
                ? const Center(child: CircularProgressIndicator())
                : ListView.builder(
                    padding: const EdgeInsets.all(12),
                    itemCount: logs.length,
                    itemBuilder: (_, i) {
                      final it = logs[i];
                      return Card(
                        child: ListTile(
                          title: Text(it['message'] ?? ''),
                          subtitle: Text((it['reply'] ?? '').isEmpty ? '—' : it['reply']),
                        ),
                      );
                    },
                  ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Expanded(child: TextField(controller: _msg, decoration: const InputDecoration(hintText: "Type a message"))),
                const SizedBox(width: 8),
                ElevatedButton(onPressed: _send, child: const Text("Send")),
              ],
            ),
          )
        ],
      ),
    );
  }
}
