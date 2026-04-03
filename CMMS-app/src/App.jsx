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
import BillingPage from './pages/BillingPage'
<<<<<<< HEAD
import CartPage from './pages/CartPage';
import MyBookings from './pages/MyBookings';
import { CartProvider } from './components/CartPage/CartContext';
import AdminDashboard from './pages/AdminDashboard';
import AdminBillingPage from './pages/AdminBillingPage';
import AdminExtrasManagement from './pages/AdminExtrasManagement';
import AdminFeedbackPage from './pages/AdminFeedbackPage';
import AdminRebatePage from './pages/AdminRebatePage';
import AdminMenuManagement from './pages/AdminMenuManagement';
import AdminNotificationPage from './pages/AdminNotificationPage';
import AdminQRScanPage from './pages/AdminQRScanPage';
=======
import AdminFeedbackPage from './pages/AdminFeedbackPage';
import AdminExtrasManagement from './pages/AdminExtrasManagement';
import AdminBillingPage from './pages/AdminBillingPage';
import AdminMenuManagement from './pages/AdminMenuManagement';
import AdminRebatePage from './pages/AdminRebatePage';
>>>>>>> b967ae00ba034adc2b31cfd33ea3f5903164fc47

function App() {
  return (
    <Router>
<<<<<<< HEAD
      <CartProvider>
        <Routes>
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

          <Route path='/extras' element={
            <ProtectedRoute>
              <ExtrasPage/>
            </ProtectedRoute>
          }/>

          <Route path='/rebate' element={
            <ProtectedRoute>
              <RebatePage/>
            </ProtectedRoute>
          }/>

          <Route path='/billing' element={
            <ProtectedRoute>
              <BillingPage/>
            </ProtectedRoute>
          }/>

          <Route path='/cart' element={
            <ProtectedRoute>
              <CartPage/>
            </ProtectedRoute>
          }/>
=======
      <Routes>
        <Route path="/login" element={<AuthPage />} />

        {/* Protected Routes */}
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

        <Route path='/extras' element={
          <ProtectedRoute>
            <ExtrasPage />
          </ProtectedRoute>
        } />

        <Route path='/rebate' element={
          <ProtectedRoute>
            <RebatePage />
          </ProtectedRoute>
        } />

        <Route path='/billing' element={
          <ProtectedRoute>
            <BillingPage />
          </ProtectedRoute>
        } />
        <Route path="/admin-feedback" element={
          <ProtectedRoute>
            <AdminFeedbackPage />
          </ProtectedRoute>
        } />
        <Route path="/admin-extras" element={
          <ProtectedRoute>
            <AdminExtrasManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin-billing" element={
          <ProtectedRoute>
            <AdminBillingPage />
          </ProtectedRoute>
        } />
        <Route path="/admin-menu" element={
          <ProtectedRoute>
            <AdminMenuManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin-rebate" element={
          <ProtectedRoute>
            <AdminRebatePage />
          </ProtectedRoute>
        } />
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
>>>>>>> b967ae00ba034adc2b31cfd33ea3f5903164fc47

          <Route path='/my-bookings' element={
            <ProtectedRoute>
              <MyBookings/>
            </ProtectedRoute>
          }/>
          
          {/* Admin Protected Routes */}
          <Route path='/admin-dashboard' element={
            <AdminProtectedRoute>
              <AdminDashboard/>
            </AdminProtectedRoute>
          }/>

          <Route path='/admin-billing' element={
            <AdminProtectedRoute>
              <AdminBillingPage/>
            </AdminProtectedRoute>
          }/>

          <Route path='/admin-extra-management' element={
            <AdminProtectedRoute>
              <AdminExtrasManagement/>
            </AdminProtectedRoute>
          }/>

          <Route path='/admin-feedback' element={
            <AdminProtectedRoute>
              <AdminFeedbackPage/>
            </AdminProtectedRoute>
          }/>

          <Route path='/admin-notifications' element={
            <AdminProtectedRoute>
              <AdminNotificationPage />
            </AdminProtectedRoute>
          } />

          <Route path='/admin-rebate' element={
            <AdminProtectedRoute>
              <AdminRebatePage/>
            </AdminProtectedRoute>
          }/>

          <Route path='/admin-menu-management' element={
            <AdminProtectedRoute>
              <AdminMenuManagement/>
            </AdminProtectedRoute>
          }/>

          <Route path='/admin-qr-scan' element={
            <AdminProtectedRoute>
              <AdminQRScanPage/>
            </AdminProtectedRoute>
          }/>

          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;



