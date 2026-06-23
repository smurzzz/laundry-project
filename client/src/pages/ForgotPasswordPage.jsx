import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPasswordRequest } from '../services/authService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await forgotPasswordRequest({ email: email.toLowerCase() });
      setMessage(response.message);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl py-6">
      <section className="app-card">
        <p className="app-kicker">Password help</p>
        <h1 className="app-page-title mt-3">Forgot your password?</h1>
        <p className="mt-2 app-muted">Enter your email and we'll send you a secure reset link.</p>
        <form className="mt-8 space-y-6" onSubmit={submitHandler}>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="app-input mt-2"
              placeholder="you@example.com"
            />
          </label>
          <button type="submit" disabled={isSubmitting} className="app-button-primary w-full disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting ? 'Sending link...' : 'Send reset link'}
          </button>
        </form>
        {message ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">{message}</p> : null}
        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          Remembered it? <Link to="/login" className="font-semibold text-cyan-600 hover:underline dark:text-cyan-300">Back to login</Link>
        </p>
      </section>
    </div>
  );
};

export default ForgotPasswordPage;
