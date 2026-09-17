import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

const emptyAddress = {
  fullName: '',
  line1: '',
  line2: '',
  city: '',
  region: '',
  postalCode: '',
  country: 'US',
  phone: '',
};

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = Math.round(subtotal * 0.075 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <SEO title="Checkout" path="/checkout" noindex />
        <h1 className="text-2xl mb-3">Log in to check out</h1>
        <p className="text-stone-500 mb-6">You'll need an account so we can attach this order to you.</p>
        <Link to="/login?next=/checkout" className="bg-pine-700 text-white px-6 py-3 rounded inline-block">
          Log in
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <SEO title="Checkout" path="/checkout" noindex />
        <h1 className="text-2xl mb-3">Your cart is empty</h1>
        <Link to="/products" className="text-pine-700 underline">
          Browse products
        </Link>
      </div>
    );
  }

  const handleChange = (e) => setAddress((a) => ({ ...a, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post('/orders', {
        items: items.map((i) => ({ product: i.product, qty: i.qty })),
        shippingAddress: address,
        paymentMethod,
      });
      clearCart();
      navigate(`/account/orders/${res.data.order._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <SEO title="Checkout" path="/checkout" noindex />
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Cart', path: '/cart' }, { label: 'Checkout' }]} />
      <h1 className="text-3xl mt-3 mb-6">Checkout</h1>

      <div className="grid sm:grid-cols-3 gap-10">
        <form onSubmit={handleSubmit} className="sm:col-span-2 space-y-4">
          <h2 className="text-lg">Shipping address</h2>
          {error && <p className="text-rust-600 text-sm">{error}</p>}

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full name" name="fullName" value={address.fullName} onChange={handleChange} required />
            <Field label="Phone" name="phone" value={address.phone} onChange={handleChange} />
          </div>
          <Field label="Address line 1" name="line1" value={address.line1} onChange={handleChange} required />
          <Field label="Address line 2 (optional)" name="line2" value={address.line2} onChange={handleChange} />
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="City" name="city" value={address.city} onChange={handleChange} required />
            <Field label="State / region" name="region" value={address.region} onChange={handleChange} required />
            <Field label="Postal code" name="postalCode" value={address.postalCode} onChange={handleChange} required />
          </div>
          <Field label="Country" name="country" value={address.country} onChange={handleChange} required />

          <div>
            <label htmlFor="paymentMethod" className="block text-sm text-stone-500 mb-1">
              Payment method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm"
            >
              <option value="cash_on_delivery">Cash on delivery</option>
              <option value="card">Card (demo -- no real payment processor wired up)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto bg-rust-500 hover:bg-rust-600 text-white px-8 py-3 rounded font-medium"
          >
            {submitting ? 'Placing order...' : 'Place order'}
          </button>
        </form>

        <aside className="border border-stone-200 rounded p-5 h-fit">
          <h2 className="text-lg mb-4">Order summary</h2>
          <ul className="space-y-2 text-sm mb-4">
            {items.map((item) => (
              <li key={item.product} className="flex justify-between">
                <span>
                  {item.name} &times; {item.qty}
                </span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-stone-200 pt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-base pt-2 border-t border-stone-200">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, required }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm text-stone-500 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-stone-300 rounded px-3 py-2 text-sm"
      />
    </div>
  );
}
