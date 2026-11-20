const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');

async function main() {
  const dir = __dirname;
  console.log('Project dir:', dir);

  // 1. Init repo
  console.log('1. Initializing Git repository...');
  await git.init({ fs, dir, defaultBranch: 'main' });
  console.log('Repo initialized.');

  // 2. Add remote
  const remoteUrl = 'https://github.com/twizitechsolution/Easypay.git';
  try {
    await git.addRemote({ fs, dir, remote: 'origin', url: remoteUrl });
    console.log('Added remote origin:', remoteUrl);
  } catch (e) {
    console.log('Remote origin may already exist:', e.message);
  }

  // 3. Stage files
  console.log('2. Staging all modified project files...');
  
  // Recursively find files not in node_modules or .git
  function getFiles(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    let files = [];
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relPath = path.relative(dir, fullPath).replace(/\\/g, '/');

      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'MinGit' || relPath.startsWith('.system_generated')) {
        continue;
      }

      if (entry.isDirectory()) {
        files = files.concat(getFiles(fullPath));
      } else {
        files.push(relPath);
      }
    }
    return files;
  }

  const files = getFiles(dir);
  console.log(`Found ${files.length} project files to track.`);

  for (const f of files) {
    await git.add({ fs, dir, filepath: f });
  }
  console.log('All files staged in index.');

  // 4. Commit
  console.log('3. Creating commit...');
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'twizitechsolution',
      email: 'admin@easypay.com'
    },
    message: 'Update EasyPay: Enterprise Admin Console, CRED-Style 3D Lucky Draw & Vercel deployment'
  });

  console.log('Commit successfully created! SHA:', sha);
}

main().catch(err => {
  console.error('Git error:', err);
  process.exit(1);
});
