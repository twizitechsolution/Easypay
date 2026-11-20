# Easy Pay — Master Product & Architecture Specification Document

---

## 1. Project Overview & Identity

* **Application Name**: **Easy Pay**
* **Operating Entity**: Easy Pay Fintech & Digital Commerce
* **Target Audience**: Indian consumers seeking everyday financial utilities, instant digital gift card savings, and in-app curated shopping.
* **Target Platforms**: Android (APK / App Bundle) & iOS via Google Flutter (Dart 3.x).

---

## 2. Design System: Modern Fintech with Neon Accents

### Color Tokens
* **Background Primary**: Deep Obsidian Black (`#0A0D14`)
* **Background Secondary / Surfaces**: Dark Slate Blue (`#121721`)
* **Elevated Cards / Modals**: Frosted Glass Surface (`#1A2130` with `1px` border `#2A3447`)
* **Primary Neon Accent**: Electric Cyan (`#00F2FE` gradient to `#4FACFE`)
* **Secondary Neon Accent**: Cyber Emerald (`#00FF87` gradient to `#60EFA0` — for savings, cashback, success states)
* **Highlight / Alert Accent**: Neon Magenta / Purple (`#7928CA` to `#FF0080`)
* **Text Primary**: Crisp White (`#FFFFFF`)
* **Text Muted / Subtitle**: Cool Grey (`#8E9BAE`)

### Visual Style Rules
* **Glassmorphic Cards**: Subtle blur filters (`BackdropFilter`) with dark translucent backgrounds.
* **Neon Glow Effects**: Active action buttons (e.g., "Buy Voucher", "Recharge Now", "Pay via UPI") feature soft neon drop-shadow glows.
* **Pill Badges**: Cashback and discount tags displayed in high-contrast neon badges (e.g., `5% Instant Cashback`).

---

## 3. Core Feature Modules & Specifications

### Module 1: Super-App Home Dashboard
* **Dynamic Header**: User greeting, profile avatar, wallet/rewards balance badge, notifications bell.
* **Hero Quick-Pay Card**: High-visibility neon gradient card featuring:
  * "Scan UPI QR Code" (Camera trigger)
  * "Send Money / Pay via UPI ID"
  * "Check Balance"
* **Services Grid**:
  * Mobile Recharge (Prepaid & Postpaid)
  * DTH Recharge (Tata Play, Airtel DTH, Dish TV, Sun Direct)
  * FASTag Recharge
  * Electricity & Water Bills (Bharat Connect / BBPS integration)
  * CIBIL Credit Score Check
* **Promotional Banner Carousel**: Sliding banners for cashback offers and flash sales.
* **Gift Cards Showcase**: Top trending Indian brand vouchers (Amazon Pay, Flipkart, Swiggy, Zomato) with real-time cashback percentages.
* **Curated Dropshipping Deals**: Featured shopping products with "Buy Now" triggers.

---

### Module 2: Digital Gift Cards Hub (Priority #1)
* **Search & Filter Bar**: Instant client-side search across 300+ Indian brands with category filter pills (All, E-Commerce, Food & Dining, Fashion, Travel, Electronics, Entertainment).
* **Brand Detail & Denomination Selector**:
  * Fixed denomination chips (₹100, ₹250, ₹500, ₹1000, ₹2000, ₹5000) or custom range inputs.
  * Real-time calculation: Displays Amount Payable, Discount/Cashback Applied, and Final Savings.
  * Brand terms & conditions, redemption instructions, and validity period.
* **Digital Code & PIN Vault (My Vouchers)**:
  * Encrypted local storage (`flutter_secure_storage` / SQLite).
  * Card view displaying: Brand Logo, 16-digit Card Number, Secret PIN, Expiration Date, and Claim URL.
  * Action buttons: "One-Tap Copy Code", "Copy PIN", "Redeem Now", and "Share Voucher via WhatsApp/SMS".
  * Barcode & QR Code renderer for in-store point-of-sale redemption.

---

### Module 3: Recharge & Utility Bill Payments (Bharat Connect / BBPS)
* **Mobile Recharge**:
  * Mobile number input with auto-operator and circle detection.
  * Plan browser categorized by Recommended, Truly Unlimited, Data Packs, and Top-Up.
* **DTH & FASTag**:
  * Subscriber ID / Vehicle Registration number lookup.
  * Real-time bill fetching.
* **Utility Payments (Electricity, Gas, Water)**:
  * State and biller selector (supporting 200+ Indian billers).
  * Consumer number validation and due amount presentation.

---

### Module 4: In-App Dropshipping Store (E-Commerce Expansion)
* **Storefront Feed**:
  * Category tiles (Smart Gadgets, Fashion & Accessories, Home & Living, Lifestyle).
  * Product grid with high-resolution imagery, pricing, discounts, and customer ratings.
* **Product Detail Screen**:
  * Image carousel, variant selector (size, color, specifications), detailed descriptions, and return policies.
* **Shopping Cart & Checkout**:
  * Item quantity adjustments, promo code input, and total price breakdown (Subtotal, GST, Delivery Fee, Discount).
* **Multi-Address Management**: Saved delivery addresses with GPS location autofill.
* **Order Tracking Pipeline**: Live stepper showing Order Placed $\rightarrow$ Packed $\rightarrow$ Shipped $\rightarrow$ Out for Delivery $\rightarrow$ Delivered.

---

### Module 5: Payments Engine & UPI Intent Routing
* **UPI Intent (Zero-Redirect Payments)**:
  * Direct intent resolution via `upi://pay` query calling installed Indian UPI applications:
    * PhonePe (`com.phonepe.app`)
    * Google Pay (`com.google.android.apps.nbu.paisa.user`)
    * Paytm (`net.one97.paytm`)
    * CRED (`com.dreamplug.androidapp`)
    * Amazon Pay (`in.amazon.mShop.android.shopping`)
    * BHIM UPI (`in.org.npci.upiapp`)
* **Payment Gateway Fallback**: Supports Net Banking, Debit/Credit Cards, and Wallets (Razorpay / Cashfree simulation).
* **Order Confirmation & Digital Receipt**: Instant animated success screen with downloadable receipt.

---

## 4. Technical Architecture & File Organization

```
easy_pay/
├── android/app/src/main/AndroidManifest.xml   # UPI queries, Camera, Biometric permissions
├── lib/
│   ├── core/
│   │   ├── theme/
│   │   │   ├── app_colors.dart                 # Obsidian & Neon color palette
│   │   │   ├── app_typography.dart             # Modern geometric font styles
│   │   │   └── app_theme.dart                  # Dark neon ThemeData
│   │   ├── constants/
│   │   │   ├── api_endpoints.dart
│   │   │   └── app_assets.dart
│   │   └── utils/
│   │       ├── currency_formatter.dart         # INR ₹ formatters
│   │       └── upi_launcher.dart               # upi:// intent caller
│   ├── data/
│   │   ├── mock/                               # Built-in mock data for offline prototype
│   │   │   ├── mock_gift_cards.dart            # Amazon, Flipkart, Swiggy, Zomato catalogs
│   │   │   ├── mock_recharge_plans.dart        # Jio, Airtel, Vi tariff plans
│   │   │   └── mock_products.dart              # Dropshipping store inventory
│   │   └── repositories/
│   │       ├── gift_card_repository.dart
│   │       ├── recharge_repository.dart
│   │       └── store_repository.dart
│   ├── features/
│   │   ├── auth/screens/
│   │   ├── home/screens/
│   │   │   └── home_screen.dart
│   │   ├── gift_cards/screens/
│   │   │   ├── gift_cards_catalog_screen.dart
│   │   │   ├── gift_card_detail_screen.dart
│   │   │   └── my_vouchers_vault_screen.dart
│   │   ├── recharge/screens/
│   │   │   ├── mobile_recharge_screen.dart
│   │   │   └── bill_payment_screen.dart
│   │   ├── shopping/screens/
│   │   │   ├── store_screen.dart
│   │   │   ├── product_detail_screen.dart
│   │   │   └── cart_checkout_screen.dart
│   │   └── navigation/
│   │       └── main_navigation_wrapper.dart    # Neon floating bottom navigation bar
│   └── main.dart
```

---

## 5. Implementation Phases

* **Phase 1**: Project initialization, theme tokens, neon components, and main navigation shell.
* **Phase 2**: Home super-app dashboard and Gift Cards catalog + voucher vault (with full mock dataset).
* **Phase 3**: Shopping & dropshipping storefront (product listing, detail page, cart, and address manager).
* **Phase 4**: Recharge & bill payment workflows with plan selectors.
* **Phase 5**: Payments engine (UPI intent triggering & order success animations).
* **Phase 6**: Build release APK.
