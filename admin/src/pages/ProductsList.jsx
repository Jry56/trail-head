import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get('/products', { params: { search: search || undefined, limit: 48 } })
      .then((res) => setProducts(res.data.products))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">Products</h1>
        <Link to="/products/new" className="bg-pine-700 hover:bg-pine-800 text-white px-4 py-2 rounded text-sm">
          Add product
        </Link>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
        className="mb-4 flex gap-2"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="border border-slate-300 rounded px-3 py-1.5 text-sm w-64"
        />
        <button type="submit" className="border border-slate-300 rounded px-3 py-1.5 text-sm hover:border-pine-400">
          Search
        </button>
      </form>

      {error && <p className="text-rust-600 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <div className="border border-slate-200 rounded overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Category</th>
                <th className="px-4 py-2 font-medium text-right">Price</th>
                <th className="px-4 py-2 font-medium text-right">Stock</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-slate-100">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.category?.name}</td>
                  <td className="px-4 py-2 text-right">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">{p.stock}</td>
                  <td className="px-4 py-2 text-right space-x-3">
                    <Link to={`/products/${p._id}`} className="text-pine-700 hover:underline">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(p._id, p.name)} className="text-rust-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                    No products found.
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
