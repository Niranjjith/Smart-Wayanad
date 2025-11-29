import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';
import 'dart:math' as math;

class ChatbotPage extends StatefulWidget {
  const ChatbotPage({super.key});

  @override
  State<ChatbotPage> createState() => _ChatbotPageState();
}

class _ChatbotPageState extends State<ChatbotPage>
    with TickerProviderStateMixin {
  final _msg = TextEditingController();
  final _scrollController = ScrollController();
  List<Map<String, dynamic>> messages = [];
  bool sending = false;
  late AnimationController _typingController;

  @override
  void initState() {
    super.initState();
    _typingController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat();
    
    // Add comprehensive welcome message with district info
    messages.add({
      'type': 'bot',
      'message':
          "Hello! 👋 Welcome to Smart Wayanad AI Assistant!\n\n"
          "🌿 **About Wayanad District:**\n"
          "Wayanad is a beautiful hill district in Kerala, India, known for its lush green forests, wildlife sanctuaries, and rich biodiversity. It's located in the Western Ghats and is home to several indigenous tribes.\n\n"
          "📋 **I can help you with:**\n"
          "• 🚨 Emergency services & SOS alerts\n"
          "• 🚌 Bus routes & transport information\n"
          "• 🏥 Hospitals, clinics & medical facilities\n"
          "• 🌤️ Weather & climate information\n"
          "• 🚔 Police stations & helpline numbers\n"
          "• 🚕 Taxi stands & auto services\n"
          "• 📍 Tourist attractions & locations\n"
          "• 🎯 District information & FAQs\n\n"
          "Ask me anything about Wayanad or use the quick buttons below!",
      'timestamp': DateTime.now(),
    });
  }

  @override
  void dispose() {
    _msg.dispose();
    _scrollController.dispose();
    _typingController.dispose();
    super.dispose();
  }

  // 📨 Send a message to AI chatbot
  Future<void> _send() async {
    final text = _msg.text.trim();
    if (text.isEmpty || sending || !mounted) return;

    // Add user message
    if (mounted) {
      setState(() {
        messages.add({
          'type': 'user',
          'message': text,
          'timestamp': DateTime.now(),
        });
        sending = true;
      });
    }
    _msg.clear();
    _scrollToBottom();

    try {
      // Call AI chatbot
      final response = await ApiService.sendChatbotMessage(text, null);
      
      if (response != null && mounted) {
        setState(() {
          messages.add({
            'type': 'bot',
            'message': response['reply'] ?? 'Sorry, I could not process that.',
            'intent': response['intent'],
            'confidence': response['confidence'],
            'timestamp': DateTime.now(),
          });
          sending = false;
        });
      } else {
        setState(() {
          messages.add({
            'type': 'bot',
            'message':
                'Sorry, I\'m having trouble connecting. Please try again.',
            'timestamp': DateTime.now(),
          });
          sending = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          messages.add({
            'type': 'bot',
            'message': 'Error: ${e.toString()}',
            'timestamp': DateTime.now(),
          });
          sending = false;
        });
      }
    }

    _scrollToBottom();
  }

  void _scrollToBottom() {
    if (!mounted) return;
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted && _scrollController.hasClients) {
        try {
          _scrollController.animateTo(
            _scrollController.position.maxScrollExtent,
            duration: const Duration(milliseconds: 400),
            curve: Curves.easeOut,
          );
        } catch (e) {
          // Ignore scroll errors during rapid updates
        }
      }
    });
  }

  // Send quick message from button
  void _sendQuickMessage(String message) {
    if (sending || !mounted) return;
    _msg.text = message;
    // Small delay to prevent rapid state changes
    Future.delayed(const Duration(milliseconds: 100), () {
      if (mounted) {
        _send();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: Column(
        children: [
          // App Bar
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  const Color(0xFF4FACFE),
                  const Color(0xFF00F2FE),
                ],
              ),
            ),
            child: SafeArea(
              bottom: false,
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                      onPressed: () => Navigator.pop(context),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(
                        Icons.smart_toy_rounded,
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
                            'AI Assistant',
                            style: GoogleFonts.poppins(
                              color: Colors.white,
                              fontSize: 28,
                              fontWeight: FontWeight.w800,
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Powered by AI & NLP',
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
              ),
            ),
          ),

          // Quick Action Buttons (only show when no messages or first message)
          if (messages.length <= 1)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              color: Colors.white,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Quick Questions:',
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey.shade700,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      _QuickButton(
                        text: 'About Wayanad',
                        icon: Icons.info_outline,
                        onTap: () => _sendQuickMessage('Tell me about Wayanad district'),
                      ),
                      _QuickButton(
                        text: 'Tourist Places',
                        icon: Icons.place,
                        onTap: () => _sendQuickMessage('What are the famous tourist places in Wayanad?'),
                      ),
                      _QuickButton(
                        text: 'Best Time to Visit',
                        icon: Icons.calendar_today,
                        onTap: () => _sendQuickMessage('What is the best time to visit Wayanad?'),
                      ),
                      _QuickButton(
                        text: 'How to Reach',
                        icon: Icons.directions,
                        onTap: () => _sendQuickMessage('How can I reach Wayanad?'),
                      ),
                      _QuickButton(
                        text: 'Emergency Help',
                        icon: Icons.emergency,
                        onTap: () => _sendQuickMessage('What are the emergency helpline numbers?'),
                      ),
                      _QuickButton(
                        text: 'Weather Info',
                        icon: Icons.wb_sunny,
                        onTap: () => _sendQuickMessage('What is the weather like in Wayanad?'),
                      ),
                      _QuickButton(
                        text: 'Bus Routes',
                        icon: Icons.directions_bus,
                        onTap: () => _sendQuickMessage('Show me bus routes in Wayanad'),
                      ),
                      _QuickButton(
                        text: 'Hospitals',
                        icon: Icons.local_hospital,
                        onTap: () => _sendQuickMessage('Where are the hospitals in Wayanad?'),
                      ),
                    ],
                  ),
                ],
              ),
            ),

          // Chat Messages
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(20),
              itemCount: messages.length + (sending ? 1 : 0),
              physics: const ClampingScrollPhysics(),
              itemBuilder: (context, index) {
                if (index == messages.length && sending) {
                  return _TypingIndicator(controller: _typingController);
                }
                if (index >= messages.length) return const SizedBox.shrink();
                final msg = messages[index];
                return _ChatBubble(
                  message: msg['message'] ?? '',
                  isUser: msg['type'] == 'user',
                  intent: msg['intent'],
                  confidence: msg['confidence'],
                );
              },
            ),
          ),

          // Input Box
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 10,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: SafeArea(
              top: false,
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(24),
                      ),
                      child: TextField(
                        controller: _msg,
                        decoration: InputDecoration(
                          hintText: "Ask me anything...",
                          hintStyle: GoogleFonts.poppins(
                            color: Colors.grey.shade500,
                          ),
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 20,
                            vertical: 12,
                          ),
                        ),
                        onSubmitted: (_) => _send(),
                        maxLines: null,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          const Color(0xFF4FACFE),
                          const Color(0xFF00F2FE),
                        ],
                      ),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF4FACFE).withValues(alpha: 0.4),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: IconButton(
                      onPressed: sending ? null : _send,
                      icon: sending
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Icon(
                              Icons.send_rounded,
                              color: Colors.white,
                            ),
                    ),
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

class _ChatBubble extends StatelessWidget {
  final String message;
  final bool isUser;
  final String? intent;
  final double? confidence;

  const _ChatBubble({
    required this.message,
    required this.isUser,
    this.intent,
    this.confidence,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        mainAxisAlignment:
            isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!isUser) ...[
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    const Color(0xFF4FACFE),
                    const Color(0xFF00F2FE),
                  ],
                ),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.smart_toy_rounded,
                color: Colors.white,
                size: 20,
              ),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: isUser
                    ? LinearGradient(
                        colors: [
                          const Color(0xFF667EEA),
                          const Color(0xFF764BA2),
                        ],
                      )
                    : null,
                color: isUser ? null : Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(20),
                  topRight: const Radius.circular(20),
                  bottomLeft: Radius.circular(isUser ? 20 : 4),
                  bottomRight: Radius.circular(isUser ? 4 : 20),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.1),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    message,
                    style: GoogleFonts.poppins(
                      color: isUser ? Colors.white : Colors.grey.shade900,
                      fontSize: 15,
                      height: 1.5,
                    ),
                  ),
                  if (!isUser && intent != null) ...[
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.blue.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            intent!,
                            style: GoogleFonts.poppins(
                              fontSize: 10,
                              color: Colors.blue.shade700,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        if (confidence != null) ...[
                          const SizedBox(width: 8),
                          Text(
                            '${(confidence! * 100).toInt()}%',
                            style: GoogleFonts.poppins(
                              fontSize: 10,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ),
          if (isUser) ...[
            const SizedBox(width: 8),
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    const Color(0xFF667EEA),
                    const Color(0xFF764BA2),
                  ],
                ),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.person_rounded,
                color: Colors.white,
                size: 20,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _TypingIndicator extends StatelessWidget {
  final AnimationController controller;

  const _TypingIndicator({required this.controller});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF4FACFE),
                  const Color(0xFF00F2FE),
                ],
              ),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.smart_toy_rounded,
              color: Colors.white,
              size: 20,
            ),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.1),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _Dot(controller: controller, delay: 0),
                const SizedBox(width: 4),
                _Dot(controller: controller, delay: 0.2),
                const SizedBox(width: 4),
                _Dot(controller: controller, delay: 0.4),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Dot extends StatelessWidget {
  final AnimationController controller;
  final double delay;

  const _Dot({required this.controller, required this.delay});

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, child) {
        final value = (controller.value + delay) % 1.0;
        return Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: Colors.grey.shade400.withValues(
              alpha: 0.3 + (math.sin(value * math.pi * 2) * 0.5 + 0.5) * 0.7,
            ),
            shape: BoxShape.circle,
          ),
        );
      },
    );
  }
}

class _QuickButton extends StatelessWidget {
  final String text;
  final IconData icon;
  final VoidCallback onTap;

  const _QuickButton({
    required this.text,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: const Color(0xFF4FACFE).withValues(alpha: 0.3),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF4FACFE).withValues(alpha: 0.1),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 16,
              color: const Color(0xFF4FACFE),
            ),
            const SizedBox(width: 6),
            Text(
              text,
              style: GoogleFonts.poppins(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF4FACFE),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
