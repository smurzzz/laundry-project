import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArchiveBoxIcon, ChartBarSquareIcon, ClipboardDocumentListIcon, HomeIcon, PlusCircleIcon, Squares2X2Icon, UserCircleIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user } = useAuth();
  const customerLinks = [
    { to: '/customer', label: 'Overview', icon: HomeIcon },
    { to: '/customer/create-order', label: 'Create Order', icon: PlusCircleIcon },
    { to: '/customer/orders', label: 'Order History', icon: ClipboardDocumentListIcon },
    { to: '/customer/profile', label: 'Profile', icon: UserCircleIcon },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Overview', icon: ChartBarSquareIcon },
    { to: '/admin/orders', label: 'Orders', icon: ClipboardDocumentListIcon },
    { to: '/admin/services', label: 'Services', icon: WrenchScrewdriverIcon },
    { to: '/admin/promo-codes', label: 'Promo Codes', icon: ClipboardDocumentListIcon },
  ];

  const links = user?.role === 'admin' ? adminLinks : customerLinks;

  return (
    <aside className="app-surface sticky top-20 z-10 hidden h-[calc(100vh-5rem)] overflow-hidden rounded-[1.5rem] p-5 lg:block">
      <div className="mb-6">
        <p className="app-kicker">Navigation</p>
        <h2 className="mt-3 text-xl font-bold text-slate-950 dark:text-white">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user?.role === 'admin' ? 'Operations control' : 'Your laundry flow'}</p>
      </div>
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon || Squares2X2Icon;
          return (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200 ${isActive ? 'bg-slate-950 text-white shadow-lg shadow-slate-900/15 dark:bg-white dark:text-slate-950' : 'text-slate-600 hover:-translate-y-0.5 hover:bg-white/80 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'}`
            }
          >
            <Icon className="h-5 w-5" />
            {link.label}
          </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

