import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const load = () => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data.order))
      .catch((err) => setError(err.message));
  };

  useEffect(load, [id]);

  const handleStatusChange = async (status) => {
    setUpdating(true);
    try {
      await api.put(`/orders/${id}/status`, { status });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (error) return <div className="p-8 text-rust-600">{error}</div>;
  if (!order) return <div className="p-8 text-slate-400">Loading...</div>;

  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      <Link to="/orders" className="text-sm text-pine-700 hover:underline">
        &larr; Back to orders
      </Link>
      <h1 className="text-2xl mt-2 mb-1">Order #{order._id.slice(-8).toUpperCase()}</h1>
      <p className="text-slate-500 mb-6">Placed {new Date(order.createdAt).toLocaleString()}</p>

      <div className="grid sm:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Customer</h2>
          <p className="text-sm">{order.user?.name}</p>
          <p className="text-sm text-slate-500">{order.user?.email}</p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Shipping address</h2>
          <address className="not-italic text-sm">
            {order.shippingAddress.fullName}
            <br />
            {order.shippingAddress.line1}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postalCode}
          </address>
        </div>
      </div>

      <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Update status</h2>
      <div className="flex gap-2 mb-8">
        {statuses.map((s) => (
          <button
            key={s}
            disabled={updating}
            onClick={() => handleStatusChange(s)}
            className={`px-3 py-1.5 rounded text-sm capitalize ${
              order.status === s ? 'bg-pine-700 text-white' : 'border border-slate-300 hover:border-pine-400'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Items</h2>
      <ul className="divide-y divide-slate-200 border-y border-slate-200">
        {order.items.map((item) => (
          <li key={item.product} className="flex justify-between py-3 text-sm">
            <span>
              {item.name} &times; {item.qty}
            </span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <p className="text-right font-medium mt-3">Total: ${order.totalPrice.toFixed(2)}</p>
    </div>
  );
}
