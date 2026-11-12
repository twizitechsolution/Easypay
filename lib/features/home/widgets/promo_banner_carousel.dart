import 'dart:async';
import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/neon_badge.dart';

class PromoBannerData {
  final String title;
  final String subtitle;
  final String badgeText;
  final NeonBadgeVariant badgeVariant;
  final List<Color> gradientColors;
  final IconData icon;

  const PromoBannerData({
    required this.title,
    required this.subtitle,
    required this.badgeText,
    required this.badgeVariant,
    required this.gradientColors,
    required this.icon,
  });
}

class PromoBannerCarousel extends StatefulWidget {
  final VoidCallback onBannerTap;

  const PromoBannerCarousel({
    super.key,
    required this.onBannerTap,
  });

  @override
  State<PromoBannerCarousel> createState() => _PromoBannerCarouselState();
}

class _PromoBannerCarouselState extends State<PromoBannerCarousel> {
  final PageController _pageController = PageController(viewportFraction: 0.92);
  int _currentIndex = 0;
  Timer? _autoSlideTimer;

  final List<PromoBannerData> banners = const [
    PromoBannerData(
      title: 'Flat 6% Cashback on Swiggy & Zomato',
      subtitle: 'Instant discount vouchers with no minimum order value.',
      badgeText: 'LIMITED TIME',
      badgeVariant: NeonBadgeVariant.emerald,
      gradientColors: [Color(0xFF0F383E), Color(0xFF142436)],
      icon: Icons.fastfood_rounded,
    ),
    PromoBannerData(
      title: 'Zero Convenience Fee on All UPI Transfers',
      subtitle: 'Pay any merchant QR code and earn scratch cards.',
      badgeText: 'ZERO CHARGES',
      badgeVariant: NeonBadgeVariant.cyan,
      gradientColors: [Color(0xFF1B2A4A), Color(0xFF10192A)],
      icon: Icons.flash_on_rounded,
    ),
    PromoBannerData(
      title: 'Curated Dropshipping Flash Sale',
      subtitle: 'Up to 60% OFF on AeroSync Smartwatch & ANC Audio.',
      badgeText: 'MEGA SALE',
      badgeVariant: NeonBadgeVariant.magenta,
      gradientColors: [Color(0xFF38153A), Color(0xFF1B142D)],
      icon: Icons.shopping_bag_rounded,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    _autoSlideTimer = Timer.periodic(const Duration(seconds: 4), (_) {
      if (!mounted) return;
      final nextIndex = (_currentIndex + 1) % banners.length;
      _pageController.animateToPage(
        nextIndex,
        duration: const Duration(milliseconds: 500),
        curve: Curves.easeInOutCubic,
      );
    });
  }

  @override
  void dispose() {
    _autoSlideTimer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          height: 120,
          child: PageView.builder(
            controller: _pageController,
            onPageChanged: (index) => setState(() => _currentIndex = index),
            itemCount: banners.length,
            itemBuilder: (context, index) {
              final b = banners[index];
              return GestureDetector(
                onTap: widget.onBannerTap,
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 6),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(18),
                    gradient: LinearGradient(
                      colors: b.gradientColors,
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    border: Border.all(
                      color: AppColors.borderSubtle.withOpacity(0.8),
                      width: 1,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.25),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            NeonBadge(
                              text: b.badgeText,
                              variant: b.badgeVariant,
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              b.title,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: AppTypography.headingSmall.copyWith(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              b.subtitle,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: AppTypography.bodySmall.copyWith(
                                color: AppColors.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.08),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          b.icon,
                          color: AppColors.electricCyan,
                          size: 24,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 10),
        // Dots indicator
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(banners.length, (index) {
            final isActive = _currentIndex == index;
            return AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              margin: const EdgeInsets.symmetric(horizontal: 3),
              width: isActive ? 18 : 6,
              height: 4,
              decoration: BoxDecoration(
                color: isActive ? AppColors.electricCyan : AppColors.borderSubtle,
                borderRadius: BorderRadius.circular(2),
              ),
            );
          }),
        ),
      ],
    );
  }
}
