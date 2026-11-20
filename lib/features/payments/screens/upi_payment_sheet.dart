import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../core/utils/upi_launcher.dart';
import '../../../core/widgets/neon_badge.dart';
import '../../../core/widgets/neon_button.dart';
import 'payment_receipt_screen.dart';

class UpiPaymentSheet extends StatefulWidget {
  final double amount;
  final String payeeName;
  final String payeeVpa;
  final String transactionTitle;
  final double cashbackEarned;

  const UpiPaymentSheet({
    super.key,
    required this.amount,
    required this.payeeName,
    this.payeeVpa = 'easypay.merchant@icici',
    required this.transactionTitle,
    this.cashbackEarned = 15.0,
  });

  static Future<void> show(
    BuildContext context, {
    required double amount,
    required String payeeName,
    String payeeVpa = 'easypay.merchant@icici',
    required String transactionTitle,
    double cashbackEarned = 15.0,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => UpiPaymentSheet(
        amount: amount,
        payeeName: payeeName,
        payeeVpa: payeeVpa,
        transactionTitle: transactionTitle,
        cashbackEarned: cashbackEarned,
      ),
    );
  }

  @override
  State<UpiPaymentSheet> createState() => _UpiPaymentSheetState();
}

class _UpiPaymentSheetState extends State<UpiPaymentSheet> {
  final TextEditingController _customVpaController = TextEditingController();
  bool _isManualVpa = false;
  bool _isProcessing = false;
  String? _selectedFallback; // 'wallet', 'card', 'netbanking'

  @override
  void dispose() {
    _customVpaController.dispose();
    super.dispose();
  }

  void _triggerPayment(String appName) async {
    setState(() => _isProcessing = true);

    // Attempt real UPI intent launch
    await UpiLauncher.launchUpiIntent(
      receiverVpa: widget.payeeVpa,
      receiverName: widget.payeeName,
      amount: widget.amount,
      transactionRef: 'EPAY${DateTime.now().millisecondsSinceEpoch}',
      transactionNote: widget.transactionTitle,
    );

    // Simulate instant secure processing callback
    await Future.delayed(const Duration(milliseconds: 1000));
    if (!mounted) return;
    setState(() => _isProcessing = false);

    Navigator.pop(context); // Close sheet

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => PaymentReceiptScreen(
          amount: widget.amount,
          payeeName: widget.payeeName,
          transactionTitle: widget.transactionTitle,
          paymentMode: appName,
          cashbackEarned: widget.cashbackEarned,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF131924),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        border: Border.all(
          color: AppColors.electricCyan.withOpacity(0.35),
          width: 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.8),
            blurRadius: 30,
            spreadRadius: 4,
          ),
        ],
      ),
      padding: EdgeInsets.fromLTRB(
        22,
        20,
        22,
        MediaQuery.of(context).viewInsets.bottom + 22,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 44,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.borderSubtle,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Header: Amount & Payee
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Paying ${widget.payeeName}',
                    style: AppTypography.headingSmall.copyWith(fontSize: 16),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    widget.transactionTitle,
                    style: AppTypography.bodySmall,
                  ),
                ],
              ),
              Text(
                CurrencyFormatter.format(widget.amount),
                style: AppTypography.heroBalance.copyWith(
                  fontSize: 26,
                  color: AppColors.cyberEmerald,
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          // Installed UPI Apps Grid
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'UPI Instant Intent (Zero Fee)',
                style: AppTypography.bodySmall.copyWith(
                  letterSpacing: 0.5,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textMuted,
                ),
              ),
              const NeonBadge(
                text: 'NPCI VERIFIED',
                variant: NeonBadgeVariant.cyan,
                padding: EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
              ),
            ],
          ),

          const SizedBox(height: 12),

          // UPI App Tiles
          SizedBox(
            height: 82,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: UpiLauncher.popularUpiApps.length,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (context, index) {
                final app = UpiLauncher.popularUpiApps[index];
                return GestureDetector(
                  onTap: _isProcessing ? null : () => _triggerPayment(app.name),
                  child: Column(
                    children: [
                      Container(
                        width: 52,
                        height: 52,
                        decoration: BoxDecoration(
                          color: app.brandColor.withOpacity(0.15),
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: app.brandColor.withOpacity(0.4),
                            width: 1.2,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: app.brandColor.withOpacity(0.2),
                              blurRadius: 10,
                            ),
                          ],
                        ),
                        child: Icon(app.icon, size: 24, color: Colors.white),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        app.name,
                        style: AppTypography.bodySmall.copyWith(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 12),

          // Manual UPI ID Toggle
          GestureDetector(
            onTap: () => setState(() => _isManualVpa = !_isManualVpa),
            child: Row(
              children: [
                const Icon(Icons.alternate_email_rounded, size: 16, color: AppColors.electricCyan),
                const SizedBox(width: 8),
                Text(
                  'Enter UPI ID / VPA manually',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.electricCyan,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const Spacer(),
                Icon(
                  _isManualVpa ? Icons.keyboard_arrow_up_rounded : Icons.keyboard_arrow_down_rounded,
                  color: AppColors.electricCyan,
                  size: 18,
                ),
              ],
            ),
          ),

          if (_isManualVpa) ...[
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _customVpaController,
                    style: AppTypography.bodyMedium.copyWith(color: AppColors.textPrimary),
                    decoration: const InputDecoration(
                      hintText: 'e.g. mobile@upi, username@okhdfcbank',
                      contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                NeonButton(
                  text: 'Pay',
                  height: 46,
                  variant: NeonButtonVariant.cyan,
                  onPressed: () {
                    if (_customVpaController.text.isNotEmpty) {
                      _triggerPayment('Custom UPI (${_customVpaController.text})');
                    }
                  },
                ),
              ],
            ),
          ],

          const SizedBox(height: 18),
          const Divider(color: AppColors.borderSubtle, height: 1),
          const SizedBox(height: 14),

          // Fallback Gateway Options: Easy Pay Wallet, Cards, Net Banking
          Text(
            'Alternative Payment Methods',
            style: AppTypography.bodySmall.copyWith(
              letterSpacing: 0.5,
              fontWeight: FontWeight.w700,
              color: AppColors.textMuted,
            ),
          ),

          const SizedBox(height: 10),

          // Easy Pay Balance
          _buildPaymentOptionTile(
            id: 'wallet',
            title: 'Easy Pay Balance',
            subtitle: 'Available: ₹4,850.50 (Instant 1-Click)',
            icon: Icons.account_balance_wallet_rounded,
            iconColor: AppColors.electricCyan,
            onTap: () => _triggerPayment('Easy Pay Wallet Balance'),
          ),

          const SizedBox(height: 8),

          // Cards
          _buildPaymentOptionTile(
            id: 'card',
            title: 'Debit / Credit Card',
            subtitle: 'Visa, Mastercard, RuPay, Maestro',
            icon: Icons.credit_card_rounded,
            iconColor: const Color(0xFFFFD166),
            onTap: () => _triggerPayment('Card Payment (Gateway)'),
          ),

          const SizedBox(height: 8),

          // Net Banking
          _buildPaymentOptionTile(
            id: 'netbanking',
            title: 'Net Banking',
            subtitle: 'HDFC, ICICI, SBI, Axis & 50+ Banks',
            icon: Icons.account_balance_rounded,
            iconColor: const Color(0xFF60EFA0),
            onTap: () => _triggerPayment('Net Banking'),
          ),

          const SizedBox(height: 12),
        ],
      ),
    );
  }

  Widget _buildPaymentOptionTile({
    required String id,
    required String title,
    required String subtitle,
    required IconData icon,
    required Color iconColor,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: _isProcessing ? null : onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: AppColors.surfaceElevated,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.borderSubtle),
        ),
        child: Row(
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: iconColor.withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 20, color: iconColor),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: AppTypography.headingSmall.copyWith(fontSize: 13),
                  ),
                  Text(
                    subtitle,
                    style: AppTypography.bodySmall.copyWith(fontSize: 10),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right_rounded, size: 18, color: AppColors.textMuted),
          ],
        ),
      ),
    );
  }
}
