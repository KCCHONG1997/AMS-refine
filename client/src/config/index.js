// Application Configuration
export const CONFIG = {
  API: {
    BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3002',
    TIMEOUT: 10000,
  },
  APP: {
    NAME: 'AMS Parts Management System',
    VERSION: '1.0.0',
  },
  ROUTES: {
    // Customer routes
    HOME: '/',
    ABOUT: '/about',
    PRODUCTS: '/ourproducts',
    PARTNERS: '/ourpartners',
    CONTACT: '/contact',
    REVIEWS: '/reviews',
    CART: '/cart',
    PROFILE: '/profile',
    QR_CODE: '/qrcode',
    CUSTOMER_INFO: '/customerinfo',
    
    // Account routes
    LOGIN: '/account/login',
    FORGOT_PASSWORD: '/account/forgot-password',
    RESET_PASSWORD: '/account/reset-password',
    
    // Admin routes
    ADMIN: {
      HOME: '/admin/home',
      DASHBOARD: '/admin/dashboard',
      USERS: '/admin/users',
      ACCOUNTS: {
        ADD: '/admin/accounts/add',
        EDIT: '/admin/accounts/edit',
        DELETE: '/admin/accounts/delete',
      },
      PRODUCTS: {
        ADD: '/admin/products/add',
        EDIT: '/admin/products/edit',
        DELETE: '/admin/products/delete',
      },
      ORDERS: '/admin/orders',
      ABOUT: '/admin/about',
      CONTACT: '/admin/contact',
      PDF_UPLOADER: '/admin/pdfuploader',
    },
    
    // Brand routes
    BRANDS: {
      YAMAHA: '/yamahaproducts',
      HONDA: '/hondaproducts',
      BOSCH: '/boschproducts',
    },
  },
};

export default CONFIG;
