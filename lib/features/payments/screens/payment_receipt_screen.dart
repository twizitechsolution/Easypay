import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../core/widgets/neon_badge.dart';
import '../../../core/widgets/neon_button.dart';

class PaymentReceiptScreen extends StatefulWidget {
  final double amount;
  final String payeeName;
  final String transactionTitle;
  final String paymentMode;
  final double cashbackEarned;

  const PaymentReceiptScreen({
    super.key,
    required this.amount,
    required this.payeeName,
    required this.transactionTitle,
    this.paymentMode = 'Google Pay UPI',
    this.cashbackEarned = 15.0,
  });

  @override
  State<PaymentReceiptScreen> createState() => _PaymentReceiptScreenState();
}

class _PaymentReceiptScreenState extends State<PaymentReceiptScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;

  final String _txnId = 'UPI-${DateTime.now().millisecondsSinceEpoch}';
  final String _bankUtr = '43${DateTime.now().millisecondsSinceEpoch.toString().substring(3)}';

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
    _scaleAnimation = CurvedAnimation(parent: _animController, curve: Curves.easeOutBack);
    _fadeAnimation = CurvedAnimation(parent: _animController, curve: Curves.easeIn);
    _animController.forward();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  void _shareReceipt() {
    Clipboard.setData(
      ClipboardData(
        text: 'Easy Pay Transaction Successful!\n'
            'Amount: ${CurrencyFormatter.format(widget.amount)}\n'
            'Paid to: ${widget.payeeName}\n'
            'Txn ID: $_txnId\n'
            'Bank UTR: $_bankUtr\n'
            'Status: Verified & Completed via Easy Pay',
      ),
    );

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Receipt details copied! Ready to share via WhatsApp/SMS.'),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 10),

              // Animated Success Icon with Emerald Glow
              ScaleTransition(
                scale: _scaleAnimation,
                child: Container(
                  width: 84,
                  height: 84,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: AppColors.emeraldGradient,
                    boxShadow: AppColors.emeraldGlow(blur: 24, opacity: 0.5),
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.check_rounded,
                      size: 48,
                      color: Color(0xFF070B10),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 18),

              FadeTransition(
                opacity: _fadeAnimation,
                child: Column(
                  children: [
                    const NeonBadge(
                      text: 'PAYMENT VERIFIED & COMPLETED',
                      variant: NeonBadgeVariant.emerald,
                      showGlow: true,
                    ),
                    const SizedBox(height: 12),
                    Text(
                      CurrencyFormatter.format(widget.amount, showDecimals: true),
                      style: AppTypography.heroBalance.copyWith(
                        fontSize: 34,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Paid to ${widget.payeeName}',
                      style: AppTypography.bodyMedium.copyWith(
                        color: AppColors.textMuted,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Instant Cashback Scratch Card Reward
              if (widget.cashbackEarned > 0)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF0F3224), Color(0xFF141F2D)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(
                      color: AppColors.cyberEmerald.withOpacity(0.4),
                      width: 1.2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.cyberEmerald.withOpacity(0.12),
                        blurRadius: 18,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: AppColors.cyberEmerald.withOpacity(0.15),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.auto_awesome_rounded,
                          color: AppColors.cyberEmerald,
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '+ ${CurrencyFormatter.format(widget.cashbackEarned)} Instant Cashback',
                              style: AppTypography.headingSmall.copyWith(
                                color: AppColors.cyberEmerald,
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Credited to your Easy Pay Balance wallet.',
                              style: AppTypography.bodySmall.copyWith(fontSize: 11),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

              const SizedBox(height: 20),

              // Digital Receipt Details Box
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.surfaceElevated,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: AppColors.borderSubtle),
                ),
                child: Column(
                  children: [
                    _buildReceiptRow('Purpose', widget.transactionTitle),
                    const Divider(color: AppColors.borderSubtle, height: 22),
                    _buildReceiptRow('Payment Method', widget.paymentMode),
                    const Divider(color: AppColors.borderSubtle, height: 22),
                    _buildReceiptRow('Transaction ID', _txnId, isCopyable: true),
                    const Divider(color: AppColors.borderSubtle, height: 22),
                    _buildReceiptRow('Bank UTR', _bankUtr, isCopyable: true),
                    const Divider(color: AppColors.borderSubtle, height: 22),
                    _buildReceiptRow('Date & Time', '10 Nov 2026, 04:48 PM'),
                    const Divider(color: AppColors.borderSubtle, height: 22),
                    _buildReceiptRow('NPCI Reference', 'APPROVED 00'),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Action Buttons
              Row(
                children: [
                  Expanded(
                    child: NeonButton(
                      text: 'Share Receipt',
                      variant: NeonButtonVariant.glass,
                      icon: Icons.share_rounded,
                      onPressed: _shareReceipt,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: NeonButton(
                      text: 'Done',
                      variant: NeonButtonVariant.cyan,
                      icon: Icons.check_circle_rounded,
                      onPressed: () {
                        Navigator.of(context).popUntil((route) => route.isFirst);
                      },
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildReceiptRow(String label, String value, {bool isCopyable = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: AppTypography.bodySmall.copyWith(
            color: AppColors.textMuted,
            fontSize: 12,
          ),
        ),
        Row(
          children: [
            Text(
              value,
              style: AppTypography.bodyMedium.copyWith(
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
                fontSize: 12,
              ),
            ),
            if (isCopyable) ...[
              const SizedBox(width: 6),
              GestureDetector(
                onTap: () {
                  Clipboard.setData(ClipboardData(text: value));
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('$label copied!'),
                      behavior: SnackBarBehavior.floating,
                      duration: const Duration(seconds: 1),
                    ),
                  );
                },
                child: const Icon(
                  Icons.copy_rounded,
                  size: 14,
                  color: AppColors.electricCyan,
                ),
              ),
            ],
          ],
        ),
      ],
    );
  }
}
