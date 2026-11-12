@echo off
title Bachat Pay - Enterprise Platform Server
echo ====================================================
echo   BACHAT PAY ENTERPRISE PLATFORM (100%% Operational)
echo ====================================================
echo.
echo User Mobile / Web Application:  http://localhost:5000/
echo Enterprise Admin Control Panel: http://localhost:5000/admin
echo.
echo Features Active:
echo  [x] Authentic Bachat Pay UI & Design
echo  [x] Woohoo / Pine Labs Instant Gift Card Issuing (PIN + Code)
echo  [x] Bharat Connect BBPS Mobile & Utility Recharges
echo  [x] Simulated UPI Intent & Wallet Instant Payments
echo  [x] Encrypted My Vouchers Vault with Barcode & PIN Reveal
echo.
node server/server.js
pause
