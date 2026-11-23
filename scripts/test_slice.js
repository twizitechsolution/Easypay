const fs = require('fs');
const vm = require('vm');

let app = fs.readFileSync('public/app.html', 'utf8').replace(/\r\n/g, '\n');

const sIdx = 639445;
const eIdx = 734780;

const testControllersJs = `
    function dummyTest() {
      console.log('dummy');
    }
`;

const newApp = app.slice(0, sIdx) + testControllersJs + '\n' + app.slice(eIdx);

const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;

while ((match = scriptRegex.exec(newApp)) !== null) {
  count++;
  try {
    new vm.Script(match[1]);
    console.log('Script', count, 'OK');
  } catch (err) {
    console.log('Script', count, 'FAILED:', err.message);
    const lineMatch = err.stack.match(/evalmachine\.<anonymous>:(\d+)/);
    if (lineMatch) {
      const lineNo = parseInt(lineMatch[1]);
      const lines = match[1].split('\n');
      console.log('Error around line', lineNo, ':');
      console.log(lines.slice(Math.max(0, lineNo - 5), Math.min(lines.length, lineNo + 5)).map((l, i) => (lineNo - 5 + i) + ': ' + l).join('\n'));
    }
  }
}
