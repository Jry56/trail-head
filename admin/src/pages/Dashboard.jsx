import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, pendingOrders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get('/products', { params: { limit: 1 } }),
      api.get('/categories'),
      api.get('/orders', { params: { limit: 5 } }),
      api.get('/orders', { params: { status: 'pending', limit: 1 } }),
    ])
      .then(([productsRes, categoriesRes, ordersRes, pendingRes]) => {
        if (!active) return;
        setStats({
          products: productsRes.data.total,
          categories: categoriesRes.data.categories.length,
          orders: ordersRes.data.total,
          pendingOrders: pendingRes.data.total,
        });
        setRecentOrders(ordersRes.data.orders);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      <h1 className="text-2xl mb-6">Dashboard</h1>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <StatCard label="Products" value={stats.products} to="/products" />
            <StatCard label="Categories" value={stats.categories} to="/categories" />
            <StatCard label="Total orders" value={stats.orders} to="/orders" />
            <StatCard label="Pending orders" value={stats.pendingOrders} to="/orders?status=pending" accent />
          </div>

          <h2 className="text-lg mb-3">Recent orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-slate-500 text-sm">No orders yet.</p>
          ) : (
            <div className="border border-slate-200 rounded overflow-hidden bg-white">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-left">
                  <tr>
                    <th className="px-4 py-2 font-medium">Order</th>
                    <th className="px-4 py-2 font-medium">Customer</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-t border-slate-100">
                      <td className="px-4 py-2">
                        <Link to={`/orders/${order._id}`} className="text-pine-700 hover:underline">
                          #{order._id.slice(-8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-4 py-2">{order.user?.name}</td>
                      <td className="px-4 py-2 capitalize">{order.status}</td>
                      <td className="px-4 py-2 text-right">${order.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, to, accent }) {
  return (
    <Link
      to={to}
      className={`block border rounded p-4 bg-white hover:border-pine-400 ${
        accent && value > 0 ? 'border-rust-500' : 'border-slate-200'
      }`}
    >
      <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl mt-1">{value}</p>
    </Link>
  );
}
