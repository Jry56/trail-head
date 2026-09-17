import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCard from '../components/ProductCard';

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.trailheadsupply.example.com').replace(/\/$/, '');

export default function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setError('');
    setProduct(null);
    api
      .get(`/products/slug/${slug}`)
      .then((res) => {
        if (!active) return;
        setProduct(res.data.product);
        setActiveImage(0);
        return api.get(`/products/${res.data.product._id}/related`);
      })
      .then((res) => active && res && setRelated(res.data.products))
      .catch((err) => active && setError(err.message));
    return () => {
      active = false;
    };
  }, [slug]);

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
        <SEO title="Product not found" path={`/product/${slug}`} noindex />
        <h1 className="text-2xl mb-3">We couldn't find that product.</h1>
        <p className="text-stone-500 mb-6">{error}</p>
        <Link to="/products" className="text-pine-700 underline">
          Back to all products
        </Link>
      </div>
    );
  }

  if (!product) {
    return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-stone-400">Loading product...</div>;
  }

  const handleAddToCart = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSubmitting(true);
    try {
      await api.post(`/products/${product._id}/reviews`, reviewForm);
      const res = await api.get(`/products/slug/${slug}`);
      setProduct(res.data.product);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    image: product.images.map((img) => img.url),
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand || 'Trailhead' },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: product.currency || 'USD',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    ...(product.numReviews > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.numReviews,
      },
    }),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <SEO
        title={product.metaTitle || product.name}
        description={product.metaDescription || product.shortDescription}
        path={`/product/${product.slug}`}
        image={product.images[0]?.url}
        jsonLd={jsonLd}
      />
      <Breadcrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: 'Shop all gear', path: '/products' },
          ...(product.category ? [{ label: product.category.name, path: `/category/${product.category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="grid sm:grid-cols-2 gap-10 mt-4">
        <div>
          <div className="aspect-square bg-stone-100 rounded overflow-hidden">
            <img
              src={product.images[activeImage].url}
              alt={product.images[activeImage].alt}
              width="600"
              height="600"
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <button
                  key={img.url}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded overflow-hidden border-2 ${
                    i === activeImage ? 'border-pine-600' : 'border-transparent'
                  }`}
                  aria-label={`Show image ${i + 1}: ${img.alt}`}
                >
                  <img src={img.url} alt="" width="64" height="64" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl mb-1">{product.name}</h1>
          {product.numReviews > 0 && (
            <p className="text-sm text-stone-500 mb-3">
              {product.rating.toFixed(1)} out of 5 ({product.numReviews} review{product.numReviews === 1 ? '' : 's'})
            </p>
          )}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl font-medium">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-stone-400 line-through">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>
          <p className="text-stone-700 mb-6">{product.shortDescription}</p>

          {product.attributes?.length > 0 && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-6 border-t border-b border-stone-200 py-4">
              {product.attributes.map((attr) => (
                <div key={attr.name} className="contents">
                  <dt className="text-stone-500">{attr.name}</dt>
                  <dd>{attr.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <p className={`text-sm mb-4 ${product.stock > 0 ? 'text-pine-700' : 'text-rust-600'}`}>
            {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
          </p>

          <div className="flex items-center gap-3 mb-4">
            <label htmlFor="qty" className="text-sm text-stone-500">
              Quantity
            </label>
            <input
              id="qty"
              type="number"
              min="1"
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
              className="w-16 border border-stone-300 rounded px-2 py-1.5 text-sm"
              disabled={product.stock === 0}
            />
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full sm:w-auto bg-rust-500 hover:bg-rust-600 disabled:bg-stone-300 text-white px-8 py-3 rounded font-medium"
          >
            {added ? 'Added to cart' : 'Add to cart'}
          </button>

          <div className="mt-8">
            <h2 className="text-lg mb-2">Details</h2>
            <p className="text-stone-700 whitespace-pre-line">{product.description}</p>
          </div>
        </div>
      </div>

      <section className="mt-14 max-w-2xl">
        <h2 className="text-2xl mb-4">Reviews</h2>
        {product.reviews?.length > 0 ? (
          <ul className="space-y-4 mb-8">
            {product.reviews.map((review, i) => (
              <li key={i} className="border border-stone-200 rounded p-4">
                <p className="font-medium text-sm">
                  {review.name} &middot; {review.rating}/5
                </p>
                <p className="text-stone-700 text-sm mt-1">{review.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-stone-500 mb-8">No reviews yet -- be the first to leave one.</p>
        )}

        {user ? (
          <form onSubmit={handleReviewSubmit} className="space-y-3">
            <h3 className="text-lg">Leave a review</h3>
            {reviewError && <p className="text-rust-600 text-sm">{reviewError}</p>}
            <div>
              <label htmlFor="rating" className="block text-sm text-stone-500 mb-1">
                Rating
              </label>
              <select
                id="rating"
                value={reviewForm.rating}
                onChange={(e) => setReviewForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                className="border border-stone-300 rounded px-2 py-1.5 text-sm"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} star{n === 1 ? '' : 's'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm text-stone-500 mb-1">
                Comment
              </label>
              <textarea
                id="comment"
                required
                minLength={5}
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                className="w-full border border-stone-300 rounded px-3 py-2 text-sm"
                rows={3}
              />
            </div>
            <button
              type="submit"
              disabled={reviewSubmitting}
              className="bg-pine-700 hover:bg-pine-800 text-white px-5 py-2 rounded text-sm"
            >
              {reviewSubmitting ? 'Submitting...' : 'Submit review'}
            </button>
          </form>
        ) : (
          <p className="text-sm text-stone-500">
            <Link to="/login" className="underline">
              Log in
            </Link>{' '}
            to leave a review.
          </p>
        )}
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl mb-6">You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
