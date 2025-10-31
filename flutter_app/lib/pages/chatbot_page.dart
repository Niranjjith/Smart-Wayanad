import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';

class ChatbotPage extends StatefulWidget {
  const ChatbotPage({super.key});

  @override
  State<ChatbotPage> createState() => _ChatbotPageState();
}

class _ChatbotPageState extends State<ChatbotPage> {
  final _msg = TextEditingController();
  final _scrollController = ScrollController();
  List logs = [];
  bool loading = true;
  bool sending = false;

  // 🧩 Fetch chat logs
  Future<void> _load() async {
    setState(() => loading = true);
    logs = await ApiService.getChatLogs();
    setState(() => loading = false);
    _scrollToBottom();
  }

  // 📨 Send a message
  Future<void> _send() async {
    final text = _msg.text.trim();
    if (text.isEmpty) return;

    setState(() => sending = true);
    await ApiService.sendChat("user", text);
    _msg.clear();
    await _load();
    setState(() => sending = false);
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 300), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 400),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _msg.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: Colors.green.shade50,
      appBar: AppBar(
        backgroundColor: Colors.green.shade800,
        elevation: 0,
        title: Text(
          "Smart Wayanad Chatbot",
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.w600,
            fontSize: 18,
            color: Colors.white,
          ),
        ),
      ),

      // 🧱 Chat Body
      body: Column(
        children: [
          Expanded(
            child: loading
                ? const Center(child: CircularProgressIndicator())
                : logs.isEmpty
                    ? Center(
                        child: Text(
                          "No chats yet.\nStart the conversation 👋",
                          textAlign: TextAlign.center,
                          style: GoogleFonts.poppins(
                            color: Colors.grey.shade600,
                            fontSize: 15,
                          ),
                        ),
                      )
                    : ListView.builder(
                        controller: _scrollController,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 10),
                        itemCount: logs.length,
                        itemBuilder: (_, i) {
                          final it = logs.reversed.toList()[i];
                          final isUser = it['user'] == "user";
                          final msg = it['message'] ?? "";
                          final reply = it['response'] ?? "";

                          return Column(
                            crossAxisAlignment: isUser
                                ? CrossAxisAlignment.end
                                : CrossAxisAlignment.start,
                            children: [
                              // 🗨️ User Message Bubble
                              if (msg.isNotEmpty)
                                Container(
                                  margin:
                                      const EdgeInsets.symmetric(vertical: 6),
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: isUser
                                        ? Colors.green.shade700
                                        : Colors.white,
                                    borderRadius: BorderRadius.circular(16),
                                    boxShadow: [
                                      BoxShadow(
                                        color:
                                            Colors.green.withOpacity(0.1),
                                        blurRadius: 6,
                                        offset: const Offset(2, 2),
                                      ),
                                    ],
                                  ),
                                  child: Text(
                                    msg,
                                    style: GoogleFonts.poppins(
                                      color: isUser
                                          ? Colors.white
                                          : Colors.green.shade900,
                                      fontSize: 15,
                                    ),
                                  ),
                                ),

                              // 🤖 Bot Reply Bubble
                              if (reply.isNotEmpty)
                                Container(
                                  margin: const EdgeInsets.only(
                                      top: 2, bottom: 10, left: 6),
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(
                                        color: Colors.green.shade100),
                                    boxShadow: [
                                      BoxShadow(
                                        color:
                                            Colors.green.withOpacity(0.05),
                                        blurRadius: 6,
                                        offset: const Offset(1, 2),
                                      ),
                                    ],
                                  ),
                                  child: Row(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const Icon(Icons.smart_toy_rounded,
                                          size: 18, color: Colors.green),
                                      const SizedBox(width: 6),
                                      Expanded(
                                        child: Text(
                                          reply,
                                          style: GoogleFonts.poppins(
                                            color: Colors.green.shade900,
                                            fontSize: 14,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                            ],
                          );
                        },
                      ),
          ),

          // 🧭 Input Box
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(
                top: BorderSide(color: Colors.green.shade100, width: 1.2),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.green.withOpacity(0.05),
                  blurRadius: 6,
                  offset: const Offset(0, -1),
                ),
              ],
            ),
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _msg,
                      decoration: InputDecoration(
                        hintText: "Type your message...",
                        hintStyle: GoogleFonts.poppins(
                          color: Colors.grey.shade500,
                        ),
                        filled: true,
                        fillColor: Colors.green.shade50,
                        contentPadding: const EdgeInsets.symmetric(
                            vertical: 10, horizontal: 14),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide:
                              BorderSide(color: Colors.green.shade300),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide:
                              BorderSide(color: Colors.green.shade700),
                        ),
                      ),
                      onSubmitted: (_) => _send(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: sending ? null : _send,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green.shade700,
                      shape: const CircleBorder(),
                      padding: const EdgeInsets.all(14),
                      elevation: 0,
                    ),
                    child: sending
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : const Icon(Icons.send_rounded,
                            color: Colors.white, size: 20),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
