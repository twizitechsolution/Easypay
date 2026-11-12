import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../core/widgets/neon_badge.dart';
import '../../../data/models/gift_card_model.dart';

class QrBarcodeDialog extends StatelessWidget {
  final UserVoucher voucher;

  const QrBarcodeDialog({
    super.key,
    required this.voucher,
  });

  static void show(BuildContext context, UserVoucher voucher) {
    showDialog(
      context: context,
      builder: (ctx) => QrBarcodeDialog(voucher: voucher),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF131924),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: AppColors.electricCyan.withOpacity(0.4),
            width: 1.2,
          ),
          boxShadow: [
            BoxShadow(
              color: AppColors.electricCyan.withOpacity(0.2),
              blurRadius: 30,
              spreadRadius: 2,
            ),
            BoxShadow(
              color: Colors.black.withOpacity(0.8),
              blurRadius: 20,
            ),
          ],
        ),
        padding: const EdgeInsets.all(22),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      voucher.brandName,
                      style: AppTypography.headingSmall.copyWith(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Value: ${CurrencyFormatter.format(voucher.denomination)}',
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.cyberEmerald,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.surfaceElevated,
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: const Icon(
                      Icons.close_rounded,
                      size: 18,
                      color: AppColors.textMuted,
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 20),

            // In-store POS Scan Notice
            const NeonBadge(
              text: 'SCAN AT BILLING COUNTER',
              variant: NeonBadgeVariant.cyan,
              showGlow: true,
              padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            ),

            const SizedBox(height: 18),

            // High Contrast QR Code Scanner Surface
            Container(
              width: 180,
              height: 180,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: AppColors.electricCyan,
                  width: 3,
                ),
                boxShadow: AppColors.cyanGlow(blur: 16, opacity: 0.3),
              ),
              child: CustomPaint(
                painter: _QrMatrixPainter(data: voucher.cardNumber),
              ),
            ),

            const SizedBox(height: 18),

            // Barcode view for 1D laser scanners
            Container(
              height: 52,
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
              ),
              child: CustomPaint(
                painter: _BarcodePainter(seed: voucher.cardNumber.hashCode),
              ),
            ),

            const SizedBox(height: 16),

            // Numeric Card & PIN display with copy
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.surfaceElevated,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.borderSubtle),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'CARD NUMBER',
                            style: AppTypography.bodySmall.copyWith(
                              fontSize: 9,
                              letterSpacing: 1,
                              color: AppColors.textMuted,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            voucher.cardNumber,
                            style: AppTypography.bodyMedium.copyWith(
                              fontWeight: FontWeight.w700,
                              color: AppColors.textPrimary,
                              letterSpacing: 1.2,
                            ),
                          ),
                        ],
                      ),
                      IconButton(
                        icon: const Icon(Icons.copy_rounded, size: 16, color: AppColors.electricCyan),
                        onPressed: () {
                          Clipboard.setData(ClipboardData(text: voucher.cardNumber));
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Card number copied to clipboard!'),
                              duration: Duration(seconds: 1),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                  const Divider(color: AppColors.borderSubtle, height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'SECRET PIN',
                            style: AppTypography.bodySmall.copyWith(
                              fontSize: 9,
                              letterSpacing: 1,
                              color: AppColors.textMuted,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            voucher.pin,
                            style: AppTypography.bodyMedium.copyWith(
                              fontWeight: FontWeight.w800,
                              color: AppColors.cyberEmerald,
                              letterSpacing: 2,
                            ),
                          ),
                        ],
                      ),
                      IconButton(
                        icon: const Icon(Icons.copy_rounded, size: 16, color: AppColors.cyberEmerald),
                        onPressed: () {
                          Clipboard.setData(ClipboardData(text: voucher.pin));
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('PIN copied to clipboard!'),
                              duration: Duration(seconds: 1),
                            ),
                          );
                        },
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

/// Stylized QR pattern painter
class _QrMatrixPainter extends CustomPainter {
  final String data;
  _QrMatrixPainter({required this.data});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.black
      ..style = PaintingStyle.fill;

    const int grid = 17;
    final cellSize = size.width / grid;

    // Corner target finders
    void drawFinder(double x, double y) {
      canvas.drawRect(Rect.fromLTWH(x, y, cellSize * 5, cellSize * 5), paint);
      final whitePaint = Paint()..color = Colors.white;
      canvas.drawRect(Rect.fromLTWH(x + cellSize, y + cellSize, cellSize * 3, cellSize * 3), whitePaint);
      canvas.drawRect(Rect.fromLTWH(x + cellSize * 2, y + cellSize * 2, cellSize, cellSize), paint);
    }

    drawFinder(0, 0);
    drawFinder(size.width - cellSize * 5, 0);
    drawFinder(0, size.height - cellSize * 5);

    // Matrix dots
    final hash = data.hashCode.abs();
    for (int r = 0; r < grid; r++) {
      for (int c = 0; c < grid; c++) {
        // Skip corner areas
        if ((r < 5 && c < 5) || (r < 5 && c >= grid - 5) || (r >= grid - 5 && c < 5)) {
          continue;
        }
        if (((hash >> ((r * c) % 31)) & 1) == 1 || (r + c) % 3 == 0) {
          canvas.drawRRect(
            RRect.fromRectAndRadius(
              Rect.fromLTWH(c * cellSize + 0.5, r * cellSize + 0.5, cellSize - 1, cellSize - 1),
              const Radius.circular(1.5),
            ),
            paint,
          );
        }
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// Barcode 1D strip painter
class _BarcodePainter extends CustomPainter {
  final int seed;
  _BarcodePainter({required this.seed});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.black
      ..style = PaintingStyle.fill;

    double x = 4;
    int state = seed.abs();
    while (x < size.width - 4) {
      final width = (state % 3) + 1.5;
      final gap = ((state >> 2) % 3) + 1.5;
      canvas.drawRect(Rect.fromLTWH(x, 0, width, size.height), paint);
      x += width + gap;
      state = (state * 1103515245 + 12345) & 0x7FFFFFFF;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
