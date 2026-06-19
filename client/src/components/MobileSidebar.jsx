import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { XMarkIcon } from '@heroicons/react/24/outline';

const MobileSidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const customerLinks = [
    { to: '/customer', label: 'Overview' },
    { to: '/customer/create-order', label: 'Create Order' },
    { to: '/customer/orders', label: 'Order History' },
    { to: '/customer/profile', label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Overview' },
    { to: '/admin/orders', label: 'Orders' },
    { to: '/admin/services', label: 'Services' },
    { to: '/admin/promo-codes', label: 'Promo Codes' },
  ];

  const links = user?.role === 'admin' ? adminLinks : customerLinks;

  return (
    <div className={`fixed inset-0 z-50 transform bg-slate-950/55 backdrop-blur-sm transition duration-300 ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
      <div className={`absolute right-0 top-0 h-full w-80 max-w-[86vw] border-l border-white/20 bg-white/90 p-6 shadow-2xl backdrop-blur-2xl transition duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} dark:bg-slate-950/90`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-950 dark:text-white">Menu</h3>
          <button onClick={onClose} aria-label="Close menu" className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-cyan-50 dark:bg-slate-800 dark:text-slate-200">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-6 space-y-3">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={onClose} className={({ isActive }) => `block rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'text-slate-700 hover:bg-white/80 dark:text-slate-200 dark:hover:bg-white/10'}`}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileSidebar;

