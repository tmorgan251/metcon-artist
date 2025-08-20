const fs = require('fs');
const path = require('path');

// Read the index.html file
const indexPath = path.join(__dirname, 'dist', 'index.html');
const content = fs.readFileSync(indexPath, 'utf8');

// Replace absolute paths with relative paths
const fixedContent = content
  .replace(/href="\//g, 'href="./')
  .replace(/src="\//g, 'src="./');

// Write the fixed content back
fs.writeFileSync(indexPath, fixedContent);

console.log('Fixed absolute paths in dist/index.html for GitHub Pages deployment');
