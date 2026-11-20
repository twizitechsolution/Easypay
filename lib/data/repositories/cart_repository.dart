import 'package:flutter/foundation.dart';
import '../models/product_model.dart';
import '../models/cart_item_model.dart';
import '../mock/mock_products.dart';

class CartRepository extends ChangeNotifier {
  static final CartRepository _instance = CartRepository._internal();
  factory CartRepository() => _instance;

  CartRepository._internal() {
    // Add default initial item to cart for realistic experience
    _items.add(
      CartItem(
        product: MockProducts.catalog.first,
        selectedVariant: MockProducts.catalog.first.availableVariants.first,
        quantity: 1,
      ),
    );
  }

  final List<CartItem> _items = [];
  String? _appliedPromoCode;
  double _promoDiscountPercent = 0.0;

  final List<DeliveryAddress> _addresses = [
    const DeliveryAddress(
      id: 'addr_01',
      name: 'Alex Johnson',
      street: 'Flat 402, Cyber Heights, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      phone: '+91 98765 43210',
      tag: 'Home',
      isDefault: true,
    ),
    const DeliveryAddress(
      id: 'addr_02',
      name: 'Alex Johnson',
      street: 'Level 5, WeWork Prestige Tech Park, Marathahalli',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
      phone: '+91 98765 43210',
      tag: 'Work',
      isDefault: false,
    ),
  ];

  DeliveryAddress? _selectedAddress;

  final List<OrderModel> _placedOrders = [];

  List<CartItem> get items => List.unmodifiable(_items);
  List<DeliveryAddress> get addresses => List.unmodifiable(_addresses);
  List<OrderModel> get placedOrders => List.unmodifiable(_placedOrders);

  DeliveryAddress get selectedAddress =>
      _selectedAddress ?? _addresses.firstWhere((a) => a.isDefault, orElse: () => _addresses.first);

  int get totalItemCount => _items.fold(0, (sum, i) => sum + i.quantity);

  double get subtotal => _items.fold(0.0, (sum, i) => sum + i.totalPrice);

  double get deliveryFee => (subtotal >= 999 || _items.isEmpty) ? 0.0 : 70.0;

  double get promoDiscountAmount => (subtotal * _promoDiscountPercent) / 100.0;

  double get totalAmount => (subtotal - promoDiscountAmount + deliveryFee).clamp(0.0, double.infinity);

  String? get appliedPromoCode => _appliedPromoCode;

  void selectAddress(DeliveryAddress address) {
    _selectedAddress = address;
    notifyListeners();
  }

  void addToCart(Product product, String variant, {int quantity = 1}) {
    final existingIndex = _items.indexWhere(
      (item) => item.product.id == product.id && item.selectedVariant == variant,
    );

    if (existingIndex != -1) {
      _items[existingIndex].quantity += quantity;
    } else {
      _items.add(
        CartItem(
          product: product,
          selectedVariant: variant,
          quantity: quantity,
        ),
      );
    }
    notifyListeners();
  }

  void updateQuantity(CartItem item, int delta) {
    final newQty = item.quantity + delta;
    if (newQty <= 0) {
      _items.remove(item);
    } else {
      item.quantity = newQty;
    }
    notifyListeners();
  }

  void removeItem(CartItem item) {
    _items.remove(item);
    notifyListeners();
  }

  bool applyPromoCode(String code) {
    final clean = code.trim().toUpperCase();
    if (clean == 'NEON20') {
      _appliedPromoCode = 'NEON20';
      _promoDiscountPercent = 20.0;
      notifyListeners();
      return true;
    } else if (clean == 'EASY10') {
      _appliedPromoCode = 'EASY10';
      _promoDiscountPercent = 10.0;
      notifyListeners();
      return true;
    }
    return false;
  }

  void removePromoCode() {
    _appliedPromoCode = null;
    _promoDiscountPercent = 0.0;
    notifyListeners();
  }

  OrderModel checkout() {
    final order = OrderModel(
      orderId: 'EP-${DateTime.now().millisecondsSinceEpoch.toString().substring(6)}',
      items: List.from(_items),
      totalAmount: totalAmount,
      discountAmount: promoDiscountAmount,
      address: selectedAddress,
      orderDate: DateTime.now(),
      currentStepIndex: 1, // 'Packed'
      trackingNumber: 'DELHIVERY-${DateTime.now().millisecondsSinceEpoch.toString().substring(4)}',
    );

    _placedOrders.insert(0, order);
    _items.clear();
    _appliedPromoCode = null;
    _promoDiscountPercent = 0.0;
    notifyListeners();
    return order;
  }
}
