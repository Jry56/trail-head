import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Cart() {
  const { items, updateQty, removeItem, subtotal } = useCart();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <SEO title="Your cart" path="/cart" noindex />
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Your cart' }]} />
      <h1 className="text-3xl mt-3 mb-6">Your cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-stone-500 mb-4">Your cart is empty.</p>
          <Link to="/products" className="text-pine-700 underline">
            Continue shopping
          </Link>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-stone-200 border-y border-stone-200">
            {items.map((item) => (
              <li key={item.product} className="flex gap-4 py-4">
                <img
                  src={item.image}
                  alt={item.imageAlt || item.name}
                  width="80"
                  height="80"
                  className="w-20 h-20 object-cover rounded bg-stone-100"
                />
                <div className="flex-1">
                  <Link to={`/product/${item.slug}`} className="font-medium hover:underline">
                    {item.name}
                  </Link>
                  <p className="text-stone-500 text-sm">${item.price.toFixed(2)} each</p>
                  <div className="flex items-center gap-2 mt-2">
                    <label htmlFor={`qty-${item.product}`} className="sr-only">
                      Quantity for {item.name}
                    </label>
                    <input
                      id={`qty-${item.product}`}
                      type="number"
                      min="1"
                      max={item.stock}
                      value={item.qty}
                      onChange={(e) => updateQty(item.product, Number(e.target.value))}
                      className="w-16 border border-stone-300 rounded px-2 py-1 text-sm"
                    />
                    <button
                      onClick={() => removeItem(item.product)}
                      className="text-sm text-rust-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="font-medium">${(item.price * item.qty).toFixed(2)}</p>
              </li>
            ))}
          </ul>

          <div className="flex justify-end mt-6">
            <div className="w-full sm:w-64">
              <div className="flex justify-between text-lg mb-4">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <Link
                to="/checkout"
                className="block text-center bg-rust-500 hover:bg-rust-600 text-white px-6 py-3 rounded font-medium"
              >
                Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
