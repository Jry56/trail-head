import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

const SITE_URL = (process.env.SITE_URL || 'http://localhost:5173').replace(/\/$/, '');

function xmlEscape(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// @desc    Dynamic sitemap.xml — always in sync with the live catalog.
// @route   GET /sitemap.xml
// @access  Public
export const getSitemap = asyncHandler(async (req, res) => {
  const [products, categories] = await Promise.all([
    Product.find({ isActive: true }).select('slug updatedAt').lean(),
    Category.find({ isActive: true }).select('slug updatedAt').lean(),
  ]);

  const staticUrls = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/products', changefreq: 'daily', priority: '0.9' },
    { loc: '/about', changefreq: 'monthly', priority: '0.5' },
    { loc: '/contact', changefreq: 'monthly', priority: '0.5' },
  ];

  const urls = [
    ...staticUrls.map((u) => ({ ...u, lastmod: new Date().toISOString() })),
    ...categories.map((c) => ({
      loc: `/category/${c.slug}`,
      lastmod: new Date(c.updatedAt).toISOString(),
      changefreq: 'weekly',
      priority: '0.7',
    })),
    ...products.map((p) => ({
      loc: `/product/${p.slug}`,
      lastmod: new Date(p.updatedAt).toISOString(),
      changefreq: 'weekly',
      priority: '0.8',
    })),
  ];

  const body = urls
    .map(
      (u) => `  <url>
    <loc>${xmlEscape(SITE_URL + u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// @desc    robots.txt — points crawlers at the dynamic sitemap.
// @route   GET /robots.txt
// @access  Public
export const getRobotsTxt = asyncHandler(async (req, res) => {
  const body = `User-agent: *
Allow: /
Disallow: /account
Disallow: /checkout
Disallow: /cart

Sitemap: ${SITE_URL}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(body);
});

// @desc    llms.txt — a plain-language summary for AI assistants/crawlers,
// following the emerging llms.txt convention (llmstxt.org).
// @route   GET /llms.txt
// @access  Public
export const getLlmsTxt = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).select('name slug description').lean();

  const categoryLines = categories
    .map((c) => `- [${c.name}](${SITE_URL}/category/${c.slug}): ${c.description || 'Browse this category.'}`)
    .join('\n');

  const body = `# Trailhead Supply Co.

> Trailhead Supply Co. is an online retailer of outdoor and camping gear: tents, packs, cook systems, footwear and trail apparel, shipped across the US.

This file helps AI assistants and language models understand what this site offers and how to point users to the right pages. It is not intended for search engine ranking (see /robots.txt and /sitemap.xml for that).

## Store
- Homepage: ${SITE_URL}/
- All products: ${SITE_URL}/products
- Contact / store info: ${SITE_URL}/contact

## Categories
${categoryLines || '- Categories are managed dynamically; see /api/categories for the live list.'}

## Notes
- Prices are listed in USD and include applicable sales tax at checkout.
- Product data (name, price, stock, description) is available at ${SITE_URL}/api/products for structured queries.
`;
  res.header('Content-Type', 'text/plain');
  res.send(body);
});
