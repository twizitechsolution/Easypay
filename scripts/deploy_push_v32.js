const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');

async function main() {
  const token = fs.readFileSync('.git_token', 'utf8').trim();
  const currentHead = await git.resolveRef({ fs, dir: '.', ref: 'HEAD' });
  console.log('Current HEAD commit on main:', currentHead);

  // Stage all working directory files
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

  // Create commit
  const commitMsg = `Release v1.0.32: Admin Multi-Angle Product Photos, Comprehensive User Details Dossier Modal, Full-Width Enterprise Tables, and 100% Real Synchronized DB Transactions Ledger`;
  
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

  // Update refs/heads/main
  fs.writeFileSync('.git/refs/heads/main', commitOid + '\n', 'utf8');

  // Push to GitHub
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

  // Verify remote ref
  const remoteCommits = await git.listServerRefs({
    fs,
    http,
    url: 'https://github.com/twizitechsolution/Easypay.git',
    prefix: 'refs/heads/main'
  });
  console.log('Remote refs/heads/main is now verified at:', remoteCommits);
}

main().catch(err => {
  console.error('Deployment push failed:', err);
  process.exit(1);
});
