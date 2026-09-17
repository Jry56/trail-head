import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const emptyProduct = {
  name: '',
  brand: '',
  sku: '',
  category: '',
  shortDescription: '',
  description: '',
  price: '',
  compareAtPrice: '',
  stock: 0,
  images: [{ url: '', alt: '' }],
  isFeatured: false,
  isActive: true,
  metaTitle: '',
  metaDescription: '',
};

export default function ProductForm() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyProduct);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    if (isNew) return;
    api
      .get(`/products/${id}`)
      .then((res) => {
        const p = res.data.product;
        setForm({
          ...emptyProduct,
          ...p,
          category: p.category?._id || p.category || '',
          images: p.images.length ? p.images : emptyProduct.images,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const updateField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const updateImage = (index, field, value) => {
    setForm((f) => {
      const images = [...f.images];
      images[index] = { ...images[index], [field]: value };
      return { ...f, images };
    });
  };

  const addImageRow = () => setForm((f) => ({ ...f, images: [...f.images, { url: '', alt: '' }] }));
  const removeImageRow = (index) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const missingAlt = form.images.some((img) => img.url && !img.alt.trim());
    if (missingAlt) {
      setError('Every product image needs alt text describing it -- that field cannot be left blank.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        stock: Number(form.stock),
        images: form.images.filter((img) => img.url.trim()),
      };
      if (isNew) {
        await api.post('/products', payload);
      } else {
        await api.put(`/products/${id}`, payload);
      }
      navigate('/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-400">Loading...</div>;

  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      <Link to="/products" className="text-sm text-pine-700 hover:underline">
        &larr; Back to products
      </Link>
      <h1 className="text-2xl mt-2 mb-6">{isNew ? 'Add product' : 'Edit product'}</h1>

      {error && <p className="text-rust-600 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Basics</h2>
          <Field label="Name" value={form.name} onChange={(v) => updateField('name', v)} required />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Brand" value={form.brand} onChange={(v) => updateField('brand', v)} />
            <Field label="SKU" value={form.sku} onChange={(v) => updateField('sku', v)} />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm text-slate-500 mb-1">
              Category
            </label>
            <select
              id="category"
              required
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <Field
            label="Short description"
            value={form.shortDescription}
            onChange={(v) => updateField('shortDescription', v)}
            maxLength={200}
          />
          <div>
            <label htmlFor="description" className="block text-sm text-slate-500 mb-1">
              Full description
            </label>
            <textarea
              id="description"
              required
              rows={5}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Pricing & stock</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Price ($)" type="number" step="0.01" value={form.price} onChange={(v) => updateField('price', v)} required />
            <Field label="Compare-at price ($)" type="number" step="0.01" value={form.compareAtPrice} onChange={(v) => updateField('compareAtPrice', v)} />
            <Field label="Stock" type="number" value={form.stock} onChange={(v) => updateField('stock', v)} required />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => updateField('isFeatured', e.target.checked)} />
              Featured on homepage
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isActive} onChange={(e) => updateField('isActive', e.target.checked)} />
              Active (visible in the store)
            </label>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            Images <span className="normal-case font-normal text-slate-400">(alt text is required for every image)</span>
          </h2>
          {form.images.map((img, i) => (
            <div key={i} className="grid sm:grid-cols-[2fr,2fr,auto] gap-2 items-start">
              <input
                placeholder="Image URL"
                value={img.url}
                onChange={(e) => updateImage(i, 'url', e.target.value)}
                className="border border-slate-300 rounded px-3 py-2 text-sm"
              />
              <input
                placeholder="Alt text (describe the image)"
                value={img.alt}
                onChange={(e) => updateImage(i, 'alt', e.target.value)}
                className="border border-slate-300 rounded px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => removeImageRow(i)}
                className="text-rust-600 text-sm px-2 py-2"
                aria-label="Remove image row"
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addImageRow} className="text-sm text-pine-700 hover:underline">
            + Add another image
          </button>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide">SEO</h2>
          <Field
            label="Meta title (defaults to product name if left blank)"
            value={form.metaTitle}
            onChange={(v) => updateField('metaTitle', v)}
            maxLength={70}
          />
          <div>
            <label htmlFor="metaDescription" className="block text-sm text-slate-500 mb-1">
              Meta description
            </label>
            <textarea
              id="metaDescription"
              rows={2}
              maxLength={160}
              value={form.metaDescription}
              onChange={(e) => updateField('metaDescription', e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
            />
            <p className="text-xs text-slate-400 mt-1">{form.metaDescription.length}/160 characters</p>
          </div>
        </section>

        <button
          type="submit"
          disabled={submitting}
          className="bg-pine-700 hover:bg-pine-800 text-white px-6 py-2.5 rounded font-medium"
        >
          {submitting ? 'Saving...' : isNew ? 'Create product' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required, maxLength, step }) {
  return (
    <div>
      <label className="block text-sm text-slate-500 mb-1">{label}</label>
      <input
        type={type}
        step={step}
        required={required}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
      />
    </div>
  );
}
