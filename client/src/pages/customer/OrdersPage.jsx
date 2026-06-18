import { useEffect, useState } from 'react';
import apiClient from '../../services/apiService';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await apiClient.get('/orders');
        setOrders(data.orders);
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
      <div className="app-card">
        <p className="app-kicker">Order timeline</p>
        <h2 className="app-page-title mt-3">My laundry orders</h2>
        <p className="mt-2 app-muted">Track each order through the full washing and delivery workflow.</p>
      </div>
      <div className="app-card">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="h-20 animate-pulse rounded-3xl bg-slate-200/80 dark:bg-slate-800" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400">No orders found yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="app-panel">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">Order {order.orderNumber}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Placed {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="w-fit rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200">{order.status}</span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white/85 p-4 shadow-sm dark:bg-slate-900/80">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="rounded-2xl bg-white/85 p-4 shadow-sm dark:bg-slate-900/80">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Pickup</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{order.pickupType}</p>
                    </div>
                    <div className="rounded-2xl bg-white/85 p-4 shadow-sm dark:bg-slate-900/80">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Items</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{order.items.length}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrdersPage;

