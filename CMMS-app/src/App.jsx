import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import FirstPage from './pages/FirstPage';
import DailyMenu from './pages/DailyMenu';
import ComplaintPage from "./pages/ComplaintPage";
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import ExtrasPage from './pages/ExtrasPage';
import RebatePage from './pages/RebatePage';
import BillingPage from './pages/BillingPage';
import MyBookings from './pages/MyBookings';
import CartPage from './pages/CartPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminFeedbackPage from './pages/AdminFeedbackPage';
import AdminExtrasManagement from './pages/AdminExtrasManagement';
import AdminBillingPage from './pages/AdminBillingPage';
import AdminMenuManagement from './pages/AdminMenuManagement';
import AdminRebatePage from './pages/AdminRebatePage';
import AdminNotificationPage from './pages/AdminNotificationPage';
import AdminQRScanPage from './pages/AdminQRScanPage';
import { CartProvider } from './components/CartPage/CartContext';

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />

          {/* Student Protected Routes */}
          <Route path="/first" element={
            <ProtectedRoute>
              <FirstPage />
            </ProtectedRoute>
          } />
          <Route path="/menu" element={
            <ProtectedRoute>
              <DailyMenu />
            </ProtectedRoute>
          } />
          <Route path="/feedbacks" element={
            <ProtectedRoute>
              <ComplaintPage />
            </ProtectedRoute>
          } />
          <Route path="/extras" element={
            <ProtectedRoute>
              <ExtrasPage />
            </ProtectedRoute>
          } />
          <Route path="/rebate" element={
            <ProtectedRoute>
              <RebatePage />
            </ProtectedRoute>
          } />
          <Route path="/billing" element={
            <ProtectedRoute>
              <BillingPage />
            </ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />

          {/* Admin Protected Routes */}
          <Route path="/admin-dashboard" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/admin-billing" element={
            <AdminProtectedRoute>
              <AdminBillingPage />
            </AdminProtectedRoute>
          } />
          <Route path="/admin-extras" element={
            <AdminProtectedRoute>
              <AdminExtrasManagement />
            </AdminProtectedRoute>
          } />
          <Route path="/admin-feedback" element={
            <AdminProtectedRoute>
              <AdminFeedbackPage />
            </AdminProtectedRoute>
          } />
          <Route path="/admin-notifications" element={
            <AdminProtectedRoute>
              <AdminNotificationPage />
            </AdminProtectedRoute>
          } />
          <Route path="/admin-rebate" element={
            <AdminProtectedRoute>
              <AdminRebatePage />
            </AdminProtectedRoute>
          } />
          <Route path="/admin-menu" element={
            <AdminProtectedRoute>
              <AdminMenuManagement />
            </AdminProtectedRoute>
          } />
          <Route path="/admin-qr-scan" element={
            <AdminProtectedRoute>
              <AdminQRScanPage />
            </AdminProtectedRoute>
          } />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
