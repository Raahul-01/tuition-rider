// This script generates a sitemap.xml file based on the pages in the app directory
const fs = require('fs');
const globby = require('globby');
const path = require('path');

// Domain of your website
const domain = process.env.NEXT_PUBLIC_APP_URL || 'https://tuitionrider.com';

async function generateSitemap() {
  console.log('Generating sitemap...');
  
  // Get all pages from the app directory except excluded files
  const pages = await globby([
    'app/**/*.tsx',
    '!app/**/_*.tsx',
    '!app/**/layout.tsx',
    '!app/**/error.tsx',
    '!app/**/loading.tsx',
    '!app/**/not-found.tsx',
    '!app/**/(protected)/**/*.tsx', // Exclude protected routes
    '!app/**/admin/**/*.tsx', // Exclude admin routes
  ]);

  // Format the XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map((page) => {
      // Convert path format
      const routePath = page
        .replace('app', '')
        .replace(/\/page\.tsx$/, '') // /page.tsx -> /
        .replace(/\[(.*?)\]/g, ':$1') // [id] -> :id
        .replace(/^\//, ''); // Remove leading slash
      
      // Skip dynamic routes for simplicity
      if (routePath.includes(':')) {
        return '';
      }
      
      // Format the URL
      const url = `${domain}/${routePath}`;
      
      return `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .filter(Boolean) // Remove empty strings
    .join('')}
</urlset>`;

  // Write the sitemap to a file
  fs.writeFileSync('public/sitemap.xml', sitemap);
  console.log('Sitemap generated successfully!');
}

// Run the script
generateSitemap().catch((error) => {
  console.error('Error generating sitemap:', error);
  process.exit(1);
}); 