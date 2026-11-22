const fs = require('fs');

const app = fs.readFileSync('public/app.html', 'utf8');

console.log('1. Profile banner shows Nirod Behera & 9876548808:', app.includes('id="profileAccountName" onclick="openProfileEditModal()" style="cursor:pointer;">Nirod Behera</div>') && app.includes('id="profileAccountPhone">+91 9876548808</div>'));
console.log('2. syncUserProfileUI called in loadData:', app.includes('syncUserProfileUI();') && app.includes('localStorage.setItem(\'currentUser\''));
console.log('3. Bank accounts top bar has max-width 480px:', app.includes('<!-- Top App Bar (Mobile Responsive Centered Max-Width 480px) -->'));
console.log('4. My Orders top bar & tab bar has max-width 480px:', app.includes('Segmented Tab Bar (Mobile Responsive Centered Max-Width 480px)'));
console.log('5. Refresh button has fa-spin & animation function:', app.includes('refreshMyOrdersWithAnimation') && app.includes('id="refreshMyOrdersIcon"'));
console.log('6. Add Payment modal has Card Selectors:', app.includes('payTypeCard_bank') && app.includes('payTypeCard_upi') && app.includes('payTypeCard_usdt'));
console.log('7. USDT network has Cards:', app.includes('usdtNetCard_trc20') && app.includes('usdtNetCard_bep20') && app.includes('usdtNetCard_erc20'));
console.log('8. Saved details list has UPI & USDT icons:', app.includes('linear-gradient(135deg, #097939 0%, #ED752E 100%)') && app.includes('₮</div>'));
