class Product {
  final String id;
  final String title;
  final String subtitle;
  final String category;
  final double originalPrice;
  final double salePrice;
  final double rating;
  final int reviewsCount;
  final String imageUrl;
  final List<String> images;
  final String description;
  final List<String> highlights;
  final List<String> availableVariants;
  final bool isFeatured;

  const Product({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.category,
    required this.originalPrice,
    required this.salePrice,
    required this.rating,
    required this.reviewsCount,
    required this.imageUrl,
    required this.images,
    required this.description,
    required this.highlights,
    required this.availableVariants,
    this.isFeatured = false,
  });

  double get discountPercent => ((originalPrice - salePrice) / originalPrice) * 100;
}
