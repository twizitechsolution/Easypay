import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../core/widgets/neon_badge.dart';
import '../../../core/widgets/neon_button.dart';
import '../../../data/models/recharge_model.dart';
import '../../../data/mock/mock_recharge_plans.dart';
import '../widgets/plan_card.dart';

class MobileRechargeScreen extends StatefulWidget {
  const MobileRechargeScreen({super.key});

  @override
  State<MobileRechargeScreen> createState() => _MobileRechargeScreenState();
}

class _MobileRechargeScreenState extends State<MobileRechargeScreen> {
  final TextEditingController _phoneController = TextEditingController(text: '9876543210');
  final TextEditingController _planSearchController = TextEditingController();
  
  TelecomOperator _selectedOperator = MockRechargeData.operators.first;
  String _selectedCircle = 'Maharashtra & Goa';
  String _selectedCategory = 'Recommended';
  String _planQuery = '';
  bool _isProcessing = false;

  @override
  void dispose() {
    _phoneController.dispose();
    _planSearchController.dispose();
    super.dispose();
  }

  void _onPhoneChanged(String value) {
    if (value.length >= 4) {
      final prefix = value.substring(0, 2);
      if (prefix == '98' || prefix == '99') {
        setState(() => _selectedOperator = MockRechargeData.operators[1]); // Airtel
      } else {
        setState(() => _selectedOperator = MockRechargeData.operators[0]); // Jio
      }
    }
  }

  List<RechargePlan> get _filteredPlans {
    return MockRechargeData.plans.where((p) {
      final matchesCategory = _selectedCategory == 'Recommended' || p.category == _selectedCategory;
      final matchesQuery = _planQuery.isEmpty ||
          p.price.toString().contains(_planQuery) ||
          p.data.toLowerCase().contains(_planQuery.toLowerCase()) ||
          p.description.toLowerCase().contains(_planQuery.toLowerCase()) ||
          p.perks.any((perk) => perk.toLowerCase().contains(_planQuery.toLowerCase()));
      return matchesCategory && matchesQuery;
    }).toList();
  }

  void _showOperatorSheet() {
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
            Text('Select Telecom Operator', style: AppTypography.headingSmall),
            const SizedBox(height: 14),
            ...MockRechargeData.operators.map((op) {
              final isSelected = op.id == _selectedOperator.id;
              return ListTile(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                tileColor: isSelected ? AppColors.electricCyan.withOpacity(0.12) : null,
                leading: CircleAvatar(
                  backgroundColor: Color(int.parse('0xFF${op.primaryColorHex}')),
                  child: Text(
                    op.logoCode[0],
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800),
                  ),
                ),
                title: Text(op.name, style: AppTypography.headingSmall.copyWith(fontSize: 14)),
                trailing: isSelected
                    ? const Icon(Icons.check_circle_rounded, color: AppColors.electricCyan)
                    : null,
                onTap: () {
                  setState(() => _selectedOperator = op);
                  Navigator.pop(ctx);
                },
              );
            }),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }

  void _showCircleSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) => Container(
        height: 400,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFF131924),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          border: Border.all(color: AppColors.borderSubtle),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Select Telecom Circle', style: AppTypography.headingSmall),
            const SizedBox(height: 14),
            Expanded(
              child: ListView.builder(
                itemCount: MockRechargeData.circles.length,
                itemBuilder: (context, index) {
                  final circle = MockRechargeData.circles[index];
                  final isSelected = circle == _selectedCircle;
                  return ListTile(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    tileColor: isSelected ? AppColors.electricCyan.withOpacity(0.12) : null,
                    title: Text(circle, style: AppTypography.bodyMedium),
                    trailing: isSelected
                        ? const Icon(Icons.check_rounded, color: AppColors.electricCyan)
                        : null,
                    onTap: () {
                      setState(() => _selectedCircle = circle);
                      Navigator.pop(ctx);
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _handlePlanRecharge(RechargePlan plan) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setSheetState) {
          return Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFF131924),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(26)),
              border: Border.all(color: AppColors.electricCyan.withOpacity(0.4), width: 1.5),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Confirm Mobile Recharge', style: AppTypography.headingSmall),
                    const NeonBadge(text: 'BBPS VERIFIED', variant: NeonBadgeVariant.cyan),
                  ],
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceElevated,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.borderSubtle),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: Color(int.parse('0xFF${_selectedOperator.primaryColorHex}')),
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Text(
                            _selectedOperator.logoCode,
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 10),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('+91 ${_phoneController.text}', style: AppTypography.headingSmall.copyWith(fontSize: 14)),
                            const SizedBox(height: 2),
                            Text('${_selectedOperator.name} • $_selectedCircle', style: AppTypography.bodySmall),
                          ],
                        ),
                      ),
                      Text(
                        CurrencyFormatter.format(plan.price),
                        style: AppTypography.headingMedium.copyWith(color: AppColors.cyberEmerald, fontWeight: FontWeight.w800),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    const Icon(Icons.flash_on_rounded, size: 16, color: AppColors.cyberEmerald),
                    const SizedBox(width: 6),
                    Text(
                      'Earn instant ₹15 Easy Pay cashback on this recharge!',
                      style: AppTypography.bodySmall.copyWith(color: AppColors.cyberEmerald, fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                NeonButton(
                  text: _isProcessing ? 'Processing...' : 'Pay with UPI / Wallet',
                  variant: NeonButtonVariant.cyan,
                  isLoading: _isProcessing,
                  width: double.infinity,
                  onPressed: () async {
                    setSheetState(() => _isProcessing = true);
                    await Future.delayed(const Duration(milliseconds: 1000));
                    setSheetState(() => _isProcessing = false);
                    Navigator.pop(ctx);

                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Recharge of ${CurrencyFormatter.format(plan.price)} successful for +91 ${_phoneController.text}!'),
                        backgroundColor: const Color(0xFF0C2B24),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                ),
                const SizedBox(height: 10),
              ],
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final plans = _filteredPlans;

    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(
        title: const Text('Prepaid Recharge'),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Mobile Number Input Box with Circle & Operator Pills
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surfaceElevated,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.borderSubtle),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Mobile Number', style: AppTypography.bodySmall.copyWith(color: AppColors.textMuted)),
                  const SizedBox(height: 6),
                  TextField(
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    onChanged: _onPhoneChanged,
                    style: AppTypography.headingMedium.copyWith(
                      letterSpacing: 1.5,
                      fontSize: 18,
                    ),
                    decoration: InputDecoration(
                      prefixIcon: const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 10, vertical: 14),
                        child: Text(
                          '+91',
                          style: TextStyle(color: AppColors.electricCyan, fontWeight: FontWeight.w700, fontSize: 16),
                        ),
                      ),
                      suffixIcon: const Icon(Icons.contacts_rounded, color: AppColors.electricCyan),
                      contentPadding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),

                  const SizedBox(height: 14),

                  // Operator & Circle Switcher Row
                  Row(
                    children: [
                      // Operator Pill
                      Expanded(
                        child: GestureDetector(
                          onTap: _showOperatorSheet,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                            decoration: BoxDecoration(
                              color: AppColors.backgroundSecondary,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: AppColors.borderSubtle),
                            ),
                            child: Row(
                              children: [
                                Text(
                                  _selectedOperator.name,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: AppTypography.bodySmall.copyWith(
                                    color: AppColors.textPrimary,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                const Spacer(),
                                const Icon(Icons.keyboard_arrow_down_rounded, size: 16, color: AppColors.textMuted),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      // Circle Pill
                      Expanded(
                        child: GestureDetector(
                          onTap: _showCircleSheet,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                            decoration: BoxDecoration(
                              color: AppColors.backgroundSecondary,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: AppColors.borderSubtle),
                            ),
                            child: Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    _selectedCircle,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: AppTypography.bodySmall.copyWith(
                                      color: AppColors.textPrimary,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                                const Icon(Icons.keyboard_arrow_down_rounded, size: 16, color: AppColors.textMuted),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Plan Search Bar
            TextField(
              controller: _planSearchController,
              onChanged: (val) => setState(() => _planQuery = val),
              style: AppTypography.bodyMedium.copyWith(color: AppColors.textPrimary),
              decoration: InputDecoration(
                hintText: 'Search plan (e.g. 299, 1.5GB, Hotstar...)',
                prefixIcon: const Icon(Icons.search_rounded, color: AppColors.electricCyan),
                filled: true,
                fillColor: AppColors.surfaceElevated,
              ),
            ),

            const SizedBox(height: 14),

            // Category Tabs
            SizedBox(
              height: 42,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: MockRechargeData.planCategories.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final cat = MockRechargeData.planCategories[index];
                  final isSelected = _selectedCategory == cat;

                  return GestureDetector(
                    onTap: () => setState(() => _selectedCategory = cat),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppColors.electricCyan.withOpacity(0.15)
                            : AppColors.surfaceElevated,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: isSelected ? AppColors.electricCyan : AppColors.borderSubtle,
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

            const SizedBox(height: 18),

            // Plans List
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: plans.length,
              separatorBuilder: (_, __) => const SizedBox(height: 14),
              itemBuilder: (context, index) {
                final plan = plans[index];
                return PlanCard(
                  plan: plan,
                  onSelectPlan: () => _handlePlanRecharge(plan),
                );
              },
            ),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}
