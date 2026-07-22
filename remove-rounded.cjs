const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace all rounded classes except rounded-full (used for icons/avatars)
  const regex = /rounded-\[?[a-zA-Z0-9.]+\]?|rounded-(sm|md|lg|xl|2xl|3xl)/g;
  
  content = content.replace(regex, (match) => {
    if (match === 'rounded-full' || match.includes('rounded-full')) {
      return match;
    }
    return 'rounded-none';
  });

  fs.writeFileSync(filePath, content, 'utf8');
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      processFile(filePath);
    }
  }
}

walk(path.join(__dirname, 'src'));
console.log('Replaced all rounded classes with rounded-none.');
