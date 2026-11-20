import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../core/widgets/neon_badge.dart';
import '../../../core/widgets/neon_button.dart';
import '../../../data/models/recharge_model.dart';
import '../../../data/mock/mock_recharge_plans.dart';

class DthFastagScreen extends StatefulWidget {
  final int initialIndex; // 0 for DTH, 1 for FASTag

  const DthFastagScreen({
    super.key,
    this.initialIndex = 0,
  });

  @override
  State<DthFastagScreen> createState() => _DthFastagScreenState();
}

class _DthFastagScreenState extends State<DthFastagScreen> {
  late int _modeIndex; // 0: DTH, 1: FASTag
  
  // DTH State
  DthProvider _selectedDth = MockRechargeData.dthProviders.first;
  final TextEditingController _subscriberIdController = TextEditingController(text: '1098234812');
  int _selectedDthAmount = 350;

  // FASTag State
  FastagBank _selectedBank = MockRechargeData.fastagBanks.first;
  final TextEditingController _vehicleNumberController = TextEditingController(text: 'MH02EK8821');
  int _selectedFastagAmount = 1000;

  bool _isProcessing = false;

  @override
  void initState() {
    super.initState();
    _modeIndex = widget.initialIndex;
  }

  @override
  void dispose() {
    _subscriberIdController.dispose();
    _vehicleNumberController.dispose();
    super.dispose();
  }

  void _handlePay() async {
    setState(() => _isProcessing = true);
    await Future.delayed(const Duration(milliseconds: 900));
    if (!mounted) return;
    setState(() => _isProcessing = false);

    final title = _modeIndex == 0 ? 'DTH Recharge' : 'FASTag Recharge';
    final amount = _modeIndex == 0 ? _selectedDthAmount : _selectedFastagAmount;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$title of ${CurrencyFormatter.format(amount)} successful!'),
        backgroundColor: const Color(0xFF0C2B24),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(
        title: Text(_modeIndex == 0 ? 'DTH Satellite TV' : 'FASTag Toll Recharge'),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Mode Segmented Switcher
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: AppColors.surfaceElevated,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderSubtle),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _modeIndex = 0),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: _modeIndex == 0 ? AppColors.electricCyan.withOpacity(0.15) : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                          border: _modeIndex == 0 ? Border.all(color: AppColors.electricCyan) : null,
                        ),
                        child: Center(
                          child: Text(
                            'DTH Recharge',
                            style: AppTypography.buttonLabel.copyWith(
                              fontSize: 13,
                              color: _modeIndex == 0 ? AppColors.electricCyan : AppColors.textMuted,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _modeIndex = 1),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: _modeIndex == 1 ? AppColors.electricCyan.withOpacity(0.15) : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                          border: _modeIndex == 1 ? Border.all(color: AppColors.electricCyan) : null,
                        ),
                        child: Center(
                          child: Text(
                            'FASTag Toll',
                            style: AppTypography.buttonLabel.copyWith(
                              fontSize: 13,
                              color: _modeIndex == 1 ? AppColors.electricCyan : AppColors.textMuted,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            if (_modeIndex == 0) ...[
              // DTH View
              Text('Select DTH Operator', style: AppTypography.headingSmall.copyWith(fontSize: 15)),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14),
                decoration: BoxDecoration(
                  color: AppColors.surfaceElevated,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.borderSubtle),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<DthProvider>(
                    value: _selectedDth,
                    isExpanded: true,
                    dropdownColor: AppColors.surfaceElevated,
                    items: MockRechargeData.dthProviders.map((p) {
                      return DropdownMenuItem(
                        value: p,
                        child: Text(p.name, style: AppTypography.bodyMedium.copyWith(color: AppColors.textPrimary)),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _selectedDth = val);
                    },
                  ),
                ),
              ),

              const SizedBox(height: 18),

              Text('Smart Card / Subscriber ID', style: AppTypography.headingSmall.copyWith(fontSize: 15)),
              const SizedBox(height: 8),
              TextField(
                controller: _subscriberIdController,
                style: AppTypography.bodyLarge.copyWith(color: AppColors.textPrimary),
                decoration: const InputDecoration(
                  hintText: 'Enter 10 or 11 digit Subscriber ID',
                  prefixIcon: Icon(Icons.tv_rounded, color: AppColors.electricCyan),
                ),
              ),

              const SizedBox(height: 24),

              Text('Recharge Amount', style: AppTypography.headingSmall.copyWith(fontSize: 15)),
              const SizedBox(height: 10),
              Wrap(
                spacing: 10,
                children: [200, 350, 500, 1000, 1500].map((amt) {
                  final isSelected = _selectedDthAmount == amt;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedDthAmount = amt),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: isSelected ? AppColors.electricCyan.withOpacity(0.15) : AppColors.surfaceElevated,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected ? AppColors.electricCyan : AppColors.borderSubtle,
                        ),
                      ),
                      child: Text(
                        CurrencyFormatter.format(amt),
                        style: AppTypography.buttonLabel.copyWith(
                          color: isSelected ? AppColors.electricCyan : AppColors.textPrimary,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ] else ...[
              // FASTag View
              Text('FASTag Issuing Bank', style: AppTypography.headingSmall.copyWith(fontSize: 15)),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14),
                decoration: BoxDecoration(
                  color: AppColors.surfaceElevated,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.borderSubtle),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<FastagBank>(
                    value: _selectedBank,
                    isExpanded: true,
                    dropdownColor: AppColors.surfaceElevated,
                    items: MockRechargeData.fastagBanks.map((b) {
                      return DropdownMenuItem(
                        value: b,
                        child: Text(b.bankName, style: AppTypography.bodyMedium.copyWith(color: AppColors.textPrimary)),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _selectedBank = val);
                    },
                  ),
                ),
              ),

              const SizedBox(height: 18),

              Text('Vehicle Registration Number', style: AppTypography.headingSmall.copyWith(fontSize: 15)),
              const SizedBox(height: 8),
              TextField(
                controller: _vehicleNumberController,
                textCapitalization: TextCapitalization.characters,
                style: AppTypography.headingSmall.copyWith(
                  letterSpacing: 2,
                  color: AppColors.textPrimary,
                ),
                decoration: const InputDecoration(
                  hintText: 'e.g. MH02AB1234',
                  prefixIcon: Icon(Icons.directions_car_filled_rounded, color: AppColors.electricCyan),
                ),
              ),

              const SizedBox(height: 24),

              Text('Recharge Balance', style: AppTypography.headingSmall.copyWith(fontSize: 15)),
              const SizedBox(height: 10),
              Wrap(
                spacing: 10,
                children: [500, 1000, 2000, 3000].map((amt) {
                  final isSelected = _selectedFastagAmount == amt;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedFastagAmount = amt),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: isSelected ? AppColors.electricCyan.withOpacity(0.15) : AppColors.surfaceElevated,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected ? AppColors.electricCyan : AppColors.borderSubtle,
                        ),
                      ),
                      child: Text(
                        CurrencyFormatter.format(amt),
                        style: AppTypography.buttonLabel.copyWith(
                          color: isSelected ? AppColors.electricCyan : AppColors.textPrimary,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ],

            const SizedBox(height: 32),

            // Pay Action
            NeonButton(
              text: 'Recharge Now (${CurrencyFormatter.format(_modeIndex == 0 ? _selectedDthAmount : _selectedFastagAmount)})',
              variant: NeonButtonVariant.cyan,
              isLoading: _isProcessing,
              width: double.infinity,
              height: 52,
              onPressed: _handlePay,
            ),
          ],
        ),
      ),
    );
  }
}
