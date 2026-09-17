import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const image = product.images?.[0];
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block bg-white border border-stone-200 rounded overflow-hidden hover:border-pine-400 transition-colors"
    >
      <div className="aspect-square bg-stone-100 overflow-hidden">
        {image && (
          <img
            src={image.url}
            alt={image.alt}
            loading="lazy"
            width="400"
            height="400"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-stone-400 uppercase tracking-wide">{product.category?.name}</p>
        <h3 className="text-base leading-snug mt-0.5">{product.name}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-medium">${product.price.toFixed(2)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-stone-400 line-through">${product.compareAtPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
