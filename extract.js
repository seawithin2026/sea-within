const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('SEA-WITHIN-COMPLETE-PROJECT.txt', 'utf-8');
const regex = /={5,}\nFILE:\s+\.\/(.+?)\n={5,}\n/g;
const parts = content.split(regex);

let count = 0;
for (let i = 1; i < parts.length; i += 2) {
  const filePath = parts[i].trim();
  const fileContent = (parts[i + 1] || '').trim() + '\n';
  const fullPath = path.join('.', filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, fileContent, 'utf-8');
  count++;
  console.log('Created: ' + filePath);
}
console.log('\nDone! ' + count + ' files created.');
