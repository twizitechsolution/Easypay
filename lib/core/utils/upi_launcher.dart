import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class UpiAppInfo {
  final String id;
  final String name;
  final String packageName;
  final Color brandColor;
  final IconData icon;

  const UpiAppInfo({
    required this.id,
    required this.name,
    required this.packageName,
    required this.brandColor,
    required this.icon,
  });
}

class UpiLauncher {
  UpiLauncher._();

  static const List<UpiAppInfo> popularUpiApps = [
    UpiAppInfo(
      id: 'phonepe',
      name: 'PhonePe',
      packageName: 'com.phonepe.app',
      brandColor: Color(0xFF5F259F),
      icon: Icons.account_balance_wallet_rounded,
    ),
    UpiAppInfo(
      id: 'gpay',
      name: 'Google Pay',
      packageName: 'com.google.android.apps.nbu.paisa.user',
      brandColor: Color(0xFF4285F4),
      icon: Icons.payment_rounded,
    ),
    UpiAppInfo(
      id: 'paytm',
      name: 'Paytm UPI',
      packageName: 'net.one97.paytm',
      brandColor: Color(0xFF00BAF2),
      icon: Icons.currency_rupee_rounded,
    ),
    UpiAppInfo(
      id: 'cred',
      name: 'CRED UPI',
      packageName: 'com.dreamplug.androidapp',
      brandColor: Color(0xFF1B1B1B),
      icon: Icons.credit_card_rounded,
    ),
    UpiAppInfo(
      id: 'bhim',
      name: 'BHIM UPI',
      packageName: 'in.org.npci.upiapp',
      brandColor: Color(0xFF007236),
      icon: Icons.shield_rounded,
    ),
  ];

  /// Generate standard NPCI UPI Intent URI
  static Uri buildUpiUri({
    required String receiverVpa,
    required String receiverName,
    required double amount,
    required String transactionRef,
    required String transactionNote,
  }) {
    final queryParameters = {
      'pa': receiverVpa,
      'pn': receiverName,
      'mc': '5411', // Grocery / Merchant code
      'tr': transactionRef,
      'tn': transactionNote,
      'am': amount.toStringAsFixed(2),
      'cu': 'INR',
    };

    return Uri(
      scheme: 'upi',
      host: 'pay',
      queryParameters: queryParameters,
    );
  }

  /// Launch UPI Intent
  static Future<bool> launchUpiIntent({
    required String receiverVpa,
    required String receiverName,
    required double amount,
    required String transactionRef,
    required String transactionNote,
  }) async {
    final uri = buildUpiUri(
      receiverVpa: receiverVpa,
      receiverName: receiverName,
      amount: amount,
      transactionRef: transactionRef,
      transactionNote: transactionNote,
    );

    try {
      if (await canLaunchUrl(uri)) {
        return await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    } catch (_) {
      // Intent handling handled gracefully
    }
    return false;
  }
}
