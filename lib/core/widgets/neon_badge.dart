import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';

enum NeonBadgeVariant {
  emerald,
  cyan,
  magenta,
  gold,
}

class NeonBadge extends StatelessWidget {
  final String text;
  final IconData? icon;
  final NeonBadgeVariant variant;
  final bool showGlow;
  final EdgeInsetsGeometry padding;

  const NeonBadge({
    super.key,
    required this.text,
    this.icon,
    this.variant = NeonBadgeVariant.emerald,
    this.showGlow = false,
    this.padding = const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
  });

  Color _getMainColor() {
    switch (variant) {
      case NeonBadgeVariant.emerald:
        return AppColors.cyberEmerald;
      case NeonBadgeVariant.cyan:
        return AppColors.electricCyan;
      case NeonBadgeVariant.magenta:
        return AppColors.neonMagenta;
      case NeonBadgeVariant.gold:
        return const Color(0xFFFFD166);
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _getMainColor();

    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: color.withOpacity(0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: color.withOpacity(0.4),
          width: 1,
        ),
        boxShadow: showGlow
            ? [
                BoxShadow(
                  color: color.withOpacity(0.25),
                  blurRadius: 8,
                  spreadRadius: 0.5,
                ),
              ]
            : null,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 12, color: color),
            const SizedBox(width: 4),
          ],
          Text(
            text,
            style: AppTypography.badgeLabel.copyWith(
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}
