import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPasswordRequest } from '../services/authService';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await resetPasswordRequest(token, { password: form.password });
      toast.success(response.message || 'Password updated successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl py-6">
      <section className="app-card">
        <p className="app-kicker">Secure reset</p>
        <h1 className="app-page-title mt-3">Choose a new password</h1>
        <p className="mt-2 app-muted">This link can only be used once and expires after 30 minutes.</p>
        <form className="mt-8 space-y-6" onSubmit={submitHandler}>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            New password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="app-input mt-2"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Confirm new password
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
              className="app-input mt-2"
            />
          </label>
          <button type="submit" disabled={isSubmitting} className="app-button-primary w-full disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting ? 'Updating password...' : 'Update password'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          Need another link? <Link to="/forgot-password" className="font-semibold text-cyan-600 hover:underline dark:text-cyan-300">Request a new one</Link>
        </p>
      </section>
    </div>
  );
};

export default ResetPasswordPage;
