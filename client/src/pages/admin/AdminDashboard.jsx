import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/apiService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const { data } = await apiClient.get('/orders?limit=5');
        setRecentOrders(data.orders || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecentOrders();
  }, []);

  return (
    <section className="space-y-6">
      <div className="app-card bg-gradient-to-br from-white/90 to-cyan-50/80 dark:from-slate-900/90 dark:to-cyan-950/30">
        <p className="app-kicker">Operations view</p>
        <h2 className="app-page-title mt-3">Admin dashboard</h2>
        <p className="mt-2 app-muted">Manage customers, orders, and services from one place.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="app-card">
          <p className="app-kicker">Total customers</p>
          <p className="mt-4 text-4xl font-bold text-slate-950 dark:text-white">{stats?.totalCustomers ?? '...'}</p>
        </div>
        <div className="app-card">
          <p className="app-kicker">Total orders</p>
          <p className="mt-4 text-4xl font-bold text-slate-950 dark:text-white">{stats?.totalOrders ?? '...'}</p>
        </div>
        <div className="app-card">
          <p className="app-kicker">Revenue</p>
          <p className="mt-4 text-4xl font-bold text-slate-950 dark:text-white">${stats?.revenue?.toFixed(2) ?? '...'}</p>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin/promo-codes" className="app-card hover:shadow-lg transition">
          <p className="app-kicker">🏷️</p>
          <h4 className="mt-2 font-semibold text-slate-950 dark:text-white">Promo Codes</h4>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Manage discounts and special offers</p>
        </Link>
        <Link to="/admin/promo-codes" className="app-card hover:shadow-lg transition">
          <p className="app-kicker">🏷️</p>
          <h4 className="mt-2 font-semibold text-slate-950 dark:text-white">Promo Codes</h4>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Manage discounts & promotions</p>
        </Link>
        <Link to="/admin/support" className="app-card hover:shadow-lg transition">
          <p className="app-kicker">💬</p>
          <h4 className="mt-2 font-semibold text-slate-950 dark:text-white">Support Tickets</h4>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Handle customer inquiries</p>
        </Link>
      </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="app-panel">
            <p className="text-sm text-slate-500 dark:text-slate-400">Orders this month</p>
            <p className="mt-4 text-3xl font-bold text-slate-950 dark:text-white">{stats?.monthlyOrders?.length ?? 0}</p>
          </div>
          <div className="app-panel">
            <p className="text-sm text-slate-500 dark:text-slate-400">Average order value</p>
            <p className="mt-4 text-3xl font-bold text-slate-950 dark:text-white">${stats?.revenue && stats.monthlyOrders ? (stats.revenue / Math.max(stats.monthlyOrders.length, 1)).toFixed(2) : '...'}</p>
          </div>
          <div className="app-panel">
            <p className="text-sm text-slate-500 dark:text-slate-400">Monthly trend</p>
            <p className="mt-4 text-3xl font-bold text-slate-950 dark:text-white">Insights</p>
          </div>
        </div>
        <div className="app-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-950 dark:text-white">Recent orders</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Latest orders placed by customers</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400">No recent orders available.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order._id} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">Order {order.orderNumber}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{order.customer?.name || 'Customer'} · {order.status}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">₱{order.totalAmount.toFixed(2)}</p>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{order.items?.length ?? 0} item(s) · {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
    </section>
  );
};

export default AdminDashboard;

