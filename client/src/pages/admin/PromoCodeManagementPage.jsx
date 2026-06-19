import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { toast } from 'react-toastify';

const PromoCodeManagementPage = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    discountType: 'percentage',
    maxUses: '',
    minOrderValue: 0,
    validFrom: '',
    validUntil: '',
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const response = await axios.get(API_BASE_URL + '/promo-codes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('cw_token')}` },
      });
      setPromoCodes(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch promo codes');
      setLoading(false);
    }
  };

  const handleCreatePromoCode = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_BASE_URL + '/promo-codes', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('cw_token')}` },
      });
      toast.success('Promo code created');
      setFormData({
        code: '',
        discount: '',
        discountType: 'percentage',
        maxUses: '',
        minOrderValue: 0,
        validFrom: '',
        validUntil: '',
      });
      setShowForm(false);
      fetchPromoCodes();
    } catch (error) {
      toast.error('Failed to create promo code');
    }
  };

  const handleToggleActive = async (id, currentActive) => {
    try {
      await axios.patch(
        `${API_BASE_URL}`/promo-codes/${id}`,
        { active: !currentActive },
        { headers: { Authorization: `Bearer ${localStorage.getItem('cw_token')}` } }
      );
      fetchPromoCodes();
      toast.success('Promo code updated');
    } catch (error) {
      toast.error('Failed to update promo code');
    }
  };

  const handleDeletePromoCode = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_BASE_URL}`/promo-codes/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('cw_token')}` },
        });
        fetchPromoCodes();
        toast.success('Promo code deleted');
      } catch (error) {
        toast.error('Failed to delete promo code');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Promo Code Management</h2>
          <p className="text-slate-600 dark:text-slate-400">Create and manage promotional codes</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-500 transition"
        >
          New Promo Code
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Create Promo Code</h3>
          <form onSubmit={handleCreatePromoCode} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="SUMMER2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Discount</label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                required
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Type</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Max Uses</label>
              <input
                type="number"
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Valid From</label>
              <input
                type="datetime-local"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                required
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Valid Until</label>
              <input
                type="datetime-local"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                required
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="flex-1 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-500 transition">
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-2 rounded-lg hover:bg-slate-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Promo Codes List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-sky-500"></div>
        </div>
      ) : promoCodes.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <p className="text-slate-600 dark:text-slate-400">No promo codes yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Code</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Discount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Uses</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Valid Until</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {promoCodes.map((promo) => (
                <tr key={promo._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{promo.code}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                    {promo.discount}{promo.discountType === 'percentage' ? '%' : '$'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                    {promo.currentUses}/{promo.maxUses || '∞'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(promo.validUntil).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        promo.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {promo.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <button
                      onClick={() => handleToggleActive(promo._id, promo.active)}
                      className="text-sky-600 hover:underline"
                    >
                      {promo.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleDeletePromoCode(promo._id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PromoCodeManagementPage;

