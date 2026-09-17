import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.trailheadsupply.example.com').replace(/\/$/, '');

/**
 * @param {{label: string, path?: string}[]} items - Ordered trail, last item is the current page (no path needed).
 */
export default function Breadcrumbs({ items }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.path ? `${SITE_URL}${item.path}` : undefined,
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <nav aria-label="Breadcrumb" className="text-sm text-stone-400">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.label} className="flex items-center gap-1">
                {index > 0 && <span aria-hidden="true">/</span>}
                {isLast || !item.path ? (
                  <span className="text-stone-800 font-medium" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link to={item.path} className="hover:text-pine-700 hover:underline">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
