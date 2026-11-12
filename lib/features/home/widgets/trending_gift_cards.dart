import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/neon_badge.dart';
import '../../../data/models/gift_card_model.dart';
import '../../../data/mock/mock_gift_cards.dart';

class TrendingGiftCardsSection extends StatelessWidget {
  final VoidCallback onViewAll;
  final Function(GiftCardBrand brand) onBrandSelected;

  const TrendingGiftCardsSection({
    super.key,
    required this.onViewAll,
    required this.onBrandSelected,
  });

  @override
  Widget build(BuildContext context) {
    final brands = MockGiftCards.brands.take(4).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Text(
                  'Top Brand Vouchers',
                  style: AppTypography.headingMedium.copyWith(fontSize: 17),
                ),
                const SizedBox(width: 8),
                const NeonBadge(
                  text: 'Instant Savings',
                  variant: NeonBadgeVariant.emerald,
                  padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                ),
              ],
            ),
            GestureDetector(
              onTap: onViewAll,
              child: Row(
                children: [
                  Text(
                    'View All',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.electricCyan,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(width: 2),
                  const Icon(
                    Icons.chevron_right_rounded,
                    size: 16,
                    color: AppColors.electricCyan,
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),
        SizedBox(
          height: 175,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: brands.length,
            separatorBuilder: (_, __) => const SizedBox(width: 12),
            itemBuilder: (context, index) {
              final b = brands[index];
              return _GiftCardItem(
                brand: b,
                onTap: () => onBrandSelected(b),
              );
            },
          ),
        ),
      ],
    );
  }
}

class _GiftCardItem extends StatelessWidget {
  final GiftCardBrand brand;
  final VoidCallback onTap;

  const _GiftCardItem({
    required this.brand,
    required this.onTap,
  });

  Color _getBrandColor() {
    try {
      return Color(int.parse('0xFF${brand.primaryColorHex}'));
    } catch (_) {
      return AppColors.electricCyan;
    }
  }

  @override
  Widget build(BuildContext context) {
    final brandColor = _getBrandColor();

    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        width: 145,
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.surfaceElevated,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: AppColors.borderSubtle,
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.3),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top: Logo Icon & Category
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: brandColor.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: brandColor.withOpacity(0.4),
                      width: 1,
                    ),
                  ),
                  child: Center(
                    child: Text(
                      brand.name[0],
                      style: AppTypography.headingSmall.copyWith(
                        color: brandColor,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                ),
                NeonBadge(
                  text: '${brand.cashbackRate.toStringAsFixed(1)}%',
                  variant: NeonBadgeVariant.emerald,
                  padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                ),
              ],
            ),
            const Spacer(),
            Text(
              brand.name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: AppTypography.headingSmall.copyWith(
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              brand.category,
              style: AppTypography.bodySmall.copyWith(
                fontSize: 10,
                color: AppColors.textMuted,
              ),
            ),
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.electricCyan.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: AppColors.electricCyan.withOpacity(0.3),
                  width: 1,
                ),
              ),
              child: Center(
                child: Text(
                  'Get Code',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.electricCyan,
                    fontWeight: FontWeight.w700,
                    fontSize: 11,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
