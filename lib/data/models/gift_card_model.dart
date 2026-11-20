class GiftCardBrand {
  final String id;
  final String name;
  final String category; // 'E-Commerce', 'Food & Dining', 'Fashion', 'Travel', 'Entertainment'
  final String logoUrl;
  final double cashbackRate; // e.g. 5.0 for 5%
  final String cashbackTag; // e.g. "5% Instant Cashback"
  final List<int> denominations;
  final String description;
  final String terms;
  final int validityDays;
  final String primaryColorHex;

  const GiftCardBrand({
    required this.id,
    required this.name,
    required this.category,
    required this.logoUrl,
    required this.cashbackRate,
    required this.cashbackTag,
    required this.denominations,
    required this.description,
    required this.terms,
    this.validityDays = 365,
    this.primaryColorHex = '00F2FE',
  });
}

class UserVoucher {
  final String id;
  final String brandName;
  final String category;
  final int denomination;
  final double cashbackEarned;
  final String cardNumber;
  final String pin;
  final DateTime expiryDate;
  final DateTime purchasedAt;
  final String redemptionUrl;
  final bool isRedeemed;

  const UserVoucher({
    required this.id,
    required this.brandName,
    required this.category,
    required this.denomination,
    required this.cashbackEarned,
    required this.cardNumber,
    required this.pin,
    required this.expiryDate,
    required this.purchasedAt,
    required this.redemptionUrl,
    this.isRedeemed = false,
  });
}
