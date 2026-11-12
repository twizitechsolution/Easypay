import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/glass_container.dart';
import '../../../core/widgets/neon_badge.dart';
import '../../../core/utils/currency_formatter.dart';

class HeroQuickPayCard extends StatelessWidget {
  final VoidCallback onScanQr;
  final VoidCallback onSendMoney;
  final VoidCallback onCheckBalance;

  const HeroQuickPayCard({
    super.key,
    required this.onScanQr,
    required this.onSendMoney,
    required this.onCheckBalance,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(
          colors: [
            Color(0xFF1E2838),
            Color(0xFF121824),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        border: Border.all(
          color: AppColors.electricCyan.withOpacity(0.3),
          width: 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.electricCyan.withOpacity(0.12),
            blurRadius: 24,
            spreadRadius: 1,
            offset: const Offset(0, 8),
          ),
          BoxShadow(
            color: Colors.black.withOpacity(0.4),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: Stack(
          children: [
            // Ambient neon light accent in top right corner
            Positioned(
              top: -40,
              right: -30,
              child: Container(
                width: 130,
                height: 130,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.electricCyan.withOpacity(0.15),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Top Row: Balance & UPI ID
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                'Easy Pay Balance',
                                style: AppTypography.bodySmall.copyWith(
                                  color: AppColors.textMuted,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              const SizedBox(width: 8),
                              const NeonBadge(
                                text: '+₹135 Cashback',
                                variant: NeonBadgeVariant.emerald,
                                padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.baseline,
                            textBaseline: TextBaseline.alphabetic,
                            children: [
                              Text(
                                CurrencyFormatter.format(4850.50, showDecimals: true),
                                style: AppTypography.heroBalance.copyWith(
                                  color: AppColors.textPrimary,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      // UPI ID Pill with Copy
                      GestureDetector(
                        onTap: () {
                          Clipboard.setData(const ClipboardData(text: 'alex@easypay'));
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('UPI ID copied: alex@easypay'),
                              duration: Duration(seconds: 1),
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: AppColors.surfaceElevated.withOpacity(0.8),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: AppColors.electricCyan.withOpacity(0.35),
                              width: 1,
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.qr_code_2_rounded,
                                size: 14,
                                color: AppColors.electricCyan,
                              ),
                              const SizedBox(width: 5),
                              Text(
                                'alex@easypay',
                                style: AppTypography.bodySmall.copyWith(
                                  color: AppColors.electricCyan,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(width: 4),
                              const Icon(
                                Icons.copy_rounded,
                                size: 12,
                                color: AppColors.textMuted,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // Action Buttons Row: Scan QR, Send Money, Check Balance
                  Row(
                    children: [
                      // Scan QR button (Hero Neon)
                      Expanded(
                        flex: 4,
                        child: _HeroActionButton(
                          icon: Icons.qr_code_scanner_rounded,
                          label: 'Scan QR',
                          isPrimary: true,
                          onTap: onScanQr,
                        ),
                      ),
                      const SizedBox(width: 10),
                      // Send Money
                      Expanded(
                        flex: 4,
                        child: _HeroActionButton(
                          icon: Icons.send_rounded,
                          label: 'Pay UPI / No.',
                          isPrimary: false,
                          onTap: onSendMoney,
                        ),
                      ),
                      const SizedBox(width: 10),
                      // Check Balance
                      Expanded(
                        flex: 3,
                        child: _HeroActionButton(
                          icon: Icons.account_balance_wallet_outlined,
                          label: 'Balance',
                          isPrimary: false,
                          onTap: onCheckBalance,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _HeroActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isPrimary;
  final VoidCallback onTap;

  const _HeroActionButton({
    required this.icon,
    required this.label,
    required this.isPrimary,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        height: 52,
        decoration: BoxDecoration(
          gradient: isPrimary ? AppColors.primaryCyanGradient : null,
          color: isPrimary ? null : AppColors.surfaceElevated.withOpacity(0.9),
          borderRadius: BorderRadius.circular(14),
          border: isPrimary
              ? null
              : Border.all(color: AppColors.borderSubtle, width: 1),
          boxShadow: isPrimary
              ? [
                  BoxShadow(
                    color: AppColors.electricCyan.withOpacity(0.35),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ]
              : null,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 18,
              color: isPrimary ? AppColors.backgroundPrimary : AppColors.electricCyan,
            ),
            const SizedBox(width: 6),
            Flexible(
              child: Text(
                label,
                overflow: TextOverflow.ellipsis,
                style: AppTypography.buttonLabel.copyWith(
                  fontSize: 12,
                  color: isPrimary ? AppColors.backgroundPrimary : AppColors.textPrimary,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
