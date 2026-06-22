import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ToastProvider from './components/ToastProvider';
import Navbar from './components/Navbar';
import DashboardLayout from './components/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import OrdersPage from './pages/customer/OrdersPage';
import CreateOrderPage from './pages/customer/CreateOrderPage';
import ProfilePage from './pages/customer/ProfilePage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import ServiceRatingsPage from './pages/customer/ServiceRatingsPage';
import SupportTicketsPage from './pages/customer/SupportTicketsPage';
import ServicesPage from './pages/admin/ServicesPage';
import PromoCodeManagementPage from './pages/admin/PromoCodeManagementPage';
import TicketManagementPage from './pages/admin/TicketManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';

const ProtectedRoute = ({ children, roles, loginPath = '/login' }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to={loginPath} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#d7fbff_0,#eef7fb_34%,#f8fafc_64%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,#164e63_0,#0f172a_36%,#020617_72%)] dark:text-slate-100">
            <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.65),rgba(255,255,255,0)_42%),linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[length:auto,42px_42px,42px_42px] dark:bg-[linear-gradient(120deg,rgba(8,47,73,0.28),rgba(8,47,73,0)_42%),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)]" />
            <Navbar />
            <main className="relative mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
              <ToastProvider />
              <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/register" element={<AdminRegisterPage />} />
              {/* Customer Routes */}
              <Route path="/customer" element={<ProtectedRoute roles={['customer']}><DashboardLayout><CustomerDashboard /></DashboardLayout></ProtectedRoute>} />
              <Route path="/customer/orders" element={<ProtectedRoute roles={['customer']}><DashboardLayout><OrdersPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/customer/create-order" element={<ProtectedRoute roles={['customer']}><DashboardLayout><CreateOrderPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/customer/profile" element={<ProtectedRoute roles={['customer']}><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/customer/tracking" element={<ProtectedRoute roles={['customer']}><DashboardLayout><OrderTrackingPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/customer/ratings" element={<ProtectedRoute roles={['customer']}><DashboardLayout><ServiceRatingsPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/customer/support" element={<ProtectedRoute roles={['customer']}><DashboardLayout><SupportTicketsPage /></DashboardLayout></ProtectedRoute>} />
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute roles={['admin']}><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
              <Route path="/admin/services" element={<ProtectedRoute roles={['admin']}><DashboardLayout><ServicesPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><DashboardLayout><OrderManagementPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/admin/promo-codes" element={<ProtectedRoute roles={['admin']}><DashboardLayout><PromoCodeManagementPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/admin/support" element={<ProtectedRoute roles={['admin']}><DashboardLayout><TicketManagementPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  </ThemeProvider>
  );
}

export default App;
