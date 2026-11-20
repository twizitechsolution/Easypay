import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../core/widgets/neon_badge.dart';
import '../../../data/models/recharge_model.dart';

class PlanCard extends StatelessWidget {
  final RechargePlan plan;
  final VoidCallback onSelectPlan;

  const PlanCard({
    super.key,
    required this.plan,
    required this.onSelectPlan,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: plan.isPopular
              ? AppColors.electricCyan.withOpacity(0.4)
              : AppColors.borderSubtle,
          width: plan.isPopular ? 1.4 : 1,
        ),
        boxShadow: plan.isPopular
            ? [
                BoxShadow(
                  color: AppColors.electricCyan.withOpacity(0.1),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                ),
              ]
            : null,
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Bar: Price, Validity & Popular badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: plan.isPopular
                    ? const Color(0xFF192434)
                    : const Color(0xFF151C26),
                border: const Border(
                  bottom: BorderSide(color: AppColors.borderSubtle, width: 0.8),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(
                        CurrencyFormatter.format(plan.price),
                        style: AppTypography.heroBalance.copyWith(
                          fontSize: 24,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '(${plan.validity})',
                        style: AppTypography.bodySmall.copyWith(
                          color: AppColors.electricCyan,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  if (plan.isPopular)
                    const NeonBadge(
                      text: 'BESTSELLER',
                      variant: NeonBadgeVariant.emerald,
                      showGlow: true,
                      padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    )
                  else
                    NeonBadge(
                      text: plan.category,
                      variant: NeonBadgeVariant.cyan,
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    ),
                ],
              ),
            ),

            // Plan Specs Matrix (Data, Voice, SMS, Validity)
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      _buildSpecItem('DATA', plan.data, Icons.data_usage_rounded),
                      _buildSpecItem('VOICE', plan.voice, Icons.phone_in_talk_rounded),
                      _buildSpecItem('SMS', plan.sms, Icons.sms_outlined),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // Description
                  Text(
                    plan.description,
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.textMuted,
                      height: 1.3,
                    ),
                  ),

                  // Perks / Subscriptions
                  if (plan.perks.isNotEmpty) ...[
                    const SizedBox(height: 10),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: plan.perks.map((p) {
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppColors.backgroundSecondary,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: AppColors.borderSubtle),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.stars_rounded,
                                size: 12,
                                color: Color(0xFFFFD166),
                              ),
                              const SizedBox(width: 4),
                              Text(
                                p,
                                style: AppTypography.bodySmall.copyWith(
                                  fontSize: 10,
                                  color: AppColors.textPrimary,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                  ],

                  const SizedBox(height: 16),

                  // Select Plan Action
                  GestureDetector(
                    onTap: onSelectPlan,
                    child: Container(
                      width: double.infinity,
                      height: 42,
                      decoration: BoxDecoration(
                        gradient: AppColors.primaryCyanGradient,
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: AppColors.cyanGlow(blur: 10, opacity: 0.3),
                      ),
                      child: Center(
                        child: Text(
                          'Recharge with ${CurrencyFormatter.format(plan.price)}',
                          style: AppTypography.buttonLabel.copyWith(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSpecItem(String label, String value, IconData icon) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: AppTypography.bodySmall.copyWith(
              fontSize: 9,
              letterSpacing: 0.8,
              color: AppColors.textTertiary,
            ),
          ),
          const SizedBox(height: 2),
          Row(
            children: [
              Icon(icon, size: 12, color: AppColors.electricCyan),
              const SizedBox(width: 4),
              Flexible(
                child: Text(
                  value,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTypography.bodySmall.copyWith(
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                    fontSize: 11,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
