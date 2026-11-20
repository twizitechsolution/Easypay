import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../core/widgets/neon_badge.dart';
import '../../../core/widgets/neon_button.dart';
import '../../../data/models/recharge_model.dart';
import '../../../data/mock/mock_recharge_plans.dart';

class UtilityBillScreen extends StatefulWidget {
  final String initialCategory; // 'Electricity', 'Water', 'Piped Gas'

  const UtilityBillScreen({
    super.key,
    this.initialCategory = 'Electricity',
  });

  @override
  State<UtilityBillScreen> createState() => _UtilityBillScreenState();
}

class _UtilityBillScreenState extends State<UtilityBillScreen> {
  late String _category;
  String _selectedState = 'Maharashtra';
  UtilityBiller? _selectedBiller;
  final TextEditingController _consumerIdController = TextEditingController(text: '9000182741');
  
  bool _isFetching = false;
  bool _isPaying = false;
  FetchedBillDetails? _fetchedBill;

  @override
  void initState() {
    super.initState();
    _category = widget.initialCategory;
    _updateBiller();
  }

  void _updateBiller() {
    final matching = MockRechargeData.utilityBillers.where(
      (b) => b.category == _category && b.state == _selectedState,
    ).toList();

    if (matching.isNotEmpty) {
      _selectedBiller = matching.first;
    } else {
      _selectedBiller = MockRechargeData.utilityBillers.firstWhere(
        (b) => b.category == _category,
        orElse: () => MockRechargeData.utilityBillers.first,
      );
    }
  }

  void _fetchBill() async {
    if (_consumerIdController.text.trim().isEmpty) return;

    setState(() {
      _isFetching = true;
      _fetchedBill = null;
    });

    await Future.delayed(const Duration(milliseconds: 900));
    if (!mounted) return;

    setState(() {
      _isFetching = false;
      _fetchedBill = FetchedBillDetails(
        consumerNumber: _consumerIdController.text,
        customerName: 'Alex Johnson',
        billerName: _selectedBiller?.name ?? 'Adani Electricity',
        dueAmount: 1840.0,
        dueDate: DateTime.now().add(const Duration(days: 9)),
        billNumber: 'INV-2026-9921',
      );
    });
  }

  void _payBill() async {
    setState(() => _isPaying = true);
    await Future.delayed(const Duration(milliseconds: 1000));
    if (!mounted) return;
    setState(() => _isPaying = false);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF131924),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: AppColors.cyberEmerald, width: 1.2),
        ),
        title: Row(
          children: [
            const Icon(Icons.check_circle_rounded, color: AppColors.cyberEmerald, size: 24),
            const SizedBox(width: 8),
            Text('Bill Paid Successfully', style: AppTypography.headingSmall),
          ],
        ),
        content: Text(
          'Payment of ${CurrencyFormatter.format(_fetchedBill!.dueAmount)} received for Consumer ${_fetchedBill!.consumerNumber}.\n\nReference: BBPS-9481029481\nCashback Credited: ₹25 to Easy Pay balance.',
          style: AppTypography.bodyMedium,
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              Navigator.pop(context);
            },
            child: const Text('DONE'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(
        title: Text('$_category Bill (BBPS)'),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // State Selector
            Text('State / Province', style: AppTypography.headingSmall.copyWith(fontSize: 15)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              decoration: BoxDecoration(
                color: AppColors.surfaceElevated,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.borderSubtle),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _selectedState,
                  isExpanded: true,
                  dropdownColor: AppColors.surfaceElevated,
                  items: ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu'].map((st) {
                    return DropdownMenuItem(
                      value: st,
                      child: Text(st, style: AppTypography.bodyMedium.copyWith(color: AppColors.textPrimary)),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) {
                      setState(() {
                        _selectedState = val;
                        _updateBiller();
                        _fetchedBill = null;
                      });
                    }
                  },
                ),
              ),
            ),

            const SizedBox(height: 18),

            // Biller Selector
            Text('Electricity / Utility Board', style: AppTypography.headingSmall.copyWith(fontSize: 15)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              decoration: BoxDecoration(
                color: AppColors.surfaceElevated,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.borderSubtle),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<UtilityBiller>(
                  value: _selectedBiller,
                  isExpanded: true,
                  dropdownColor: AppColors.surfaceElevated,
                  items: MockRechargeData.utilityBillers
                      .where((b) => b.category == _category)
                      .map((biller) {
                    return DropdownMenuItem(
                      value: biller,
                      child: Text(
                        biller.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: AppTypography.bodyMedium.copyWith(color: AppColors.textPrimary),
                      ),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) {
                      setState(() {
                        _selectedBiller = val;
                        _fetchedBill = null;
                      });
                    }
                  },
                ),
              ),
            ),

            const SizedBox(height: 18),

            // Consumer Account Number
            Text('Consumer Account Number (CA)', style: AppTypography.headingSmall.copyWith(fontSize: 15)),
            const SizedBox(height: 8),
            TextField(
              controller: _consumerIdController,
              keyboardType: TextInputType.number,
              style: AppTypography.bodyLarge.copyWith(color: AppColors.textPrimary),
              decoration: const InputDecoration(
                hintText: 'Enter 10-digit Consumer Number',
                prefixIcon: Icon(Icons.bolt_rounded, color: AppColors.electricCyan),
              ),
            ),

            const SizedBox(height: 20),

            // Fetch Bill Action
            NeonButton(
              text: 'Fetch Due Bill via BBPS',
              variant: NeonButtonVariant.glass,
              isLoading: _isFetching,
              width: double.infinity,
              icon: Icons.sync_rounded,
              onPressed: _fetchBill,
            ),

            const SizedBox(height: 24),

            // Fetched Bill Preview Card
            if (_fetchedBill != null) ...[
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppColors.surfaceElevated,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.electricCyan.withOpacity(0.4), width: 1.2),
                  boxShadow: AppColors.cyanGlow(blur: 14, opacity: 0.15),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Bill Details Fetched', style: AppTypography.headingSmall.copyWith(fontSize: 15)),
                        const NeonBadge(text: 'VERIFIED DUE', variant: NeonBadgeVariant.emerald),
                      ],
                    ),
                    const Divider(color: AppColors.borderSubtle, height: 20),
                    _buildBillRow('Consumer Name', _fetchedBill!.customerName),
                    const SizedBox(height: 8),
                    _buildBillRow('Bill Number', _fetchedBill!.billNumber),
                    const SizedBox(height: 8),
                    _buildBillRow('Due Date', '19 Nov 2026'),
                    const Divider(color: AppColors.borderSubtle, height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Total Due Amount', style: AppTypography.headingSmall.copyWith(fontSize: 14)),
                        Text(
                          CurrencyFormatter.format(_fetchedBill!.dueAmount),
                          style: AppTypography.headingLarge.copyWith(
                            color: AppColors.cyberEmerald,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              NeonButton(
                text: 'Pay Bill (${CurrencyFormatter.format(_fetchedBill!.dueAmount)})',
                variant: NeonButtonVariant.cyan,
                isLoading: _isPaying,
                width: double.infinity,
                height: 52,
                icon: Icons.flash_on_rounded,
                onPressed: _payBill,
              ),
            ],

            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildBillRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: AppTypography.bodySmall.copyWith(color: AppColors.textMuted)),
        Text(value, style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
      ],
    );
  }
}
