import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../core/widgets/neon_badge.dart';
import '../../../core/widgets/neon_button.dart';
import '../../../data/models/gift_card_model.dart';
import '../../../data/repositories/gift_card_repository.dart';
import 'my_vouchers_vault_screen.dart';

class GiftCardDetailScreen extends StatefulWidget {
  final GiftCardBrand brand;

  const GiftCardDetailScreen({
    super.key,
    required this.brand,
  });

  @override
  State<GiftCardDetailScreen> createState() => _GiftCardDetailScreenState();
}

class _GiftCardDetailScreenState extends State<GiftCardDetailScreen> {
  late int _selectedDenomination;
  final TextEditingController _customAmountController = TextEditingController();
  bool _isCustom = false;
  bool _isProcessing = false;

  @override
  void initState() {
    super.initState();
    _selectedDenomination = widget.brand.denominations.first;
  }

  @override
  void dispose() {
    _customAmountController.dispose();
    super.dispose();
  }

  Color _getBrandColor() {
    try {
      return Color(int.parse('0xFF${widget.brand.primaryColorHex}'));
    } catch (_) {
      return AppColors.electricCyan;
    }
  }

  int get _currentAmount {
    if (_isCustom) {
      final parsed = int.tryParse(_customAmountController.text);
      return (parsed != null && parsed > 0) ? parsed : 0;
    }
    return _selectedDenomination;
  }

  double get _cashbackEarned => (_currentAmount * widget.brand.cashbackRate) / 100.0;
  double get _effectivePrice => _currentAmount - _cashbackEarned;

  void _handleBuyNow() async {
    if (_currentAmount < 50) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select or enter a denomination of at least ₹50'),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    setState(() => _isProcessing = true);
    await Future.delayed(const Duration(milliseconds: 900));
    if (!mounted) return;

    final voucher = GiftCardRepository().purchaseVoucher(
      brand: widget.brand,
      denomination: _currentAmount,
    );

    setState(() => _isProcessing = false);

    _showPurchaseSuccessModal(voucher);
  }

  void _showPurchaseSuccessModal(UserVoucher voucher) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: const Color(0xFF131924),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          border: Border.all(color: AppColors.cyberEmerald.withOpacity(0.4), width: 1.5),
          boxShadow: [
            BoxShadow(
              color: AppColors.cyberEmerald.withOpacity(0.2),
              blurRadius: 30,
              spreadRadius: 2,
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.cyberEmerald.withOpacity(0.15),
                border: Border.all(color: AppColors.cyberEmerald, width: 2),
                boxShadow: AppColors.emeraldGlow(blur: 16),
              ),
              child: const Icon(
                Icons.check_rounded,
                size: 38,
                color: AppColors.cyberEmerald,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Voucher Generated Successfully!',
              style: AppTypography.headingMedium.copyWith(fontSize: 18),
            ),
            const SizedBox(height: 6),
            Text(
              '${widget.brand.name} ${CurrencyFormatter.format(voucher.denomination)} digital gift card is ready in your vault.',
              textAlign: TextAlign.center,
              style: AppTypography.bodyMedium,
            ),
            const SizedBox(height: 16),
            NeonBadge(
              text: '+${CurrencyFormatter.format(voucher.cashbackEarned)} INSTANT CASHBACK CREDITED',
              variant: NeonBadgeVariant.emerald,
              showGlow: true,
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: NeonButton(
                    text: 'View in Vault',
                    variant: NeonButtonVariant.emerald,
                    onPressed: () {
                      Navigator.pop(ctx);
                      Navigator.push(
                        context,
                        MaterialTransitions.fadeThrough(const MyVouchersVaultScreen()),
                      );
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: NeonButton(
                    text: 'Done',
                    variant: NeonButtonVariant.glass,
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final brandColor = _getBrandColor();

    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(
        title: Text(widget.brand.name),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_rounded, size: 20),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Sharing ${widget.brand.name} voucher link!'),
                  behavior: SnackBarBehavior.floating,
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Brand Banner Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(22),
                gradient: LinearGradient(
                  colors: [
                    brandColor.withOpacity(0.35),
                    const Color(0xFF141A25),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                border: Border.all(
                  color: brandColor.withOpacity(0.5),
                  width: 1.2,
                ),
                boxShadow: [
                  BoxShadow(
                    color: brandColor.withOpacity(0.15),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white.withOpacity(0.2)),
                    ),
                    child: Center(
                      child: Text(
                        widget.brand.name[0],
                        style: AppTypography.headingLarge.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.w900,
                          fontSize: 28,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.brand.name,
                          style: AppTypography.headingMedium.copyWith(
                            fontSize: 20,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          widget.brand.category,
                          style: AppTypography.bodySmall.copyWith(
                            color: AppColors.textMuted,
                          ),
                        ),
                        const SizedBox(height: 8),
                        NeonBadge(
                          text: widget.brand.cashbackTag,
                          variant: NeonBadgeVariant.emerald,
                          showGlow: true,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Denomination Selector Header
            Text(
              'Select Denomination',
              style: AppTypography.headingSmall.copyWith(fontSize: 16),
            ),
            const SizedBox(height: 4),
            Text(
              'Choose from standard values or specify custom denomination',
              style: AppTypography.bodySmall,
            ),

            const SizedBox(height: 14),

            // Denomination Chips Grid
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: [
                ...widget.brand.denominations.map((denom) {
                  final isSelected = !_isCustom && _selectedDenomination == denom;
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _isCustom = false;
                        _selectedDenomination = denom;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppColors.electricCyan.withOpacity(0.15)
                            : AppColors.surfaceElevated,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected ? AppColors.electricCyan : AppColors.borderSubtle,
                          width: isSelected ? 1.5 : 1,
                        ),
                        boxShadow: isSelected
                            ? AppColors.cyanGlow(blur: 10, opacity: 0.3)
                            : null,
                      ),
                      child: Text(
                        CurrencyFormatter.format(denom),
                        style: AppTypography.buttonLabel.copyWith(
                          fontSize: 14,
                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                          color: isSelected ? AppColors.electricCyan : AppColors.textPrimary,
                        ),
                      ),
                    ),
                  );
                }),
                // Custom Amount Chip
                GestureDetector(
                  onTap: () {
                    setState(() => _isCustom = true);
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: _isCustom
                          ? AppColors.electricCyan.withOpacity(0.15)
                          : AppColors.surfaceElevated,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: _isCustom ? AppColors.electricCyan : AppColors.borderSubtle,
                        width: _isCustom ? 1.5 : 1,
                      ),
                    ),
                    child: Text(
                      'Custom ₹',
                      style: AppTypography.buttonLabel.copyWith(
                        fontSize: 14,
                        fontWeight: _isCustom ? FontWeight.w700 : FontWeight.w500,
                        color: _isCustom ? AppColors.electricCyan : AppColors.textPrimary,
                      ),
                    ),
                  ),
                ),
              ],
            ),

            if (_isCustom) ...[
              const SizedBox(height: 14),
              TextField(
                controller: _customAmountController,
                keyboardType: TextInputType.number,
                autofocus: true,
                onChanged: (_) => setState(() {}),
                style: AppTypography.headingSmall.copyWith(color: AppColors.textPrimary),
                decoration: InputDecoration(
                  prefixText: '₹ ',
                  prefixStyle: AppTypography.headingSmall.copyWith(color: AppColors.electricCyan),
                  hintText: 'Enter amount (e.g. 750)',
                ),
              ),
            ],

            const SizedBox(height: 24),

            // Real-Time Calculation & Savings Card
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
                      Text('Voucher Face Value', style: AppTypography.bodyMedium),
                      Text(
                        CurrencyFormatter.format(_currentAmount),
                        style: AppTypography.bodyMedium.copyWith(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Text('Cashback (${widget.brand.cashbackRate}%)', style: AppTypography.bodyMedium),
                          const SizedBox(width: 6),
                          const Icon(Icons.flash_on_rounded, size: 14, color: AppColors.cyberEmerald),
                        ],
                      ),
                      Text(
                        '+ ${CurrencyFormatter.format(_cashbackEarned)}',
                        style: AppTypography.bodyMedium.copyWith(
                          color: AppColors.cyberEmerald,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                  const Divider(color: AppColors.borderSubtle, height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Net Effective Cost',
                            style: AppTypography.headingSmall.copyWith(fontSize: 14),
                          ),
                          Text(
                            'Credited to Easy Pay Balance',
                            style: AppTypography.bodySmall.copyWith(fontSize: 10),
                          ),
                        ],
                      ),
                      Text(
                        CurrencyFormatter.format(_effectivePrice),
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

            const SizedBox(height: 24),

            // Terms & Conditions / Description
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surfaceElevated.withOpacity(0.5),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderSubtle),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.info_outline_rounded, size: 16, color: AppColors.electricCyan),
                      const SizedBox(width: 8),
                      Text(
                        'Redemption Details & Terms',
                        style: AppTypography.headingSmall.copyWith(fontSize: 13),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.brand.description,
                    style: AppTypography.bodySmall.copyWith(height: 1.4),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.brand.terms,
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.textMuted,
                      height: 1.4,
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // Proceed to Pay Neon CTA
            NeonButton(
              text: 'Buy Voucher for ${CurrencyFormatter.format(_currentAmount)}',
              variant: NeonButtonVariant.cyan,
              isLoading: _isProcessing,
              width: double.infinity,
              height: 54,
              icon: Icons.flash_on_rounded,
              onPressed: _handleBuyNow,
            ),

            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}

class MaterialTransitions {
  static Route fadeThrough(Widget child) {
    return PageRouteBuilder(
      pageBuilder: (context, animation, secondaryAnimation) => child,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        return FadeTransition(opacity: animation, child: child);
      },
      transitionDuration: const Duration(milliseconds: 250),
    );
  }
}
