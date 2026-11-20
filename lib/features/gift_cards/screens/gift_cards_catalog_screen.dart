import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/neon_badge.dart';
import '../../../data/models/gift_card_model.dart';
import '../../../data/mock/mock_gift_cards.dart';
import '../../../data/repositories/gift_card_repository.dart';
import 'gift_card_detail_screen.dart';
import 'my_vouchers_vault_screen.dart';

class GiftCardsCatalogScreen extends StatefulWidget {
  const GiftCardsCatalogScreen({super.key});

  @override
  State<GiftCardsCatalogScreen> createState() => _GiftCardsCatalogScreenState();
}

class _GiftCardsCatalogScreenState extends State<GiftCardsCatalogScreen> {
  final TextEditingController _searchController = TextEditingController();
  final GiftCardRepository _repository = GiftCardRepository();
  String _selectedCategory = 'All';
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _repository.addListener(_onRepoChanged);
  }

  @override
  void dispose() {
    _searchController.dispose();
    _repository.removeListener(_onRepoChanged);
    super.dispose();
  }

  void _onRepoChanged() {
    if (mounted) setState(() {});
  }

  List<GiftCardBrand> get _filteredBrands {
    return _repository.searchAndFilter(
      query: _searchQuery,
      category: _selectedCategory,
    );
  }

  @override
  Widget build(BuildContext context) {
    final brands = _filteredBrands;
    final vaultCount = _repository.activeVouchers.length;

    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      body: SafeArea(
        bottom: false,
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            // Top App Bar with My Vault Action
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Digital Gift Cards',
                          style: AppTypography.headingLarge.copyWith(fontSize: 22),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Save up to 10% on top Indian brands',
                          style: AppTypography.bodySmall,
                        ),
                      ],
                    ),
                    // My Vault Pill Button
                    GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialTransitions.fadeThrough(const MyVouchersVaultScreen()),
                        );
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceElevated,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: AppColors.electricCyan.withOpacity(0.5),
                            width: 1.2,
                          ),
                          boxShadow: AppColors.cyanGlow(blur: 10, opacity: 0.2),
                        ),
                        child: Row(
                          children: [
                            const Icon(
                              Icons.vpn_key_rounded,
                              size: 14,
                              color: AppColors.electricCyan,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              'My Vault ($vaultCount)',
                              style: AppTypography.bodySmall.copyWith(
                                color: AppColors.electricCyan,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Search Bar
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
                child: TextField(
                  controller: _searchController,
                  onChanged: (val) => setState(() => _searchQuery = val),
                  style: AppTypography.bodyLarge.copyWith(color: AppColors.textPrimary),
                  decoration: InputDecoration(
                    hintText: 'Search 300+ brands (Amazon, Swiggy, Zomato...)',
                    hintStyle: AppTypography.bodyMedium.copyWith(color: AppColors.textMuted),
                    prefixIcon: const Icon(Icons.search_rounded, color: AppColors.electricCyan),
                    suffixIcon: _searchQuery.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear_rounded, size: 18, color: AppColors.textMuted),
                            onPressed: () {
                              _searchController.clear();
                              setState(() => _searchQuery = '');
                            },
                          )
                        : null,
                    filled: true,
                    fillColor: AppColors.surfaceElevated,
                    contentPadding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
            ),

            // Category Filter Pills
            SliverToBoxAdapter(
              child: SizedBox(
                height: 52,
                child: ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                  scrollDirection: Axis.horizontal,
                  itemCount: MockGiftCards.categories.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, index) {
                    final cat = MockGiftCards.categories[index];
                    final isSelected = _selectedCategory == cat;

                    return GestureDetector(
                      onTap: () => setState(() => _selectedCategory = cat),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? AppColors.electricCyan.withOpacity(0.15)
                              : AppColors.surfaceElevated,
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(
                            color: isSelected ? AppColors.electricCyan : AppColors.borderSubtle,
                            width: 1,
                          ),
                        ),
                        child: Center(
                          child: Text(
                            cat,
                            style: AppTypography.bodySmall.copyWith(
                              color: isSelected ? AppColors.electricCyan : AppColors.textMuted,
                              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 10)),

            // Brand Grid (2 Columns)
            if (brands.isEmpty)
              SliverFillRemaining(
                hasScrollBody: false,
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.search_off_rounded, size: 48, color: AppColors.textTertiary),
                      const SizedBox(height: 12),
                      Text(
                        'No matching brands found',
                        style: AppTypography.headingSmall.copyWith(color: AppColors.textMuted),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Try searching for another brand or change the category filter.',
                        style: AppTypography.bodySmall,
                      ),
                    ],
                  ),
                ),
              )
            else
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 110),
                sliver: SliverGrid(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.74,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final brand = brands[index];
                      return _BrandCatalogCard(
                        brand: brand,
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialTransitions.fadeThrough(
                              GiftCardDetailScreen(brand: brand),
                            ),
                          );
                        },
                      );
                    },
                    childCount: brands.length,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _BrandCatalogCard extends StatelessWidget {
  final GiftCardBrand brand;
  final VoidCallback onTap;

  const _BrandCatalogCard({
    required this.brand,
    required this.onTap,
  });

  Color _getBrandColor() {
    try {
      return Color(int.parse('0xFF${brand.primaryColorHex}'));
    } catch (_) {
      return AppColors.electricCyan;
    }
  }

  @override
  Widget build(BuildContext context) {
    final brandColor = _getBrandColor();

    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.surfaceElevated,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: AppColors.borderSubtle,
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.3),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top: Logo Icon & Cashback Badge
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: brandColor.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: brandColor.withOpacity(0.35),
                      width: 1,
                    ),
                  ),
                  child: Center(
                    child: Text(
                      brand.name[0],
                      style: AppTypography.headingSmall.copyWith(
                        color: brandColor,
                        fontWeight: FontWeight.w900,
                        fontSize: 20,
                      ),
                    ),
                  ),
                ),
                NeonBadge(
                  text: '${brand.cashbackRate.toStringAsFixed(1)}%',
                  variant: NeonBadgeVariant.emerald,
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                ),
              ],
            ),

            const Spacer(),

            Text(
              brand.name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: AppTypography.headingSmall.copyWith(
                fontSize: 14,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              brand.category,
              style: AppTypography.bodySmall.copyWith(
                fontSize: 10,
                color: AppColors.textMuted,
              ),
            ),

            const SizedBox(height: 8),

            // Denominations hint
            Text(
              'From ₹${brand.denominations.first}',
              style: AppTypography.bodySmall.copyWith(
                fontSize: 11,
                color: AppColors.cyberEmerald,
                fontWeight: FontWeight.w600,
              ),
            ),

            const SizedBox(height: 8),

            // Action Button
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 7),
              decoration: BoxDecoration(
                gradient: AppColors.primaryCyanGradient,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Center(
                child: Text(
                  'Buy Voucher',
                  style: AppTypography.buttonLabel.copyWith(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
