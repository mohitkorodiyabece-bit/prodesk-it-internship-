import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const FALLBACK_IMAGE = 'https://placehold.co/100x100?text=No+Image'

const initialFormState = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
}

function validateForm(form) {
  const errors = {}

  if (!form.fullName.trim()) {
    errors.fullName = 'Full name is required.'
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!form.address.trim()) {
    errors.address = 'Address is required.'
  }

  if (!form.city.trim()) {
    errors.city = 'City is required.'
  }

  if (!form.state.trim()) {
    errors.state = 'State is required.'
  }

  if (!form.postalCode.trim()) {
    errors.postalCode = 'Postal code is required.'
  }

  return errors
}

function Checkout() {
  const { cartItems, cartTotal, totalItems, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [orderPlaced, setOrderPlaced] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const validationErrors = validateForm(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      setOrderPlaced(true)
      clearCart()
    }
  }

  const handleImageError = (event) => {
    event.target.onerror = null
    event.target.src = FALLBACK_IMAGE
  }

  if (orderPlaced) {
    return (
      <div className="page">
        <div className="container">
          <div className="order-success">
            <div className="state-icon">🎉</div>
            <h1 className="state-title">Order Placed Successfully!</h1>
            <p className="state-desc">
              Thank you, {form.fullName || user?.name || 'Guest'}! Your mock order has been
              received and will be shipped to {form.address}, {form.city}, {form.state}{' '}
              {form.postalCode}.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
              <Link to="/shop" className="btn btn-primary">
                Continue Shopping
              </Link>
              <Link to="/" className="btn btn-outline">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="state-box">
            <div className="state-icon">🧾</div>
            <h2 className="state-title">Nothing to check out</h2>
            <p className="state-desc">Your cart is empty. Add some products before checking out.</p>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/shop')}>
              Go to Shop
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ marginBottom: '28px' }}>Checkout</h1>

        <div className="checkout-layout">
          <div className="checkout-form-card">
            <h2>Shipping Information</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                <div className="form-group full">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? 'error' : ''}
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  />
                  {errors.fullName && (
                    <span className="form-error" id="fullName-error">{errors.fullName}</span>
                  )}
                </div>

                <div className="form-group full">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <span className="form-error" id="email-error">{errors.email}</span>
                  )}
                </div>

                <div className="form-group full">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className={errors.address ? 'error' : ''}
                    aria-invalid={Boolean(errors.address)}
                    aria-describedby={errors.address ? 'address-error' : undefined}
                  />
                  {errors.address && (
                    <span className="form-error" id="address-error">{errors.address}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className={errors.city ? 'error' : ''}
                    aria-invalid={Boolean(errors.city)}
                    aria-describedby={errors.city ? 'city-error' : undefined}
                  />
                  {errors.city && (
                    <span className="form-error" id="city-error">{errors.city}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className={errors.state ? 'error' : ''}
                    aria-invalid={Boolean(errors.state)}
                    aria-describedby={errors.state ? 'state-error' : undefined}
                  />
                  {errors.state && (
                    <span className="form-error" id="state-error">{errors.state}</span>
                  )}
                </div>

                <div className="form-group full">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    className={errors.postalCode ? 'error' : ''}
                    aria-invalid={Boolean(errors.postalCode)}
                    aria-describedby={errors.postalCode ? 'postalCode-error' : undefined}
                  />
                  {errors.postalCode && (
                    <span className="form-error" id="postalCode-error">{errors.postalCode}</span>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg btn-block">
                Place Order
              </button>
            </form>
          </div>

          <div className="order-summary-card">
            <h2>Order Summary</h2>
            <div className="order-summary-list">
              {cartItems.map((item) => {
                const discounted = item.price * (1 - (item.discountPercentage || 0) / 100)
                return (
                  <div className="order-summary-item" key={item.id}>
                    <img
                      src={item.thumbnail || FALLBACK_IMAGE}
                      alt={item.title}
                      onError={handleImageError}
                    />
                    <div className="order-summary-item-info">
                      <strong>{item.title}</strong>
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <span className="order-summary-item-price">
                      ${(discounted * item.quantity).toFixed(2)}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="summary-row">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout