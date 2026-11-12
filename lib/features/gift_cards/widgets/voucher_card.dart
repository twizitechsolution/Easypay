import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../core/widgets/neon_badge.dart';
import '../../../data/models/gift_card_model.dart';
import 'qr_barcode_dialog.dart';

class VoucherCard extends StatefulWidget {
  final UserVoucher voucher;
  final VoidCallback onToggleRedemption;

  const VoucherCard({
    super.key,
    required this.voucher,
    required this.onToggleRedemption,
  });

  @override
  State<VoucherCard> createState() => _VoucherCardState();
}

class _VoucherCardState extends State<VoucherCard> {
  bool _showPin = false;

  void _copyToClipboard(String text, String label) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$label copied to clipboard!'),
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 1),
      ),
    );
  }

  Future<void> _redeemUrl() async {
    final uri = Uri.parse(widget.voucher.redemptionUrl);
    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        _showRedeemInstructions();
      }
    } catch (_) {
      _showRedeemInstructions();
    }
  }

  void _showRedeemInstructions() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surfaceElevated,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: AppColors.borderSubtle),
        ),
        title: Text(
          'How to Redeem ${widget.voucher.brandName}',
          style: AppTypography.headingSmall.copyWith(color: AppColors.electricCyan),
        ),
        content: Text(
          '1. Open the ${widget.voucher.brandName} app or website.\n'
          '2. Go to Account > Add Gift Card / Wallet.\n'
          '3. Enter Card Number: ${widget.voucher.cardNumber}\n'
          '4. Enter PIN: ${widget.voucher.pin}\n'
          '5. The balance of ${CurrencyFormatter.format(widget.voucher.denomination)} will be credited instantly!',
          style: AppTypography.bodyMedium.copyWith(color: AppColors.textPrimary, height: 1.4),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('GOT IT'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final v = widget.voucher;
    final daysLeft = v.expiryDate.difference(DateTime.now()).inDays;

    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: v.isRedeemed ? AppColors.borderSubtle : AppColors.electricCyan.withOpacity(0.3),
          width: 1.2,
        ),
        boxShadow: v.isRedeemed
            ? []
            : [
                BoxShadow(
                  color: AppColors.electricCyan.withOpacity(0.08),
                  blurRadius: 18,
                  offset: const Offset(0, 6),
                ),
              ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Column(
          children: [
            // Top Ribbon with Brand & Denomination
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              decoration: BoxDecoration(
                color: v.isRedeemed
                    ? const Color(0xFF161C26)
                    : const Color(0xFF1B2332),
                border: const Border(
                  bottom: BorderSide(color: AppColors.borderSubtle, width: 0.8),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.electricCyan.withOpacity(0.15),
                          border: Border.all(color: AppColors.electricCyan.withOpacity(0.3)),
                        ),
                        child: Center(
                          child: Text(
                            v.brandName[0],
                            style: AppTypography.headingSmall.copyWith(
                              color: AppColors.electricCyan,
                              fontSize: 16,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            v.brandName,
                            style: AppTypography.headingSmall.copyWith(
                              fontSize: 15,
                              color: v.isRedeemed ? AppColors.textMuted : AppColors.textPrimary,
                            ),
                          ),
                          Text(
                            v.category,
                            style: AppTypography.bodySmall.copyWith(
                              fontSize: 10,
                              color: AppColors.textTertiary,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        CurrencyFormatter.format(v.denomination),
                        style: AppTypography.headingSmall.copyWith(
                          color: v.isRedeemed ? AppColors.textMuted : AppColors.cyberEmerald,
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 2),
                      NeonBadge(
                        text: v.isRedeemed ? 'REDEEMED' : '+${CurrencyFormatter.format(v.cashbackEarned)} SAVED',
                        variant: v.isRedeemed ? NeonBadgeVariant.cyan : NeonBadgeVariant.emerald,
                        padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Card Number & PIN Body
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // 16-Digit Code Row
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    decoration: BoxDecoration(
                      color: AppColors.backgroundPrimary.withOpacity(0.6),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.borderSubtle.withOpacity(0.8)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'VOUCHER CODE',
                              style: AppTypography.bodySmall.copyWith(
                                fontSize: 9,
                                letterSpacing: 0.8,
                                color: AppColors.textMuted,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              v.cardNumber,
                              style: AppTypography.bodyMedium.copyWith(
                                letterSpacing: 1.2,
                                fontWeight: FontWeight.w600,
                                color: v.isRedeemed ? AppColors.textMuted : AppColors.textPrimary,
                              ),
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.copy_rounded, size: 16, color: AppColors.electricCyan),
                              onPressed: () => _copyToClipboard(v.cardNumber, 'Voucher code'),
                              tooltip: 'Copy Code',
                            ),
                            IconButton(
                              icon: const Icon(Icons.qr_code_2_rounded, size: 20, color: AppColors.electricCyan),
                              onPressed: () => QrBarcodeDialog.show(context, v),
                              tooltip: 'Show Barcode / QR',
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 10),

                  // PIN and Expiration
                  Row(
                    children: [
                      // PIN
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                          decoration: BoxDecoration(
                            color: AppColors.backgroundPrimary.withOpacity(0.6),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.borderSubtle.withOpacity(0.8)),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'PIN',
                                    style: AppTypography.bodySmall.copyWith(
                                      fontSize: 9,
                                      letterSpacing: 0.8,
                                      color: AppColors.textMuted,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    _showPin ? v.pin : '••••',
                                    style: AppTypography.bodyMedium.copyWith(
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.cyberEmerald,
                                      letterSpacing: 2,
                                    ),
                                  ),
                                ],
                              ),
                              Row(
                                children: [
                                  GestureDetector(
                                    onTap: () => setState(() => _showPin = !_showPin),
                                    child: Icon(
                                      _showPin ? Icons.visibility_off_rounded : Icons.visibility_rounded,
                                      size: 16,
                                      color: AppColors.textMuted,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  GestureDetector(
                                    onTap: () => _copyToClipboard(v.pin, 'PIN'),
                                    child: const Icon(
                                      Icons.copy_rounded,
                                      size: 16,
                                      color: AppColors.cyberEmerald,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      // Expiry Info
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        decoration: BoxDecoration(
                          color: AppColors.backgroundPrimary.withOpacity(0.6),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.borderSubtle.withOpacity(0.8)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'VALIDITY',
                              style: AppTypography.bodySmall.copyWith(
                                fontSize: 9,
                                letterSpacing: 0.8,
                                color: AppColors.textMuted,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              v.isRedeemed ? 'Archived' : '${daysLeft}d left',
                              style: AppTypography.bodySmall.copyWith(
                                fontWeight: FontWeight.w600,
                                color: v.isRedeemed ? AppColors.textMuted : const Color(0xFFFFD166),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 14),

                  // Bottom Action Buttons: Redeem Now & Status toggle
                  Row(
                    children: [
                      // Redeem URL Button
                      Expanded(
                        child: GestureDetector(
                          onTap: _redeemUrl,
                          child: Container(
                            height: 40,
                            decoration: BoxDecoration(
                              gradient: v.isRedeemed ? null : AppColors.primaryCyanGradient,
                              color: v.isRedeemed ? AppColors.surfaceElevated : null,
                              borderRadius: BorderRadius.circular(10),
                              boxShadow: v.isRedeemed ? [] : AppColors.cyanGlow(blur: 8, opacity: 0.25),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.open_in_new_rounded,
                                  size: 14,
                                  color: v.isRedeemed ? AppColors.textMuted : AppColors.backgroundPrimary,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  'Redeem Now',
                                  style: AppTypography.buttonLabel.copyWith(
                                    fontSize: 12,
                                    color: v.isRedeemed ? AppColors.textMuted : AppColors.backgroundPrimary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      // Mark Redeemed / Unmark Toggle
                      GestureDetector(
                        onTap: widget.onToggleRedemption,
                        child: Container(
                          height: 40,
                          padding: const EdgeInsets.symmetric(horizontal: 14),
                          decoration: BoxDecoration(
                            color: AppColors.surfaceElevated,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: AppColors.borderSubtle),
                          ),
                          child: Center(
                            child: Text(
                              v.isRedeemed ? 'Mark Active' : 'Mark Used',
                              style: AppTypography.bodySmall.copyWith(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: v.isRedeemed ? AppColors.cyberEmerald : AppColors.textMuted,
                              ),
                            ),
                          ),
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
