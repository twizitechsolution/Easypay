import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/neon_badge.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../data/models/product_model.dart';
import '../../../data/mock/mock_products.dart';

class FeaturedProductsSection extends StatelessWidget {
  final VoidCallback onViewStore;
  final Function(Product product) onProductSelected;

  const FeaturedProductsSection({
    super.key,
    required this.onViewStore,
    required this.onProductSelected,
  });

  @override
  Widget build(BuildContext context) {
    final products = MockProducts.featured;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Text(
                  'Curated Tech Store',
                  style: AppTypography.headingMedium.copyWith(fontSize: 17),
                ),
                const SizedBox(width: 8),
                const NeonBadge(
                  text: 'Up to 60% OFF',
                  variant: NeonBadgeVariant.magenta,
                  padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                ),
              ],
            ),
            GestureDetector(
              onTap: onViewStore,
              child: Row(
                children: [
                  Text(
                    'Explore Shop',
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
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: products.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final p = products[index];
            return _ProductCard(
              product: p,
              onTap: () => onProductSelected(p),
            );
          },
        ),
      ],
    );
  }
}

class _ProductCard extends StatelessWidget {
  final Product product;
  final VoidCallback onTap;

  const _ProductCard({
    required this.product,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.surfaceElevated,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: AppColors.borderSubtle,
            width: 1,
          ),
        ),
        child: Row(
          children: [
            // Product image preview or stylized placeholder with neon border
            Container(
              width: 78,
              height: 78,
              decoration: BoxDecoration(
                color: AppColors.backgroundSecondary,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: AppColors.borderSubtle,
                  width: 1,
                ),
              ),
              child: Center(
                child: Icon(
                  product.category == 'Smart Gadgets'
                      ? Icons.watch_rounded
                      : Icons.headphones_rounded,
                  size: 36,
                  color: AppColors.electricCyan,
                ),
              ),
            ),
            const SizedBox(width: 14),
            // Product details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: AppTypography.headingSmall.copyWith(
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    product.subtitle,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.textMuted,
                      fontSize: 11,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Text(
                        CurrencyFormatter.format(product.salePrice),
                        style: AppTypography.headingSmall.copyWith(
                          color: AppColors.cyberEmerald,
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        CurrencyFormatter.format(product.originalPrice),
                        style: AppTypography.bodySmall.copyWith(
                          fontSize: 11,
                          color: AppColors.textTertiary,
                          decoration: TextDecoration.lineThrough,
                        ),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          gradient: AppColors.primaryCyanGradient,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          'Buy Now',
                          style: AppTypography.buttonLabel.copyWith(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
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
