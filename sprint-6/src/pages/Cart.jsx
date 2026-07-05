import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

const FALLBACK_IMAGE = 'https://placehold.co/200x200?text=No+Image'

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalItems,
    cartTotal,
  } = useCart()
  const navigate = useNavigate()

  const handleImageError = (event) => {
    event.target.onerror = null
    event.target.src = FALLBACK_IMAGE
  }

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="state-box">
            <div className="state-icon">🛒</div>
            <h2 className="state-title">Your cart is empty</h2>
            <p className="state-desc">
              Looks like you haven't added anything yet. Start exploring our products.
            </p>
            <Link to="/shop" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <div className="cart-top-actions">
          <h1>Your Cart</h1>
          <button type="button" className="btn btn-danger" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-layout">
          <div className="cart-list">
            {cartItems.map((item) => {
              const discounted = item.price * (1 - (item.discountPercentage || 0) / 100)
              const subtotal = discounted * item.quantity

              return (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-image">
                    <img
                      src={item.thumbnail || FALLBACK_IMAGE}
                      alt={item.title}
                      onError={handleImageError}
                    />
                  </div>

                  <div className="cart-item-info">
                    <h3>{item.title}</h3>
                    <div className="cart-item-price">
                      ${discounted.toFixed(2)} each
                    </div>
                    <div className="cart-item-controls">
                      <div className="qty-selector">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${item.title}`}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          aria-label={`Increase quantity of ${item.title}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="cart-item-remove"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-side">
                    <span className="cart-item-subtotal">${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <div className="cart-summary-actions">
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
              <Link to="/shop" className="btn btn-outline btn-block">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart