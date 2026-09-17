import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrdersList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const status = searchParams.get('status') || '';

  useEffect(() => {
    setLoading(true);
    api
      .get('/orders', { params: { status: status || undefined, limit: 50 } })
      .then((res) => setOrders(res.data.orders))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      <h1 className="text-2xl mb-6">Orders</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSearchParams({})}
          className={`px-3 py-1.5 rounded text-sm ${!status ? 'bg-pine-700 text-white' : 'border border-slate-300'}`}
        >
          All
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setSearchParams({ status: s })}
            className={`px-3 py-1.5 rounded text-sm capitalize ${
              status === s ? 'bg-pine-700 text-white' : 'border border-slate-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <p className="text-rust-600 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <div className="border border-slate-200 rounded overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Order</th>
                <th className="px-4 py-2 font-medium">Customer</th>
                <th className="px-4 py-2 font-medium">Placed</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t border-slate-100">
                  <td className="px-4 py-2">
                    <Link to={`/orders/${order._id}`} className="text-pine-700 hover:underline">
                      #{order._id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{order.user?.name}</td>
                  <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2 capitalize">{order.status}</td>
                  <td className="px-4 py-2 text-right">${order.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
