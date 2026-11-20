import 'dart:math';
import 'package:flutter/foundation.dart';
import '../models/gift_card_model.dart';
import '../mock/mock_gift_cards.dart';

class GiftCardRepository extends ChangeNotifier {
  static final GiftCardRepository _instance = GiftCardRepository._internal();
  factory GiftCardRepository() => _instance;

  GiftCardRepository._internal() {
    _vouchers.addAll(MockGiftCards.initialVouchers);
  }

  final List<GiftCardBrand> _brands = List.from(MockGiftCards.brands);
  final List<UserVoucher> _vouchers = [];

  List<GiftCardBrand> get allBrands => List.unmodifiable(_brands);
  List<UserVoucher> get allVouchers => List.unmodifiable(_vouchers);

  List<UserVoucher> get activeVouchers =>
      _vouchers.where((v) => !v.isRedeemed).toList();

  List<UserVoucher> get redeemedVouchers =>
      _vouchers.where((v) => v.isRedeemed).toList();

  double get totalSavingsEarned =>
      _vouchers.fold(0.0, (acc, item) => acc + item.cashbackEarned);

  /// Client-side instant search and category filter
  List<GiftCardBrand> searchAndFilter({
    String query = '',
    String category = 'All',
  }) {
    return _brands.where((b) {
      final matchesCategory = category == 'All' || b.category.toLowerCase() == category.toLowerCase();
      final matchesQuery = query.isEmpty ||
          b.name.toLowerCase().contains(query.toLowerCase()) ||
          b.category.toLowerCase().contains(query.toLowerCase()) ||
          b.description.toLowerCase().contains(query.toLowerCase());
      return matchesCategory && matchesQuery;
    }).toList();
  }

  /// Purchase and generate an instant digital voucher
  UserVoucher purchaseVoucher({
    required GiftCardBrand brand,
    required int denomination,
  }) {
    final random = Random();
    final cardSegments = List.generate(
      4,
      (i) => i == 0
          ? brand.name.replaceAll(RegExp(r'[^a-zA-Z]'), '').toUpperCase().padRight(4, 'X').substring(0, 4)
          : (1000 + random.nextInt(9000)).toString(),
    );
    final cardNumber = cardSegments.join('-');
    final pin = (1000 + random.nextInt(9000)).toString();
    final cashbackEarned = (denomination * brand.cashbackRate) / 100.0;

    final voucher = UserVoucher(
      id: 'vch_${DateTime.now().millisecondsSinceEpoch}',
      brandName: brand.name,
      category: brand.category,
      denomination: denomination,
      cashbackEarned: cashbackEarned,
      cardNumber: cardNumber,
      pin: pin,
      expiryDate: DateTime.now().add(Duration(days: brand.validityDays)),
      purchasedAt: DateTime.now(),
      redemptionUrl: 'https://${brand.id}.com/redeem',
      isRedeemed: false,
    );

    _vouchers.insert(0, voucher);
    notifyListeners();
    return voucher;
  }

  /// Mark voucher as redeemed
  void toggleVoucherRedemption(String id) {
    final index = _vouchers.indexWhere((v) => v.id == id);
    if (index != -1) {
      final current = _vouchers[index];
      _vouchers[index] = UserVoucher(
        id: current.id,
        brandName: current.brandName,
        category: current.category,
        denomination: current.denomination,
        cashbackEarned: current.cashbackEarned,
        cardNumber: current.cardNumber,
        pin: current.pin,
        expiryDate: current.expiryDate,
        purchasedAt: current.purchasedAt,
        redemptionUrl: current.redemptionUrl,
        isRedeemed: !current.isRedeemed,
      );
      notifyListeners();
    }
  }
}
