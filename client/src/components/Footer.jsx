import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-pine-900 text-stone-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <h2 className="text-stone-50 text-base mb-3">Trailhead Supply Co.</h2>
          <p className="text-sm text-stone-300 max-w-xs">
            Tents, packs, cook systems, footwear and trail apparel, tested on real trips before they reach the shop.
          </p>
        </div>
        <div>
          <h2 className="text-stone-50 text-base mb-3">Shop</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/products" className="text-stone-300 hover:text-gold-400">
                All products
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-stone-300 hover:text-gold-400">
                About us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-stone-300 hover:text-gold-400">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-stone-50 text-base mb-3">Visit or write to us</h2>
          <address className="not-italic text-sm text-stone-300 space-y-1">
            <p>118 Timberline Ave, Bend, OR 97701</p>
            <p>
              <a href="tel:+15550102938" className="hover:text-gold-400">
                (555) 010-2938
              </a>
            </p>
            <p>
              <a href="mailto:hello@trailheadsupply.example.com" className="hover:text-gold-400">
                hello@trailheadsupply.example.com
              </a>
            </p>
          </address>
        </div>
      </div>
      <div className="border-t border-pine-800 px-4 sm:px-6 py-4 text-xs text-stone-400 max-w-6xl mx-auto">
        &copy; {new Date().getFullYear()} Trailhead Supply Co. All rights reserved.
      </div>
    </footer>
  );
}
