import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/products', label: 'Products' },
  { to: '/categories', label: 'Categories' },
  { to: '/orders', label: 'Orders' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-pine-900 text-slate-100 flex flex-col shrink-0">
        <div className="px-5 py-4 border-b border-pine-800">
          <p className="font-medium text-slate-50">Trailhead Admin</p>
          <p className="text-xs text-slate-400 truncate">{user?.email}</p>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1" aria-label="Admin sections">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded text-sm ${
                  isActive ? 'bg-pine-700 text-white' : 'text-slate-200 hover:bg-pine-800'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-2 py-4 border-t border-pine-800">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded text-sm text-slate-200 hover:bg-pine-800"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
