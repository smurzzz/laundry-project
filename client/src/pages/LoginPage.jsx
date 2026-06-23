import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const loggedInUser = await login({ ...form, email: form.email.toLowerCase() });
      toast.success('Logged in successfully');
      navigate(loggedInUser.role === 'admin' ? '/admin' : '/customer');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-6 py-6 lg:grid-cols-[1fr_0.86fr] lg:items-stretch">
      <section className="app-card flex min-h-[420px] flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 to-cyan-950 text-white dark:from-slate-900 dark:to-cyan-950">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">Laundry made calm</p>
          <h1 className="mt-5 max-w-xl text-4xl font-bold leading-tight sm:text-5xl">Clean orders, quick tracking, smoother days.</h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-cyan-50/75">Manage pickups, delivery notes, invoices, and status updates from one polished workspace.</p>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {['Track', 'Schedule', 'Receive'].map((item) => (
            <div key={item} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm font-semibold">{item}</p>
              <p className="mt-1 text-xs text-cyan-50/65">Order flow</p>
            </div>
          ))}
        </div>
      </section>
      <section className="app-card">
      <h1 className="app-page-title">Welcome back</h1>
      <p className="mt-2 app-muted">Sign in to manage your laundry orders, track status, and receive alerts.</p>
      <form className="mt-8 space-y-6" onSubmit={submitHandler}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Email
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="app-input mt-2" />
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Password
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="app-input mt-2" />
        </label>
        <div className="text-right text-sm">
          <Link to="/forgot-password" className="font-semibold text-cyan-600 hover:underline dark:text-cyan-300">
            Forgot password?
          </Link>
        </div>
        <button type="submit" className="app-button-primary w-full">Sign in</button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
        New to CleanWash? <Link to="/register" className="font-semibold text-cyan-600 hover:underline dark:text-cyan-300">Create an account</Link>
      </p>
      </section>
    </div>
  );
};

export default LoginPage;
