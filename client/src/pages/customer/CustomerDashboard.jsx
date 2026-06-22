import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/apiService';

const CustomerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await apiClient.get('/orders');
        setOrders(data.orders || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <section className="space-y-6">
      <div className="app-card bg-gradient-to-br from-white/90 to-cyan-50/80 dark:from-slate-900/90 dark:to-cyan-950/30">
        <p className="app-kicker">Customer workspace</p>
        <h2 className="app-page-title mt-3">Customer dashboard</h2>
        <p className="mt-2 app-muted">View your recent orders, manage your profile, and request new laundry services.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/customer/tracking" className="app-card hover:shadow-lg transition">
          <p className="app-kicker">Tracking</p>
          <h4 className="mt-2 font-semibold text-slate-950 dark:text-white">Order Tracking</h4>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Track your orders in real-time</p>
        </Link>
        <Link to="/customer/ratings" className="app-card hover:shadow-lg transition">
          <p className="app-kicker">Ratings</p>
          <h4 className="mt-2 font-semibold text-slate-950 dark:text-white">Service Ratings</h4>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Rate your laundry services</p>
        </Link>
        <Link to="/customer/support" className="app-card hover:shadow-lg transition">
          <p className="app-kicker">Support</p>
          <h4 className="mt-2 font-semibold text-slate-950 dark:text-white">Support</h4>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Get customer support help</p>
        </Link>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="app-card">
          <p className="app-kicker">Current orders</p>
          <p className="mt-4 text-4xl font-bold text-slate-950 dark:text-white">{orders.length}</p>
        </div>
        <div className="app-card">
          <p className="app-kicker">Active status</p>
          <p className="mt-4 text-3xl font-bold text-slate-950 dark:text-white">Tracking enabled</p>
        </div>
        <div className="app-card">
          <p className="app-kicker">Invoice downloads</p>
          <p className="mt-4 text-3xl font-bold text-slate-950 dark:text-white">Available</p>
        </div>
      </div>

      <div className="app-card">
        <h3 className="text-xl font-bold text-slate-950 dark:text-white">Recent Orders</h3>
        {loading ? (
          <div className="mt-6 space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800" />
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400">No recent orders yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="app-panel">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-semibold text-slate-950 dark:text-white">Order {order.orderNumber}</p>
                    <span className="w-fit rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200">
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Total: ₱{order.totalAmount.toFixed(2)}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerDashboard;
