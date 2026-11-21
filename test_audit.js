const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const html = fs.readFileSync(path.join(baseDir, 'index.html'), 'utf8');

// Collect all onclick handlers
const onclickRegex = /onclick="([^"]+)"/g;
let match;
const handlers = new Set();
while ((match = onclickRegex.exec(html)) !== null) {
  handlers.add(match[1].trim());
}

console.log('Total unique onclick handlers:', handlers.size);
Array.from(handlers).sort().forEach(h => console.log('  -', h));

// Collect all form onsubmit handlers
const formRegex = /<form\b([^>]*)>/g;
console.log('\nForms found:');
while ((match = formRegex.exec(html)) !== null) {
  console.log('  Form tag:', match[1]);
}

// Collect all inputs with id
const inputRegex = /<(?:input|select|textarea)\b([^>]*)>/g;
const inputs = [];
while ((match = inputRegex.exec(html)) !== null) {
  const idMatch = /id="([^"]+)"/.exec(match[1]);
  if (idMatch) inputs.push(idMatch[1]);
}
console.log('\nInputs with ID count:', inputs.length);
