import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Franchise from './pages/Franchise';
import Investment from './pages/Investment';
import OperatingCosts from './pages/OperatingCosts';
import Products from './pages/Products';
import Process from './pages/Process';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import { Login, Register, AdminLogin } from './pages/AuthPages';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBrand from './pages/admin/AdminBrand';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import { AdminFranchises, AdminInvestments, AdminCosts, AdminProducts, AdminProcess, AdminGallery, AdminUsers, AdminMessages } from './pages/admin/AdminModules';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/franchise" element={<Franchise />} />
        <Route path="/investment" element={<Investment />} />
        <Route path="/operating-costs" element={<OperatingCosts />} />
        <Route path="/products" element={<Products />} />
        <Route path="/process" element={<Process />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<ProtectedRoute role="entrepreneur"><Dashboard /></ProtectedRoute>} />
      </Route>
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="brand" element={<AdminBrand />} />
        <Route path="franchises" element={<AdminFranchises />} />
        <Route path="investments" element={<AdminInvestments />} />
        <Route path="costs" element={<AdminCosts />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="process" element={<AdminProcess />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="messages" element={<AdminMessages />} />
      </Route>
      <Route path="*" element={<div className="state"><h2>404 - Page not found</h2><a className="btn primary" href="/">Go Home</a></div>} />
    </Routes>
  );
}
