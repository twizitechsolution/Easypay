import '../models/transaction_model.dart';

class MockTransactions {
  static final List<TransactionRecord> recent = [
    TransactionRecord(
      id: 'tx_01',
      title: 'Swiggy Voucher Cashback',
      subtitle: 'Instant reward credited to Easy Pay Balance',
      amount: 30.0,
      isCredit: true,
      type: TransactionType.cashbackReward,
      timestamp: DateTime.now().subtract(const Duration(minutes: 42)),
      referenceId: 'EPAY-REW-94821',
    ),
    TransactionRecord(
      id: 'tx_02',
      title: 'Jio Prepaid 5G Recharge',
      subtitle: 'Mobile +91 98765 43210 (₹299 Truly Unlimited)',
      amount: 299.0,
      isCredit: false,
      type: TransactionType.mobileRecharge,
      timestamp: DateTime.now().subtract(const Duration(hours: 3)),
      referenceId: 'EPAY-REC-11820',
    ),
    TransactionRecord(
      id: 'tx_03',
      title: 'UPI Transfer to Rahul Sharma',
      subtitle: 'Sent via PhonePe (rahul@okaxis)',
      amount: 1500.0,
      isCredit: false,
      type: TransactionType.upiTransfer,
      timestamp: DateTime.now().subtract(const Duration(hours: 22)),
      referenceId: 'UPI-4820194829',
    ),
    TransactionRecord(
      id: 'tx_04',
      title: 'Referral Bonus Credited',
      subtitle: 'Friend joined Easy Pay via your invite link',
      amount: 100.0,
      isCredit: true,
      type: TransactionType.cashbackReward,
      timestamp: DateTime.now().subtract(const Duration(days: 1)),
      referenceId: 'EPAY-REF-77301',
    ),
  ];
}
