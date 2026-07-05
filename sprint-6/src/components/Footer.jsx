import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">ShopSphere</div>
          <p className="footer-desc">
            A modern, fast, and reliable place to discover quality products across every
            category — built for a smooth shopping experience.
          </p>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/shop">All Products</Link></li>
            <li><Link to="/cart">My Cart</Link></li>
            <li><Link to="/checkout">Checkout</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/">Home</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><Link to="/shop">Returns</Link></li>
            <li><Link to="/shop">Shipping Info</Link></li>
            <li><Link to="/shop">Contact Us</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {year} ShopSphere. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer