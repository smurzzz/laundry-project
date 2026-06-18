import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const AdminRegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { registerAdmin } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      await registerAdmin({ ...form, email: form.email.toLowerCase() });
      toast.success('Admin account created');
      navigate('/admin/inventory');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="mx-auto max-w-xl py-6">
      <section className="app-card">
        <p className="app-kicker">Admin setup</p>
        <h1 className="app-page-title mt-3">Create admin account</h1>
        <p className="mt-2 app-muted">Create a new admin login for inventory, services, and analytics access.</p>
        <form className="mt-8 space-y-6" onSubmit={submitHandler}>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Full name
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="app-input mt-2" />
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="app-input mt-2" />
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Password
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="app-input mt-2" />
          </label>
          <button type="submit" className="app-button-primary w-full">Create admin</button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have admin access? <Link to="/admin/login" className="font-semibold text-cyan-600 hover:underline dark:text-cyan-300">Admin login</Link>
        </p>
      </section>
    </div>
  );
};

export default AdminRegisterPage;

