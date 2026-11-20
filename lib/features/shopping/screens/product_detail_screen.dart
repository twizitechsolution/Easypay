import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../core/widgets/neon_badge.dart';
import '../../../core/widgets/neon_button.dart';
import '../../../data/models/product_model.dart';
import '../../../data/repositories/cart_repository.dart';
import 'cart_checkout_screen.dart';

class ProductDetailScreen extends StatefulWidget {
  final Product product;

  const ProductDetailScreen({
    super.key,
    required this.product,
  });

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  late String _selectedVariant;
  int _quantity = 1;

  @override
  void initState() {
    super.initState();
    _selectedVariant = widget.product.availableVariants.first;
  }

  void _addToCart({bool navigate = false}) {
    CartRepository().addToCart(
      widget.product,
      _selectedVariant,
      quantity: _quantity,
    );

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${widget.product.title} added to cart!'),
        behavior: SnackBarBehavior.floating,
        action: SnackBarAction(
          label: 'VIEW CART',
          textColor: AppColors.electricCyan,
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const CartCheckoutScreen()),
            );
          },
        ),
      ),
    );

    if (navigate) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => const CartCheckoutScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.product;

    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(
        title: Text(p.category),
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_bag_outlined),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const CartCheckoutScreen()),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product Hero Image Card
            Container(
              height: 280,
              width: double.infinity,
              margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              decoration: BoxDecoration(
                color: AppColors.surfaceElevated,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.borderSubtle),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.4),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Icon(
                    p.category == 'Smart Gadgets'
                        ? Icons.watch_rounded
                        : p.category == 'Audio'
                            ? Icons.headphones_rounded
                            : Icons.power_rounded,
                    size: 110,
                    color: AppColors.electricCyan.withOpacity(0.8),
                  ),
                  Positioned(
                    top: 16,
                    left: 16,
                    child: NeonBadge(
                      text: '${p.discountPercent.toInt()}% DISCOUNT',
                      variant: NeonBadgeVariant.magenta,
                      showGlow: true,
                    ),
                  ),
                  Positioned(
                    bottom: 16,
                    right: 16,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.7),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.borderSubtle),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.star_rounded, size: 16, color: Color(0xFFFFD166)),
                          const SizedBox(width: 4),
                          Text(
                            '${p.rating} (${p.reviewsCount})',
                            style: AppTypography.bodySmall.copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Product Details Content
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    p.title,
                    style: AppTypography.headingLarge.copyWith(fontSize: 22),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    p.subtitle,
                    style: AppTypography.bodyMedium.copyWith(color: AppColors.textMuted),
                  ),

                  const SizedBox(height: 16),

                  // Price Row
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(
                        CurrencyFormatter.format(p.salePrice),
                        style: AppTypography.heroBalance.copyWith(
                          fontSize: 28,
                          color: AppColors.cyberEmerald,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Text(
                        CurrencyFormatter.format(p.originalPrice),
                        style: AppTypography.bodyLarge.copyWith(
                          color: AppColors.textTertiary,
                          decoration: TextDecoration.lineThrough,
                        ),
                      ),
                      const SizedBox(width: 12),
                      NeonBadge(
                        text: 'FREE DELIVERY',
                        variant: NeonBadgeVariant.cyan,
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Variant Selection
                  Text(
                    'Color & Variant',
                    style: AppTypography.headingSmall.copyWith(fontSize: 15),
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 10,
                    children: p.availableVariants.map((variant) {
                      final isSelected = _selectedVariant == variant;
                      return GestureDetector(
                        onTap: () => setState(() => _selectedVariant = variant),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? AppColors.electricCyan.withOpacity(0.15)
                                : AppColors.surfaceElevated,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isSelected ? AppColors.electricCyan : AppColors.borderSubtle,
                              width: isSelected ? 1.5 : 1,
                            ),
                          ),
                          child: Text(
                            variant,
                            style: AppTypography.bodySmall.copyWith(
                              color: isSelected ? AppColors.electricCyan : AppColors.textPrimary,
                              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 24),

                  // Key Highlights
                  Text(
                    'Product Highlights',
                    style: AppTypography.headingSmall.copyWith(fontSize: 15),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceElevated,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: Column(
                      children: p.highlights.map((h) {
                        return Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(
                                Icons.check_circle_rounded,
                                size: 16,
                                color: AppColors.cyberEmerald,
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  h,
                                  style: AppTypography.bodySmall.copyWith(
                                    color: AppColors.textPrimary,
                                    height: 1.3,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Description
                  Text(
                    'About this Product',
                    style: AppTypography.headingSmall.copyWith(fontSize: 15),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    p.description,
                    style: AppTypography.bodySmall.copyWith(
                      height: 1.5,
                      color: AppColors.textMuted,
                    ),
                  ),

                  const SizedBox(height: 100), // Bottom bar padding
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
        decoration: BoxDecoration(
          color: AppColors.surfaceElevated.withOpacity(0.95),
          border: const Border(top: BorderSide(color: AppColors.borderSubtle)),
        ),
        child: Row(
          children: [
            Expanded(
              child: NeonButton(
                text: 'Add to Cart',
                variant: NeonButtonVariant.glass,
                icon: Icons.add_shopping_cart_rounded,
                onPressed: () => _addToCart(navigate: false),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: NeonButton(
                text: 'Buy Now',
                variant: NeonButtonVariant.cyan,
                icon: Icons.flash_on_rounded,
                onPressed: () => _addToCart(navigate: true),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
