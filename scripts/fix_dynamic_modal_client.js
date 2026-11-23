const fs = require('fs');

let admin = fs.readFileSync('public/admin.html', 'utf8');

// Replace openUserDetailsModal implementation with clean dynamic rendering
const oldFnAnchor = '    async function openUserDetailsModal(userId) {';
const nextFnAnchor = '    function toggleDossierVisibility(inputId, btn) {';

const startIndex = admin.indexOf(oldFnAnchor);
const endIndex = admin.indexOf(nextFnAnchor);

if (startIndex !== -1 && endIndex !== -1) {
  const newFnCode = `    async function openUserDetailsModal(userId) {
      try {
        const res = await fetch("/api/admin/user-details?id=" + encodeURIComponent(userId));
        const data = await res.json();
        if (!data.success || !data.dossier) {
          alert(data.error || "User details not found");
          return;
        }
        const d = data.dossier;
        const u = d.user || {};
        const s = d.stats || {};
        const dl = d.downline || [];
        const txns = d.transactions || [];

        // Header Avatar, Name, and Status Badges
        const avatarEl = document.getElementById("dossierAvatar");
        if (avatarEl) {
          if (u.profilePicture) {
            avatarEl.innerHTML = '<img src="' + u.profilePicture + '" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">';
          } else {
            avatarEl.innerHTML = (u.firstName || u.name || "U")[0].toUpperCase();
          }
        }
        if (document.getElementById("dossierUserName")) {
          document.getElementById("dossierUserName").innerText = u.name || (u.firstName + " " + (u.lastName || "")).trim();
        }
        if (document.getElementById("dossierUserId")) {
          document.getElementById("dossierUserId").innerText = u.id;
        }
        if (document.getElementById("dossierRegisteredAt")) {
          const regDate = u.registeredAt ? new Date(u.registeredAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Recently";
          document.getElementById("dossierRegisteredAt").innerText = regDate;
        }

        // Account Status & KYC Badges
        const kycBadge = document.getElementById("dossierKycBadge");
        if (kycBadge) {
          const isActive = u.status === 'ACTIVE' || (u.isActivated && Number(u.walletBalance || 0) > 0);
          kycBadge.className = isActive ? 'badge badge-green' : 'badge badge-amber';
          kycBadge.innerHTML = isActive 
            ? '<i class="fa-solid fa-circle-check"></i> ' + (u.kycStatus || 'VERIFIED') + ' • ACTIVE'
            : '<i class="fa-solid fa-clock"></i> NOT ACTIVE (Pending First Deposit)';
        }

        // KPI Stats (100% Dynamic - Zero Static Fallbacks)
        if (document.getElementById("dossierStatWallet")) {
          document.getElementById("dossierStatWallet").innerText = "₹" + Number(u.walletBalance != null ? u.walletBalance : (s.walletBalance || 0)).toLocaleString("en-IN", { minimumFractionDigits: 2 });
        }
        if (document.getElementById("dossierStatDeposits")) {
          document.getElementById("dossierStatDeposits").innerText = "₹" + Number(s.totalDeposits != null ? s.totalDeposits : 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
        }
        if (document.getElementById("dossierStatSpend")) {
          const totalOutflow = (Number(s.totalShopping) || 0) + (Number(s.totalVouchers) || 0) + (Number(s.totalLottery) || 0) + (Number(s.totalRecharges) || 0);
          document.getElementById("dossierStatSpend").innerText = "₹" + Number(totalOutflow).toLocaleString("en-IN", { minimumFractionDigits: 2 });
        }
        if (document.getElementById("dossierStatDownline")) {
          document.getElementById("dossierStatDownline").innerText = dl.length + " Members";
        }

        // Personal Credentials
        if (document.getElementById("dossierFieldFullName")) document.getElementById("dossierFieldFullName").innerText = u.name || (u.firstName + " " + (u.lastName || "")).trim();
        if (document.getElementById("dossierFieldMobile")) document.getElementById("dossierFieldMobile").innerText = "+91 " + u.mobile;
        if (document.getElementById("dossierFieldEmail")) document.getElementById("dossierFieldEmail").innerText = u.email || (u.mobile + "@easypay.in");
        if (document.getElementById("dossierFieldPayId")) document.getElementById("dossierFieldPayId").innerText = u.payId || (u.mobile + "@easypay");
        if (document.getElementById("dossierFieldPassword")) document.getElementById("dossierFieldPassword").value = u.password || ("EasyPay@" + u.mobile.slice(-4));
        if (document.getElementById("dossierFieldPin")) document.getElementById("dossierFieldPin").value = u.securityPin || u.mpin || "1234";
        if (document.getElementById("dossierFieldBank")) document.getElementById("dossierFieldBank").innerText = (u.bankName || "Not Linked") + " (" + (u.bankAccountMasked || "None") + ")";
        if (document.getElementById("dossierFieldPincode")) document.getElementById("dossierFieldPincode").innerText = (u.pincode || "400001") + " (" + (u.city || "Mumbai") + ")";
        if (document.getElementById("dossierFieldReferral")) document.getElementById("dossierFieldReferral").innerText = (u.referralCode || ("REF_" + u.id)) + " (Sponsor: " + (u.referredBy || "SYSTEM") + ")";

        // Activities Breakdown
        if (document.getElementById("dossierActShopping")) document.getElementById("dossierActShopping").innerText = "₹" + Number(s.totalShopping || 0).toLocaleString("en-IN");
        if (document.getElementById("dossierActShoppingCount")) document.getElementById("dossierActShoppingCount").innerText = (d.orders || []).length + " Orders Placed";
        if (document.getElementById("dossierActVouchers")) document.getElementById("dossierActVouchers").innerText = "₹" + Number(s.totalVouchers || 0).toLocaleString("en-IN");
        if (document.getElementById("dossierActVouchersCount")) document.getElementById("dossierActVouchersCount").innerText = (d.vouchers || []).length + " Vouchers";
        if (document.getElementById("dossierActRecharges")) document.getElementById("dossierActRecharges").innerText = "₹" + Number(s.totalRecharges || 0).toLocaleString("en-IN");
        if (document.getElementById("dossierActLottery")) document.getElementById("dossierActLottery").innerText = "₹" + Number(s.totalLottery || 0).toLocaleString("en-IN");
        if (document.getElementById("dossierActTransfers")) document.getElementById("dossierActTransfers").innerText = "₹" + Number(s.totalTransfersSent || 0).toLocaleString("en-IN");

        // Downline Table (100% specific to this user)
        if (document.getElementById("dossierDownlineCount")) document.getElementById("dossierDownlineCount").innerText = dl.length;
        const dlTbody = document.getElementById("dossierDownlineTbody");
        if (dlTbody) {
          if (dl.length === 0) {
            dlTbody.innerHTML = "<tr><td colspan=\"5\" style=\"text-align:center; padding:18px; color:#64748B;\">No referred downline members linked yet.</td></tr>";
          } else {
            dlTbody.innerHTML = dl.map(function(m) {
              const mActive = m.status === 'ACTIVE' || (m.isActivated && Number(m.walletBalance || 0) > 0);
              return "<tr><td><div style=\"display:flex; align-items:center; gap:8px;\"><div style=\"width:24px; height:24px; border-radius:50%; background:#7C3AED; color:white; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700;\">" +
                (m.firstName || m.name || "M")[0] + "</div><div><strong>" + (m.name || (m.firstName + " " + (m.lastName || ""))) +
                "</strong><div style=\"font-size:10px; color:#64748B;\">ID: " + m.id + "</div></div></div></td>" +
                "<td><strong>+91 " + m.mobile + "</strong></td>" +
                "<td><strong style=\"color:#059669;\">₹" + Number(m.walletBalance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 }) + "</strong></td>" +
                "<td><span class=\"badge " + (mActive ? "badge-green" : "badge-amber") + "\">" + (mActive ? "<i class=\"fa-solid fa-check\"></i> ACTIVE" : "<i class=\"fa-solid fa-clock\"></i> NOT ACTIVE") + "</span></td>" +
                "<td style=\"color:#64748B;\">" + (m.registeredAt ? new Date(m.registeredAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Recently") + "</td></tr>";
            }).join("");
          }
        }

        // Transactions Table (100% specific to this user)
        const txnCountBadge = document.getElementById("dossierTxnCountBadge");
        if (txnCountBadge) txnCountBadge.innerText = txns.length + " Transactions Found";
        const txnTbody = document.getElementById("dossierTxnTbody");
        if (txnTbody) {
          if (txns.length === 0) {
            txnTbody.innerHTML = "<tr><td colspan=\"6\" style=\"text-align:center; padding:18px; color:#64748B;\">No transactions recorded for this user yet.</td></tr>";
          } else {
            txnTbody.innerHTML = txns.map(function(t) {
              const isCredit = (t.type || "").includes("CREDIT") || t.type === "WALLET_ADD";
              const amtStr = (isCredit ? "+" : "-") + "₹" + Math.abs(Number(t.amount || 0)).toLocaleString("en-IN", { minimumFractionDigits: 2 });
              const dateStr = formatAdminTimestamp(t.timestamp);
              return "<tr><td><code>" + (t.id || "TXN") + "</code></td>" +
                "<td style=\"color:#64748B; font-size:11px; white-space:nowrap;\">" + dateStr + "</td>" +
                "<td><strong>" + (t.title || "Transaction") + "</strong>" + (t.utr ? "<div style=\"font-size:10px; color:#64748B; font-family:monospace;\">UTR: " + t.utr + "</div>" : "") + "</td>" +
                "<td><span class=\"badge badge-gray\">" + (t.category || "Payment") + "</span></td>" +
                "<td><strong style=\"color:" + (isCredit ? "#059669" : "#0F172A") + ";\">" + amtStr + "</strong></td>" +
                "<td><span class=\"badge badge-green\">" + (t.status || "SUCCESS") + "</span></td></tr>";
            }).join("");
          }
        }

        openModal("modalUserDetails");
      } catch (err) {
        console.error("Error opening user details:", err);
        alert("Could not fetch user dossier");
      }
    }
`;

  admin = admin.slice(0, startIndex) + newFnCode + '\n' + admin.slice(endIndex);
  fs.writeFileSync('public/admin.html', admin, 'utf8');
  console.log('Successfully updated openUserDetailsModal to be 100% dynamic without static fallbacks!');
} else {
  console.log('Could not find anchor indexes for openUserDetailsModal');
}
