import { useState } from 'react';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.trailheadsupply.example.com').replace(/\/$/, '');

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo-only: no email backend is wired up in this scaffold. Point this at
    // a real transactional email service (or POST /api/contact once you add
    // that endpoint) before going live.
    setSent(true);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Trailhead Supply Co.',
    url: SITE_URL,
    image: `${SITE_URL}/og-image.jpg`,
    telephone: '+1-555-010-2938',
    email: 'hello@trailheadsupply.example.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '118 Timberline Ave',
      addressLocality: 'Bend',
      addressRegion: 'OR',
      postalCode: '97701',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 44.0582,
      longitude: -121.3153,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <SEO
        title="Contact us"
        description="Reach Trailhead Supply Co. by phone, email, or in person at our Bend, Oregon storefront."
        path="/contact"
        jsonLd={jsonLd}
      />
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Contact' }]} />
      <h1 className="text-3xl mt-3 mb-6">Contact us</h1>

      <div className="grid sm:grid-cols-2 gap-10">
        <div>
          <h2 className="text-lg mb-2">Storefront</h2>
          <address className="not-italic text-stone-700 text-sm space-y-1 mb-6">
            <p>118 Timberline Ave, Bend, OR 97701</p>
            <p>Monday-Friday, 9am-5pm</p>
          </address>
          <p className="text-sm text-stone-700">
            <a href="tel:+15550102938" className="text-pine-700 underline">
              (555) 010-2938
            </a>
          </p>
          <p className="text-sm text-stone-700 mt-1">
            <a href="mailto:hello@trailheadsupply.example.com" className="text-pine-700 underline">
              hello@trailheadsupply.example.com
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg mb-2">Send a message</h2>
          {sent && <p className="text-pine-700 text-sm">Thanks -- we'll get back to you within a business day.</p>}
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
            <label htmlFor="message" className="block text-sm text-stone-500 mb-1">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <button type="submit" className="bg-pine-700 hover:bg-pine-800 text-white px-6 py-2.5 rounded font-medium">
            Send message
          </button>
        </form>
      </div>
    </div>
  );
}
