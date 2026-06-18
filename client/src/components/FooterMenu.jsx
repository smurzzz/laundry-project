import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FooterMenu = () => {
  const { user } = useAuth();
  if (!user) return null;

  const customerLinks = [
    { to: '/customer', label: 'Home' },
    { to: '/customer/create-order', label: 'Create' },
    { to: '/customer/orders', label: 'Orders' },
    { to: '/customer/profile', label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Home' },
    { to: '/admin/services', label: 'Services' },
    { to: '/admin/inventory', label: 'Inventory' },
  ];

  const links = user.role === 'admin' ? adminLinks : customerLinks;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/60 bg-white/80 px-4 py-3 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/80 lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-3xl border border-white/70 bg-white/70 p-1.5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `flex-1 rounded-2xl px-3 py-2.5 text-center text-xs font-bold transition ${isActive ? 'bg-slate-950 text-white shadow-lg shadow-slate-900/15 dark:bg-white dark:text-slate-950' : 'text-slate-600 hover:bg-cyan-50 dark:text-slate-300 dark:hover:bg-white/10'}`}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </footer>
  );
};

export default FooterMenu;

