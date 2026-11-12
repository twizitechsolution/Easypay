import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../core/widgets/neon_badge.dart';
import 'mobile_recharge_screen.dart';
import 'dth_fastag_screen.dart';
import 'utility_bill_screen.dart';

class RechargeHubScreen extends StatelessWidget {
  const RechargeHubScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      body: SafeArea(
        bottom: false,
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            // Top Header
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 14),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Recharge & Bills',
                          style: AppTypography.headingLarge.copyWith(fontSize: 22),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Bharat Connect BBPS Bill Payment Portal',
                          style: AppTypography.bodySmall,
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.cyberEmerald.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.cyberEmerald.withOpacity(0.4)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.verified_user_rounded, size: 14, color: AppColors.cyberEmerald),
                          const SizedBox(width: 4),
                          Text(
                            'BBPS 2.0',
                            style: AppTypography.bodySmall.copyWith(
                              color: AppColors.cyberEmerald,
                              fontWeight: FontWeight.w700,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Cash Back Promo Card
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF142436), Color(0xFF0F323A)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: AppColors.electricCyan.withOpacity(0.3)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.flash_on_rounded, size: 30, color: AppColors.electricCyan),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Instant 2% Cashback on Mobile & FASTag',
                              style: AppTypography.headingSmall.copyWith(fontSize: 13, fontWeight: FontWeight.w700),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Credited directly to Easy Pay Wallet with zero convenience fee.',
                              style: AppTypography.bodySmall.copyWith(fontSize: 11),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Main Utilities Grid
            SliverPadding(
              padding: const EdgeInsets.all(20),
              sliver: SliverGrid.count(
                crossAxisCount: 2,
                childAspectRatio: 1.15,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                children: [
                  _HubCategoryCard(
                    title: 'Mobile Recharge',
                    subtitle: 'Jio, Airtel, Vi, BSNL',
                    icon: Icons.phone_android_rounded,
                    color: AppColors.electricCyan,
                    badge: '2% CASHBACK',
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const MobileRechargeScreen()),
                      );
                    },
                  ),
                  _HubCategoryCard(
                    title: 'DTH Satellite TV',
                    subtitle: 'Tata Play, Airtel, Dish',
                    icon: Icons.tv_rounded,
                    color: const Color(0xFF60EFA0),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const DthFastagScreen(initialIndex: 0)),
                      );
                    },
                  ),
                  _HubCategoryCard(
                    title: 'FASTag Toll',
                    subtitle: 'ICICI, HDFC, SBI, Paytm',
                    icon: Icons.directions_car_filled_rounded,
                    color: const Color(0xFFFF9F43),
                    badge: 'INSTANT PASS',
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const DthFastagScreen(initialIndex: 1)),
                      );
                    },
                  ),
                  _HubCategoryCard(
                    title: 'Electricity Bill',
                    subtitle: '200+ State Boards',
                    icon: Icons.bolt_rounded,
                    color: const Color(0xFFFFD166),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const UtilityBillScreen(initialCategory: 'Electricity')),
                      );
                    },
                  ),
                  _HubCategoryCard(
                    title: 'Water Bill',
                    subtitle: 'DJB, BWSSB, MCGM',
                    icon: Icons.water_drop_rounded,
                    color: const Color(0xFF4FACFE),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const UtilityBillScreen(initialCategory: 'Water')),
                      );
                    },
                  ),
                  _HubCategoryCard(
                    title: 'Piped Gas',
                    subtitle: 'IGL, MGL, Adani Gas',
                    icon: Icons.local_fire_department_rounded,
                    color: AppColors.neonMagenta,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const UtilityBillScreen(initialCategory: 'Piped Gas')),
                      );
                    },
                  ),
                ],
              ),
            ),

            // Quick Repeat Recharges Strip
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Recent Recharges & Bills',
                      style: AppTypography.headingSmall.copyWith(fontSize: 16),
                    ),
                    const SizedBox(height: 12),
                    _RecentRechargeTile(
                      title: 'Reliance Jio (+91 98765 43210)',
                      subtitle: 'Last recharged: 28 days pack (₹299)',
                      amount: 299,
                      onRepeat: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const MobileRechargeScreen()),
                        );
                      },
                    ),
                    const SizedBox(height: 10),
                    _RecentRechargeTile(
                      title: 'Tata Play (ID: 1098234812)',
                      subtitle: 'Premium Super Hindi HD Pack',
                      amount: 350,
                      onRepeat: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const DthFastagScreen(initialIndex: 0)),
                        );
                      },
                    ),
                    const SizedBox(height: 10),
                    _RecentRechargeTile(
                      title: 'ICICI FASTag (MH 02 EK 8821)',
                      subtitle: 'Toll plaza auto-recharge',
                      amount: 1000,
                      onRepeat: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const DthFastagScreen(initialIndex: 1)),
                        );
                      },
                    ),
                    const SizedBox(height: 110),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _HubCategoryCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final String? badge;
  final VoidCallback onTap;

  const _HubCategoryCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    this.badge,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.surfaceElevated,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: AppColors.borderSubtle),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.25),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.12),
                    shape: BoxShape.circle,
                    border: Border.all(color: color.withOpacity(0.3)),
                  ),
                  child: Icon(icon, size: 22, color: color),
                ),
                if (badge != null)
                  NeonBadge(
                    text: badge!,
                    variant: NeonBadgeVariant.emerald,
                    padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                  ),
              ],
            ),
            const Spacer(),
            Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: AppTypography.headingSmall.copyWith(fontSize: 14),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: AppTypography.bodySmall.copyWith(fontSize: 10),
            ),
          ],
        ),
      ),
    );
  }
}

class _RecentRechargeTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final double amount;
  final VoidCallback onRepeat;

  const _RecentRechargeTile({
    required this.title,
    required this.subtitle,
    required this.amount,
    required this.onRepeat,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.electricCyan.withOpacity(0.12),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.history_rounded, size: 20, color: AppColors.electricCyan),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTypography.headingSmall.copyWith(fontSize: 13),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTypography.bodySmall.copyWith(fontSize: 11),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                CurrencyFormatter.format(amount),
                style: AppTypography.headingSmall.copyWith(fontSize: 14, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 2),
              GestureDetector(
                onTap: onRepeat,
                child: Text(
                  'Repeat',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.electricCyan,
                    fontWeight: FontWeight.w700,
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
