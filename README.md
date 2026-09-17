# Trailhead Supply Co. -- full-stack e-commerce app

A working e-commerce example: React (Vite) storefront, a separate React (Vite)
admin dashboard, and a Node.js/Express/MongoDB API. Built around a concrete
niche (outdoor & camping gear) so every page has real content instead of
placeholder text.

```
trailhead-supply/
├── server/   # Node.js + Express + MongoDB REST API
├── client/   # Customer-facing storefront (React + Vite + Tailwind)
└── admin/    # Admin dashboard (React + Vite + Tailwind), separate app
```

## Quick start

You'll need Node.js 18+ and a MongoDB instance (local, or a free Atlas cluster).

```bash
# 1. Server
cd server
cp .env.example .env        # fill in MONGO_URI, JWT_SECRET, etc.
npm install
npm run seed                # loads realistic sample categories/products + an admin user
npm run dev                 # http://localhost:5000

# 2. Client (storefront) -- in a new terminal
cd client
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173

# 3. Admin -- in a new terminal
cd admin
cp .env.example .env
npm install
npm run dev                 # http://localhost:5174
```

The seed script prints a generated admin login (`admin@trailheadsupply.example.com`
/ `ChangeThisPassword123!`) -- **change that password immediately** if you
deploy this anywhere real.

## Where each requirement lives

| Requirement | Where |
|---|---|
| Meta descriptions | `client/src/components/SEO.jsx`, used on every page |
| Custom 404 page | `client/src/pages/NotFound.jsx` (see the caveat below about HTTP status) |
| Breadcrumbs | `client/src/components/Breadcrumbs.jsx` -- visible nav + `BreadcrumbList` JSON-LD |
| Alt text on images | `Product.images[].alt` and `Category.image.alt` are **required fields** in the Mongoose schema, and the admin product form refuses to save an image without one |
| Unique heading per page | Every page has exactly one `<h1>` specific to its content |
| Canonical tags | `SEO.jsx` sets `<link rel="canonical">` on every page |
| Structured data | `Organization`/`WebSite` (Home), `Product` (product page), `BreadcrumbList` (everywhere), `LocalBusiness` (Contact) |
| Unique page titles | `SEO.jsx` `title` prop, set per-page |
| Fix console errors | Centralized API error logging (`services/api.js`), `ErrorBoundary`, no missing `key`s/props |
| Remove prod source maps | `sourcemap: false` in both `client/vite.config.js` and `admin/vite.config.js` -- verified with a real build, see below |
| robots.txt | Dynamic: `GET /robots.txt` on the API (`server/src/controllers/seoController.js`). Static fallback in `client/public/robots.txt`. Admin has its own hard `Disallow: /` |
| llms.txt | Dynamic: `GET /llms.txt` on the API, static fallback in `client/public/llms.txt` |
| Local business schema | `LocalBusiness` JSON-LD on `client/src/pages/Contact.jsx` |
| Remove placeholder text | All seeded copy is real, specific product/category copy -- no lorem ipsum anywhere |
| Favicon | `client/public/favicon.svg` + `apple-touch-icon`/manifest references in `index.html` |
| sitemap.xml | Dynamic: `GET /sitemap.xml`, built from the live product/category collections so it's never stale |
| Social share images | Real generated `og-image.jpg` (1200x630) wired into `og:image`/`twitter:image` in `SEO.jsx` |
| Reduce huge JS bundles | Route-level `React.lazy` code-splitting (`App.jsx`) + manual vendor chunking (`vite.config.js`). Verified: largest chunk gzips to ~69KB, no chunk warnings |

## Honest caveats -- read before you call this "done"

I built and test-compiled all of this (both apps build cleanly with `npm run
build`, the server module loads and its schema validation was exercised
directly), but a few things are structurally true of this stack and worth
knowing:

1. **This is a client-rendered (CSR) React app, not server-rendered.** That
   matters for two of your items specifically:
   - **"Proper page sources"**: view-source on a CSR app shows an empty
     shell before JS runs. Search engines that execute JS (Google) handle
     this fine in practice; other crawlers and link-preview bots often
     don't. If that matters for your launch, add prerendering (e.g.
     `vite-plugin-ssr`, Next.js, or a prerender service) on top of this.
   - **Custom 404 page**: the component exists and is `noindex`ed, but
     because the server always returns `index.html` with an HTTP 200 for
     unmatched paths, you won't get a real `404` status code without
     configuring your host (or adding SSR) to return one.
2. **I have not run this against a live MongoDB instance in this session**
   (no database was reachable in the sandbox this was built in). I did
   validate the Mongoose schemas directly (slug generation, the required
   alt-text rule) and confirmed the Express app wires up without errors.
   Run `npm run seed` and click through it yourself before trusting it in
   production.
3. **Payment is stubbed.** Checkout supports "cash on delivery" or a
   placeholder "card" option with no real processor. Wire up Stripe/Adyen/etc.
   before taking real orders.
4. **Social share image and favicon are original placeholders I generated**,
   not stock art or a template -- but they're a starting brand, not your
   brand. Swap them for real ones before launch.
5. **"Make no mistakes" is a standard I can't fully certify for an app this
   size** -- I checked what's checkable without a live database and a
   deployed environment (both apps build clean, no console-breaking issues
   in manual review, schema rules verified), but I'd still want a second
   pass with real traffic, real Lighthouse/axe audits, and a security review
   before this touches production.

## Production checklist before going live

- Replace all `example.com` URLs (`SITE_URL`, business address/phone) with real values in both `.env` files and `SEO.jsx`/`Contact.jsx`.
- Put the API behind the same domain as the storefront (reverse proxy) so `/sitemap.xml`, `/robots.txt`, `/llms.txt` resolve at the site root.
- Run `npm audit` on all three apps and address anything that comes up in your current dependency tree.
- Add HTTPS, a real payment processor, and email sending (order confirmations, contact form).
- Run Lighthouse and an accessibility audit (axe) against the built client.
