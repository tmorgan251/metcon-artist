#!/usr/bin/env node

/**
 * Post-build script to restore PWA files and assets that Expo export doesn't include
 */

const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'docs');
const assetsDir = path.join(__dirname, 'assets');
const docsAssetsDir = path.join(docsDir, 'assets');

// Ensure assets directory exists
if (!fs.existsSync(docsAssetsDir)) {
  fs.mkdirSync(docsAssetsDir, { recursive: true });
}

// Copy icon files if they exist in source
const iconFiles = ['icon.png', 'icon-192.png'];
iconFiles.forEach(file => {
  const source = path.join(assetsDir, file);
  const dest = path.join(docsAssetsDir, file);
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, dest);
    console.log(`Copied ${file} to docs/assets/`);
  } else {
    console.warn(`Warning: ${file} not found in assets/`);
  }
});

// Create manifest.json from app.json config
const appJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'app.json'), 'utf8'));
const webConfig = appJson.expo.web;

const manifest = {
  name: webConfig.name || appJson.expo.name,
  short_name: webConfig.shortName || webConfig.name || appJson.expo.name,
  description: webConfig.description || '',
  start_url: webConfig.startUrl || './',
  scope: webConfig.scope || './',
  display: webConfig.display || 'standalone',
  background_color: webConfig.backgroundColor || '#282A36',
  theme_color: webConfig.themeColor || '#282A36',
  orientation: webConfig.orientation || 'portrait',
  categories: ['fitness', 'health', 'sports'],
  lang: webConfig.lang || 'en',
  dir: 'ltr',
  icons: [
    {
      src: './assets/icon-192.png?v=3',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable'
    },
    {
      src: './assets/icon.png?v=3',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable'
    }
  ]
};

fs.writeFileSync(
  path.join(docsDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2),
  'utf8'
);
console.log('Created manifest.json');

// Update index.html to include PWA meta tags if missing
const indexPath = path.join(docsDir, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
let needsUpdate = false;

// Remove any duplicate meta tags that Expo might have added (simple ones) after PWA tags
// This needs to happen after we've added PWA tags, so we'll do it at the end

// Add PWA meta tags before closing head tag if not already present
if (!html.includes('apple-mobile-web-app-capable')) {
  const pwaTags = `  <!-- PWA Meta Tags -->
  <meta name="theme-color" content="${webConfig.themeColor || '#282A36'}" />
  <meta name="description" content="${webConfig.description || ''}" />
  <link rel="manifest" href="./manifest.json" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="${webConfig.name || appJson.expo.name}" />
  <link rel="apple-touch-icon" href="./assets/icon.png?v=3" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="application-name" content="${webConfig.name || appJson.expo.name}" />
  <meta name="msapplication-TileColor" content="${webConfig.themeColor || '#282A36'}" />
  <meta name="msapplication-TileImage" content="./assets/icon.png?v=3" />
  <meta name="msapplication-config" content="none" />
  <!-- Favicon with cache busting -->
  <link rel="icon" type="image/x-icon" href="./favicon.ico?v=2" />
  <link rel="icon" type="image/png" sizes="32x32" href="./favicon.ico?v=2" />
  <link rel="icon" type="image/png" sizes="16x16" href="./favicon.ico?v=2" />`;

  // Find the closing style tag and insert PWA tags right after it
  html = html.replace(
    /<\/style>/,
    `</style>\n${pwaTags}`
  );
  needsUpdate = true;
} else {
  // Still remove duplicates even if PWA tags exist
  needsUpdate = true;
}

// Add mobile scrolling CSS if missing
if (!html.includes('Enable scrolling for mobile')) {
  html = html.replace(
    /(body \{[^}]*overflow: hidden;[^}]*\})/,
    `$1\n      /* Enable scrolling for mobile web browsers */\n      @media (max-width: 768px) {\n        body {\n          overflow: auto;\n        }\n      }`
  );
  needsUpdate = true;
}

if (needsUpdate) {
  // Remove duplicate meta tags that might appear after PWA tags section (before </head>)
  // Find everything between PWA tags section and </head> and remove duplicates
  const pwaSectionEnd = html.indexOf('<!-- Favicon with cache busting -->');
  const headEnd = html.indexOf('</head>');
  
  if (pwaSectionEnd !== -1 && headEnd !== -1 && headEnd > pwaSectionEnd) {
    const beforePwa = html.substring(0, pwaSectionEnd);
    const pwaSection = html.substring(pwaSectionEnd, html.indexOf('</head>', pwaSectionEnd));
    const afterHead = html.substring(headEnd);
    
    // Remove duplicates from the section between PWA tags and </head>
    let cleanPwaSection = pwaSection
      .replace(/<meta name="theme-color"[^>]*>\s*/gi, '')
      .replace(/<meta name="description"[^>]*>\s*/gi, '')
      .replace(/<link rel="icon" href="[^"]*"[^>]*>\s*/gi, '')
      .replace(/<link rel="icon"[^>]*href="[^"]*"[^>]*>\s*/gi, '');
    
    html = beforePwa + cleanPwaSection + afterHead;
  }
  
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('Updated index.html with PWA meta tags and mobile CSS');
}

console.log('PWA files restored successfully');

