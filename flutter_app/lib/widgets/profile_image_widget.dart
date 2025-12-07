import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'dart:convert';
import 'dart:io';

class ProfileImageWidget extends StatelessWidget {
  final String? imageUrl;
  final String fallbackText;
  final double size;
  final BoxFit fit;

  const ProfileImageWidget({
    super.key,
    required this.imageUrl,
    required this.fallbackText,
    this.size = 100,
    this.fit = BoxFit.cover,
  });

  @override
  Widget build(BuildContext context) {
    if (imageUrl == null || imageUrl!.isEmpty) {
      return _buildFallback();
    }

    // Check if it's a base64 image
    if (imageUrl!.startsWith('data:image')) {
      try {
        // Extract base64 string from data URI
        final parts = imageUrl!.split(',');
        if (parts.length > 1) {
          final base64String = parts[1];
          final imageBytes = base64Decode(base64String);
          return Image.memory(
            imageBytes,
            fit: fit,
            errorBuilder: (context, error, stackTrace) => _buildFallback(),
          );
        }
      } catch (e) {
        print("Error decoding base64 image: $e");
        return _buildFallback();
      }
    }

    // Check if it's a local file path
    if (imageUrl!.startsWith('/') || imageUrl!.contains('\\')) {
      try {
        final file = File(imageUrl!);
        if (file.existsSync()) {
          return Image.file(
            file,
            fit: fit,
            errorBuilder: (context, error, stackTrace) => _buildFallback(),
          );
        }
      } catch (e) {
        // Ignore file errors
      }
    }

    // It's a network URL
    return CachedNetworkImage(
      imageUrl: imageUrl!,
      fit: fit,
      placeholder: (context, url) => Container(
        color: Colors.grey.shade200,
        child: Center(
          child: CircularProgressIndicator(
            strokeWidth: 2,
            valueColor: AlwaysStoppedAnimation<Color>(Colors.grey.shade400),
          ),
        ),
      ),
      errorWidget: (context, url, error) => _buildFallback(),
    );
  }

  Widget _buildFallback() {
    return Container(
      color: Colors.grey.shade300,
      child: Center(
        child: Text(
          fallbackText.isNotEmpty ? fallbackText[0].toUpperCase() : 'U',
          style: TextStyle(
            color: Colors.grey.shade700,
            fontSize: size * 0.4,
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
    );
  }
}

