const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');

async function main() {
  const token = fs.readFileSync('.git_token', 'utf8').trim();
  const currentHead = await git.resolveRef({ fs, dir: '.', ref: 'HEAD' });
  console.log('Current HEAD commit on main:', currentHead);

  const status = await git.statusMatrix({ fs, dir: '.' });
  for (const [filepath, head, workdir, stage] of status) {
    if (filepath.includes('.git_token')) continue;
    if (workdir === 0) {
      await git.remove({ fs, dir: '.', filepath });
      console.log('Removed from index:', filepath);
    } else if (workdir !== stage || stage === 0) {
      await git.add({ fs, dir: '.', filepath });
      console.log('Added to index:', filepath);
    }
  }

  const commitMsg = 'Release v1.0.38: Saved Payment Picker & USDT/Bank/UPI Withdrawal Flow, Admin Withdrawal Requests & USDT Rate, Mobile-Responsive Zerodha-Style Passbook & Portfolio, Gift Voucher Details Fix, and 10-Level Refer & Earn Commission Engine';

  const commitOid = await git.commit({
    fs,
    dir: '.',
    parent: [currentHead],
    author: {
      name: 'twizitechsolution',
      email: 'admin@easypay.com'
    },
    message: commitMsg
  });

  console.log('New Commit OID:', commitOid);
  fs.writeFileSync('.git/refs/heads/main', commitOid + '\n', 'utf8');

  const pushResult = await git.push({
    fs,
    http,
    dir: '.',
    remote: 'origin',
    ref: 'refs/heads/main',
    remoteRef: 'refs/heads/main',
    force: false,
    onAuth: () => ({ username: token })
  });

  console.log('Push Result:', JSON.stringify(pushResult, null, 2));
}

main().catch(err => {
  console.error('Deployment push failed:', err);
  process.exit(1);
});
