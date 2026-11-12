enum TransactionType {
  upiTransfer,
  giftCardPurchase,
  cashbackReward,
  mobileRecharge,
  billPayment,
  storeOrder,
}

class TransactionRecord {
  final String id;
  final String title;
  final String subtitle;
  final double amount;
  final bool isCredit;
  final TransactionType type;
  final DateTime timestamp;
  final String status;
  final String? referenceId;

  const TransactionRecord({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.amount,
    required this.isCredit,
    required this.type,
    required this.timestamp,
    this.status = 'Success',
    this.referenceId,
  });
}
