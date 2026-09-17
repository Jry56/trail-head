import { useEffect, useState } from 'react';
import api from '../services/api';

const emptyForm = { name: '', description: '', metaTitle: '', metaDescription: '', image: { url: '', alt: '' } };

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    api
      .get('/categories')
      .then((res) => setCategories(res.data.categories))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name,
      description: cat.description || '',
      metaTitle: cat.metaTitle || '',
      metaDescription: cat.metaDescription || '',
      image: cat.image || { url: '', alt: '' },
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.image.url && !form.image.alt.trim()) {
      setError('The category image needs alt text.');
      return;
    }
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
      } else {
        await api.post('/categories', form);
      }
      cancelEdit();
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-4xl">
      <h1 className="text-2xl mb-6">Categories</h1>

      {error && <p className="text-rust-600 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="border border-slate-200 bg-white rounded p-5 mb-8 space-y-3">
        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
          {editingId ? 'Edit category' : 'Add category'}
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="border border-slate-300 rounded px-3 py-2 text-sm"
          />
          <input
            placeholder="Meta title"
            maxLength={70}
            value={form.metaTitle}
            onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
            className="border border-slate-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <textarea
          placeholder="Description"
          rows={2}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Meta description"
          rows={2}
          maxLength={160}
          value={form.metaDescription}
          onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
        />
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            placeholder="Image URL"
            value={form.image.url}
            onChange={(e) => setForm((f) => ({ ...f, image: { ...f.image, url: e.target.value } }))}
            className="border border-slate-300 rounded px-3 py-2 text-sm"
          />
          <input
            placeholder="Image alt text"
            value={form.image.alt}
            onChange={(e) => setForm((f) => ({ ...f, image: { ...f.image, alt: e.target.value } }))}
            className="border border-slate-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="bg-pine-700 hover:bg-pine-800 text-white px-5 py-2 rounded text-sm">
            {editingId ? 'Save changes' : 'Add category'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="text-sm text-slate-500 hover:underline">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <div className="border border-slate-200 rounded overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Slug</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-t border-slate-100">
                  <td className="px-4 py-2">{cat.name}</td>
                  <td className="px-4 py-2 text-slate-500">{cat.slug}</td>
                  <td className="px-4 py-2 text-right space-x-3">
                    <button onClick={() => startEdit(cat)} className="text-pine-700 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(cat._id, cat.name)} className="text-rust-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
