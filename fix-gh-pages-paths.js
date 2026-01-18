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

// Add cache-busting version parameter to script tag if not present
html = html.replace(/(src="\.\/_expo\/static\/js\/web\/index-[^"]+\.js")(\s|>)/g, '$1?v=3"$2');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Fixed paths in index.html for GitHub Pages');

// Ensure .nojekyll file exists so GitHub Pages serves files/folders starting with _
const nojekyllPath = path.join(__dirname, 'docs', '.nojekyll');
if (!fs.existsSync(nojekyllPath)) {
  fs.writeFileSync(nojekyllPath, '');
  console.log('Created .nojekyll file for GitHub Pages');
}

