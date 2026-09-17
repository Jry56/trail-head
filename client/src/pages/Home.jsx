import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.trailheadsupply.example.com').replace(/\/$/, '');

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([api.get('/products', { params: { featured: true, limit: 4 } }), api.get('/categories')])
      .then(([productsRes, categoriesRes]) => {
        if (!active) return;
        setFeatured(productsRes.data.products);
        setCategories(categoriesRes.data.categories);
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Trailhead Supply Co.',
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: SITE_URL,
      name: 'Trailhead Supply Co.',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/products?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ];

  return (
    <>
      <SEO
        title="Outdoor & Camping Gear Built for Real Miles"
        description="Shop tents, backpacks, cook systems, hiking footwear and trail apparel. Free shipping over $100."
        path="/"
        jsonLd={jsonLd}
      />

      <section className="bg-pine-800 text-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid sm:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl leading-tight">Gear that earns its weight in your pack.</h1>
            <p className="mt-5 text-stone-200 max-w-prose">
              Every tent, pack and stove in the shop has been out on the trail first. We only sell what we would
              carry ourselves.
            </p>
            <Link
              to="/products"
              className="inline-block mt-7 bg-rust-500 hover:bg-rust-600 text-white px-6 py-3 rounded font-medium"
            >
              Shop all gear
            </Link>
          </div>
          <div className="hidden sm:block">
            <img
              src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900"
              alt="Backpacking tent pitched beside a mountain lake at sunrise"
              width="900"
              height="600"
              className="rounded shadow-lg object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-2xl mb-6">Shop by category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/category/${cat.slug}`}
              className="group block rounded overflow-hidden border border-stone-200 hover:border-pine-400"
            >
              <div className="aspect-[4/3] bg-stone-100">
                {cat.image?.url && (
                  <img
                    src={cat.image.url}
                    alt={cat.image.alt}
                    loading="lazy"
                    width="300"
                    height="225"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <p className="p-2 text-sm font-medium">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-2xl mb-6">Trail favorites</h2>
        {error && <p className="text-rust-600">{error}</p>}
        {loading ? (
          <p className="text-stone-400">Loading featured gear...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
