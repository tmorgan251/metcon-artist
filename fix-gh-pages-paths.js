#!/usr/bin/env node

/**
 * Post-build script to fix absolute paths in index.html for GitHub Pages
 * GitHub Pages serves from /metcon-artist/ subdirectory, so we need relative paths
 */

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'docs', 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('index.html not found at:', indexPath);
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

// Replace absolute paths with relative paths
html = html.replace(/href="\/favicon\.ico"/g, 'href="./favicon.ico"');
html = html.replace(/src="\/_expo\//g, 'src="./_expo/');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Fixed paths in index.html for GitHub Pages');

