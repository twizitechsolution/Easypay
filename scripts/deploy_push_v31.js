const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');

async function main() {
  const token = fs.readFileSync('.git_token', 'utf8').trim();

  console.log('Staging working directory...');
  const status = await git.statusMatrix({ fs, dir: '.' });
  for (const [filepath, head, workdir, stage] of status) {
    if (workdir === 0) {
      await git.remove({ fs, dir: '.', filepath });
      console.log('Removed from index:', filepath);
    } else if (workdir !== stage || stage === 0) {
      await git.add({ fs, dir: '.', filepath });
      console.log('Added to index:', filepath);
    }
  }

  const commitMsg = `Release v1.0.31: Consistent User Profile (Nirod Behera), Branded Payment Method Cards, Authentic UPI & USDT Logos, Mobile Responsive Views & Animated Orders Refresh`;
  
  const commitOid = await git.commit({
    fs,
    dir: '.',
    author: {
      name: 'twizitechsolution',
      email: 'admin@easypay.com'
    },
    message: commitMsg
  });

  console.log('New Clean Commit OID:', commitOid);

  fs.writeFileSync('.git/refs/heads/main', commitOid + '\n', 'utf8');
  fs.writeFileSync('.git/HEAD', 'ref: refs/heads/main\n', 'utf8');

  console.log('Pushing to GitHub remote refs/heads/main...');
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

  const remoteCommits = await git.listServerRefs({
    fs,
    http,
    url: 'https://github.com/twizitechsolution/Easypay.git',
    prefix: 'refs/heads/main'
  });
  console.log('Remote refs/heads/main is now:', remoteCommits);
}

main().catch(err => {
  console.error('Deployment push failed:', err);
  process.exit(1);
});
