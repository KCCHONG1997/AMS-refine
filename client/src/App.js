import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout';
import { CONFIG } from './config';

// Account Components
import Login from './pages/account/Login';
import ResetPassword from './pages/account/ResetPassword';
import ForgotPassword from './pages/account/ForgotPassword';

// Admin Components
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHome from './pages/admin/AdminHome';
import AdminAbout from './pages/admin/AdminAbout'
import AccountsList from './pages/admin/AccountsList';
import AddAccount from './pages/admin/AddAccount';
import EditAccount from './pages/admin/EditAccount';
import DeleteAccount from './pages/admin/DeleteAccount';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import DeleteProduct from './pages/admin/DeleteProduct';
import Orders from './pages/admin/Orders';
import PdfUploader from './components/pdfuploader';
import AdminContactUs from './pages/admin/AdminContactUs';

// Customer Components
import Home from './pages/customer/Home';
import About from './pages/customer/About';
import OurProducts from './pages/customer/OurProducts'
import OurPartners from './pages/customer/OurPartners';
import ContactUs from './pages/customer/ContactUs';
import Reviews from './pages/customer/Reviews';
import DebugAccounts from './pages/DebugAccounts';
import Cart from './pages/customer/Cart';
import CustomerInfoWrapper from './pages/customer/CustomerInfoWrapper';
import QrCode from './pages/customer/QrCode';
import Profile from './pages/customer/Profile';

// Brand Components
import YamahaProducts from './pages/customer/brands/YamahaProducts';
import HondaProducts from './pages/customer/brands/HondaProducts';
import BoschProducts from './pages/customer/brands/BoschProducts';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Customer Routes */}
          <Route path={CONFIG.ROUTES.HOME} element={<Home />} />
          <Route path={CONFIG.ROUTES.ABOUT} element={<About />} />
          <Route path={CONFIG.ROUTES.PRODUCTS} element={<OurProducts />} />
          <Route path={CONFIG.ROUTES.PARTNERS} element={<OurPartners />} />
          <Route path={CONFIG.ROUTES.CONTACT} element={<ContactUs />} />
          <Route path={CONFIG.ROUTES.REVIEWS} element={<Reviews />} />
          <Route path={CONFIG.ROUTES.CART} element={<Cart />} />
          <Route path={CONFIG.ROUTES.CUSTOMER_INFO} element={<CustomerInfoWrapper />} />
          <Route path={CONFIG.ROUTES.QR_CODE} element={<QrCode />} />
          <Route path={CONFIG.ROUTES.PROFILE} element={<Profile />} />
          <Route path="/debug-accounts" element={<DebugAccounts />} />

          {/* Brand Routes */}
          <Route path={CONFIG.ROUTES.BRANDS.YAMAHA} element={<YamahaProducts />} />
          <Route path={CONFIG.ROUTES.BRANDS.HONDA} element={<HondaProducts />} />
          <Route path={CONFIG.ROUTES.BRANDS.BOSCH} element={<BoschProducts />} />

          {/* Account Routes */}
          <Route path={CONFIG.ROUTES.LOGIN} element={<Login />} />
          <Route path={`${CONFIG.ROUTES.RESET_PASSWORD}/:token`} element={<ResetPassword />} />
          <Route path={CONFIG.ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

          {/* Admin Routes */}
          <Route path={CONFIG.ROUTES.ADMIN.HOME} element={<AdminHome />} />
          <Route path={CONFIG.ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
          <Route path={CONFIG.ROUTES.ADMIN.USERS} element={<AccountsList />} />
          <Route path={CONFIG.ROUTES.ADMIN.ORDERS} element={<Orders />} />
          <Route path={CONFIG.ROUTES.ADMIN.ABOUT} element={<AdminAbout />} />
          <Route path={CONFIG.ROUTES.ADMIN.CONTACT} element={<AdminContactUs />} />
          <Route path={CONFIG.ROUTES.ADMIN.PDF_UPLOADER} element={<PdfUploader />} />
          <Route path="/admin/reviews" element={<Reviews />} />
          
          {/* Admin Account Management */}
          <Route path={`${CONFIG.ROUTES.ADMIN.ACCOUNTS.ADD}`} element={<AddAccount />} />
          <Route path={`${CONFIG.ROUTES.ADMIN.ACCOUNTS.EDIT}/:id`} element={<EditAccount />} />
          <Route path={`${CONFIG.ROUTES.ADMIN.ACCOUNTS.DELETE}/:id`} element={<DeleteAccount />} />
          
          {/* Admin Product Management */}
          <Route path={CONFIG.ROUTES.ADMIN.PRODUCTS.ADD} element={<AddProduct />} />
          <Route path={`${CONFIG.ROUTES.ADMIN.PRODUCTS.EDIT}/:id`} element={<EditProduct />} />
          <Route path={`${CONFIG.ROUTES.ADMIN.PRODUCTS.DELETE}/:id`} element={<DeleteProduct />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
