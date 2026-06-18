import { useEffect, useState } from 'react';
import apiClient from '../../services/apiService';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await apiClient.get('/users/profile');
        setProfile(data);
        setForm({ name: data.name, phone: data.phone || '', address: data.address || '' });
      } catch (error) {
        console.error(error);
      }
    };
    loadProfile();
  }, []);

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      await apiClient.put('/users/profile', form);
      toast.success('Profile saved');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/95">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Profile management</h2>
      <p className="mt-2 text-slate-500 dark:text-slate-400">Update your customer details and profile photo.</p>
      <form className="mt-8 space-y-6" onSubmit={submitHandler}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Full name
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Phone
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Address
          <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows="3" className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
        </label>
        <button type="submit" className="rounded-2xl bg-sky-600 px-5 py-3 text-white transition hover:bg-sky-500">Save changes</button>
      </form>
    </div>
  );
};

export default ProfilePage;

