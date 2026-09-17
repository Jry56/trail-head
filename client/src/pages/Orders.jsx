import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api
      .get('/orders/mine')
      .then((res) => active && setOrders(res.data.orders))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <SEO title="My orders" path="/account/orders" noindex />
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'My orders' }]} />
      <h1 className="text-3xl mt-3 mb-6">My orders</h1>

      {error && <p className="text-rust-600">{error}</p>}
      {loading ? (
        <p className="text-stone-400">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-stone-500">
          No orders yet.{' '}
          <Link to="/products" className="underline">
            Start shopping
          </Link>
          .
        </p>
      ) : (
        <ul className="divide-y divide-stone-200 border-y border-stone-200">
          {orders.map((order) => (
            <li key={order._id} className="py-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-stone-500">
                  Placed {new Date(order.createdAt).toLocaleDateString()} &middot; {order.status}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">${order.totalPrice.toFixed(2)}</span>
                <Link to={`/account/orders/${order._id}`} className="text-sm text-pine-700 underline">
                  View
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
