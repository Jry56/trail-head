import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
      {/*
        Note: because this is a client-rendered SPA, the browser still gets an
        HTTP 200 for unmatched routes (the server always returns index.html).
        For a real 404 status code, configure your host to return 404 for
        unmatched paths, or move this route to a server-rendered/prerendered
        setup. This component still gives crawlers and users a clear,
        noindexed "not found" page either way.
      */}
      <SEO title="Page not found" path="/404" noindex />
      <p className="text-gold-500 font-display text-sm tracking-wide mb-2">404</p>
      <h1 className="text-3xl mb-3">We couldn't find that trail.</h1>
      <p className="text-stone-500 mb-8 max-w-prose mx-auto">
        The page you're looking for may have moved or no longer exists. Try heading back to the shop, or search for
        what you need.
      </p>
      <div className="flex justify-center gap-4">
        <Link to="/" className="bg-pine-700 hover:bg-pine-800 text-white px-6 py-3 rounded font-medium">
          Go home
        </Link>
        <Link to="/products" className="border border-stone-300 hover:border-pine-400 px-6 py-3 rounded font-medium">
          Shop all gear
        </Link>
      </div>
    </div>
  );
}
