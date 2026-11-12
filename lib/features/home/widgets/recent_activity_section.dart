import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/neon_badge.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../data/models/transaction_model.dart';
import '../../../data/mock/mock_transactions.dart';

class RecentActivitySection extends StatelessWidget {
  final VoidCallback onViewHistory;

  const RecentActivitySection({
    super.key,
    required this.onViewHistory,
  });

  @override
  Widget build(BuildContext context) {
    final transactions = MockTransactions.recent;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Recent Transactions',
              style: AppTypography.headingMedium.copyWith(fontSize: 17),
            ),
            GestureDetector(
              onTap: onViewHistory,
              child: Text(
                'View All',
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.electricCyan,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            color: AppColors.surfaceElevated.withOpacity(0.6),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(
              color: AppColors.borderSubtle,
              width: 1,
            ),
          ),
          child: ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: transactions.length,
            separatorBuilder: (_, __) => Divider(
              color: AppColors.borderSubtle.withOpacity(0.5),
              height: 1,
            ),
            itemBuilder: (context, index) {
              final tx = transactions[index];
              return _TransactionTile(tx: tx);
            },
          ),
        ),
      ],
    );
  }
}

class _TransactionTile extends StatelessWidget {
  final TransactionRecord tx;

  const _TransactionTile({required this.tx});

  IconData _getIcon() {
    switch (tx.type) {
      case TransactionType.cashbackReward:
        return Icons.auto_awesome_rounded;
      case TransactionType.mobileRecharge:
        return Icons.phone_android_rounded;
      case TransactionType.upiTransfer:
        return Icons.currency_rupee_rounded;
      case TransactionType.giftCardPurchase:
        return Icons.card_giftcard_rounded;
      case TransactionType.billPayment:
        return Icons.receipt_long_rounded;
      case TransactionType.storeOrder:
        return Icons.local_mall_rounded;
    }
  }

  Color _getIconColor() {
    if (tx.isCredit) return AppColors.cyberEmerald;
    return AppColors.electricCyan;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      child: Row(
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: _getIconColor().withOpacity(0.12),
              shape: BoxShape.circle,
              border: Border.all(
                color: _getIconColor().withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Icon(
              _getIcon(),
              size: 20,
              color: _getIconColor(),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  tx.title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTypography.headingSmall.copyWith(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  tx.subtitle,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTypography.bodySmall.copyWith(
                    fontSize: 11,
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${tx.isCredit ? "+" : "-"}${CurrencyFormatter.format(tx.amount)}',
                style: AppTypography.headingSmall.copyWith(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: tx.isCredit ? AppColors.cyberEmerald : AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                'Just now',
                style: AppTypography.bodySmall.copyWith(
                  fontSize: 10,
                  color: AppColors.textTertiary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
