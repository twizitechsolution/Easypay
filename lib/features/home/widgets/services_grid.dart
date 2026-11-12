import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/neon_badge.dart';

class ServiceItemData {
  final String title;
  final IconData icon;
  final Color iconColor;
  final String? badgeText;
  final NeonBadgeVariant badgeVariant;
  final VoidCallback onTap;

  const ServiceItemData({
    required this.title,
    required this.icon,
    required this.iconColor,
    this.badgeText,
    this.badgeVariant = NeonBadgeVariant.emerald,
    required this.onTap,
  });
}

class ServicesGrid extends StatelessWidget {
  final Function(String serviceName) onServiceSelected;

  const ServicesGrid({
    super.key,
    required this.onServiceSelected,
  });

  @override
  Widget build(BuildContext context) {
    final services = [
      ServiceItemData(
        title: 'Mobile\nRecharge',
        icon: Icons.phone_android_rounded,
        iconColor: AppColors.electricCyan,
        badgeText: '2% Back',
        badgeVariant: NeonBadgeVariant.emerald,
        onTap: () => onServiceSelected('Mobile Recharge'),
      ),
      ServiceItemData(
        title: 'DTH\nRecharge',
        icon: Icons.tv_rounded,
        iconColor: const Color(0xFF60EFA0),
        onTap: () => onServiceSelected('DTH Recharge'),
      ),
      ServiceItemData(
        title: 'FASTag\nToll',
        icon: Icons.directions_car_filled_rounded,
        iconColor: const Color(0xFFFF9F43),
        onTap: () => onServiceSelected('FASTag'),
      ),
      ServiceItemData(
        title: 'Electricity\nBill',
        icon: Icons.bolt_rounded,
        iconColor: const Color(0xFFFFD166),
        badgeText: 'BBPS',
        badgeVariant: NeonBadgeVariant.cyan,
        onTap: () => onServiceSelected('Electricity Bill'),
      ),
      ServiceItemData(
        title: 'Water &\nPiped Gas',
        icon: Icons.water_drop_rounded,
        iconColor: const Color(0xFF4FACFE),
        onTap: () => onServiceSelected('Water & Gas'),
      ),
      ServiceItemData(
        title: 'Credit Score\n(CIBIL)',
        icon: Icons.speed_rounded,
        iconColor: AppColors.neonMagenta,
        badgeText: 'FREE',
        badgeVariant: NeonBadgeVariant.magenta,
        onTap: () => onServiceSelected('Credit Score'),
      ),
      ServiceItemData(
        title: 'Google Play\nRecharge',
        icon: Icons.sports_esports_rounded,
        iconColor: const Color(0xFF00FF87),
        onTap: () => onServiceSelected('Google Play'),
      ),
      ServiceItemData(
        title: 'Broadband\nInternet',
        icon: Icons.wifi_rounded,
        iconColor: const Color(0xFF8E9BAE),
        onTap: () => onServiceSelected('Broadband'),
      ),
    ];

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated.withOpacity(0.55),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: AppColors.borderSubtle,
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Recharge & Bill Payments',
                style: AppTypography.headingSmall.copyWith(
                  letterSpacing: -0.2,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.electricCyan.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        color: AppColors.cyberEmerald,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 5),
                    Text(
                      'Bharat Connect',
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.electricCyan,
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: services.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 4,
              childAspectRatio: 0.72,
              crossAxisSpacing: 10,
              mainAxisSpacing: 12,
            ),
            itemBuilder: (context, index) {
              final s = services[index];
              return _ServiceTile(service: s);
            },
          ),
        ],
      ),
    );
  }
}

class _ServiceTile extends StatelessWidget {
  final ServiceItemData service;

  const _ServiceTile({required this.service});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: service.onTap,
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: service.iconColor.withOpacity(0.12),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: service.iconColor.withOpacity(0.3),
                    width: 1,
                  ),
                ),
                child: Center(
                  child: Icon(
                    service.icon,
                    size: 24,
                    color: service.iconColor,
                  ),
                ),
              ),
              if (service.badgeText != null)
                Positioned(
                  top: -4,
                  right: -8,
                  child: NeonBadge(
                    text: service.badgeText!,
                    variant: service.badgeVariant,
                    padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            service.title,
            textAlign: TextAlign.center,
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.textPrimary,
              fontSize: 11,
              height: 1.15,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
