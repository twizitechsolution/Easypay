class TelecomOperator {
  final String id;
  final String name;
  final String logoCode; // 'JIO', 'AIRTEL', 'VI', 'BSNL'
  final String primaryColorHex;

  const TelecomOperator({
    required this.id,
    required this.name,
    required this.logoCode,
    required this.primaryColorHex,
  });
}

class RechargePlan {
  final String id;
  final String operatorId;
  final double price;
  final String validity;
  final String data;
  final String voice;
  final String sms;
  final String category; // 'Truly Unlimited', '5G Data', 'Recommended', 'Annual'
  final String description;
  final List<String> perks;
  final bool isPopular;

  const RechargePlan({
    required this.id,
    required this.operatorId,
    required this.price,
    required this.validity,
    required this.data,
    required this.voice,
    required this.sms,
    required this.category,
    required this.description,
    this.perks = const [],
    this.isPopular = false,
  });
}

class DthProvider {
  final String id;
  final String name;
  final String primaryColorHex;

  const DthProvider({
    required this.id,
    required this.name,
    required this.primaryColorHex,
  });
}

class FastagBank {
  final String id;
  final String bankName;

  const FastagBank({
    required this.id,
    required this.bankName,
  });
}

class UtilityBiller {
  final String id;
  final String name;
  final String state;
  final String category; // 'Electricity', 'Water', 'Piped Gas'

  const UtilityBiller({
    required this.id,
    required this.name,
    required this.state,
    required this.category,
  });
}

class FetchedBillDetails {
  final String consumerNumber;
  final String customerName;
  final String billerName;
  final double dueAmount;
  final DateTime dueDate;
  final String billNumber;

  const FetchedBillDetails({
    required this.consumerNumber,
    required this.customerName,
    required this.billerName,
    required this.dueAmount,
    required this.dueDate,
    required this.billNumber,
  });
}
