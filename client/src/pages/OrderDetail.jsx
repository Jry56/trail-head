import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api
      .get(`/orders/${id}`)
      .then((res) => active && setOrder(res.data.order))
      .catch((err) => active && setError(err.message));
    return () => {
      active = false;
    };
  }, [id]);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <SEO title="Order not found" path={`/account/orders/${id}`} noindex />
        <p className="text-rust-600">{error}</p>
      </div>
    );
  }

  if (!order) {
    return <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-stone-400">Loading order...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <SEO title={`Order #${order._id.slice(-8).toUpperCase()}`} path={`/account/orders/${order._id}`} noindex />
      <Breadcrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: 'My orders', path: '/account/orders' },
          { label: `#${order._id.slice(-8).toUpperCase()}` },
        ]}
      />
      <h1 className="text-3xl mt-3 mb-1">Order #{order._id.slice(-8).toUpperCase()}</h1>
      <p className="text-stone-500 mb-6">
        Placed {new Date(order.createdAt).toLocaleDateString()} &middot; Status:{' '}
        <span className="font-medium capitalize">{order.status}</span>
      </p>

      <ul className="divide-y divide-stone-200 border-y border-stone-200 mb-6">
        {order.items.map((item) => (
          <li key={item.product} className="flex gap-4 py-4">
            <img src={item.image} alt={item.name} width="64" height="64" className="w-16 h-16 object-cover rounded bg-stone-100" />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-stone-500">
                Qty {item.qty} &times; ${item.price.toFixed(2)}
              </p>
            </div>
            <p className="font-medium">${(item.price * item.qty).toFixed(2)}</p>
          </li>
        ))}
      </ul>

      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg mb-2">Shipping address</h2>
          <address className="not-italic text-sm text-stone-700">
            {order.shippingAddress.fullName}
            <br />
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 && (
              <>
                <br />
                {order.shippingAddress.line2}
              </>
            )}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postalCode}
            <br />
            {order.shippingAddress.country}
          </address>
        </div>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Items</span>
            <span>${order.itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${order.taxPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium text-base pt-2 border-t border-stone-200">
            <span>Total</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Link to="/account/orders" className="inline-block mt-8 text-pine-700 underline text-sm">
        Back to all orders
      </Link>
    </div>
  );
}
