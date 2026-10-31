const fs = require('fs');
const path = require('path');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else if (src.endsWith('.svg') || src.endsWith('.json') || src.endsWith('.png')) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, dest);
    console.log(`Copied asset: ${src} -> ${dest}`);
  }
}

const rootDir = path.resolve(__dirname, '..');
const nodesSrc = path.join(rootDir, 'nodes');
const distNodes = path.join(rootDir, 'dist', 'nodes');

copyRecursive(nodesSrc, distNodes);
console.log('Assets successfully copied to dist/!');

