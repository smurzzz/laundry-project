import { useEffect, useState } from 'react';
import apiClient from '../../services/apiService';
import { toast } from 'react-toastify';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', category: 'Wash', description: '', price: '', duration: '', options: [{ name: '', priceAdjustment: 0, description: '' }] });

  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data } = await apiClient.get('/services');
        setServices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const options = form.options.filter((option) => option.name.trim());
      const { data } = await apiClient.post('/services', { ...form, price: Number(form.price), options });
      setServices((prev) => [data, ...prev]);
      toast.success('Service added');
      setForm({ name: '', category: 'Wash', description: '', price: '', duration: '', options: [{ name: '', priceAdjustment: 0, description: '' }] });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="app-card">
        <p className="app-kicker">Catalog control</p>
        <h2 className="app-page-title mt-3">Service catalog</h2>
        <p className="mt-2 app-muted">Create and manage Wash, Dry, Fold, Iron, and Express services.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="app-card">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Add new service</h3>
          <form className="mt-6 space-y-4" onSubmit={submitHandler}>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Service name" required className="app-input" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows="3" className="app-input" />
            <div className="grid gap-4 sm:grid-cols-3">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="app-input">
                <option value="Wash">Wash</option>
                <option value="Dry Clean">Dry Clean</option>
                <option value="Iron">Iron</option>
                <option value="Express">Express</option>
                <option value="Special">Special</option>
              </select>
              <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" type="number" step="0.01" required className="app-input" />
              <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="Duration" required className="app-input" />
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Service choices</h4>
              {form.options.map((option, idx) => (
                <div key={idx} className="grid gap-3 sm:grid-cols-[1fr_150px]">
                  <input value={option.name} onChange={(e) => {
                    const next = [...form.options];
                    next[idx].name = e.target.value;
                    setForm({ ...form, options: next });
                  }} placeholder="Option name" className="app-input" />
                  <input value={option.priceAdjustment} onChange={(e) => {
                    const next = [...form.options];
                    next[idx].priceAdjustment = Number(e.target.value);
                    setForm({ ...form, options: next });
                  }} placeholder="Price adj." type="number" step="0.01" className="app-input" />
                  <input value={option.description} onChange={(e) => {
                    const next = [...form.options];
                    next[idx].description = e.target.value;
                    setForm({ ...form, options: next });
                  }} placeholder="Option description" className="app-input sm:col-span-2" />
                </div>
              ))}
              <button type="button" className="app-button-secondary" onClick={() => setForm({ ...form, options: [...form.options, { name: '', priceAdjustment: 0, description: '' }] })}>Add choice</button>
            </div>
            <button type="submit" className="app-button-primary">Save service</button>
          </form>
        </div>
        <div className="app-card">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Service list</h3>
          {loading ? (
            <div className="mt-6 space-y-3">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="h-16 animate-pulse rounded-3xl bg-slate-200/80 dark:bg-slate-800" />
              ))}
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {services.map((service) => (
                <div key={service._id} className="app-panel">
                  <p className="font-semibold text-slate-900 dark:text-white">{service.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{service.category} · ${service.price.toFixed(2)} · {service.duration}</p>
                  {service.options?.length > 0 && (
                    <div className="mt-3 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-950/10 dark:text-slate-300">
                      <p className="font-semibold">Choices</p>
                      {service.options.map((option, idx) => (
                        <p key={idx} className="leading-6">{option.name} {option.priceAdjustment !== 0 ? `(+${option.priceAdjustment.toFixed(2)})` : ''} — {option.description}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;

