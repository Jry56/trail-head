import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/products?search=${encodeURIComponent(query.trim())}` : '/products');
    setMenuOpen(false);
  };

  return (
    <header className="bg-pine-900 text-stone-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
            <rect width="64" height="64" rx="12" fill="#1c3524" />
            <path d="M8 46 L24 20 L32 32 L40 16 L58 46 Z" fill="#f2f6f3" />
            <path d="M24 20 L28 26 L20 26 Z" fill="#c9a227" />
          </svg>
          <span className="font-display text-lg tracking-tight text-stone-50">Trailhead</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 ml-4" aria-label="Primary">
          <Link to="/products" className="text-stone-100 hover:text-gold-400">
            Shop all
          </Link>
          <Link to="/about" className="text-stone-100 hover:text-gold-400">
            About
          </Link>
          <Link to="/contact" className="text-stone-100 hover:text-gold-400">
            Contact
          </Link>
        </nav>

        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md ml-auto" role="search">
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          <input
            id="site-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tents, packs, boots..."
            className="w-full rounded-l px-3 py-1.5 text-stone-900 text-sm"
          />
          <button type="submit" className="bg-rust-500 hover:bg-rust-600 px-3 rounded-r text-sm font-medium">
            Search
          </button>
        </form>

        <div className="flex items-center gap-4 ml-auto sm:ml-0">
          {user ? (
            <div className="hidden sm:flex items-center gap-3 text-sm">
              <Link to="/account/orders" className="hover:text-gold-400">
                My orders
              </Link>
              {user.role === 'admin' && (
                <a
                  href={import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174'}
                  className="hover:text-gold-400"
                >
                  Admin
                </a>
              )}
              <button onClick={logout} className="hover:text-gold-400">
                Log out
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:inline hover:text-gold-400 text-sm">
              Log in
            </Link>
          )}

          <Link to="/cart" className="relative" aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 4h2l2.4 12.2A2 2 0 0 0 9.36 18h7.28a2 2 0 0 0 1.96-1.6L20 8H6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="21" r="1.4" fill="currentColor" />
              <circle cx="17" cy="21" r="1.4" fill="currentColor" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-rust-500 text-white text-[11px] leading-none rounded-full h-4 w-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-pine-800 px-4 py-3 flex flex-col gap-3">
          <form onSubmit={handleSearch} role="search">
            <label htmlFor="site-search-mobile" className="sr-only">
              Search products
            </label>
            <input
              id="site-search-mobile"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded px-3 py-1.5 text-stone-900 text-sm"
            />
          </form>
          <Link to="/products" onClick={() => setMenuOpen(false)}>
            Shop all
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
          {user ? (
            <>
              <Link to="/account/orders" onClick={() => setMenuOpen(false)}>
                My orders
              </Link>
              <button onClick={logout} className="text-left">
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Log in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
