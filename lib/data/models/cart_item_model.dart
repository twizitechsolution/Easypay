import 'product_model.dart';

class CartItem {
  final Product product;
  final String selectedVariant;
  int quantity;

  CartItem({
    required this.product,
    required this.selectedVariant,
    this.quantity = 1,
  });

  double get totalPrice => product.salePrice * quantity;
}

class DeliveryAddress {
  final String id;
  final String name;
  final String street;
  final String city;
  final String state;
  final String pincode;
  final String phone;
  final String tag; // 'Home', 'Work'
  final bool isDefault;

  const DeliveryAddress({
    required this.id,
    required this.name,
    required this.street,
    required this.city,
    required this.state,
    required this.pincode,
    required this.phone,
    this.tag = 'Home',
    this.isDefault = false,
  });
}

class OrderModel {
  final String orderId;
  final List<CartItem> items;
  final double totalAmount;
  final double discountAmount;
  final DeliveryAddress address;
  final DateTime orderDate;
  final int currentStepIndex; // 0: Placed, 1: Packed, 2: Shipped, 3: Out for Delivery, 4: Delivered
  final String trackingNumber;

  const OrderModel({
    required this.orderId,
    required this.items,
    required this.totalAmount,
    required this.discountAmount,
    required this.address,
    required this.orderDate,
    required this.currentStepIndex,
    required this.trackingNumber,
  });
}
