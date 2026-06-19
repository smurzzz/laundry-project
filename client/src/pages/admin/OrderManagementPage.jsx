import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/apiService';
import { toast } from 'react-toastify';

const statusOptions = [
  'Pending',
  'Confirmed',
  'Washing',
  'Drying',
  'Folding',
  'Ready for Pickup',
  'Out for Delivery',
  'Completed',
  'Cancelled',
];

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Washing: 'bg-violet-100 text-violet-800',
  Drying: 'bg-purple-100 text-purple-800',
  Folding: 'bg-sky-100 text-sky-800',
  'Ready for Pickup': 'bg-emerald-100 text-emerald-800',
  'Out for Delivery': 'bg-cyan-100 text-cyan-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await apiClient.get('/orders');
      setOrders(data.orders || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    if (!newStatus) return;
    setUpdating(orderId);
    try {
      const { data } = await apiClient.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) => prev.map((order) => (order._id === orderId ? data : order)));
      toast.success(`Order ${data.orderNumber} updated to ${data.status}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => filter === 'All' || order.status === filter);
  }, [orders, filter]);

  return (
    <section className="space-y-6">
      <div className="app-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="app-kicker">Order control</p>
            <h2 className="app-page-title mt-3">Admin order management</h2>
            <p className="mt-2 app-muted">Review pending orders and confirm, cancel, or advance the status of any order.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/admin" className="app-button">Back to dashboard</Link>
            <button type="button" onClick={fetchOrders} className="app-button-primary">Refresh</button>
          </div>
        </div>
      </div>

      <div className="app-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Filter orders</p>
            <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">Showing {filteredOrders.length} of {orders.length} orders</p>
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="app-input max-w-xs">
            <option value="All">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="app-card space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="h-28 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="app-card text-center">
          <p className="text-slate-600 dark:text-slate-400">No orders match the selected status.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="app-panel">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold text-slate-950 dark:text-white">Order {order.orderNumber}</p>
                    <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ${statusColors[order.status] || 'bg-slate-100 text-slate-800'}`}>{order.status}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{order.customer?.name || 'Unknown customer'} · {order.items?.length || 0} item(s)</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Placed {new Date(order.createdAt).toLocaleString()}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pickup: {order.pickupType || 'Pickup'} · Address: {order.deliveryAddress || 'N/A'}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-[1fr_auto] lg:items-end">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    disabled={updating === order._id}
                    className="app-input"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => updateStatus(order._id, order.status)}
                    disabled={updating === order._id}
                    className="app-button-primary"
                  >
                    {updating === order._id ? 'Saving...' : 'Update status'}
                  </button>
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/40">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Customer email</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{order.customer?.email || '—'}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/40">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Order total</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">₱{order.totalAmount?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/40">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Estimated delivery</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleString() : 'Not scheduled'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default OrderManagementPage;
