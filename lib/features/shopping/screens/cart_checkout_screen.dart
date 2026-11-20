import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../core/widgets/neon_badge.dart';
import '../../../core/widgets/neon_button.dart';
import '../../../data/models/cart_item_model.dart';
import '../../../data/repositories/cart_repository.dart';
import '../../payments/screens/upi_payment_sheet.dart';
import 'order_tracking_screen.dart';

class CartCheckoutScreen extends StatefulWidget {
  const CartCheckoutScreen({super.key});

  @override
  State<CartCheckoutScreen> createState() => _CartCheckoutScreenState();
}

class _CartCheckoutScreenState extends State<CartCheckoutScreen> {
  final CartRepository _cartRepo = CartRepository();
  final TextEditingController _promoController = TextEditingController();
  bool _isCheckingOut = false;

  @override
  void initState() {
    super.initState();
    _cartRepo.addListener(_onCartChanged);
  }

  @override
  void dispose() {
    _promoController.dispose();
    _cartRepo.removeListener(_onCartChanged);
    super.dispose();
  }

  void _onCartChanged() {
    if (mounted) setState(() {});
  }

  void _applyPromo() {
    final success = _cartRepo.applyPromoCode(_promoController.text);
    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Promo Code ${_cartRepo.appliedPromoCode} applied!'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Invalid code! Try "NEON20" for 20% discount.'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  void _handleCheckout() {
    if (_cartRepo.items.isEmpty) return;

    UpiPaymentSheet.show(
      context,
      amount: _cartRepo.totalAmount,
      payeeName: 'Easy Pay Direct Commerce',
      transactionTitle: 'Tech Store Checkout (${_cartRepo.totalItemCount} items)',
      cashbackEarned: 35.0,
    ).then((_) {
      if (_cartRepo.items.isNotEmpty) {
        final order = _cartRepo.checkout();
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => OrderTrackingScreen(order: order),
          ),
        );
      }
    });
  }

  void _showAddressSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFF131924),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          border: Border.all(color: AppColors.borderSubtle),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Select Delivery Address',
              style: AppTypography.headingSmall.copyWith(fontSize: 16),
            ),
            const SizedBox(height: 14),
            ..._cartRepo.addresses.map((addr) {
              final isSelected = addr.id == _cartRepo.selectedAddress.id;
              return GestureDetector(
                onTap: () {
                  _cartRepo.selectAddress(addr);
                  Navigator.pop(ctx);
                },
                child: Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.electricCyan.withOpacity(0.12)
                        : AppColors.surfaceElevated,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: isSelected ? AppColors.electricCyan : AppColors.borderSubtle,
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
                        color: isSelected ? AppColors.electricCyan : AppColors.textMuted,
                        size: 20,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  addr.name,
                                  style: AppTypography.headingSmall.copyWith(fontSize: 14),
                                ),
                                const SizedBox(width: 8),
                                NeonBadge(
                                  text: addr.tag,
                                  variant: NeonBadgeVariant.cyan,
                                  padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                                ),
                              ],
                            ),
                            const SizedBox(height: 3),
                            Text(
                              '${addr.street}, ${addr.city} - ${addr.pincode}',
                              style: AppTypography.bodySmall,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final items = _cartRepo.items;
    final address = _cartRepo.selectedAddress;

    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(
        title: Text('Shopping Cart (${_cartRepo.totalItemCount})'),
      ),
      body: items.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.shopping_cart_outlined, size: 72, color: AppColors.textTertiary),
                  const SizedBox(height: 16),
                  Text(
                    'Your cart is currently empty',
                    style: AppTypography.headingSmall.copyWith(color: AppColors.textMuted),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Explore trending gadgets in the Easy Pay Store',
                    style: AppTypography.bodySmall,
                  ),
                ],
              ),
            )
          : SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Delivery Address Banner
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceElevated,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.location_on_rounded,
                          color: AppColors.electricCyan,
                          size: 24,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(
                                    'Delivering to ${address.name}',
                                    style: AppTypography.headingSmall.copyWith(fontSize: 13),
                                  ),
                                  const SizedBox(width: 6),
                                  NeonBadge(
                                    text: address.tag,
                                    variant: NeonBadgeVariant.cyan,
                                    padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 2),
                              Text(
                                '${address.street}, ${address.city}',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: AppTypography.bodySmall,
                              ),
                            ],
                          ),
                        ),
                        TextButton(
                          onPressed: _showAddressSheet,
                          child: Text(
                            'CHANGE',
                            style: AppTypography.buttonLabel.copyWith(
                              fontSize: 11,
                              color: AppColors.electricCyan,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Cart Items List
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: items.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final item = items[index];
                      return _CartItemTile(
                        item: item,
                        onIncrement: () => _cartRepo.updateQuantity(item, 1),
                        onDecrement: () => _cartRepo.updateQuantity(item, -1),
                        onDelete: () => _cartRepo.removeItem(item),
                      );
                    },
                  ),

                  const SizedBox(height: 20),

                  // Promo Code Input
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceElevated,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.local_offer_outlined, color: AppColors.electricCyan, size: 20),
                        const SizedBox(width: 10),
                        Expanded(
                          child: _cartRepo.appliedPromoCode != null
                              ? Row(
                                  children: [
                                    NeonBadge(
                                      text: '${_cartRepo.appliedPromoCode} APPLIED',
                                      variant: NeonBadgeVariant.emerald,
                                      showGlow: true,
                                    ),
                                    const Spacer(),
                                    IconButton(
                                      icon: const Icon(Icons.close_rounded, size: 16),
                                      onPressed: () => _cartRepo.removePromoCode(),
                                    ),
                                  ],
                                )
                              : TextField(
                                  controller: _promoController,
                                  style: AppTypography.bodyMedium.copyWith(color: AppColors.textPrimary),
                                  decoration: const InputDecoration(
                                    hintText: 'Enter Promo (Try "NEON20")',
                                    border: InputBorder.none,
                                    enabledBorder: InputBorder.none,
                                    focusedBorder: InputBorder.none,
                                    contentPadding: EdgeInsets.zero,
                                  ),
                                ),
                        ),
                        if (_cartRepo.appliedPromoCode == null)
                          TextButton(
                            onPressed: _applyPromo,
                            child: Text(
                              'APPLY',
                              style: AppTypography.buttonLabel.copyWith(
                                color: AppColors.electricCyan,
                                fontSize: 12,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Bill Price Breakdown
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceElevated,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Cart Subtotal', style: AppTypography.bodyMedium),
                            Text(
                              CurrencyFormatter.format(_cartRepo.subtotal),
                              style: AppTypography.bodyMedium.copyWith(
                                color: AppColors.textPrimary,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                        if (_cartRepo.promoDiscountAmount > 0) ...[
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Promo Discount', style: AppTypography.bodyMedium),
                              Text(
                                '- ${CurrencyFormatter.format(_cartRepo.promoDiscountAmount)}',
                                style: AppTypography.bodyMedium.copyWith(
                                  color: AppColors.cyberEmerald,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ],
                          ),
                        ],
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Delivery Fee', style: AppTypography.bodyMedium),
                            Text(
                              _cartRepo.deliveryFee == 0
                                  ? 'FREE'
                                  : CurrencyFormatter.format(_cartRepo.deliveryFee),
                              style: AppTypography.bodyMedium.copyWith(
                                color: _cartRepo.deliveryFee == 0
                                    ? AppColors.cyberEmerald
                                    : AppColors.textPrimary,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                        const Divider(color: AppColors.borderSubtle, height: 20),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Final Amount Payable',
                              style: AppTypography.headingSmall.copyWith(fontSize: 15),
                            ),
                            Text(
                              CurrencyFormatter.format(_cartRepo.totalAmount),
                              style: AppTypography.headingMedium.copyWith(
                                color: AppColors.electricCyan,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 30),

                  // Checkout CTA Button
                  NeonButton(
                    text: 'Pay & Place Order (${CurrencyFormatter.format(_cartRepo.totalAmount)})',
                    variant: NeonButtonVariant.cyan,
                    isLoading: _isCheckingOut,
                    width: double.infinity,
                    height: 54,
                    icon: Icons.shield_rounded,
                    onPressed: _handleCheckout,
                  ),

                  const SizedBox(height: 30),
                ],
              ),
            ),
    );
  }
}

class _CartItemTile extends StatelessWidget {
  final CartItem item;
  final VoidCallback onIncrement;
  final VoidCallback onDecrement;
  final VoidCallback onDelete;

  const _CartItemTile({
    required this.item,
    required this.onIncrement,
    required this.onDecrement,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Row(
        children: [
          // Thumbnail
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: AppColors.backgroundSecondary,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: const Center(
              child: Icon(
                Icons.devices_other_rounded,
                size: 30,
                color: AppColors.electricCyan,
              ),
            ),
          ),
          const SizedBox(width: 12),
          // Product Details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.product.title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTypography.headingSmall.copyWith(fontSize: 13),
                ),
                const SizedBox(height: 2),
                Text(
                  'Variant: ${item.selectedVariant}',
                  style: AppTypography.bodySmall.copyWith(fontSize: 11),
                ),
                const SizedBox(height: 4),
                Text(
                  CurrencyFormatter.format(item.totalPrice),
                  style: AppTypography.headingSmall.copyWith(
                    color: AppColors.cyberEmerald,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
          // Quantity Adjuster
          Container(
            decoration: BoxDecoration(
              color: AppColors.backgroundPrimary,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: Row(
              children: [
                GestureDetector(
                  onTap: onDecrement,
                  child: const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    child: Icon(Icons.remove, size: 14, color: AppColors.textPrimary),
                  ),
                ),
                Text(
                  item.quantity.toString(),
                  style: AppTypography.buttonLabel.copyWith(
                    color: AppColors.textPrimary,
                    fontSize: 12,
                  ),
                ),
                GestureDetector(
                  onTap: onIncrement,
                  child: const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    child: Icon(Icons.add, size: 14, color: AppColors.electricCyan),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
