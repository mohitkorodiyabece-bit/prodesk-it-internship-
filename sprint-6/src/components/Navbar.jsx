import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function Navbar() {
  const { totalItems } = useCart()
  const { isAuthenticated, user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    logout()
    closeMenu()
    navigate('/')
  }

  const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand" onClick={closeMenu}>
          Shop<span className="dot">Sphere</span>
        </NavLink>

        <nav className={`navbar-links${menuOpen ? ' open' : ''}`} aria-label="Main navigation">
          <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkClass} onClick={closeMenu}>
            Shop
          </NavLink>
          <NavLink to="/cart" className={navLinkClass} onClick={closeMenu}>
            Cart
          </NavLink>
          {isAuthenticated ? (
            <button
              type="button"
              className="nav-link"
              onClick={handleLogout}
              style={{ textAlign: 'left' }}
            >
              Logout
            </button>
          ) : (
            <NavLink to="/login" className={navLinkClass} onClick={closeMenu}>
              Login
            </NavLink>
          )}
        </nav>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <span className="guest-pill auth-status-desktop" aria-label="Logged in as guest">
              👤 {user?.name || 'Guest User'}
            </span>
          ) : (
            <span className="auth-status auth-status-desktop">Not logged in</span>
          )}

          <NavLink to="/cart" className="cart-link" aria-label={`View cart, ${totalItems} items`}>
            🛒
            {totalItems > 0 && <span className="cart-badge">{totalItems > 99 ? '99+' : totalItems}</span>}
          </NavLink>

          <button
            type="button"
            className="hamburger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar