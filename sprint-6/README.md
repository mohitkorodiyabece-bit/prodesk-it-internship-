# Shop Sphere — Sprint 6 React E-Commerce App

A modern multi-route E-Commerce frontend built with **React**, **Vite**, **React Router**, and the **Context API**.

The application allows users to browse products from the DummyJSON API, view individual product details, manage a global shopping cart, persist cart data across refreshes, log in as a guest, and access a protected checkout page.

---

## 🚀 Features

### Phase 1 — Base MVP
- Home page at `/`
- Product shop grid at `/shop`
- Dynamic product details route at `/product/:id`
- Product data fetched from the DummyJSON REST API
- `useParams()` used to fetch individual product details
- Client-side navigation with React Router
- Loading and error states

### Phase 2 — Priority Features
- Global cart state using React Context API
- Add products to cart
- Increase and decrease quantities
- Remove products from cart
- Clear the complete cart
- Dynamic cart badge in the navbar
- Persistent global navbar across routes
- Responsive cart page
- No Redux

### Phase 3 — Stretch Features
- Cart persistence with `localStorage`
- Mock guest authentication
- Login route at `/login`
- Authentication persistence with `localStorage`
- Protected checkout route at `/checkout`
- Unauthorized users redirected to login
- Shipping form with basic validation
- Mock order placement flow
- Cart cleared after successful order placement

---

## 🛠️ Tech Stack

- React
- Vite
- JavaScript (ES6+)
- React Router DOM
- Context API
- Vanilla CSS
- Fetch API
- localStorage

---

## 🌐 API

Product data is fetched from:

```text
https://dummyjson.com/products
```

Individual product details are fetched from:

```text
https://dummyjson.com/products/:id
```

---

## 📁 Project Structure

```text
sprint-6/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── Loader.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── pages/
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   ├── ProductDetails.jsx
│   │   └── Shop.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Move into the project folder:

```bash
cd sprint-6
```

Install dependencies:

```bash
npm install
```

Install React Router if needed:

```bash
npm install react-router-dom
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173/
```

---

## 🧭 Application Routes

| Route | Description |
|---|---|
| `/` | Home page |
| `/shop` | Product grid |
| `/product/:id` | Dynamic product details |
| `/cart` | Shopping cart |
| `/login` | Guest login |
| `/checkout` | Protected checkout |
| `*` | 404 Not Found page |

---

## 🛒 Cart Functionality

The cart is managed globally with the React Context API.

Supported actions:

- Add product to cart
- Increase quantity
- Decrease quantity
- Remove product
- Clear cart
- Calculate total items
- Calculate cart total

Cart data is stored in:

```text
localStorage
```

using the key:

```text
ecommerce_cart
```

This allows cart items to survive browser refreshes.

---

## 🔐 Mock Authentication

The project includes a simple mock guest login system.

Authentication state is stored in:

```text
localStorage
```

using the key:

```text
ecommerce_auth
```

Unauthenticated users attempting to open `/checkout` are redirected to `/login`.

---

## 📱 Responsive Design

The application is designed for:

- Desktop
- Tablet
- Mobile

The interface includes:

- Responsive navigation
- Mobile hamburger menu
- Adaptive product grids
- Responsive cart layout
- Responsive checkout forms

---

## ✅ Sprint Requirements Covered

- [x] BrowserRouter
- [x] Static routes
- [x] Dynamic `/product/:id` route
- [x] `useParams()`
- [x] REST API integration
- [x] Global Cart Context
- [x] Add to Cart
- [x] Dynamic cart badge
- [x] Persistent navbar
- [x] localStorage cart persistence
- [x] Mock guest login
- [x] Global authentication state
- [x] Protected checkout route
- [x] Unauthorized redirect to login
- [x] Responsive UI
- [x] Loading states
- [x] Error handling
- [x] No Redux

---

## 📦 Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 👨‍💻 Author

**Mohit Korodiya**

Sprint 6 — React E-Commerce Frontend Project
