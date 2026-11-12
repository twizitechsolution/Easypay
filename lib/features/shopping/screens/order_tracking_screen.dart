import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../core/widgets/neon_badge.dart';
import '../../../core/widgets/neon_button.dart';
import '../../../data/models/cart_item_model.dart';

class OrderTrackingScreen extends StatelessWidget {
  final OrderModel order;

  const OrderTrackingScreen({
    super.key,
    required this.order,
  });

  @override
  Widget build(BuildContext context) {
    final stages = [
      {'title': 'Order Placed & Confirmed', 'desc': 'Payment verified via UPI', 'done': true},
      {'title': 'Packed & Inspected', 'desc': 'Item quality audit completed', 'done': true},
      {'title': 'Shipped & In Transit', 'desc': 'Dispatched via Delhivery Express', 'done': true},
      {'title': 'Out for Delivery', 'desc': 'Courier agent assigned', 'done': false},
      {'title': 'Delivered', 'desc': 'Estimated by tomorrow 4:00 PM', 'done': false},
    ];

    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(
        title: const Text('Order Tracking'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.close_rounded),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Order Confirmed Hero Banner
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0C2B24), Color(0xFF131922)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: AppColors.cyberEmerald.withOpacity(0.4), width: 1.2),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.cyberEmerald.withOpacity(0.12),
                    blurRadius: 20,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.cyberEmerald.withOpacity(0.15),
                      border: Border.all(color: AppColors.cyberEmerald),
                      boxShadow: AppColors.emeraldGlow(blur: 10),
                    ),
                    child: const Icon(Icons.check_rounded, color: AppColors.cyberEmerald, size: 30),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Order Placed Successfully!',
                          style: AppTypography.headingSmall.copyWith(
                            color: AppColors.cyberEmerald,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'ID: ${order.orderId}',
                          style: AppTypography.bodySmall.copyWith(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'AWB: ${order.trackingNumber}',
                          style: AppTypography.bodySmall.copyWith(fontSize: 10),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Live Stepper Pipeline
            Text(
              'Delivery Status Pipeline',
              style: AppTypography.headingSmall.copyWith(fontSize: 16),
            ),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AppColors.surfaceElevated,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.borderSubtle),
              ),
              child: ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: stages.length,
                separatorBuilder: (_, __) => Padding(
                  padding: const EdgeInsets.only(left: 17),
                  child: Container(
                    height: 24,
                    width: 2,
                    color: AppColors.borderSubtle,
                  ),
                ),
                itemBuilder: (context, index) {
                  final s = stages[index];
                  final isDone = s['done'] as bool;
                  final isCurrent = index == 2; // In Transit

                  return Row(
                    children: [
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: isCurrent
                              ? AppColors.electricCyan.withOpacity(0.2)
                              : isDone
                                  ? AppColors.cyberEmerald.withOpacity(0.15)
                                  : AppColors.backgroundPrimary,
                          border: Border.all(
                            color: isCurrent
                                ? AppColors.electricCyan
                                : isDone
                                    ? AppColors.cyberEmerald
                                    : AppColors.borderSubtle,
                            width: isCurrent ? 2 : 1,
                          ),
                          boxShadow: isCurrent ? AppColors.cyanGlow(blur: 8) : null,
                        ),
                        child: Icon(
                          isDone ? Icons.check_rounded : Icons.radio_button_unchecked,
                          size: 18,
                          color: isCurrent
                              ? AppColors.electricCyan
                              : isDone
                                  ? AppColors.cyberEmerald
                                  : AppColors.textTertiary,
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              s['title'] as String,
                              style: AppTypography.headingSmall.copyWith(
                                fontSize: 13,
                                color: isDone ? AppColors.textPrimary : AppColors.textMuted,
                              ),
                            ),
                            Text(
                              s['desc'] as String,
                              style: AppTypography.bodySmall.copyWith(fontSize: 11),
                            ),
                          ],
                        ),
                      ),
                      if (isCurrent)
                        const NeonBadge(
                          text: 'LIVE',
                          variant: NeonBadgeVariant.cyan,
                          showGlow: true,
                        ),
                    ],
                  );
                },
              ),
            ),

            const SizedBox(height: 24),

            // Delivery Address Box
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surfaceElevated,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderSubtle),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.location_on_rounded, size: 16, color: AppColors.electricCyan),
                      const SizedBox(width: 8),
                      Text(
                        'Delivery Address',
                        style: AppTypography.headingSmall.copyWith(fontSize: 13),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${order.address.name} (${order.address.tag})',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '${order.address.street}, ${order.address.city} - ${order.address.pincode}',
                    style: AppTypography.bodySmall,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Back to Store Button
            NeonButton(
              text: 'Continue Shopping',
              variant: NeonButtonVariant.glass,
              width: double.infinity,
              onPressed: () => Navigator.pop(context),
            ),

            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }
}
