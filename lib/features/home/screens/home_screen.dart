import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/neon_badge.dart';
import '../../gift_cards/screens/gift_card_detail_screen.dart';
import '../../shopping/screens/product_detail_screen.dart';
import '../../recharge/screens/mobile_recharge_screen.dart';
import '../../recharge/screens/dth_fastag_screen.dart';
import '../../recharge/screens/utility_bill_screen.dart';
import '../../payments/screens/upi_payment_sheet.dart';
import '../widgets/hero_quick_pay_card.dart';
import '../widgets/services_grid.dart';
import '../widgets/promo_banner_carousel.dart';
import '../widgets/trending_gift_cards.dart';
import '../widgets/featured_products.dart';
import '../widgets/recent_activity_section.dart';

class HomeScreen extends StatelessWidget {
  final VoidCallback onNavigateToGiftCards;
  final VoidCallback onNavigateToRecharge;
  final VoidCallback onNavigateToShop;

  const HomeScreen({
    super.key,
    required this.onNavigateToGiftCards,
    required this.onNavigateToRecharge,
    required this.onNavigateToShop,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      body: SafeArea(
        bottom: false,
        child: RefreshIndicator(
          color: AppColors.electricCyan,
          backgroundColor: AppColors.surfaceElevated,
          onRefresh: () async {
            await Future.delayed(const Duration(milliseconds: 800));
          },
          child: CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              // Top Dynamic App Bar
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 14),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Avatar & Greeting
                      Row(
                        children: [
                          Container(
                            width: 46,
                            height: 46,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: AppColors.primaryCyanGradient,
                              boxShadow: AppColors.cyanGlow(blur: 10, opacity: 0.35),
                            ),
                            padding: const EdgeInsets.all(2),
                            child: Container(
                              decoration: const BoxDecoration(
                                shape: BoxShape.circle,
                                color: AppColors.surfaceElevated,
                              ),
                              child: const Center(
                                child: Text(
                                  'A',
                                  style: TextStyle(
                                    color: AppColors.electricCyan,
                                    fontWeight: FontWeight.w800,
                                    fontSize: 20,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Namaste, Alex',
                                style: AppTypography.headingSmall.copyWith(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Row(
                                children: [
                                  Container(
                                    width: 6,
                                    height: 6,
                                    decoration: const BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: AppColors.cyberEmerald,
                                    ),
                                  ),
                                  const SizedBox(width: 5),
                                  Text(
                                    'Easy Pay Verified',
                                    style: AppTypography.bodySmall.copyWith(
                                      color: AppColors.cyberEmerald,
                                      fontWeight: FontWeight.w600,
                                      fontSize: 11,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),

                      // Wallet Points & Notifications Bell
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              color: AppColors.surfaceElevated,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: AppColors.borderSubtle,
                                width: 1,
                              ),
                            ),
                            child: Row(
                              children: [
                                const Icon(
                                  Icons.stars_rounded,
                                  size: 16,
                                  color: Color(0xFFFFD166),
                                ),
                                const SizedBox(width: 5),
                                Text(
                                  '240 Pts',
                                  style: AppTypography.bodySmall.copyWith(
                                    color: AppColors.textPrimary,
                                    fontWeight: FontWeight.w700,
                                    fontSize: 11,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          // Notifications Bell
                          GestureDetector(
                            onTap: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('No new notifications right now'),
                                  duration: Duration(seconds: 1),
                                  behavior: SnackBarBehavior.floating,
                                ),
                              );
                            },
                            child: Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                color: AppColors.surfaceElevated,
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: AppColors.borderSubtle,
                                  width: 1,
                                ),
                              ),
                              child: Stack(
                                alignment: Alignment.center,
                                children: [
                                  const Icon(
                                    Icons.notifications_outlined,
                                    size: 20,
                                    color: AppColors.textPrimary,
                                  ),
                                  Positioned(
                                    top: 10,
                                    right: 11,
                                    child: Container(
                                      width: 7,
                                      height: 7,
                                      decoration: const BoxDecoration(
                                        color: AppColors.neonMagenta,
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              // Main Body Content
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    const SizedBox(height: 8),
                    // 1. Hero Quick-Pay Card
                    HeroQuickPayCard(
                      onScanQr: () {
                        UpiPaymentSheet.show(
                          context,
                          amount: 250.0,
                          payeeName: 'Merchant Store / QR',
                          transactionTitle: 'QR Code Scan & Pay',
                          cashbackEarned: 10.0,
                        );
                      },
                      onSendMoney: () {
                        UpiPaymentSheet.show(
                          context,
                          amount: 500.0,
                          payeeName: 'Rahul Sharma',
                          payeeVpa: 'rahul@okhdfcbank',
                          transactionTitle: 'UPI Direct Transfer',
                          cashbackEarned: 15.0,
                        );
                      },
                      onCheckBalance: () {
                        _showFeatureDialog(
                          context,
                          'Linked Accounts & Balance',
                          '• Easy Pay Balance: ₹4,850.50\n• HDFC Bank (•••• 4921): ₹38,290.00\n• ICICI Bank (•••• 1029): ₹12,410.00\n\nAll accounts authenticated via NPCI UPI PIN.',
                        );
                      },
                    ),

                    const SizedBox(height: 24),

                    // 2. Promotional Banner Carousel
                    PromoBannerCarousel(
                      onBannerTap: () => onNavigateToGiftCards(),
                    ),

                    const SizedBox(height: 24),

                    // 3. Recharge & BBPS Grid
                    ServicesGrid(
                      onServiceSelected: (serviceName) {
                        if (serviceName.contains('Mobile')) {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const MobileRechargeScreen()),
                          );
                        } else if (serviceName.contains('DTH')) {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const DthFastagScreen(initialIndex: 0)),
                          );
                        } else if (serviceName.contains('FASTag')) {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const DthFastagScreen(initialIndex: 1)),
                          );
                        } else if (serviceName.contains('Electricity')) {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const UtilityBillScreen(initialCategory: 'Electricity')),
                          );
                        } else if (serviceName.contains('Water')) {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const UtilityBillScreen(initialCategory: 'Water')),
                          );
                        } else {
                          onNavigateToRecharge();
                        }
                      },
                    ),

                    const SizedBox(height: 24),

                    // 4. Trending Gift Cards Spotlight
                    TrendingGiftCardsSection(
                      onViewAll: onNavigateToGiftCards,
                      onBrandSelected: (brand) {
                        Navigator.push(
                          context,
                          MaterialTransitions.fadeThrough(
                            GiftCardDetailScreen(brand: brand),
                          ),
                        );
                      },
                    ),

                    const SizedBox(height: 24),

                    // 5. Featured Dropshipping Tech Deals
                    FeaturedProductsSection(
                      onViewStore: onNavigateToShop,
                      onProductSelected: (product) {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => ProductDetailScreen(product: product),
                          ),
                        );
                      },
                    ),

                    const SizedBox(height: 24),

                    // 6. Recent Transactions Feed
                    RecentActivitySection(
                      onViewHistory: () {
                        _showFeatureDialog(
                          context,
                          'Transaction History',
                          'Showing all verified transactions, cashback rewards, and digital vouchers.',
                        );
                      },
                    ),

                    // Padding for bottom floating navigation bar
                    const SizedBox(height: 110),
                  ]),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showFeatureDialog(BuildContext context, String title, String message) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surfaceElevated,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: AppColors.borderSubtle, width: 1),
        ),
        title: Text(
          title,
          style: AppTypography.headingSmall.copyWith(
            color: AppColors.electricCyan,
          ),
        ),
        content: Text(
          message,
          style: AppTypography.bodyMedium.copyWith(
            color: AppColors.textPrimary,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(
              'OK',
              style: AppTypography.buttonLabel.copyWith(
                color: AppColors.electricCyan,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
