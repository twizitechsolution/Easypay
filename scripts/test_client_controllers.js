const fs = require('fs');
const vm = require('vm');

const s = fs.readFileSync('scripts/fix_app_client_controllers.js', 'utf8');
const start = s.indexOf('const clientControllersJs = `') + 'const clientControllersJs = `'.length;
const end = s.indexOf('`\\n\\n;\n\napp = app.slice');

const code = s.slice(start, end);
console.log('clientControllersJs length:', code.length);

try {
  new vm.Script(code);
  console.log('clientControllersJs is valid JS!');
} catch (err) {
  console.log('clientControllersJs FAILED:', err.message);
  const lineMatch = err.stack.match(/evalmachine\.<anonymous>:(\d+)/);
  if (lineMatch) {
    const lineNo = parseInt(lineMatch[1]);
    const lines = code.split('\n');
    console.log('Error around line', lineNo, ':');
    console.log(lines.slice(Math.max(0, lineNo - 5), Math.min(lines.length, lineNo + 5)).map((l, i) => (lineNo - 5 + i) + ': ' + l).join('\n'));
  }
}
