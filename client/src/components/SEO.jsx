import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Trailhead Supply Co.';
const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.trailheadsupply.example.com').replace(/\/$/, '');
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

/**
 * Drop this into every page. It's the single place that owns:
 * - a unique <title> and meta description per page
 * - a canonical URL (defaults to the current path)
 * - Open Graph / Twitter card tags for social share previews
 * - arbitrary JSON-LD structured data (Product, BreadcrumbList, LocalBusiness, etc.)
 *
 * @param {string} title - Page-specific title (site name is appended automatically).
 * @param {string} description - Page-specific meta description, under ~160 chars.
 * @param {string} [path] - Path for the canonical URL, e.g. "/product/ridgeline-2p-tent".
 * @param {string} [image] - Absolute URL to a social share image; falls back to the site default.
 * @param {object|object[]} [jsonLd] - One or more JSON-LD objects to inject as <script type="application/ld+json">.
 * @param {boolean} [noindex] - Set true for pages that should never be indexed (cart, checkout, account).
 */
export default function SEO({ title, description, path = '', image, jsonLd, noindex = false }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonical = `${SITE_URL}${path}`;
  const shareImage = image || DEFAULT_IMAGE;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={shareImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={shareImage} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
