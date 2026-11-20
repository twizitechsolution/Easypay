import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';

enum NeonButtonVariant {
  cyan,
  emerald,
  magenta,
  glass,
}

class NeonButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final IconData? icon;
  final NeonButtonVariant variant;
  final bool isLoading;
  final double? width;
  final double height;
  final bool enableGlow;

  const NeonButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.icon,
    this.variant = NeonButtonVariant.cyan,
    this.isLoading = false,
    this.width,
    this.height = 50,
    this.enableGlow = true,
  });

  @override
  State<NeonButton> createState() => _NeonButtonState();
}

class _NeonButtonState extends State<NeonButton> {
  bool _isPressed = false;

  LinearGradient _getGradient() {
    switch (widget.variant) {
      case NeonButtonVariant.cyan:
        return AppColors.primaryCyanGradient;
      case NeonButtonVariant.emerald:
        return AppColors.emeraldGradient;
      case NeonButtonVariant.magenta:
        return AppColors.magentaPurpleGradient;
      case NeonButtonVariant.glass:
        return const LinearGradient(
          colors: [Color(0xFF242F42), Color(0xFF1A2230)],
        );
    }
  }

  Color _getTextColor() {
    switch (widget.variant) {
      case NeonButtonVariant.glass:
        return AppColors.textPrimary;
      default:
        return const Color(0xFF070A0F);
    }
  }

  List<BoxShadow> _getGlow() {
    if (!widget.enableGlow || widget.onPressed == null) return [];
    switch (widget.variant) {
      case NeonButtonVariant.cyan:
        return AppColors.cyanGlow(blur: 16, opacity: _isPressed ? 0.6 : 0.4);
      case NeonButtonVariant.emerald:
        return AppColors.emeraldGlow(blur: 16, opacity: _isPressed ? 0.6 : 0.4);
      case NeonButtonVariant.magenta:
        return AppColors.magentaGlow(blur: 16, opacity: _isPressed ? 0.6 : 0.4);
      case NeonButtonVariant.glass:
        return [];
    }
  }

  @override
  Widget build(BuildContext context) {
    final bool disabled = widget.onPressed == null || widget.isLoading;

    return GestureDetector(
      onTapDown: disabled ? null : (_) => setState(() => _isPressed = true),
      onTapUp: disabled ? null : (_) => setState(() => _isPressed = false),
      onTapCancel: disabled ? null : () => setState(() => _isPressed = false),
      onTap: disabled ? null : widget.onPressed,
      child: AnimatedScale(
        scale: _isPressed ? 0.97 : 1.0,
        duration: const Duration(milliseconds: 100),
        child: Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            gradient: disabled
                ? const LinearGradient(
                    colors: [Color(0xFF2A3447), Color(0xFF1E2634)],
                  )
                : _getGradient(),
            borderRadius: BorderRadius.circular(14),
            boxShadow: disabled ? [] : _getGlow(),
            border: widget.variant == NeonButtonVariant.glass
                ? Border.all(color: AppColors.borderSubtle, width: 1)
                : null,
          ),
          alignment: Alignment.center,
          child: widget.isLoading
              ? SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2.2,
                    valueColor: AlwaysStoppedAnimation<Color>(_getTextColor()),
                  ),
                )
              : Row(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (widget.icon != null) ...[
                      Icon(widget.icon, size: 18, color: _getTextColor()),
                      const SizedBox(width: 8),
                    ],
                    Text(
                      widget.text,
                      style: AppTypography.buttonLabel.copyWith(
                        color: disabled ? AppColors.textMuted : _getTextColor(),
                      ),
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}
