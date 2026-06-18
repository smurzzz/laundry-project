import { useEffect, useMemo, useState } from 'react';
import apiClient from '../../services/apiService';
import { toast } from 'react-toastify';

const emptyForm = { itemName: '', category: '', quantity: '', threshold: '', unit: '' };

const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [stockView, setStockView] = useState('All');

  const loadItems = async () => {
    try {
      const { data } = await apiClient.get('/inventory');
      setItems(data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const categories = useMemo(() => {
    const values = items.map((item) => item.category).filter(Boolean);
    return ['All', ...Array.from(new Set(values))];
  }, [items]);

  const lowStockItems = useMemo(() => items.filter((item) => item.quantity <= item.threshold), [items]);
  const totalQuantity = useMemo(() => items.reduce((sum, item) => sum + Number(item.quantity || 0), 0), [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = `${item.itemName} ${item.category} ${item.unit}`.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || item.category === category;
      const matchesStock = stockView === 'All' || item.quantity <= item.threshold;
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [items, search, category, stockView]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      quantity: Number(form.quantity),
      threshold: Number(form.threshold),
      unit: form.unit || 'pcs',
      category: form.category || 'Cleaning',
    };

    try {
      if (editingId) {
        const { data } = await apiClient.put(`/inventory/${editingId}`, payload);
        setItems((prev) => prev.map((item) => (item._id === editingId ? data : item)));
        toast.success('Inventory item updated');
      } else {
        const { data } = await apiClient.post('/inventory', payload);
        setItems((prev) => [data, ...prev]);
        toast.success('Item added');
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      itemName: item.itemName,
      category: item.category || '',
      quantity: String(item.quantity),
      threshold: String(item.threshold),
      unit: item.unit || '',
    });
  };

  const restockItem = async (item, amount) => {
    try {
      const { data } = await apiClient.put(`/inventory/${item._id}`, { quantity: item.quantity + amount });
      setItems((prev) => prev.map((current) => (current._id === item._id ? data : current)));
      toast.success(`${item.itemName} restocked`);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const deleteItem = async (item) => {
    if (!window.confirm(`Delete ${item.itemName}?`)) return;
    try {
      await apiClient.delete(`/inventory/${item._id}`);
      setItems((prev) => prev.filter((current) => current._id !== item._id));
      toast.success('Inventory item deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="app-card">
        <p className="app-kicker">Stock room</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="app-page-title">Inventory management</h2>
            <p className="mt-2 app-muted">Track supplies, stock levels, and low stock alerts for laundry operations.</p>
          </div>
          <button type="button" onClick={loadItems} className="app-button">
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="app-card">
          <p className="app-kicker">Items</p>
          <p className="mt-4 text-4xl font-bold text-slate-950 dark:text-white">{items.length}</p>
        </div>
        <div className="app-card">
          <p className="app-kicker">Total units</p>
          <p className="mt-4 text-4xl font-bold text-slate-950 dark:text-white">{totalQuantity}</p>
        </div>
        <div className="app-card">
          <p className="app-kicker">Low stock</p>
          <p className={`mt-4 text-4xl font-bold ${lowStockItems.length ? 'text-rose-600 dark:text-rose-300' : 'text-slate-950 dark:text-white'}`}>{lowStockItems.length}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="app-card">
          <h3 className="text-xl font-bold text-slate-950 dark:text-white">{editingId ? 'Edit inventory item' : 'Add inventory item'}</h3>
          <form className="mt-6 space-y-4" onSubmit={submitHandler}>
            <input value={form.itemName} onChange={(e) => setForm({ ...form, itemName: e.target.value })} placeholder="Item name" required disabled={Boolean(editingId)} className="app-input disabled:cursor-not-allowed disabled:opacity-60" />
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="app-input" />
            <div className="grid gap-4 sm:grid-cols-2">
              <input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} type="number" min="0" placeholder="Quantity" required className="app-input" />
              <input value={form.threshold} onChange={(e) => setForm({ ...form, threshold: e.target.value })} type="number" min="0" placeholder="Low stock threshold" required className="app-input" />
            </div>
            <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="Unit, e.g. bottles, kg, pcs" className="app-input" />
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="submit" disabled={saving} className="app-button-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add item'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="app-button flex-1">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="app-card">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">Inventory list</h3>
            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[560px]">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search item" className="app-input py-2.5" />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="app-input py-2.5">
                {categories.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
              <select value={stockView} onChange={(e) => setStockView(e.target.value)} className="app-input py-2.5">
                <option>All</option>
                <option>Low stock</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 space-y-3">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="h-24 animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800" />
              ))}
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {filteredItems.length === 0 ? (
                <p className="app-muted">No inventory items match your filters.</p>
              ) : (
                filteredItems.map((item) => {
                  const lowStock = item.quantity <= item.threshold;
                  return (
                    <div key={item._id} className={`rounded-2xl border p-4 transition duration-200 hover:-translate-y-0.5 ${lowStock ? 'border-rose-300 bg-rose-50/90 dark:border-rose-700 dark:bg-rose-950/40' : 'border-slate-200 bg-slate-50/80 dark:border-white/10 dark:bg-slate-950/45'}`}>
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-bold text-slate-950 dark:text-white">{item.itemName}</p>
                            {lowStock && <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-rose-700 dark:bg-rose-400/15 dark:text-rose-200">Low stock</span>}
                          </div>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.category || 'Uncategorized'} · threshold {item.threshold} {item.unit}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white px-3 py-1.5 text-sm font-bold text-slate-800 shadow-sm dark:bg-slate-900 dark:text-slate-100">{item.quantity} {item.unit}</span>
                          <button type="button" onClick={() => restockItem(item, 5)} className="rounded-2xl bg-cyan-100 px-3 py-2 text-sm font-bold text-cyan-700 transition hover:bg-cyan-200 dark:bg-cyan-400/15 dark:text-cyan-200">+5</button>
                          <button type="button" onClick={() => restockItem(item, 10)} className="rounded-2xl bg-cyan-100 px-3 py-2 text-sm font-bold text-cyan-700 transition hover:bg-cyan-200 dark:bg-cyan-400/15 dark:text-cyan-200">+10</button>
                          <button type="button" onClick={() => startEdit(item)} className="rounded-2xl bg-slate-950 px-3 py-2 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950">Edit</button>
                          <button type="button" onClick={() => deleteItem(item)} className="rounded-2xl bg-rose-100 px-3 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-200 dark:bg-rose-400/15 dark:text-rose-200">Delete</button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;

