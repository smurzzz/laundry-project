import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminAnalyticsDashboard = () => {
  const [data, setData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    completedOrders: 0,
    monthlyData: [],
    ordersByStatus: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/reports', {
        headers: { Authorization: `Bearer ${localStorage.getItem('cw_token')}` },
      });

      const orders = response.data || [];
      const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const completedOrders = orders.filter((o) => o.status === 'completed').length;

      // Monthly data (mock)
      const monthlyData = [
        { month: 'Jan', revenue: 2400, orders: 24 },
        { month: 'Feb', revenue: 1398, orders: 22 },
        { month: 'Mar', revenue: 9800, orders: 29 },
        { month: 'Apr', revenue: 3908, orders: 40 },
        { month: 'May', revenue: 4800, orders: 36 },
        { month: 'Jun', revenue: 3800, orders: 35 },
      ];

      // Orders by status
      const statusCount = {};
      orders.forEach((o) => {
        statusCount[o.status] = (statusCount[o.status] || 0) + 1;
      });

      const ordersByStatus = Object.entries(statusCount).map(([status, count]) => ({
        status,
        count,
      }));

      setData({
        totalOrders: orders.length,
        totalRevenue,
        averageOrderValue: orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : 0,
        completedOrders,
        monthlyData,
        ordersByStatus,
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch analytics');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h2>
        <p className="text-slate-600 dark:text-slate-400">Monitor business performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">Total Orders</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{data.totalOrders}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">Total Revenue</p>
          <p className="text-3xl font-bold text-sky-600 mt-2">${data.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">Average Order Value</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">${data.averageOrderValue}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">Completed Orders</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{data.completedOrders}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.ordersByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsDashboard;

