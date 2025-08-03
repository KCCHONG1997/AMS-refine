client/
├── src/
│   ├── api/                  # API request handlers
│   │   ├── auth.js           # Login/register calls
│   │   └── products.js       # Product/cart API calls
│   ├── components/
│   │   ├── common/           # Reusable UI (buttons, modals)
│   │   ├── customer/         # Customer-specific components
│   │   ├── admin/            # Admin-specific components
│   │   └── Navbar.jsx        # Dynamic navbar (changes per role)
│   ├── context/             # React contexts
│   │   ├── AuthContext.jsx   # User auth state
│   │   └── CartContext.jsx   # Cart state
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.js        # Auth logic
│   │   └── useCart.js        # Cart logic
│   ├── pages/
│   │   ├── customer/
│   │   │   ├── Home.jsx
│   │   │   ├── Cart.jsx      # Cart page with checkout
│   │   │   └── ProductDetail.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       └── ManageUsers.jsx
│   ├── utils/               # Helpers (formatters, validators)
│   ├── App.js               # Main router
│   └── main.jsx
server/
├── controllers/             # Business logic
│   ├── authController.js
│   └── cartController.js
├── models/                  # Database models
│   ├── User.js
│   └── Product.js
├── routes/                  # API endpoints
│   ├── authRoutes.js
│   └── cartRoutes.js
├── config/                  # DB/Env setup
│   └── db.js
└── server.js                # Express entry