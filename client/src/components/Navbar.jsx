import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import MobileSidebar from './MobileSidebar';
import { Bars3Icon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import logo from '../assets/laundryLogo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/75 shadow-sm shadow-slate-900/5 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/75">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-cyan-50 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden">
              <Bars3Icon className="h-5 w-5" />
            </button>
            <Link to="/" className="group flex items-center gap-3">
              <img src={logo} alt="CleanWash Logo" className="h-12 w-12 transition group-hover:-translate-y-0.5" />
              <span>
                <span className="block text-base font-bold leading-tight text-slate-950 dark:text-white sm:text-lg">CleanWash</span>
                <span className="hidden text-xs font-medium text-slate-500 dark:text-slate-400 sm:block">Laundry Hub</span>
              </span>
            </Link>
          </div>
          <div className="hidden items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200 lg:flex">
            <button onClick={toggleTheme} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/75 px-3 py-2 shadow-sm transition hover:-translate-y-0.5 hover:bg-cyan-50 dark:border-white/10 dark:bg-slate-900/70 dark:hover:bg-slate-800">
              {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            {user ? (
              <>
                {user.role === 'admin' ? <Link className="rounded-2xl px-3 py-2 transition hover:bg-white/70 dark:hover:bg-white/10" to="/admin">Dashboard</Link> : <Link className="rounded-2xl px-3 py-2 transition hover:bg-white/70 dark:hover:bg-white/10" to="/customer">Dashboard</Link>}
                <button onClick={() => { logout(); navigate('/login'); }} className="app-button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="rounded-2xl px-3 py-2 transition hover:bg-white/70 dark:hover:bg-white/10" to="/login">Login</Link>
                <Link className="rounded-2xl px-3 py-2 transition hover:bg-white/70 dark:hover:bg-white/10" to="/admin/login">Admin Login</Link>
                <Link to="/register" className="app-button-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;

