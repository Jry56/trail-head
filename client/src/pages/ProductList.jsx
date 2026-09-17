import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import api from '../services/api';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCard from '../components/ProductCard';

export default function ProductList() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState(1);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    const params = { page, sort };
    if (search) params.search = search;
    if (categorySlug) params.category = categorySlug;

    api
      .get('/products', { params })
      .then((res) => {
        if (!active) return;
        setProducts(res.data.products);
        setPages(res.data.pages);
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));

    if (categorySlug) {
      api
        .get(`/categories/slug/${categorySlug}`)
        .then((res) => active && setCategoryInfo(res.data.category))
        .catch(() => active && setCategoryInfo(null));
    } else {
      setCategoryInfo(null);
    }

    return () => {
      active = false;
    };
  }, [categorySlug, search, sort, page]);

  const heading = categoryInfo ? categoryInfo.name : search ? `Search results for "${search}"` : 'Shop all gear';
  const description = categoryInfo
    ? categoryInfo.metaDescription || categoryInfo.description
    : 'Browse every tent, pack, cook system, boot and layer we sell -- tested on real trips before they reach the shop.';

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    ...(categoryInfo
      ? [{ label: 'Shop all gear', path: '/products' }, { label: categoryInfo.name }]
      : [{ label: 'Shop all gear' }]),
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <SEO
        title={categoryInfo?.metaTitle || heading}
        description={description}
        path={categorySlug ? `/category/${categorySlug}` : '/products'}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="text-3xl mt-3 mb-6">{heading}</h1>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <label htmlFor="sort" className="text-sm text-stone-500">
          Sort by
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="border border-stone-300 rounded px-2 py-1.5 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="rating">Top rated</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {error && <p className="text-rust-600 mb-4">{error}</p>}

      {loading ? (
        <p className="text-stone-400">Loading gear...</p>
      ) : products.length === 0 ? (
        <p className="text-stone-500">No products matched. Try a different search or category.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <nav className="flex justify-center gap-2 mt-10" aria-label="Pagination">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => updateParam('page', p === 1 ? '' : String(p))}
              aria-current={p === page ? 'page' : undefined}
              className={`w-9 h-9 rounded text-sm ${
                p === page ? 'bg-pine-700 text-white' : 'bg-white border border-stone-300 hover:border-pine-400'
              }`}
            >
              {p}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
