import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      await register({ ...form, email: form.email.toLowerCase() });
      toast.success('Account created successfully');
      navigate('/customer');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="mx-auto max-w-xl py-6">
      <section className="app-card">
      <p className="app-kicker">Join CleanWash</p>
      <h1 className="app-page-title mt-3">Create your account</h1>
      <p className="mt-2 app-muted">Start booking laundry services and tracking your orders in one place.</p>
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
          Phone
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="app-input mt-2"
            placeholder="0917 123 4567"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Password
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="app-input mt-2" />
        </label>
        <button type="submit" className="app-button-primary w-full">Create account</button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account? <Link to="/login" className="font-semibold text-cyan-600 hover:underline dark:text-cyan-300">Login</Link>
      </p>
      </section>
    </div>
  );
};

export default RegisterPage;
