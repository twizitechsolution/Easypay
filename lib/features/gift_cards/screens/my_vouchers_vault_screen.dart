import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../core/widgets/neon_badge.dart';
import '../../../data/models/gift_card_model.dart';
import '../../../data/repositories/gift_card_repository.dart';
import '../widgets/voucher_card.dart';

class MyVouchersVaultScreen extends StatefulWidget {
  const MyVouchersVaultScreen({super.key});

  @override
  State<MyVouchersVaultScreen> createState() => _MyVouchersVaultScreenState();
}

class _MyVouchersVaultScreenState extends State<MyVouchersVaultScreen> {
  final GiftCardRepository _repository = GiftCardRepository();
  String _activeFilter = 'All'; // 'All', 'Active', 'Redeemed'

  @override
  void initState() {
    super.initState();
    _repository.addListener(_onRepoChanged);
  }

  @override
  void dispose() {
    _repository.removeListener(_onRepoChanged);
    super.dispose();
  }

  void _onRepoChanged() {
    if (mounted) setState(() {});
  }

  List<UserVoucher> get _filteredVouchers {
    switch (_activeFilter) {
      case 'Active':
        return _repository.activeVouchers;
      case 'Redeemed':
        return _repository.redeemedVouchers;
      default:
        return _repository.allVouchers;
    }
  }

  @override
  Widget build(BuildContext context) {
    final vouchers = _filteredVouchers;
    final totalSavings = _repository.totalSavingsEarned;

    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(
        title: const Text('My Vouchers Vault'),
      ),
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // Total Savings Accrued Card
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 10, 20, 16),
              child: Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF0F2E28), Color(0xFF131D24)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: AppColors.cyberEmerald.withOpacity(0.4),
                    width: 1.2,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.cyberEmerald.withOpacity(0.12),
                      blurRadius: 20,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: AppColors.cyberEmerald.withOpacity(0.15),
                        shape: BoxShape.circle,
                        border: Border.all(color: AppColors.cyberEmerald.withOpacity(0.4)),
                      ),
                      child: const Icon(
                        Icons.shield_outlined,
                        color: AppColors.cyberEmerald,
                        size: 26,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Total Cashback & Savings',
                            style: AppTypography.bodySmall.copyWith(
                              color: AppColors.textMuted,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            CurrencyFormatter.format(totalSavings, showDecimals: true),
                            style: AppTypography.headingLarge.copyWith(
                              color: AppColors.cyberEmerald,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const NeonBadge(
                      text: 'VAULT ENCRYPTED',
                      variant: NeonBadgeVariant.emerald,
                      padding: EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Filter Segment Tabs
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  _buildFilterChip('All', _repository.allVouchers.length),
                  const SizedBox(width: 10),
                  _buildFilterChip('Active', _repository.activeVouchers.length),
                  const SizedBox(width: 10),
                  _buildFilterChip('Redeemed', _repository.redeemedVouchers.length),
                ],
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // Vouchers List
          if (vouchers.isEmpty)
            SliverFillRemaining(
              hasScrollBody: false,
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.card_giftcard_outlined,
                      size: 64,
                      color: AppColors.textTertiary,
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'No $_activeFilter vouchers found',
                      style: AppTypography.headingSmall.copyWith(color: AppColors.textMuted),
                    ),
                  ],
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 30),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final v = vouchers[index];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: VoucherCard(
                        voucher: v,
                        onToggleRedemption: () {
                          _repository.toggleVoucherRedemption(v.id);
                        },
                      ),
                    );
                  },
                  childCount: vouchers.length,
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String filter, int count) {
    final isSelected = _activeFilter == filter;

    return GestureDetector(
      onTap: () => setState(() => _activeFilter = filter),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.electricCyan.withOpacity(0.15)
              : AppColors.surfaceElevated,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppColors.electricCyan : AppColors.borderSubtle,
            width: 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              filter,
              style: AppTypography.buttonLabel.copyWith(
                fontSize: 12,
                color: isSelected ? AppColors.electricCyan : AppColors.textMuted,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
              ),
            ),
            const SizedBox(width: 5),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.electricCyan : AppColors.borderSubtle,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                count.toString(),
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w800,
                  color: isSelected ? AppColors.backgroundPrimary : AppColors.textPrimary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
