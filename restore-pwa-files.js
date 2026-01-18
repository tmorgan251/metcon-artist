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
  const pwaTags = `  <!-- Cache Control Meta Tags -->
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <!-- PWA Meta Tags -->
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
  // Remove duplicate meta tags that Expo adds after PWA tags (before </head>)
  // Find everything after our last favicon link and before </head>
  const lastFaviconLink = html.lastIndexOf('<link rel="icon" type="image/png" sizes="16x16"');
  const headEnd = html.indexOf('</head>');
  
  if (lastFaviconLink !== -1 && headEnd !== -1 && headEnd > lastFaviconLink) {
    // Find the end of our last favicon link
    const afterLastLink = html.indexOf('>', lastFaviconLink);
    if (afterLastLink !== -1) {
      const beforeSection = html.substring(0, afterLastLink + 1);
      const afterSection = html.substring(afterLastLink + 1, headEnd);
      const afterHead = html.substring(headEnd);
      
      // Remove duplicates from the section between our favicon links and </head>
      const cleanedAfter = afterSection
        .replace(/<meta name="theme-color"[^>]*>\s*/gi, '')
        .replace(/<meta name="description"[^>]*>\s*/gi, '')
        .replace(/<link rel="icon"[^>]*>\s*/gi, '');
      
      html = beforeSection + cleanedAfter + afterHead;
    }
  }
  
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('Updated index.html with PWA meta tags and mobile CSS');
}

// Add service worker unregistration script immediately after opening body tag
// This runs synchronously before any other scripts to prevent service workers from intercepting requests
// First, remove any existing service worker unregistration scripts (handle multi-line)
html = html.replace(/<!-- Unregister any old service workers[\s\S]*?<\/script>\s*/g, '');

const unregisterScript = `  <!-- Unregister any old service workers to prevent caching issues -->
  <!-- This must run BEFORE the main script loads to prevent service worker from intercepting -->
  <script>
    (function() {
      if ('serviceWorker' in navigator) {
        // Unregister all service workers immediately
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          for(let registration of registrations) {
            registration.unregister().then(function(success) {
              if (success) {
                console.log('Unregistered old service worker:', registration.scope);
              }
            }).catch(function(error) {
              console.error('Error unregistering service worker:', error);
            });
          }
        }).catch(function(error) {
          console.error('Error getting service worker registrations:', error);
        });
        // Also try to unregister by scope in case getRegistrations fails
        navigator.serviceWorker.getRegistration().then(function(registration) {
          if (registration) {
            registration.unregister().then(function(success) {
              if (success) {
                console.log('Unregistered service worker by scope:', registration.scope);
              }
            });
          }
        });
      }
    })();
  </script>
`;
// Insert right after <body> tag, before any other content (handle whitespace)
html = html.replace(/<body>\s*/m, '<body>\n' + unregisterScript);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Added service worker unregistration script at the top of body');

console.log('PWA files restored successfully');

