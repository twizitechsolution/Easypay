# Easy Pay — Complete Curie.apk Reverse-Engineered Platform Guide

---

## 1. Local Testing & Live Server Setup

Easy Pay & Curie Money platform aapke system par **Port 5000** par live running hai!

| Application | Local URL | Description |
| :--- | :--- | :--- |
| **Consumer Super-App** (Web & Mobile) | [http://localhost:5000/](http://localhost:5000/) | Complete Curie & EasyPay UI with authentic Lottie animations, 5-button bottom nav, and Bonds Hub. |
| **Mobile Dedicated View** | [http://localhost:5000/app](http://localhost:5000/app) | Native mobile viewport container with edge-to-edge styling. |
| **Enterprise Admin Portal** | [http://localhost:5000/admin](http://localhost:5000/admin) | Enterprise Dashboard managing GMV, active bonds, gift cards catalog, recharges, and platform analytics. |

---

## 2. Bottom Navigation Menu (Exact 5 Items)

Application ke bottom dock me 5 exact buttons implement kiye gaye hain:

1. **`Home`** (`fa-house`): Total available balance, Quick wallet add, BBPS utilities grid (Mobile, DTH, FASTag, Electricity), trending gift vouchers.
2. **`Gift Card`** (`fa-gift`): Brand gift voucher hub with categories (E-Commerce, Food, Fashion, Travel) and Pine Labs instant code generation.
3. **`Bonds`** (`12%` Prominent Badge): Dedicated Curie & Stable Money investment hub featuring all 4 reverse-engineered screenshots.
4. **`Passbook`** (`fa-clock-rotate-left`): Unified History & Active Bonds Portfolio with DICGC insurance certificate download.
5. **`Profile`** (`fa-user`): User identity (Rahul Sharma), KYC verified status, CIBIL 782 score, linked bank accounts, and 1-click **Replay Curie Onboarding Flow**.

---

## 3. Reverse-Engineered Curie.apk Flows (All 4 Screenshots Implemented)

### Screenshot 3: Top Rate Increased Slider
- Green badge: **`RATE INCREASED`**
- Heading: *"FD rate just increased for Suryoday SF Bank"*
- 3D column comparison graphic: Old rate `8.50%` (5y) vs New rate `8.60%` (5y) with upward green growth curve and 3D ₹ coin token.
- 8 carousel pagination dots with active indicator.
- **`Invest now →`** CTA button.

### Screenshot 4: Connecting Radar Logo Merging Screen
- User clicks *`Invest now →`*.
- Fullscreen overlay opens with concentric expanding radar ripple rings.
- User profile logo (**TS**) on the left and Suryoday SF Bank / EasyPay logo on the right.
- Both logos smoothly merge together towards the center with an animated pulse!
- Status text: *"Connecting you to Suryoday SF Bank"*.
- Official RBI protection badge: *"Up to ₹5 lakh is insured by DICGC (A wholly owned subsidiary of RBI)"*.
- Automatically transitions into the **Bond Investment Booking Modal** with live compound maturity calculator.

### Screenshot 1: "Invest with EasyPay" Section
- Top 3 cards in horizontal layout:
  1. **Bonds**: *Senior secured* • *SEBI-registered* • **`12.00%`** return • 3D purple scroll
  2. **RD**: *RBI-regulated* • 3D purple calendar
  3. **FD Card**: *0.5% cashback* • 3D purple credit cards
- **KBC Contest Promo Banner**: *"EasyPay presents: Be on KBC Hotseat with Amitabh Bachchan ↗"* with official Kaun Banega Crorepati gold seal.
- **Why invest with EasyPay**:
  - *"All in one place"* (FDs, Recurring Deposits, Senior Bonds, and track portfolio) with 3D checkmark coin.
  - *"No hidden fees. Complete transparency"* (Zero annual fees, transparent investing).
- *"What's on your mind?"* 6-card quick access grid (RD Monthly, High returns, FD card, No penalty withdrawal, Monthly payouts, Withdraw instantly).

### Screenshot 2: Total Investment Worth & 3D Rotating Dotted India Globe
- Heading: **`TOTAL INVESTMENT WORTH`**
- Animated rolling counter: **`₹1,41,85,11,75,000`**
- Stats: *"Across 3,500+ cities • From 78+ lakh Indians"*
- **3D Interactive Rotating Dotted Globe on HTML5 Canvas**:
  - Dotted longitude/latitude sphere of India rotating in real-time.
  - Live pulsing radar pins showing real-time bookings:
    - *"Bond booked in Delhi (₹50,000)"*
    - *"Bond booked in Bihar (₹1,00,000)"*
    - *"Bond booked in Bengaluru (₹25,000)"*
    - *"Bond booked in Mumbai (₹2,00,000)"*
    - *"Bond booked in Kolkata (₹75,000)"*
    - *"Bond booked in Jaipur (₹50,000)"*

---

## 4. Authentic Curie Onboarding Full Cycle

Top bar me **`Replay Auth`** button ya Profile tab me **`Replay Curie Onboarding Flow`** click karke full cycle test karein:
1. **Splash Screen**: Fullscreen splash with authentic `splash.json` Lottie animation.
2. **Login Screen**: Mobile number entry (+91) with authentic `onboarding_anim_1.json` Lottie carousel.
3. **Please Wait Screen**: Animated `loading_anim.json` / `three_dot_loader.json` with credential verification.
4. **OTP Screen**: 6-digit PIN boxes with auto-fill demo (`773190`) and instant transition to the main app!

---

## 5. How to Test (Step-by-Step)

1. Open in your browser: **[http://localhost:5000/](http://localhost:5000/)**
2. Click on the **Bonds (12%)** tab in the bottom bar.
3. Observe the **Rate Increased Slider** and the 3D column chart.
4. Click **`Invest now →`** to experience the **Radar Logo Merging animation** (TS + Bank logo merging together).
5. Select ₹50,000 and 5 Years lock-in, then click **`Confirm & Book Now`** -> Instant DICGC Insured Bond Certificate is issued!
6. Click **`View in Passbook & Portfolio`** (Tab 4) to verify your newly booked bond with certificate number, maturity date, and guaranteed returns.
7. Click on the **Profile** tab (Tab 5) and click **`Replay Curie Onboarding Flow`** to test the complete Splash $\rightarrow$ Login $\rightarrow$ Loader $\rightarrow$ OTP sequence!
