import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const AdminLoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const loggedInUser = await login({ ...form, email: form.email.toLowerCase() });
      if (loggedInUser.role !== 'admin') {
        logout();
        toast.error('This account is not an admin account');
        return;
      }
      toast.success('Admin logged in successfully');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="mx-auto max-w-xl py-6">
      <section className="app-card">
        <p className="app-kicker">Admin access</p>
        <h1 className="app-page-title mt-3">Admin login</h1>
        <p className="mt-2 app-muted">Sign in with an admin account to manage services and reports.</p>
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
          <button type="submit" className="app-button-primary w-full">Open admin dashboard</button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          Need a new admin? <Link to="/admin/register" className="font-semibold text-cyan-600 hover:underline dark:text-cyan-300">Create admin account</Link>
        </p>
      </section>
    </div>
  );
};

export default AdminLoginPage;
