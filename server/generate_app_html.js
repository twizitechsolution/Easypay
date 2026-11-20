const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'public', 'app.html');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>EasyPay — Complete Native & Web Application</title>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#0F172A">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  
  <!-- Fonts & FontAwesome -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <!-- Lottie Web Player -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>

  <style>
    :root {
      --primary-navy: #0F172A;
      --primary-blue: #1E3A8A;
      --primary-royal: #2563EB;
      --accent-green: #059669;
      --accent-green-bright: #10B981;
      --accent-green-light: #ECFDF5;
      --accent-purple: #7C3AED;
      --accent-purple-light: #F5F3FF;
      --accent-gold: #92400E;
      --accent-gold-light: #FEF3C7;
      --bg-page: #F8FAFC;
      --surface-white: #FFFFFF;
      --text-main: #0F172A;
      --text-secondary: #475569;
      --text-muted: #94A3B8;
      --border-light: #E2E8F0;
      --border-subtle: #F1F5F9;
      --shadow-sm: 0 1px 3px rgba(0,0,0,0.05);
      --shadow-md: 0 4px 14px rgba(0,0,0,0.07);
      --shadow-lg: 0 10px 25px -5px rgba(15, 23, 42, 0.12);
      --radius-sm: 10px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-pill: 9999px;
      --font-heading: 'Plus Jakarta Sans', sans-serif;
      --font-body: 'Inter', sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      background-color: #0B1120;
      color: var(--text-main);
      font-family: var(--font-body);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 0;
      overflow-x: hidden;
    }

    /* Top Tester & Switcher Bar */
    .top-tester-bar {
      width: 100%;
      background: #0F172A;
      color: #FFFFFF;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    .tester-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .tester-badge {
      background: #059669;
      color: white;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: var(--radius-pill);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .tester-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-test {
      background: #1E293B;
      border: 1px solid #334155;
      color: #E2E8F0;
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-test:hover {
      background: #334155;
      color: #FFFFFF;
    }
    .btn-test.admin-btn {
      background: #059669;
      border-color: #047857;
      color: #FFFFFF;
    }

    /* Responsive Mobile Frame Wrapper */
    .app-viewport-wrapper {
      width: 100%;
      max-width: 440px;
      min-height: 100vh;
      background: var(--bg-page);
      position: relative;
      box-shadow: 0 0 50px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }

    @media (min-width: 768px) {
      body {
        padding: 16px 0;
      }
      .app-viewport-wrapper {
        min-height: 900px;
        max-height: 940px;
        border-radius: 40px;
        border: 10px solid #1E293B;
        overflow-y: auto;
      }
    }

    /* App Header */
    .app-header {
      background: #FFFFFF;
      padding: 14px 18px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 1px solid var(--border-light);
    }
    .header-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .header-logo-icon {
      width: 32px;
      height: 32px;
      background: #0F172A;
      color: #FFFFFF;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
    .header-brand-title {
      font-family: var(--font-heading);
      font-size: 18px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.3px;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-icon-btn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #F8FAFC;
      border: 1px solid var(--border-light);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #475569;
      font-size: 15px;
      cursor: pointer;
      text-decoration: none;
    }
    .header-user-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 14px;
      border: 2px solid #E2E8F0;
      cursor: pointer;
      letter-spacing: 0.5px;
    }

    /* Trial FD Badge */
    .trial-fd-badge {
      background: #FEF3C7;
      color: #92400E;
      font-size: 11px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: var(--radius-pill);
      letter-spacing: 0.5px;
      border: 1px solid #FDE68A;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    /* Subpage Header */
    .subpage-header {
      background: #FFFFFF;
      padding: 14px 18px;
      display: none;
      align-items: center;
      gap: 14px;
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 1px solid var(--border-light);
    }
    .subpage-back-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #F1F5F9;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0F172A;
      font-size: 15px;
      cursor: pointer;
    }
    .subpage-title {
      font-family: var(--font-heading);
      font-size: 16px;
      font-weight: 700;
      color: #0F172A;
    }

    /* Main Scroll Area */
    .app-main-content {
      flex: 1;
      padding-bottom: 90px;
    }

    /* Section Card */
    .section-card {
      background: #FFFFFF;
      border-radius: var(--radius-lg);
      padding: 16px;
      margin: 12px 16px;
      border: 1px solid var(--border-light);
      box-shadow: var(--shadow-sm);
    }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }
    .section-title {
      font-family: var(--font-heading);
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
    }
    .section-subtitle {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .section-badge {
      background: var(--accent-green-light);
      color: var(--accent-green);
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: var(--radius-pill);
    }

    /* Wallet Card */
    .home-wallet-card {
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      color: #FFFFFF;
      border-radius: 20px;
      padding: 18px;
      margin: 12px 16px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.3);
    }
    .wallet-card-bg-circle {
      position: absolute;
      right: -20px;
      bottom: -20px;
      width: 140px;
      height: 140px;
      background: radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }
    .wallet-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #94A3B8;
      font-weight: 600;
    }
    .wallet-balance-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin: 10px 0 16px;
    }
    .wallet-balance-amount {
      font-family: var(--font-heading);
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .wallet-cashback-badge {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34D399;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: var(--radius-pill);
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    .wallet-actions-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    .btn-wallet-action {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #FFFFFF;
      padding: 8px 6px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-wallet-action:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    /* BBPS Quick Services Grid */
    .services-quick-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      text-align: center;
    }
    .service-tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
    }
    .service-icon-box {
      width: 52px;
      height: 52px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.04);
      transition: transform 0.15s;
    }
    .service-tile:hover .service-icon-box {
      transform: translateY(-2px);
    }
    .service-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-secondary);
      line-height: 1.2;
    }

    /* ==============================================================
       BONDS HUB STYLES (SCREENSHOTS 1, 2, 3, 4)
       ============================================================== */

    /* Top Rate Increased Carousel Slider (Screenshot 3) */
    .bonds-rate-slider-card {
      background: linear-gradient(180deg, #FEFCE8 0%, #FFFBEB 40%, #FFFFFF 100%);
      border: 1.5px solid #FEF08A;
      border-radius: 24px;
      padding: 20px 18px 16px;
      margin: 12px 16px;
      position: relative;
      box-shadow: 0 6px 20px rgba(234, 179, 8, 0.1);
    }
    .rate-badge-pill {
      background: #059669;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: var(--radius-pill);
      display: inline-block;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .slider-bank-title {
      font-family: var(--font-heading);
      font-size: 18px;
      font-weight: 800;
      color: #0F172A;
      line-height: 1.25;
      margin-bottom: 4px;
    }
    .slider-sub-text {
      font-size: 13px;
      color: #64748B;
      font-weight: 500;
      margin-bottom: 16px;
    }

    /* 3D Column Comparison Graphic */
    .rate-comparison-graphic {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      gap: 16px;
      margin-right: 10px;
      position: absolute;
      right: 18px;
      top: 24px;
      height: 120px;
    }
    .rate-bar-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
    }
    .rate-bar-label {
      font-size: 9px;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .rate-bar-value {
      font-family: var(--font-heading);
      font-size: 13px;
      font-weight: 800;
      margin-bottom: 4px;
    }
    .rate-bar-value.new {
      color: #059669;
      font-size: 16px;
    }
    .rate-bar-pillar {
      width: 32px;
      border-radius: 8px 8px 2px 2px;
      box-shadow: 2px 4px 10px rgba(0,0,0,0.1);
      position: relative;
    }
    .rate-bar-pillar.old {
      height: 52px;
      background: linear-gradient(180deg, #E2E8F0 0%, #CBD5E1 100%);
      border: 1px solid #94A3B8;
    }
    .rate-bar-pillar.new {
      height: 82px;
      background: linear-gradient(180deg, #34D399 0%, #059669 100%);
      border: 1px solid #047857;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 6px;
    }
    .green-growth-curve {
      position: absolute;
      top: -18px;
      right: 6px;
      color: #059669;
      font-size: 16px;
      animation: floatCurve 2s ease-in-out infinite alternate;
    }
    @keyframes floatCurve {
      0% { transform: translateY(0); }
      100% { transform: translateY(-4px); }
    }
    .rupee-coin-3d {
      width: 22px;
      height: 22px;
      background: radial-gradient(circle, #34D399 0%, #059669 80%);
      border: 1.5px solid #FFFFFF;
      border-radius: 50%;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 8px rgba(5, 150, 105, 0.4);
    }

    .btn-invest-slider {
      background: #0F172A;
      color: #FFFFFF;
      border: none;
      padding: 10px 18px;
      border-radius: var(--radius-pill);
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
      transition: transform 0.15s, background 0.15s;
      margin-top: 8px;
    }
    .btn-invest-slider:hover {
      background: #1E293B;
      transform: translateY(-1px);
    }

    /* 8-Dot Carousel Indicators */
    .slider-dots-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 14px;
    }
    .slider-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #CBD5E1;
      transition: all 0.2s;
    }
    .slider-dot.active {
      width: 18px;
      border-radius: var(--radius-pill);
      background: #0F172A;
    }

    /* "Invest with EasyPay" Top 3 Cards (Screenshot 1) */
    .bonds-category-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin: 14px 16px;
    }
    .bonds-cat-card {
      background: #FFFFFF;
      border: 1.5px solid var(--border-light);
      border-radius: 18px;
      padding: 12px 10px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 120px;
      box-shadow: var(--shadow-sm);
      cursor: pointer;
      transition: transform 0.15s, border-color 0.15s;
    }
    .bonds-cat-card:hover {
      transform: translateY(-2px);
      border-color: #CBD5E1;
    }
    .cat-card-header {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .cat-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
    }
    .cat-name {
      font-family: var(--font-heading);
      font-size: 13px;
      font-weight: 800;
      color: #0F172A;
    }
    .cat-badge-pill {
      font-size: 8px;
      font-weight: 800;
      padding: 2px 5px;
      border-radius: 4px;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .cat-badge-pill.purple {
      background: #EDE9FE;
      color: #7C3AED;
    }
    .cat-reg-text {
      font-size: 9px;
      color: #64748B;
      font-weight: 500;
    }
    .cat-rate-text {
      font-family: var(--font-heading);
      font-size: 15px;
      font-weight: 800;
      color: #059669;
      margin-top: 6px;
    }
    .cat-illustration-box {
      align-self: flex-end;
      width: 42px;
      height: 42px;
      background: #F5F3FF;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #7C3AED;
      font-size: 20px;
      box-shadow: 0 4px 10px rgba(124, 58, 237, 0.12);
    }

    /* KBC Promo Banner (Screenshot 1) */
    .kbc-promo-banner {
      background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
      border: 1.5px solid #FDE68A;
      border-radius: 20px;
      padding: 16px 18px;
      margin: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.1);
      cursor: pointer;
    }
    .kbc-banner-left {
      max-width: 65%;
    }
    .kbc-pre-text {
      font-size: 11px;
      color: #92400E;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .kbc-main-title {
      font-family: var(--font-heading);
      font-size: 15px;
      font-weight: 800;
      color: #0F172A;
      line-height: 1.25;
      margin-bottom: 2px;
    }
    .kbc-sub-text {
      font-size: 12px;
      color: #78350F;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .kbc-logo-emblem {
      width: 62px;
      height: 62px;
      border-radius: 50%;
      background: radial-gradient(circle, #3B0764 0%, #1E1B4B 100%);
      border: 2px solid #F59E0B;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 16px rgba(0,0,0,0.25);
      color: #FCD34D;
      font-size: 26px;
    }

    /* "Why Invest with EasyPay" Cards (Screenshot 1) */
    .why-invest-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin: 12px 16px;
    }
    .why-card {
      background: #FFFFFF;
      border: 1.5px solid var(--border-light);
      border-radius: 18px;
      padding: 16px 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: var(--shadow-sm);
    }
    .why-card-title {
      font-family: var(--font-heading);
      font-size: 13px;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 4px;
      line-height: 1.3;
    }
    .why-card-desc {
      font-size: 11px;
      color: #64748B;
      line-height: 1.35;
    }
    .why-card-icon-box {
      margin-top: 14px;
      align-self: flex-end;
      width: 44px;
      height: 44px;
      background: #EDE9FE;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #7C3AED;
      font-size: 20px;
    }

    /* "Total Investment Worth" Section (Screenshot 2) */
    .investment-worth-section {
      background: linear-gradient(180deg, #FBF8F5 0%, #F5EFEB 100%);
      border-top: 1px solid #EAE0D5;
      border-bottom: 1px solid #EAE0D5;
      padding: 24px 16px;
      margin-top: 20px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .worth-section-header {
      font-family: var(--font-heading);
      font-size: 12px;
      font-weight: 800;
      color: #92400E;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .worth-counter-display {
      font-family: var(--font-heading);
      font-size: 26px;
      font-weight: 800;
      color: #78350F;
      letter-spacing: -0.5px;
      margin-bottom: 12px;
    }
    .worth-metrics-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 18px;
      margin-bottom: 20px;
      font-size: 12px;
      color: #64748B;
      font-weight: 600;
    }
    .worth-metric-divider {
      width: 1px;
      height: 14px;
      background: #CBD5E1;
    }

    /* 3D Dotted Rotating Globe Canvas */
    .globe-canvas-wrapper {
      width: 100%;
      height: 260px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #dottedGlobeCanvas {
      width: 320px;
      height: 260px;
      display: block;
    }
    .live-booking-pill {
      position: absolute;
      top: 24px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      border: 1px solid #CBD5E1;
      padding: 6px 14px;
      border-radius: var(--radius-pill);
      box-shadow: 0 4px 14px rgba(0,0,0,0.08);
      font-size: 12px;
      font-weight: 700;
      color: #0F172A;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.3s;
    }
    .pulse-dot-green {
      width: 8px;
      height: 8px;
      background: #10B981;
      border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulseGreen 1.5s infinite;
    }
    @keyframes pulseGreen {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    /* "What's on your mind?" Grid (Screenshot 3) */
    .whats-on-mind-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin: 14px 16px;
    }
    .mind-card {
      background: #FFFFFF;
      border: 1.5px solid var(--border-light);
      border-radius: 16px;
      padding: 12px 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 105px;
      box-shadow: var(--shadow-sm);
      cursor: pointer;
      transition: transform 0.15s;
    }
    .mind-card:hover {
      transform: translateY(-2px);
    }
    .mind-card-title {
      font-family: var(--font-heading);
      font-size: 12px;
      font-weight: 700;
      color: #0F172A;
      line-height: 1.25;
    }
    .mind-card-sub {
      font-size: 9px;
      color: #64748B;
      margin-top: 2px;
    }
    .mind-card-icon {
      align-self: flex-end;
      width: 34px;
      height: 34px;
      background: #F5F3FF;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #7C3AED;
      font-size: 16px;
    }

    /* ==============================================================
       CONNECTING RADAR MODAL (SCREENSHOT 4)
       ============================================================== */
    .radar-modal-overlay {
      position: fixed;
      inset: 0;
      background: #FFFFFF;
      z-index: 9999;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 24px 20px 30px;
    }
    .radar-modal-overlay.active {
      display: flex;
    }
    .radar-top-row {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    .radar-stage-center {
      position: relative;
      width: 280px;
      height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    /* Concentric Radar Rings */
    .radar-circle {
      position: absolute;
      border-radius: 50%;
      border: 1px solid #E2E8F0;
      pointer-events: none;
    }
    .radar-circle-1 { width: 90px; height: 90px; animation: radarPulse 2.4s ease-out infinite; }
    .radar-circle-2 { width: 160px; height: 160px; animation: radarPulse 2.4s ease-out 0.8s infinite; }
    .radar-circle-3 { width: 230px; height: 230px; animation: radarPulse 2.4s ease-out 1.6s infinite; }
    .radar-circle-4 { width: 290px; height: 290px; }

    @keyframes radarPulse {
      0% { transform: scale(0.6); opacity: 0.8; }
      100% { transform: scale(1.15); opacity: 0; }
    }

    /* The two badges merging together */
    .radar-badges-wrap {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      z-index: 10;
    }
    .radar-badge-item {
      width: 68px;
      height: 68px;
      border-radius: 20px;
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      box-shadow: 0 8px 25px rgba(0,0,0,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 1.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .badge-user-ts {
      background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%);
      color: #FFFFFF;
      font-family: var(--font-heading);
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .badge-bank-logo {
      background: #EA580C;
      color: #FFFFFF;
      font-size: 26px;
      border-radius: 50%;
    }

    /* Merging Animation Triggered Class */
    .radar-badges-wrap.merging .radar-badge-item.left {
      transform: translateX(45px) scale(0.95);
    }
    .radar-badges-wrap.merging .radar-badge-item.right {
      transform: translateX(-45px) scale(0.95);
    }
    .radar-badges-wrap.merged .radar-badge-item {
      box-shadow: 0 0 30px rgba(16, 185, 129, 0.5);
      border-color: #10B981;
    }

    .radar-status-text {
      font-family: var(--font-heading);
      font-size: 17px;
      font-weight: 700;
      color: #0F172A;
      text-align: center;
      margin-top: 24px;
    }
    .radar-bank-name {
      color: #0F172A;
      font-weight: 800;
    }

    /* DICGC RBI Shield Badge (Screenshot 4) */
    .dicgc-guarantee-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 4px;
    }
    .dicgc-shield-icon {
      width: 28px;
      height: 28px;
      color: #059669;
      font-size: 22px;
      margin-bottom: 2px;
    }
    .dicgc-main-title {
      font-size: 13px;
      font-weight: 700;
      color: #1E293B;
    }
    .dicgc-sub-title {
      font-size: 11px;
      color: #64748B;
    }

    /* ==============================================================
       BOTTOM NAVIGATION DOCK (EXACT 5 ITEMS)
       ============================================================== */
    .app-bottom-nav {
      position: fixed;
      bottom: 0;
      width: 100%;
      max-width: 440px;
      background: #FFFFFF;
      border-top: 1px solid var(--border-light);
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      padding: 8px 4px 10px;
      z-index: 500;
      box-shadow: 0 -4px 15px rgba(0,0,0,0.04);
    }
    @media (min-width: 768px) {
      .app-bottom-nav {
        position: sticky;
        bottom: 0;
        border-radius: 0 0 30px 30px;
      }
    }
    .nav-tab-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      color: #64748B;
      text-decoration: none;
      cursor: pointer;
      position: relative;
      transition: color 0.15s;
    }
    .nav-tab-item i {
      font-size: 18px;
      transition: transform 0.15s;
    }
    .nav-tab-item span {
      font-size: 10px;
      font-weight: 600;
    }
    .nav-tab-item.active {
      color: #0F172A;
    }
    .nav-tab-item.active i {
      transform: scale(1.1);
      color: #0F172A;
    }
    .nav-tab-item.active span {
      font-weight: 800;
    }

    /* Prominent 12% Badge for Bonds Tab */
    .bonds-nav-badge {
      font-family: var(--font-heading);
      font-size: 14px;
      font-weight: 800;
      color: #059669;
      line-height: 1;
    }
    .nav-tab-item.active .bonds-nav-badge {
      color: #047857;
      transform: scale(1.1);
    }

    /* ==============================================================
       CURIE ONBOARDING & AUTH SCREENS (FULL CYCLE)
       ============================================================== */
    .curie-fullscreen-overlay {
      position: fixed;
      inset: 0;
      background: #FFFFFF;
      z-index: 10000;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 24px 20px;
      overflow-y: auto;
    }
    .curie-fullscreen-overlay.active {
      display: flex;
    }
    .onboarding-lottie-box {
      width: 220px;
      height: 220px;
      margin: 10px 0;
    }
    .onboarding-title {
      font-family: var(--font-heading);
      font-size: 22px;
      font-weight: 800;
      color: #0F172A;
      text-align: center;
      margin-bottom: 6px;
    }
    .onboarding-subtitle {
      font-size: 13px;
      color: #64748B;
      text-align: center;
      margin-bottom: 24px;
      line-height: 1.4;
    }
    .phone-input-wrap {
      display: flex;
      align-items: center;
      background: #F8FAFC;
      border: 1.5px solid #CBD5E1;
      border-radius: 14px;
      padding: 4px 14px;
      width: 100%;
      max-width: 340px;
      margin-bottom: 16px;
    }
    .phone-prefix {
      font-family: var(--font-heading);
      font-size: 15px;
      font-weight: 700;
      color: #0F172A;
      margin-right: 10px;
      border-right: 1px solid #CBD5E1;
      padding-right: 10px;
    }
    .phone-input-field {
      border: none;
      background: transparent;
      font-family: var(--font-heading);
      font-size: 16px;
      font-weight: 700;
      color: #0F172A;
      width: 100%;
      outline: none;
      letter-spacing: 1px;
    }
    .otp-boxes-wrap {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin: 20px 0;
    }
    .otp-digit-box {
      width: 44px;
      height: 52px;
      border: 1.5px solid #CBD5E1;
      border-radius: 12px;
      text-align: center;
      font-family: var(--font-heading);
      font-size: 20px;
      font-weight: 800;
      color: #0F172A;
      background: #F8FAFC;
      outline: none;
    }
    .otp-digit-box:focus {
      border-color: #2563EB;
      background: #FFFFFF;
      box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
    }

    /* Primary Actions */
    .btn-primary-action {
      background: #0F172A;
      color: #FFFFFF;
      border: none;
      border-radius: 14px;
      padding: 14px 20px;
      font-family: var(--font-heading);
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      max-width: 340px;
      transition: background 0.15s, transform 0.15s;
    }
    .btn-primary-action:hover {
      background: #1E293B;
      transform: translateY(-1px);
    }

    /* Modal Sheet */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      z-index: 2000;
      display: none;
      align-items: flex-end;
      justify-content: center;
    }
    .modal-overlay.active {
      display: flex;
    }
    .modal-sheet {
      background: #FFFFFF;
      border-radius: 28px 28px 0 0;
      width: 100%;
      max-width: 440px;
      padding: 24px 20px 32px;
      max-height: 85vh;
      overflow-y: auto;
      box-shadow: 0 -10px 30px rgba(0,0,0,0.15);
      animation: slideUp 0.25s ease-out;
    }
    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
    }
    .modal-title {
      font-family: var(--font-heading);
      font-size: 18px;
      font-weight: 800;
      color: #0F172A;
    }
    .btn-close-modal {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #F1F5F9;
      border: none;
      color: #64748B;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Form Elements */
    .form-group {
      margin-bottom: 14px;
    }
    .form-label {
      font-size: 12px;
      font-weight: 700;
      color: #475569;
      margin-bottom: 6px;
      display: block;
    }
    .form-input {
      width: 100%;
      background: #F8FAFC;
      border: 1.5px solid #CBD5E1;
      border-radius: 12px;
      padding: 10px 14px;
      font-family: var(--font-heading);
      font-size: 14px;
      font-weight: 600;
      color: #0F172A;
      outline: none;
    }
    .denom-chips-wrap {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 8px;
    }
    .denom-chip {
      background: #F1F5F9;
      border: 1px solid #CBD5E1;
      border-radius: var(--radius-pill);
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 700;
      color: #334155;
      cursor: pointer;
      transition: all 0.15s;
    }
    .denom-chip.active {
      background: #0F172A;
      border-color: #0F172A;
      color: #FFFFFF;
    }

    /* Toast Notification */
    .toast-box {
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%) translateY(50px);
      background: rgba(15, 23, 42, 0.95);
      color: #FFFFFF;
      padding: 10px 20px;
      border-radius: var(--radius-pill);
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.25);
      z-index: 9999;
      opacity: 0;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }
    .toast-box.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }

    /* History & Passbook Items */
    .history-item-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid var(--border-light);
    }
    .history-item-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .history-icon-circle {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: #F1F5F9;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: #1E3A8A;
    }
    .history-icon-circle img {
      width: 22px;
      height: 22px;
      object-fit: contain;
    }
  </style>
</head>
<body>

  <!-- TOP TESTER & STATUS BAR -->
  <div class="top-tester-bar">
    <div class="tester-left">
      <span class="tester-badge">LIVE TESTER</span>
      <span style="font-weight: 600;">EasyPay Enterprise Platform</span>
    </div>
    <div class="tester-controls">
      <button class="btn-test" onclick="launchCurieOnboarding()" title="Test Splash -> Login -> Loader -> OTP full cycle">
        <i class="fa-solid fa-play"></i> Replay Auth
      </button>
      <a href="/admin" target="_blank" class="btn-test admin-btn">
        <i class="fa-solid fa-shield-halved"></i> Admin Panel
      </a>
    </div>
  </div>

  <!-- RESPONSIVE MOBILE VIEWPORT -->
  <div class="app-viewport-wrapper">

    <!-- HOME STICKY HEADER -->
    <header class="app-header" id="homeMainHeader">
      <div class="header-brand">
        <div class="header-logo-icon">
          <i class="fa-solid fa-bolt"></i>
        </div>
        <div>
          <div class="header-brand-title" id="headerTitleBrand">EasyPay</div>
          <div style="font-size: 10px; color: #059669; font-weight: 700;">RBI & DICGC Regulated</div>
        </div>
      </div>
      <div class="header-actions">
        <span class="trial-fd-badge" onclick="switchNavTab('bonds')">
          <i class="fa-solid fa-star"></i> 12% BONDS
        </span>
        <a href="tel:1800208982" class="header-icon-btn" title="24x7 Support">
          <i class="fa-solid fa-phone"></i>
        </a>
        <div class="header-user-avatar" onclick="switchNavTab('profile')" title="View Profile">TS</div>
      </div>
    </header>

    <!-- SUBPAGE HEADER (For Recharges, Bills, Vouchers) -->
    <div class="subpage-header" id="subpageHeader">
      <button class="subpage-back-btn" onclick="goBackToHome()">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <div class="subpage-title" id="subpageHeaderTitle">Service</div>
    </div>

    <!-- MAIN SCROLLABLE CONTENT AREA -->
    <main class="app-main-content">

      <!-- ==============================================================
           VIEW 1: HOME TAB
           ============================================================== -->
      <div id="viewHome">
        
        <!-- Wallet Card -->
        <div class="home-wallet-card">
          <div class="wallet-card-bg-circle"></div>
          <div class="wallet-header">
            <span>TOTAL AVAILABLE BALANCE</span>
            <span style="display: inline-flex; align-items: center; gap: 4px;">
              <i class="fa-solid fa-shield-check" style="color: #10B981;"></i> Safe & Insured
            </span>
          </div>
          <div class="wallet-balance-row">
            <span class="wallet-balance-amount" id="userWalletBalanceDisplay">₹12,450.00</span>
            <div class="wallet-cashback-badge">
              <i class="fa-solid fa-coins"></i> +₹1,985 Bachat
            </div>
          </div>
          <div class="wallet-actions-grid">
            <button class="btn-wallet-action" onclick="openAddMoneyModal()">
              <i class="fa-solid fa-plus"></i> Add Money
            </button>
            <button class="btn-wallet-action" onclick="openQrScannerModal()">
              <i class="fa-solid fa-qrcode"></i> Scan & Pay
            </button>
            <button class="btn-wallet-action" onclick="switchNavTab('bonds')">
              <i class="fa-solid fa-chart-line"></i> Invest 12%
            </button>
          </div>
        </div>

        <!-- Dedicated Bonds Highlight Banner -->
        <div class="section-card" style="background: linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%); border-color: #DDD6FE; cursor: pointer;" onclick="switchNavTab('bonds')">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <span class="rate-badge-pill" style="background: #7C3AED;">HIGH YIELD</span>
              <div style="font-family: var(--font-heading); font-size: 16px; font-weight: 800; color: #4C1D95; margin-top: 4px;">Earn Up to 12.00% p.a.</div>
              <div style="font-size: 12px; color: #6D28D9; margin-top: 2px;">Senior Secured Bonds & Suryoday SF Bank FD</div>
            </div>
            <div style="width: 48px; height: 48px; border-radius: 14px; background: #7C3AED; color: white; display: flex; align-items: center; justify-content: center; font-size: 22px;">
              <i class="fa-solid fa-arrow-trend-up"></i>
            </div>
          </div>
        </div>

        <!-- Bharat Connect (BBPS) Utilities Grid -->
        <div class="section-card">
          <div class="section-header">
            <div>
              <div class="section-title">Recharge & Bill Payments</div>
              <div class="section-subtitle">Guaranteed instant cashback via NPCI Bharat Connect</div>
            </div>
            <span class="section-badge">Up to 5% Bachat</span>
          </div>

          <div class="services-quick-grid">
            <div class="service-tile" onclick="openDedicatedSubPage('mobile')">
              <div class="service-icon-box" style="background: #EFF6FF; color: #2563EB;">
                <i class="fa-solid fa-mobile-screen"></i>
              </div>
              <span class="service-label">Mobile<br>Prepaid</span>
            </div>

            <div class="service-tile" onclick="openDedicatedSubPage('dth')">
              <div class="service-icon-box" style="background: #F5F3FF; color: #7C3AED;">
                <i class="fa-solid fa-tv"></i>
              </div>
              <span class="service-label">DTH<br>Recharge</span>
            </div>

            <div class="service-tile" onclick="openDedicatedSubPage('fastag')">
              <div class="service-icon-box" style="background: #ECFDF5; color: #059669;">
                <i class="fa-solid fa-car"></i>
              </div>
              <span class="service-label">FASTag<br>Toll</span>
            </div>

            <div class="service-tile" onclick="openDedicatedSubPage('electricity')">
              <div class="service-icon-box" style="background: #FFFBEB; color: #D97706;">
                <i class="fa-solid fa-bolt"></i>
              </div>
              <span class="service-label">Electricity<br>Bill</span>
            </div>
          </div>
        </div>

        <!-- Trending Gift Cards Preview -->
        <div class="section-card">
          <div class="section-header">
            <div>
              <div class="section-title">Brand Gift Vouchers</div>
              <div class="section-subtitle">Instant Pine Labs Codes with up to 7% Bachat</div>
            </div>
            <span style="font-size: 12px; font-weight: 700; color: #2563EB; cursor: pointer;" onclick="switchNavTab('giftcards')">View All →</span>
          </div>
          <div id="homeTrendingBrandsList" style="display: flex; flex-direction: column; gap: 10px;"></div>
        </div>

      </div>

      <!-- ==============================================================
           VIEW 2: GIFT CARDS CATALOG TAB
           ============================================================== -->
      <div id="viewGiftCards" style="display: none;">
        <div class="section-card">
          <div class="section-header">
            <div>
              <div class="section-title">Brand Gift Vouchers Hub</div>
              <div class="section-subtitle">Instant Pine Labs Issuance with direct cashback</div>
            </div>
            <span class="section-badge">Up to 7% Bachat</span>
          </div>

          <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 12px;">
            <button class="denom-chip active" onclick="filterBrandCategory('All', this)">All</button>
            <button class="denom-chip" onclick="filterBrandCategory('E-Commerce', this)">E-Commerce</button>
            <button class="denom-chip" onclick="filterBrandCategory('Food & Dining', this)">Food & Dining</button>
            <button class="denom-chip" onclick="filterBrandCategory('Fashion', this)">Fashion</button>
            <button class="denom-chip" onclick="filterBrandCategory('Travel', this)">Travel</button>
          </div>

          <div id="catalogBrandVouchersList" style="display: flex; flex-direction: column; gap: 10px;"></div>
        </div>
      </div>

      <!-- ==============================================================
           VIEW 3: BONDS TAB (STABLE MONEY REPLICA - ALL 4 SCREENSHOTS)
           ============================================================== -->
      <div id="viewBonds" style="display: none;">

        <!-- 1. Top Rate Increased Slider (Screenshot 3) -->
        <div class="bonds-rate-slider-card">
          <span class="rate-badge-pill">RATE INCREASED</span>
          <div class="slider-bank-title">FD rate just increased<br>for Suryoday SF Bank</div>
          <div class="slider-sub-text">Lock-in your FD</div>

          <button class="btn-invest-slider" onclick="triggerRadarConnecting('Suryoday SF Bank', '8.60%', 'suryoday_fd')">
            Invest now <i class="fa-solid fa-arrow-right"></i>
          </button>

          <!-- 3D Column Comparison Graphic -->
          <div class="rate-comparison-graphic">
            <div class="rate-bar-col">
              <span class="rate-bar-label">OLD RATE</span>
              <span class="rate-bar-value" style="color: #64748B;">8.50%</span>
              <div class="rate-bar-pillar old"></div>
            </div>
            <div class="rate-bar-col">
              <span class="green-growth-curve"><i class="fa-solid fa-arrow-trend-up"></i></span>
              <span class="rate-bar-label">NEW RATE</span>
              <span class="rate-bar-value new">8.60%</span>
              <div class="rate-bar-pillar new">
                <div class="rupee-coin-3d">₹</div>
              </div>
            </div>
          </div>

          <!-- 8-Dot Carousel Indicators -->
          <div class="slider-dots-row">
            <span class="slider-dot active"></span>
            <span class="slider-dot"></span>
            <span class="slider-dot"></span>
            <span class="slider-dot"></span>
            <span class="slider-dot"></span>
            <span class="slider-dot"></span>
            <span class="slider-dot"></span>
            <span class="slider-dot"></span>
          </div>
        </div>

        <!-- 2. "Invest with EasyPay" Top 3 Cards (Screenshot 1) -->
        <div style="padding: 4px 18px 0;">
          <div style="font-family: var(--font-heading); font-size: 17px; font-weight: 800; color: #0F172A;">Invest with EasyPay</div>
        </div>

        <div class="bonds-category-row">
          <!-- Card 1: Bonds 12.00% -->
          <div class="bonds-cat-card" onclick="triggerRadarConnecting('Senior Secured Corporate Bonds', '12.00%', 'senior_secured_bonds')">
            <div class="cat-card-header">
              <div class="cat-title-row">
                <span class="cat-name">Bonds</span>
                <span class="cat-badge-pill purple">Senior secured</span>
              </div>
              <span class="cat-reg-text">SEBI-registered</span>
              <div class="cat-rate-text">12.00%</div>
            </div>
            <div class="cat-illustration-box">
              <i class="fa-solid fa-scroll"></i>
            </div>
          </div>

          <!-- Card 2: RD -->
          <div class="bonds-cat-card" onclick="triggerRadarConnecting('RBI Regulated Recurring Deposit', '9.10%', 'rbi_rd')">
            <div class="cat-card-header">
              <div class="cat-title-row">
                <span class="cat-name">RD</span>
              </div>
              <span class="cat-reg-text">RBI-regulated</span>
              <div class="cat-rate-text" style="color: #2563EB;">9.10%</div>
            </div>
            <div class="cat-illustration-box" style="background: #EFF6FF; color: #2563EB;">
              <i class="fa-solid fa-calendar-days"></i>
            </div>
          </div>

          <!-- Card 3: FD Card -->
          <div class="bonds-cat-card" onclick="triggerRadarConnecting('EasyPay FD Credit Card', '8.75%', 'fd_card')">
            <div class="cat-card-header">
              <div class="cat-title-row">
                <span class="cat-name">FD card</span>
              </div>
              <span class="cat-reg-text">0.5% cashback</span>
              <div class="cat-rate-text" style="color: #9333EA;">8.75%</div>
            </div>
            <div class="cat-illustration-box" style="background: #FAF5FF; color: #9333EA;">
              <i class="fa-solid fa-credit-card"></i>
            </div>
          </div>
        </div>

        <!-- 3. KBC Promo Banner (Screenshot 1) -->
        <div class="kbc-promo-banner" onclick="openKbcModal()">
          <div class="kbc-banner-left">
            <div class="kbc-pre-text">EasyPay presents</div>
            <div class="kbc-main-title">Be on KBC Hotseat</div>
            <div class="kbc-sub-text">with Amitabh Bachchan <i class="fa-solid fa-arrow-up-right-from-square"></i></div>
          </div>
          <div class="kbc-logo-emblem">
            <i class="fa-solid fa-award"></i>
          </div>
        </div>

        <!-- 4. "Why invest with EasyPay" Cards (Screenshot 1) -->
        <div style="padding: 10px 18px 0;">
          <div style="font-family: var(--font-heading); font-size: 16px; font-weight: 800; color: #0F172A;">Why invest with EasyPay</div>
        </div>

        <div class="why-invest-row">
          <div class="why-card">
            <div>
              <div class="why-card-title">All in one place</div>
              <div class="why-card-desc">FDs, Recurring Deposits, Senior Bonds, and track portfolio.</div>
            </div>
            <div class="why-card-icon-box">
              <i class="fa-solid fa-circle-check"></i>
            </div>
          </div>

          <div class="why-card">
            <div>
              <div class="why-card-title">No hidden fees. Complete transparency</div>
              <div class="why-card-desc">No annual charges or hidden platform fees, just transparent investing.</div>
            </div>
            <div class="why-card-icon-box" style="background: #ECFDF5; color: #059669;">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
          </div>
        </div>

        <!-- 5. "Total Investment Worth" & 3D Rotating Dotted Globe (Screenshot 2) -->
        <div class="investment-worth-section">
          <div class="worth-section-header">TOTAL INVESTMENT WORTH</div>
          <div class="worth-counter-display" id="rollingWorthCounter">₹1,41,85,11,75,000</div>
          
          <div class="worth-metrics-row">
            <span>Across 3,500+ cities</span>
            <div class="worth-metric-divider"></div>
            <span>From 78+ lakh Indians</span>
          </div>

          <!-- HTML5 Canvas 3D Rotating Dotted India Globe -->
          <div class="globe-canvas-wrapper">
            <canvas id="dottedGlobeCanvas" width="320" height="260"></canvas>
            <div class="live-booking-pill" id="liveBookingPill">
              <span class="pulse-dot-green"></span>
              <span id="liveBookingCityText">Bond booked in Delhi</span>
            </div>
          </div>
        </div>

        <!-- 6. "What's on your mind?" Grid (Screenshot 3) -->
        <div style="padding: 16px 18px 0;">
          <div style="font-family: var(--font-heading); font-size: 16px; font-weight: 800; color: #0F172A;">What's on your mind?</div>
        </div>

        <div class="whats-on-mind-grid">
          <div class="mind-card" onclick="triggerRadarConnecting('RD Monthly', '9.10%', 'rbi_rd')">
            <div>
              <div class="mind-card-title">RD (Monthly)</div>
              <div class="mind-card-sub">Start with ₹1000</div>
            </div>
            <div class="mind-card-icon"><i class="fa-solid fa-calendar-days"></i></div>
          </div>

          <div class="mind-card" onclick="triggerRadarConnecting('High Return Bonds', '12.00%', 'senior_secured_bonds')">
            <div>
              <div class="mind-card-title">High returns</div>
              <div class="mind-card-sub">Up to 12.00%</div>
            </div>
            <div class="mind-card-icon" style="color: #059669; background: #ECFDF5;"><i class="fa-solid fa-percent"></i></div>
          </div>

          <div class="mind-card" onclick="triggerRadarConnecting('FD card', '8.75%', 'fd_card')">
            <div>
              <div class="mind-card-title">FD card</div>
              <div class="mind-card-sub">0.5% cashback</div>
            </div>
            <div class="mind-card-icon"><i class="fa-solid fa-credit-card"></i></div>
          </div>

          <div class="mind-card" onclick="triggerRadarConnecting('No penalty withdrawal FD', '8.40%', 'suryoday_fd')">
            <div>
              <div class="mind-card-title">No penalty withdrawal</div>
              <div class="mind-card-sub">Instant liquidity</div>
            </div>
            <div class="mind-card-icon"><i class="fa-solid fa-circle-check"></i></div>
          </div>

          <div class="mind-card" onclick="triggerRadarConnecting('Monthly payouts FD', '8.60%', 'suryoday_fd')">
            <div>
              <div class="mind-card-title">Monthly payouts</div>
              <div class="mind-card-sub">Direct bank credit</div>
            </div>
            <div class="mind-card-icon"><i class="fa-solid fa-coins"></i></div>
          </div>

          <div class="mind-card" onclick="triggerRadarConnecting('Instant Withdraw FD', '8.50%', 'suryoday_fd')">
            <div>
              <div class="mind-card-title">Withdraw instantly</div>
              <div class="mind-card-sub">24x7 T+0 IMPS</div>
            </div>
            <div class="mind-card-icon"><i class="fa-solid fa-money-bill-transfer"></i></div>
          </div>
        </div>

      </div>

      <!-- ==============================================================
           VIEW 4: PASSBOOK (HISTORY & PORTFOLIO) TAB
           ============================================================== -->
      <div id="viewPassbook" style="display: none;">
        
        <!-- Segmented Tab Switcher -->
        <div style="padding: 12px 16px 0; display: flex; gap: 8px;">
          <button class="denom-chip active" id="btnPassbookPortfolio" onclick="switchPassbookSegment('portfolio')">
            <i class="fa-solid fa-chart-pie"></i> Bonds Portfolio
          </button>
          <button class="denom-chip" id="btnPassbookTxns" onclick="switchPassbookSegment('txns')">
            <i class="fa-solid fa-list-check"></i> All Transactions
          </button>
        </div>

        <!-- Portfolio Segment -->
        <div id="passbookPortfolioSegment">
          <!-- Portfolio Summary Card -->
          <div class="section-card" style="background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%); color: #FFFFFF; border: none;">
            <div style="font-size: 11px; color: #94A3B8; font-weight: 700; text-transform: uppercase;">Active Bonds & FD Portfolio</div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin: 8px 0 14px;">
              <span style="font-family: var(--font-heading); font-size: 26px; font-weight: 800;" id="portfolioTotalPrincipal">₹50,000.00</span>
              <span style="font-size: 12px; color: #34D399; font-weight: 700;">+₹26,850 Returns</span>
            </div>
            <div style="display: flex; gap: 14px; font-size: 12px; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 10px;">
              <div>
                <span style="color: #94A3B8;">Maturity Value:</span>
                <strong style="color: #FFFFFF; margin-left: 4px;" id="portfolioMaturityValue">₹76,850.00</strong>
              </div>
              <div>
                <span style="color: #94A3B8;">Insurance:</span>
                <strong style="color: #34D399; margin-left: 4px;">DICGC Protected</strong>
              </div>
            </div>
          </div>

          <div class="section-card">
            <div class="section-header">
              <div class="section-title">My Booked Bonds & FDs</div>
              <span class="section-badge" id="activeBondsCountBadge">1 Active</span>
            </div>
            <div id="bookedBondsListContainer" style="display: flex; flex-direction: column; gap: 12px;"></div>
          </div>
        </div>

        <!-- Transactions Ledger Segment -->
        <div id="passbookTxnsSegment" style="display: none;">
          <div class="section-card">
            <div class="section-header">
              <div class="section-title">Transactions Ledger</div>
              <span class="section-badge">Verified</span>
            </div>
            <div id="transactionsListContainer"></div>
          </div>
        </div>

      </div>

      <!-- ==============================================================
           VIEW 5: PROFILE TAB
           ============================================================== -->
      <div id="viewProfile" style="display: none;">
        
        <!-- User Card -->
        <div class="section-card" style="text-align: center; padding: 24px 16px;">
          <div style="width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%); color: white; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; margin: 0 auto 12px; border: 3px solid #E2E8F0;">
            TS
          </div>
          <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800; color: #0F172A;" id="profileUserName">Rahul Sharma</div>
          <div style="font-size: 13px; color: #64748B; margin-top: 2px;" id="profileUserMobile">+91 98765 43210</div>
          
          <div style="display: flex; justify-content: center; gap: 8px; margin-top: 12px;">
            <span class="section-badge" style="background: #ECFDF5; color: #059669;">
              <i class="fa-solid fa-circle-check"></i> KYC Verified
            </span>
            <span class="section-badge" style="background: #EFF6FF; color: #2563EB;">
              CIBIL 782 (Excellent)
            </span>
          </div>
        </div>

        <!-- Linked Bank Accounts -->
        <div class="section-card">
          <div class="section-title" style="margin-bottom: 12px;">Linked Bank Accounts</div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 36px; height: 36px; border-radius: 8px; background: #EA580C; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px;">SFB</div>
                <div>
                  <div style="font-size: 13px; font-weight: 700;">Suryoday Small Finance Bank</div>
                  <div style="font-size: 11px; color: #64748B;">A/C •••• 9182 (Primary for Payouts)</div>
                </div>
              </div>
              <span style="font-size: 11px; color: #059669; font-weight: 700;">ACTIVE</span>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 36px; height: 36px; border-radius: 8px; background: #2563EB; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px;">SBI</div>
                <div>
                  <div style="font-size: 13px; font-weight: 700;">State Bank of India</div>
                  <div style="font-size: 11px; color: #64748B;">A/C •••• 4510</div>
                </div>
              </div>
              <span style="font-size: 11px; color: #64748B;">VERIFIED</span>
            </div>
          </div>
        </div>

        <!-- Actions & Replay Onboarding -->
        <div class="section-card">
          <div class="section-title" style="margin-bottom: 12px;">App & Security Settings</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button class="btn-primary-action" style="max-width: 100%; background: #2563EB;" onclick="launchCurieOnboarding()">
              <i class="fa-solid fa-repeat"></i> Replay Curie Onboarding Flow
            </button>
            <button class="btn-wallet-action" style="background: #F1F5F9; color: #0F172A; border-color: #CBD5E1; padding: 12px;" onclick="showToast('Biometric lock active')">
              <i class="fa-solid fa-fingerprint"></i> Biometric UPI Login (Active)
            </button>
            <a href="https://wa.me/919876543210" target="_blank" class="btn-wallet-action" style="background: #ECFDF5; color: #065F46; border-color: #A7F3D0; padding: 12px; text-decoration: none;">
              <i class="fa-brands fa-whatsapp"></i> 24x7 WhatsApp Priority Support
            </a>
          </div>
        </div>

      </div>

      <!-- ==============================================================
           SUBPAGES: MOBILE, DTH, FASTAG, ELECTRICITY
           ============================================================== -->
      <div id="viewSubMobile" style="display: none;">
        <div class="section-card">
          <div class="form-group">
            <label class="form-label">Select Telecom Operator</label>
            <select class="form-input" id="mobileOperatorSelect">
              <option value="Reliance Jio">Reliance Jio Prepaid</option>
              <option value="Bharti Airtel">Bharti Airtel Prepaid</option>
              <option value="Vodafone Idea (Vi)">Vodafone Idea (Vi)</option>
              <option value="BSNL">BSNL Prepaid</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Mobile Number</label>
            <input type="tel" class="form-input" id="mobileInputNumber" placeholder="Enter 10-digit mobile number" value="9876543210">
          </div>
          <button class="btn-primary-action" style="width: 100%; margin-top: 12px;" onclick="executeDedicatedRecharge('Mobile')">
            <i class="fa-solid fa-bolt"></i> Recharge ₹299
          </button>
        </div>
      </div>

      <div id="viewSubDth" style="display: none;">
        <div class="section-card">
          <div class="form-group">
            <label class="form-label">DTH Provider</label>
            <select class="form-input" id="dthProviderSelect">
              <option value="Tata Play">Tata Play (Tata Sky)</option>
              <option value="Airtel DTH">Airtel Digital TV</option>
              <option value="Dish TV">Dish TV</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Subscriber ID</label>
            <input type="text" class="form-input" id="dthSubscriberId" value="1098273645">
          </div>
          <button class="btn-primary-action" style="width: 100%; margin-top: 12px;" onclick="executeDedicatedRecharge('DTH')">
            Recharge DTH ₹450
          </button>
        </div>
      </div>

      <div id="viewSubFastag" style="display: none;">
        <div class="section-card">
          <div class="form-group">
            <label class="form-label">FASTag Issuer Bank</label>
            <select class="form-input" id="fastagBankSelect">
              <option value="ICICI Bank FASTag">ICICI Bank FASTag</option>
              <option value="Paytm Payments Bank">Paytm Payments Bank FASTag</option>
              <option value="Axis Bank FASTag">Axis Bank FASTag</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Vehicle Registration Number</label>
            <input type="text" class="form-input" id="fastagVehicleNumber" value="DL01AB1234">
          </div>
          <button class="btn-primary-action" style="width: 100%; margin-top: 12px;" onclick="executeDedicatedRecharge('FASTag')">
            Recharge FASTag ₹500
          </button>
        </div>
      </div>

      <div id="viewSubElectricity" style="display: none;">
        <div class="section-card">
          <div class="form-group">
            <label class="form-label">Electricity Board / Discom</label>
            <select class="form-input" id="elecBoardSelect">
              <option value="Tata Power Delhi">Tata Power Delhi Distribution Ltd</option>
              <option value="BSES Rajdhani">BSES Rajdhani Power Ltd</option>
              <option value="Adani Electricity Mumbai">Adani Electricity Mumbai</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Consumer Account Number</label>
            <input type="tel" class="form-input" id="elecCaNumber" value="100928374">
          </div>
          <button class="btn-primary-action" style="width: 100%; margin-top: 12px;" onclick="executeDedicatedRecharge('Electricity')">
            Pay Bill ₹1,420
          </button>
        </div>
      </div>

    </main>

    <!-- ==============================================================
         EXACT 5 BOTTOM NAVIGATION BUTTONS
         1. Home
         2. Gift Card
         3. Bonds (with 12% badge)
         4. Passbook (History & Portfolio)
         5. Profile
         ============================================================== -->
    <nav class="app-bottom-nav">
      <div class="nav-tab-item active" id="tabHome" onclick="switchNavTab('home')">
        <i class="fa-solid fa-house"></i>
        <span>Home</span>
      </div>
      
      <div class="nav-tab-item" id="tabGiftCards" onclick="switchNavTab('giftcards')">
        <i class="fa-solid fa-gift"></i>
        <span>Gift Card</span>
      </div>
      
      <div class="nav-tab-item" id="tabBonds" onclick="switchNavTab('bonds')">
        <div class="bonds-nav-badge">12%</div>
        <span>Bonds</span>
      </div>
      
      <div class="nav-tab-item" id="tabPassbook" onclick="switchNavTab('passbook')">
        <i class="fa-solid fa-clock-rotate-left"></i>
        <span>Passbook</span>
      </div>
      
      <div class="nav-tab-item" id="tabProfile" onclick="switchNavTab('profile')">
        <i class="fa-solid fa-user"></i>
        <span>Profile</span>
      </div>
    </nav>

  </div>

  <!-- ==============================================================
       CONNECTING RADAR OVERLAY (SCREENSHOT 4)
       ============================================================== -->
  <div class="radar-modal-overlay" id="curieRadarModal">
    <div class="radar-top-row">
      <button class="subpage-back-btn" onclick="closeRadarModal()">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
    </div>

    <div class="radar-stage-center">
      <div class="radar-circle radar-circle-1"></div>
      <div class="radar-circle radar-circle-2"></div>
      <div class="radar-circle radar-circle-3"></div>
      <div class="radar-circle radar-circle-4"></div>

      <div class="radar-badges-wrap" id="radarBadgesContainer">
        <!-- User Badge -->
        <div class="radar-badge-item left badge-user-ts" id="radarLeftBadge">TS</div>
        <!-- Target Institution Badge -->
        <div class="radar-badge-item right badge-bank-logo" id="radarRightBadge">
          <i class="fa-solid fa-building-columns"></i>
        </div>
      </div>
    </div>

    <div>
      <div class="radar-status-text">
        Connecting you to<br>
        <span class="radar-bank-name" id="radarTargetBankName">Suryoday SF Bank</span>
      </div>
    </div>

    <div class="dicgc-guarantee-box">
      <i class="fa-solid fa-shield-check dicgc-shield-icon"></i>
      <div class="dicgc-main-title">Up to ₹5 lakh is insured by DICGC</div>
      <div class="dicgc-sub-title">A wholly owned subsidiary of RBI</div>
    </div>
  </div>

  <!-- ==============================================================
       BOND INVESTMENT BOOKING MODAL
       ============================================================== -->
  <div class="modal-overlay" id="bondBookingModal">
    <div class="modal-sheet">
      <div class="modal-header">
        <div>
          <div class="modal-title" id="bookBondTitle">Suryoday SF Bank FD</div>
          <div style="font-size: 11px; color: #059669; font-weight: 700;" id="bookBondRateTag">8.60% Guaranteed Return p.a.</div>
        </div>
        <button class="btn-close-modal" onclick="closeModal('bondBookingModal')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="form-group">
        <label class="form-label">Investment Amount (₹)</label>
        <input type="number" class="form-input" id="bondAmountInput" value="50000" oninput="calculateBondMaturity()">
        <div class="denom-chips-wrap">
          <button class="denom-chip" onclick="setBondAmount(10000, this)">₹10,000</button>
          <button class="denom-chip" onclick="setBondAmount(25000, this)">₹25,000</button>
          <button class="denom-chip active" onclick="setBondAmount(50000, this)">₹50,000</button>
          <button class="denom-chip" onclick="setBondAmount(100000, this)">₹1,00,000</button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Select Lock-in Tenure</label>
        <select class="form-input" id="bondTenureSelect" onchange="calculateBondMaturity()">
          <option value="12">1 Year @ 9.10% p.a.</option>
          <option value="36">3 Years @ 10.50% p.a.</option>
          <option value="60" selected>5 Years @ 8.60% p.a. (Highest Peak)</option>
        </select>
      </div>

      <!-- Live Compound Interest Summary -->
      <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 14px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
          <span style="color: #64748B;">Principal Invested:</span>
          <strong id="calcPrincipalDisplay">₹50,000.00</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
          <span style="color: #64748B;">Estimated Interest:</span>
          <strong style="color: #059669;" id="calcInterestDisplay">+₹26,850.00</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 15px; border-top: 1px dashed #CBD5E1; padding-top: 8px;">
          <span style="font-weight: 700;">Guaranteed Maturity Value:</span>
          <strong style="color: #0F172A; font-size: 17px;" id="calcMaturityDisplay">₹76,850.00</strong>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 8px; font-size: 11px; color: #059669; font-weight: 700; margin-bottom: 16px;">
        <i class="fa-solid fa-shield-check"></i> Insured by DICGC (RBI Subsidiary) up to ₹5,00,000
      </div>

      <button class="btn-primary-action" style="max-width: 100%;" onclick="executeBondBooking()">
        <i class="fa-solid fa-lock"></i> Confirm & Book Now
      </button>
    </div>
  </div>

  <!-- ==============================================================
       BOND SUCCESS CERTIFICATE MODAL
       ============================================================== -->
  <div class="modal-overlay" id="bondSuccessModal">
    <div class="modal-sheet" style="text-align: center;">
      <div style="width: 60px; height: 60px; border-radius: 50%; background: #ECFDF5; color: #059669; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 12px; border: 2px solid #10B981;">
        <i class="fa-solid fa-check"></i>
      </div>
      <div class="modal-title" style="font-size: 20px;">Investment Booked Successfully!</div>
      <div style="font-size: 12px; color: #64748B; margin-top: 4px;">Bond Registered with DICGC & Bank Registry</div>

      <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 16px; margin: 16px 0; text-align: left;">
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
          <span style="color: #64748B;">Certificate Number:</span>
          <strong style="color: #0F172A;" id="successCertNum">DICGC-EP-982172</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
          <span style="color: #64748B;">Institution:</span>
          <strong id="successInstName">Suryoday SF Bank</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
          <span style="color: #64748B;">Principal Invested:</span>
          <strong id="successPrincipal">₹50,000.00</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; border-top: 1px dashed #CBD5E1; padding-top: 8px; margin-top: 4px;">
          <span style="font-weight: 700;">Maturity Amount:</span>
          <strong style="color: #059669; font-size: 16px;" id="successMaturity">₹76,850.00</strong>
        </div>
      </div>

      <button class="btn-primary-action" style="max-width: 100%;" onclick="closeModal('bondSuccessModal'); switchNavTab('passbook');">
        <i class="fa-solid fa-file-shield"></i> View in Passbook & Portfolio
      </button>
    </div>
  </div>

  <!-- ==============================================================
       FULLSCREEN CURIE ONBOARDING MODALS (SPLASH, LOGIN, LOADER, OTP)
       ============================================================== -->

  <!-- 1. Splash Screen -->
  <div class="curie-fullscreen-overlay" id="curieSplashScreen">
    <div></div>
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div id="curieSplashLottie" class="onboarding-lottie-box"></div>
      <div style="font-family: var(--font-heading); font-size: 28px; font-weight: 800; color: #0F172A; margin-top: 10px;">EasyPay</div>
      <div style="font-size: 14px; color: #64748B; font-weight: 600; margin-top: 4px;">Smart Investments & Instant Bachat</div>
    </div>
    <div style="width: 100%; max-width: 340px;">
      <button class="btn-primary-action" onclick="goToCurieLogin()">
        Get Started <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  </div>

  <!-- 2. Login Screen -->
  <div class="curie-fullscreen-overlay" id="curieLoginScreen">
    <div style="width: 100%; display: flex; justify-content: flex-end;">
      <button class="btn-test" onclick="dismissCurieOnboarding()">Skip Demo</button>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
      <div id="curieLoginLottie" class="onboarding-lottie-box"></div>
      <div class="onboarding-title">Enter Your Mobile Number</div>
      <div class="onboarding-subtitle">We will send an authentic 6-digit OTP to verify your account</div>
      <div class="phone-input-wrap">
        <span class="phone-prefix">+91</span>
        <input type="tel" class="phone-input-field" id="curieMobileInput" value="9876543210" maxlength="10">
      </div>
    </div>
    <div style="width: 100%; max-width: 340px;">
      <button class="btn-primary-action" onclick="requestCurieOtp()">
        Get OTP <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  </div>

  <!-- 3. Please Wait Screen -->
  <div class="curie-fullscreen-overlay" id="curiePleaseWaitScreen">
    <div></div>
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div id="curieLoaderLottie" style="width: 140px; height: 140px;"></div>
      <div class="onboarding-title" style="margin-top: 14px;">Please Wait...</div>
      <div class="onboarding-subtitle" id="curieLoaderStatusText">Verifying credentials with RBI/NPCI Rail...</div>
    </div>
    <div></div>
  </div>

  <!-- 4. OTP Screen -->
  <div class="curie-fullscreen-overlay" id="curieOtpScreen">
    <div style="width: 100%; display: flex; justify-content: flex-start;">
      <button class="subpage-back-btn" onclick="goToCurieLogin()">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
      <div style="width: 60px; height: 60px; border-radius: 50%; background: #EFF6FF; color: #2563EB; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 14px;">
        <i class="fa-solid fa-key"></i>
      </div>
      <div class="onboarding-title">Enter Verification Code</div>
      <div class="onboarding-subtitle">Sent to +91 <span id="otpTargetMobileDisplay">98765 43210</span></div>

      <div class="otp-boxes-wrap">
        <input type="text" class="otp-digit-box" maxlength="1" value="7">
        <input type="text" class="otp-digit-box" maxlength="1" value="7">
        <input type="text" class="otp-digit-box" maxlength="1" value="3">
        <input type="text" class="otp-digit-box" maxlength="1" value="1">
        <input type="text" class="otp-digit-box" maxlength="1" value="9">
        <input type="text" class="otp-digit-box" maxlength="1" value="0">
      </div>

      <div style="font-size: 12px; color: #059669; font-weight: 700; cursor: pointer;" onclick="showToast('OTP resent: 773190')">
        Resend OTP (0:28)
      </div>
    </div>
    <div style="width: 100%; max-width: 340px;">
      <button class="btn-primary-action" onclick="verifyCurieOtp()">
        Verify & Continue <i class="fa-solid fa-circle-check"></i>
      </button>
    </div>
  </div>

  <!-- Buy Gift Card Modal -->
  <div class="modal-overlay" id="buyGiftCardModal">
    <div class="modal-sheet">
      <div class="modal-header">
        <div>
          <div class="modal-title" id="buyModalBrandName">Amazon Pay</div>
          <div style="font-size: 11px; color: #059669; font-weight: 700;" id="buyModalCashbackTag">3.5% Instant Bachat</div>
        </div>
        <button class="btn-close-modal" onclick="closeModal('buyGiftCardModal')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div>
        <label class="form-label">Select Voucher Value</label>
        <div class="denom-chips-wrap" id="buyModalDenomChips"></div>
      </div>

      <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 14px; margin: 16px 0;">
        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
          <span>Voucher Value:</span>
          <strong id="buySummaryFaceValue">₹1,000.00</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: #059669; margin-bottom: 6px;">
          <span>Instant Bachat:</span>
          <strong id="buySummaryCashback">-₹35.00</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 15px; border-top: 1px dashed #CBD5E1; padding-top: 6px;">
          <span style="font-weight: 700;">You Pay:</span>
          <strong style="color: #0F172A;" id="buySummaryTotal">₹965.00</strong>
        </div>
      </div>

      <button class="btn-primary-action" style="max-width: 100%;" onclick="submitGiftCardPurchase()">
        <i class="fa-solid fa-lock"></i> Pay & Generate Voucher
      </button>
    </div>
  </div>

  <!-- Add Money Modal -->
  <div class="modal-overlay" id="addMoneyModal">
    <div class="modal-sheet">
      <div class="modal-header">
        <div class="modal-title">Add Money to Wallet</div>
        <button class="btn-close-modal" onclick="closeModal('addMoneyModal')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="form-group">
        <label class="form-label">Amount (₹)</label>
        <input type="number" class="form-input" id="addMoneyAmountInput" value="1000">
      </div>
      <button class="btn-primary-action" style="max-width: 100%;" onclick="submitAddMoney()">
        Add Money via UPI
      </button>
    </div>
  </div>

  <!-- QR Modal -->
  <div class="modal-overlay" id="qrScannerModal">
    <div class="modal-sheet" style="text-align: center;">
      <div class="modal-title">Scan Any UPI QR</div>
      <div style="margin: 20px auto; width: 180px; height: 180px; background: #0F172A; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 48px;">
        <i class="fa-solid fa-qrcode"></i>
      </div>
      <button class="btn-primary-action" style="max-width: 100%;" onclick="closeModal('qrScannerModal')">
        Close Scanner
      </button>
    </div>
  </div>

  <!-- Toast Notification Box -->
  <div class="toast-box" id="toastBox">
    <i class="fa-solid fa-circle-check" style="color: #34D399;"></i>
    <span id="toastMessage">Success</span>
  </div>

  <script>
    // Application State
    let appData = {
      user: { walletBalance: 12450, cashbackEarned: 1985 },
      giftCards: [],
      investments: [],
      bonds: [],
      transactions: []
    };
    let activeNavTab = 'home';
    let selectedBrand = null;
    let selectedDenom = 500;
    let activeBookingBond = null;

    // Fetch Initial Platform Data
    async function loadData() {
      try {
        const res = await fetch('/api/data');
        if (res.ok) {
          appData = await res.json();
          renderWallet();
          renderGiftCards();
          renderBookedBonds();
          renderTransactions();
        }
      } catch (e) {
        console.error('Failed to load DB data', e);
      }
    }

    function renderWallet() {
      if (appData.user) {
        document.getElementById('userWalletBalanceDisplay').innerText = 
          '₹' + (appData.user.walletBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
      }
    }

    function renderGiftCards() {
      const cards = appData.giftCards || [];
      const homeList = document.getElementById('homeTrendingBrandsList');
      const catalogList = document.getElementById('catalogBrandVouchersList');

      const cardHtml = cards.slice(0, 4).map(c => renderBrandItem(c)).join('');
      if (homeList) homeList.innerHTML = cardHtml;
      if (catalogList) catalogList.innerHTML = cards.map(c => renderBrandItem(c)).join('');
    }

    function renderBrandItem(c) {
      return \`
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; cursor: pointer;" onclick="openBuyGiftCardModal('\${c.id}')">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 42px; height: 42px; border-radius: 10px; background: #FFFFFF; border: 1px solid #CBD5E1; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 4px;">
              <img src="\${c.logo || '/assets/curie/splash/logo.png'}" alt="\${c.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.src='/assets/curie/splash/logo.png'">
            </div>
            <div>
              <div style="font-family: var(--font-heading); font-size: 14px; font-weight: 700; color: #0F172A;">\${c.name}</div>
              <div style="font-size: 11px; color: #059669; font-weight: 700;">\${c.cashbackTag || (c.cashbackRate + '% Bachat')}</div>
            </div>
          </div>
          <button class="btn-invest-slider" style="padding: 6px 12px; font-size: 12px; margin: 0;">Buy →</button>
        </div>
      \`;
    }

    function renderBookedBonds() {
      const list = appData.investments || [];
      const container = document.getElementById('bookedBondsListContainer');
      const countBadge = document.getElementById('activeBondsCountBadge');
      if (countBadge) countBadge.innerText = list.length + ' Active';

      if (!container) return;
      if (list.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #94A3B8; padding: 20px;">No active investments yet. Start investing today!</div>';
        return;
      }

      container.innerHTML = list.map(b => \`
        <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="font-family: var(--font-heading); font-size: 15px; font-weight: 800; color: #0F172A;">\${b.institution}</div>
              <div style="font-size: 11px; color: #64748B;">\${b.category} • Rate: \${b.interestRate}% p.a.</div>
            </div>
            <span class="section-badge" style="background: #ECFDF5; color: #059669;">DICGC Insured</span>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 12px; padding-top: 10px; border-top: 1px dashed #CBD5E1;">
            <div>
              <div style="font-size: 10px; color: #64748B;">INVESTED VALUE</div>
              <div style="font-family: var(--font-heading); font-size: 16px; font-weight: 800;">₹\${(b.principal || 50000).toLocaleString('en-IN')}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 10px; color: #64748B;">MATURITY AMOUNT</div>
              <div style="font-family: var(--font-heading); font-size: 16px; font-weight: 800; color: #059669;">₹\${(b.maturityAmount || 76850).toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div style="font-size: 10px; color: #94A3B8; margin-top: 8px;">Cert: \${b.certNumber || 'DICGC-EP-982172'} • Maturity: \${b.maturityDate || '11 Nov 2031'}</div>
        </div>
      \`).join('');
    }

    function renderTransactions() {
      const container = document.getElementById('transactionsListContainer');
      if (!container) return;
      const txns = appData.transactions || [];
      if (txns.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #94A3B8; padding: 20px;">No transactions recorded.</div>';
        return;
      }
      container.innerHTML = txns.map(t => {
        const isCredit = t.amount > 0;
        const amtStr = (isCredit ? '+' : '') + '₹' + Math.abs(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 });
        return \`
          <div class="history-item-row">
            <div class="history-item-left">
              <div class="history-icon-circle">
                <i class="fa-solid \${t.type === 'INVESTMENT' ? 'fa-chart-line' : (t.type === 'RECHARGE' ? 'fa-bolt' : 'fa-gift')}"></i>
              </div>
              <div>
                <div style="font-size: 13px; font-weight: 700; color: #0F172A;">\${t.title}</div>
                <div style="font-size: 11px; color: #94A3B8;">\${t.timestamp || 'Just now'} • \${t.status}</div>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-family: var(--font-heading); font-size: 14px; font-weight: 700; color: \${isCredit ? '#059669' : '#0F172A'};">\${amtStr}</div>
              \${t.cashback ? \`<div style="font-size: 10px; font-weight: 700; color: #059669;">+₹\${t.cashback.toFixed(1)} Bachat</div>\` : ''}
            </div>
          </div>
        \`;
      }).join('');
    }

    // Navigation Switcher (Exact 5 Items)
    function switchNavTab(tab) {
      activeNavTab = tab;
      document.querySelectorAll('.app-bottom-nav .nav-tab-item').forEach(el => el.classList.remove('active'));
      
      document.getElementById('viewHome').style.display = 'none';
      document.getElementById('viewGiftCards').style.display = 'none';
      document.getElementById('viewBonds').style.display = 'none';
      document.getElementById('viewPassbook').style.display = 'none';
      document.getElementById('viewProfile').style.display = 'none';
      hideAllSubpages();

      document.getElementById('homeMainHeader').style.display = 'flex';
      document.getElementById('subpageHeader').style.display = 'none';

      if (tab === 'home') {
        document.getElementById('tabHome').classList.add('active');
        document.getElementById('viewHome').style.display = 'block';
      } else if (tab === 'giftcards') {
        document.getElementById('tabGiftCards').classList.add('active');
        document.getElementById('viewGiftCards').style.display = 'block';
      } else if (tab === 'bonds') {
        document.getElementById('tabBonds').classList.add('active');
        document.getElementById('viewBonds').style.display = 'block';
        initDottedGlobe();
      } else if (tab === 'passbook') {
        document.getElementById('tabPassbook').classList.add('active');
        document.getElementById('viewPassbook').style.display = 'block';
      } else if (tab === 'profile') {
        document.getElementById('tabProfile').classList.add('active');
        document.getElementById('viewProfile').style.display = 'block';
      }
    }

    function switchPassbookSegment(seg) {
      if (seg === 'portfolio') {
        document.getElementById('btnPassbookPortfolio').classList.add('active');
        document.getElementById('btnPassbookTxns').classList.remove('active');
        document.getElementById('passbookPortfolioSegment').style.display = 'block';
        document.getElementById('passbookTxnsSegment').style.display = 'none';
      } else {
        document.getElementById('btnPassbookPortfolio').classList.remove('active');
        document.getElementById('btnPassbookTxns').classList.add('active');
        document.getElementById('passbookPortfolioSegment').style.display = 'none';
        document.getElementById('passbookTxnsSegment').style.display = 'block';
      }
    }

    function hideAllSubpages() {
      document.getElementById('viewSubMobile').style.display = 'none';
      document.getElementById('viewSubDth').style.display = 'none';
      document.getElementById('viewSubFastag').style.display = 'none';
      document.getElementById('viewSubElectricity').style.display = 'none';
    }

    function openDedicatedSubPage(type) {
      document.getElementById('viewHome').style.display = 'none';
      hideAllSubpages();
      document.getElementById('homeMainHeader').style.display = 'none';
      document.getElementById('subpageHeader').style.display = 'flex';

      const title = document.getElementById('subpageHeaderTitle');
      if (type === 'mobile') {
        title.innerText = 'Mobile Prepaid Recharge';
        document.getElementById('viewSubMobile').style.display = 'block';
      } else if (type === 'dth') {
        title.innerText = 'DTH Recharge';
        document.getElementById('viewSubDth').style.display = 'block';
      } else if (type === 'fastag') {
        title.innerText = 'FASTag Toll Recharge';
        document.getElementById('viewSubFastag').style.display = 'block';
      } else if (type === 'electricity') {
        title.innerText = 'Electricity Bill Payment';
        document.getElementById('viewSubElectricity').style.display = 'block';
      }
    }

    function goBackToHome() {
      switchNavTab('home');
    }

    // ==============================================================
    // RADAR CONNECTING & BOND INVESTMENT FLOW
    // ==============================================================
    function triggerRadarConnecting(bankName, rateText, bondId) {
      activeBookingBond = { bankName, rateText, bondId };
      document.getElementById('radarTargetBankName').innerText = bankName;
      
      const modal = document.getElementById('curieRadarModal');
      const badgesWrap = document.getElementById('radarBadgesContainer');
      modal.classList.add('active');
      badgesWrap.classList.remove('merging', 'merged');

      // Stage 1: Animation to merge badges together
      setTimeout(() => {
        badgesWrap.classList.add('merging');
      }, 400);

      // Stage 2: Merged glow pulse
      setTimeout(() => {
        badgesWrap.classList.add('merged');
      }, 1500);

      // Stage 3: Smooth transition into Bond Investment Checkout
      setTimeout(() => {
        modal.classList.remove('active');
        openBondBookingModal();
      }, 2300);
    }

    function closeRadarModal() {
      document.getElementById('curieRadarModal').classList.remove('active');
    }

    function openBondBookingModal() {
      if (!activeBookingBond) return;
      document.getElementById('bookBondTitle').innerText = activeBookingBond.bankName;
      document.getElementById('bookBondRateTag').innerText = activeBookingBond.rateText + ' Guaranteed Return p.a.';
      calculateBondMaturity();
      openModal('bondBookingModal');
    }

    function setBondAmount(amt, btn) {
      document.getElementById('bondAmountInput').value = amt;
      document.querySelectorAll('#bondBookingModal .denom-chips-wrap .denom-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calculateBondMaturity();
    }

    function calculateBondMaturity() {
      const p = parseFloat(document.getElementById('bondAmountInput').value) || 50000;
      const months = parseInt(document.getElementById('bondTenureSelect').value) || 60;
      const rate = 8.60 / 100;
      const years = months / 12;
      // Compound quarterly
      const maturity = Math.round(p * Math.pow(1 + rate/4, 4 * years));
      const interest = maturity - p;

      document.getElementById('calcPrincipalDisplay').innerText = '₹' + p.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      document.getElementById('calcInterestDisplay').innerText = '+₹' + interest.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      document.getElementById('calcMaturityDisplay').innerText = '₹' + maturity.toLocaleString('en-IN', { minimumFractionDigits: 2 });
    }

    async function executeBondBooking() {
      if (!activeBookingBond) return;
      const p = parseFloat(document.getElementById('bondAmountInput').value) || 50000;
      const months = parseInt(document.getElementById('bondTenureSelect').value) || 60;

      showToast('Booking Bond with Suryoday SF Bank...');
      try {
        const res = await fetch('/api/invest/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bondId: activeBookingBond.bondId,
            amount: p,
            tenureMonths: months,
            paymentMethod: 'UPI'
          })
        });

        if (res.ok) {
          const data = await res.json();
          closeModal('bondBookingModal');

          document.getElementById('successCertNum').innerText = data.investment.certNumber;
          document.getElementById('successInstName').innerText = data.investment.institution;
          document.getElementById('successPrincipal').innerText = '₹' + data.investment.principal.toLocaleString('en-IN', { minimumFractionDigits: 2 });
          document.getElementById('successMaturity').innerText = '₹' + data.investment.maturityAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 });

          openModal('bondSuccessModal');
          loadData();
        } else {
          showToast('Failed to book bond');
        }
      } catch (e) {
        showToast('Error connecting to bank rail');
      }
    }

    // ==============================================================
    // 3D DOTTED GLOBE CANVAS ANIMATION (SCREENSHOT 2)
    // ==============================================================
    let globeAnimationId = null;
    let globeAngle = 0;
    const citiesList = [
      { name: 'Delhi', amount: '₹50,000' },
      { name: 'Bihar', amount: '₹1,00,000' },
      { name: 'Bengaluru', amount: '₹25,000' },
      { name: 'Mumbai', amount: '₹2,00,000' },
      { name: 'Kolkata', amount: '₹75,000' },
      { name: 'Jaipur', amount: '₹50,000' },
      { name: 'Pune', amount: '₹50,000' }
    ];
    let cityIndex = 0;

    function initDottedGlobe() {
      const canvas = document.getElementById('dottedGlobeCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (globeAnimationId) cancelAnimationFrame(globeAnimationId);

      function drawGlobe() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cx = canvas.width / 2;
        const cy = canvas.height + 40;
        const r = 210;

        globeAngle += 0.008;

        // Draw curved longitude lines
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.5)';
        ctx.lineWidth = 1;
        for (let i = -6; i <= 6; i++) {
          ctx.beginPath();
          ctx.ellipse(cx, cy, Math.abs(i * 30 + Math.sin(globeAngle)*10), r, 0, Math.PI, 2 * Math.PI);
          ctx.stroke();
        }

        // Draw dotted latitude rings
        ctx.fillStyle = '#94A3B8';
        for (let lat = 0; lat < 180; lat += 12) {
          const latRad = (lat * Math.PI) / 180;
          const y = cy - Math.sin(latRad) * r * 0.8;
          const ringWidth = Math.cos(latRad) * r;

          for (let lon = 0; lon < 360; lon += 18) {
            const lonRad = ((lon + globeAngle * 40) * Math.PI) / 180;
            const x = cx + Math.cos(lonRad) * ringWidth;
            if (y < canvas.height && x > 0 && x < canvas.width) {
              ctx.beginPath();
              ctx.arc(x, y, 1.2, 0, 2 * Math.PI);
              ctx.fill();
            }
          }
        }

        // Highlight India Subcontinent Area
        ctx.fillStyle = '#059669';
        const indX = cx + Math.sin(globeAngle * 0.5) * 40;
        const indY = 90;
        ctx.beginPath();
        ctx.arc(indX, indY, 4, 0, 2 * Math.PI);
        ctx.fill();

        // Pulsing radar ring on active city
        ctx.strokeStyle = 'rgba(5, 150, 105, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const pulseR = 8 + (Math.sin(Date.now() / 200) + 1) * 6;
        ctx.arc(indX, indY, pulseR, 0, 2 * Math.PI);
        ctx.stroke();

        globeAnimationId = requestAnimationFrame(drawGlobe);
      }
      drawGlobe();
    }

    // Rotate city pins every 2.5 seconds
    setInterval(() => {
      cityIndex = (cityIndex + 1) % citiesList.length;
      const c = citiesList[cityIndex];
      const textEl = document.getElementById('liveBookingCityText');
      if (textEl) {
        textEl.innerText = \`Bond booked in \${c.name} (\${c.amount})\`;
      }
    }, 2500);

    // ==============================================================
    // CURIE ONBOARDING FULL CYCLE (SPLASH -> LOGIN -> LOADER -> OTP)
    // ==============================================================
    function launchCurieOnboarding() {
      document.getElementById('curieSplashScreen').classList.add('active');
      document.getElementById('curieLoginScreen').classList.remove('active');
      document.getElementById('curiePleaseWaitScreen').classList.remove('active');
      document.getElementById('curieOtpScreen').classList.remove('active');

      // Load authentic Splash Lottie
      if (window.lottie) {
        window.lottie.destroy('splashAnim');
        window.lottie.loadAnimation({
          name: 'splashAnim',
          container: document.getElementById('curieSplashLottie'),
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: '/assets/curie/animations/splash.json'
        });
      }
    }

    function goToCurieLogin() {
      document.getElementById('curieSplashScreen').classList.remove('active');
      document.getElementById('curieLoginScreen').classList.add('active');

      if (window.lottie) {
        window.lottie.destroy('loginAnim');
        window.lottie.loadAnimation({
          name: 'loginAnim',
          container: document.getElementById('curieLoginLottie'),
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: '/assets/curie/animations/onboarding_anim_1.json'
        });
      }
    }

    function requestCurieOtp() {
      const mob = document.getElementById('curieMobileInput').value || '9876543210';
      document.getElementById('otpTargetMobileDisplay').innerText = mob.replace(/(\\d{5})(\\d{5})/, '$1 $2');
      
      document.getElementById('curieLoginScreen').classList.remove('active');
      document.getElementById('curiePleaseWaitScreen').classList.add('active');

      if (window.lottie) {
        window.lottie.destroy('loaderAnim');
        window.lottie.loadAnimation({
          name: 'loaderAnim',
          container: document.getElementById('curieLoaderLottie'),
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: '/assets/curie/animations/loading_anim.json'
        });
      }

      // Simulate verification delay
      setTimeout(() => {
        document.getElementById('curiePleaseWaitScreen').classList.remove('active');
        document.getElementById('curieOtpScreen').classList.add('active');
      }, 1600);
    }

    function verifyCurieOtp() {
      showToast('OTP Verified! Welcome to EasyPay');
      dismissCurieOnboarding();
    }

    function dismissCurieOnboarding() {
      document.getElementById('curieSplashScreen').classList.remove('active');
      document.getElementById('curieLoginScreen').classList.remove('active');
      document.getElementById('curiePleaseWaitScreen').classList.remove('active');
      document.getElementById('curieOtpScreen').classList.remove('active');
    }

    // Modal Helpers
    function openModal(id) { document.getElementById(id).classList.add('active'); }
    function closeModal(id) { document.getElementById(id).classList.remove('active'); }

    function openBuyGiftCardModal(cardId) {
      const card = (appData.giftCards || []).find(c => c.id === cardId);
      if (!card) return;
      selectedBrand = card;
      selectedDenom = 500;

      document.getElementById('buyModalBrandName').innerText = card.name;
      document.getElementById('buyModalCashbackTag').innerText = \`\${card.cashbackRate || 5}% Instant Bachat\`;

      const wrap = document.getElementById('buyModalDenomChips');
      const denoms = card.denominations || [250, 500, 1000, 2000];
      wrap.innerHTML = denoms.map(d => \`
        <button class="denom-chip \${d === selectedDenom ? 'active' : ''}" onclick="selectBuyDenom(\${d}, this)">₹\${d}</button>
      \`).join('');

      updateBuyModalCalculations();
      openModal('buyGiftCardModal');
    }

    function selectBuyDenom(val, btn) {
      selectedDenom = val;
      document.querySelectorAll('#buyModalDenomChips .denom-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateBuyModalCalculations();
    }

    function updateBuyModalCalculations() {
      if (!selectedBrand) return;
      const rate = selectedBrand.cashbackRate || 5;
      const cashback = (selectedDenom * rate) / 100;
      const total = selectedDenom - cashback;

      document.getElementById('buySummaryFaceValue').innerText = '₹' + selectedDenom.toFixed(2);
      document.getElementById('buySummaryCashback').innerText = '-₹' + cashback.toFixed(2);
      document.getElementById('buySummaryTotal').innerText = '₹' + total.toFixed(2);
    }

    async function submitGiftCardPurchase() {
      if (!selectedBrand) return;
      showToast('Issuing Voucher code via Pine Labs...');

      try {
        const res = await fetch('/api/buy-gift-card', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cardId: selectedBrand.id,
            denomination: selectedDenom,
            paymentMethod: 'Wallet'
          })
        });

        if (res.ok) {
          closeModal('buyGiftCardModal');
          showToast(\`\${selectedBrand.name} Voucher Issued! Code saved in Passbook\`);
          loadData();
          setTimeout(() => switchNavTab('passbook'), 1000);
        } else {
          showToast('Failed to purchase voucher');
        }
      } catch (e) {
        showToast('Purchase error');
      }
    }

    function openAddMoneyModal() { openModal('addMoneyModal'); }
    async function submitAddMoney() {
      const amt = parseFloat(document.getElementById('addMoneyAmountInput').value) || 1000;
      showToast(\`Adding ₹\${amt} via UPI...\`);
      try {
        const res = await fetch('/api/wallet/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: amt, upiApp: 'PhonePe' })
        });
        if (res.ok) {
          closeModal('addMoneyModal');
          showToast(\`₹\${amt} added successfully!\`);
          loadData();
        }
      } catch (e) {
        showToast('Error adding money');
      }
    }

    function openQrScannerModal() { openModal('qrScannerModal'); }
    function openKbcModal() {
      showToast('KBC Hotseat Contest Registration: Registered!');
    }

    async function executeDedicatedRecharge(service) {
      showToast(\`Connecting to NPCI Bharat Connect for \${service}...\`);
      try {
        const res = await fetch('/api/recharge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceType: service,
            operator: 'NPCI',
            number: '9876543210',
            amount: 299,
            paymentMethod: 'Wallet'
          })
        });
        if (res.ok) {
          const d = await res.json();
          showToast(\`\${service} Successful! Ref: \${d.operatorRef}\`);
          loadData();
          setTimeout(() => switchNavTab('passbook'), 1200);
        }
      } catch (e) {
        showToast('Payment failed');
      }
    }

    function showToast(msg) {
      const box = document.getElementById('toastBox');
      document.getElementById('toastMessage').innerText = msg;
      box.classList.add('show');
      setTimeout(() => box.classList.remove('show'), 2800);
    }

    function filterBrandCategory(cat, btn) {
      btn.parentElement.querySelectorAll('.denom-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const catalogList = document.getElementById('catalogBrandVouchersList');
      if (!catalogList || !appData.giftCards) return;

      const filtered = cat === 'All' 
        ? appData.giftCards 
        : appData.giftCards.filter(c => c.category === cat);
      catalogList.innerHTML = filtered.map(c => renderBrandItem(c)).join('');
    }

    // Startup
    loadData();
  </script>
</body>
</html>
\`;

fs.writeFileSync(targetPath, htmlContent, 'utf8');
console.log('public/app.html generated successfully! File size: ' + htmlContent.length + ' bytes');
