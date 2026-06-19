import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderTrackingPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect((a) => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('cw_token')}` },
      });
      setOrders(response.data || []);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch orders');
      setLoading(false);
    }
  };

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Confirmed: 'bg-blue-100 text-blue-800',
    Washing: 'bg-purple-100 text-purple-800',
    Drying: 'bg-violet-100 text-violet-800',
    Folding: 'bg-sky-100 text-sky-800',
    'Ready for Pickup': 'bg-green-100 text-green-800',
    'Out for Delivery': 'bg-cyan-100 text-cyan-800',
    Completed: 'bg-green-200 text-green-900',
    Cancelled: 'bg-red-100 text-red-800',
  };

  const getStatusSteps = (status) => {
    const steps = ['Pending', 'Confirmed', 'Washing', 'Drying', 'Folding', 'Ready for Pickup', 'Out for Delivery', 'Completed'];
    const index = steps.indexOf(status);
    return index === -1 ? 1 : index + 1;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Order Tracking</h2>
        <p className="text-slate-600 dark:text-slate-400">Monitor your laundry orders in real-time</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-sky-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <p className="text-slate-600 dark:text-slate-400">No orders yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Order #{order._id?.slice(-6)}</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">₱{order.totalAmount || 0}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                  {order.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
                  <span>Progress: {getStatusSteps(order.status)}/5</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-sky-500 h-2 rounded-full transition-all"
                    style={{ width: `${(getStatusSteps(order.status) / 5) * 100}%` }}
                  />
                </div>
              </div>

              {selectedOrder?._id === order._id && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">Pickup Date</p>
                      <p className="font-medium text-slate-900 dark:text-white">{new Date(order.estimatedPickup || order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">Delivery Date</p>
                      <p className="font-medium text-slate-900 dark:text-white">{new Date(order.estimatedDelivery || order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-600 dark:text-slate-400">Services</p>
                      <p className="font-medium text-slate-900 dark:text-white">{order.items?.length || 0} item(s)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;

