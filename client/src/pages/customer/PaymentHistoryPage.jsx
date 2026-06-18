import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('cw_token')}` },
      });
      setPayments(response.data || []);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch payment history');
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (filter === 'paid') return p.paymentStatus === 'paid';
    if (filter === 'pending') return p.paymentStatus === 'pending';
    return true;
  });

  const totalSpent = payments.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const totalOrders = payments.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Payment History</h2>
        <p className="text-slate-600 dark:text-slate-400">View and manage your payment records</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">Total Spent</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">Total Orders</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{totalOrders}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">Average Order</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">${(totalSpent / (totalOrders || 1)).toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'paid', 'pending'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === f
                ? 'bg-sky-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Payment List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-sky-500"></div>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <p className="text-slate-600 dark:text-slate-400">No payments found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">#{payment._id?.slice(-6)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">${payment.totalAmount?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {payment.paymentStatus}
                    </span>
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

export default PaymentHistoryPage;

