import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <SEO title="Create an account" path="/register" noindex />
      <h1 className="text-3xl mb-6">Create an account</h1>
      {error && <p className="text-rust-600 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm text-stone-500 mb-1">
            Name
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-stone-500 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm text-stone-500 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm"
          />
          <p className="text-xs text-stone-400 mt-1">At least 8 characters.</p>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-pine-700 hover:bg-pine-800 text-white px-6 py-2.5 rounded font-medium"
        >
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <p className="text-sm text-stone-500 mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-pine-700 underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
