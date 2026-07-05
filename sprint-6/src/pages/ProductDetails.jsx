import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

const FALLBACK_IMAGE = 'https://placehold.co/600x600?text=No+Image'

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState('')
  const [showToast, setShowToast] = useState(false)

  const fetchProduct = async () => {
    setStatus('loading')
    setErrorMessage('')
    setQuantity(1)
    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`)
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }
      const data = await response.json()
      if (data && data.id) {
        setProduct(data)
        setActiveImage(data.thumbnail || (data.images && data.images[0]) || '')
        setStatus('success')
      } else {
        throw new Error('Product not found')
      }
    } catch (error) {
      console.error('Failed to fetch product details:', error)
      setErrorMessage('We could not load this product. It may not exist or a network error occurred.')
      setStatus('error')
    }
  }

  useEffect(() => {
    fetchProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (!showToast) return
    const timer = setTimeout(() => setShowToast(false), 3000)
    return () => clearTimeout(timer)
  }, [showToast])

  const handleImageError = (event) => {
    event.target.onerror = null
    event.target.src = FALLBACK_IMAGE
  }

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product, quantity)
    setShowToast(true)
  }

  const increaseQty = () => setQuantity((q) => Math.min(q + 1, product?.stock || 99))
  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1))

  if (status === 'loading') {
    return (
      <div className="page">
        <div className="container">
          <div className="loader-wrap">
            <div className="spinner"></div>
            <p className="loader-text">Loading product details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="page">
        <div className="container">
          <div className="state-box">
            <div className="state-icon">⚠️</div>
            <h2 className="state-title">Product not found</h2>
            <p className="state-desc">{errorMessage}</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="btn btn-primary" onClick={fetchProduct}>
                Retry
              </button>
              <button type="button" className="btn btn-outline" onClick={() => navigate('/shop')}>
                Back to Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  const discount = product.discountPercentage || 0
  const finalPrice = discount > 0 ? product.price * (1 - discount / 100) : product.price
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail]

  const stockStatusClass =
    product.stock === 0 ? 'pd-stock-out' : product.stock < 10 ? 'pd-stock-low' : 'pd-stock-in'
  const stockStatusText =
    product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? `Only ${product.stock} left` : 'In Stock'

  return (
    <div className="page">
      <div className="container">
        <div className="breadcrumb-back">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/shop')}>
            ← Back to Shop
          </button>
        </div>

        <div className="product-details-grid">
          <div>
            <div className="pd-gallery-main">
              <img
                src={activeImage || FALLBACK_IMAGE}
                alt={product.title}
                onError={handleImageError}
              />
            </div>
            {images.length > 1 && (
              <div className="pd-thumbs">
                {images.map((img, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`pd-thumb${activeImage === img ? ' active' : ''}`}
                    onClick={() => setActiveImage(img)}
                    aria-label={`View image ${index + 1} of ${product.title}`}
                  >
                    <img src={img} alt="" onError={handleImageError} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="pd-brand-category">
              {product.brand && <span className="pd-badge">{product.brand}</span>}
              {product.category && <span className="pd-badge">{product.category}</span>}
            </div>

            <h1 className="pd-title">{product.title}</h1>

            <div className="pd-rating-row">
              <span>⭐ {product.rating?.toFixed?.(2) ?? product.rating ?? 'N/A'}</span>
              <span>•</span>
              <span className={stockStatusClass}>{stockStatusText}</span>
            </div>

            <div className="pd-price-row">
              <span className="pd-price">${finalPrice.toFixed(2)}</span>
              {discount > 0 && (
                <>
                  <span className="pd-price-old">${product.price.toFixed(2)}</span>
                  <span className="pd-discount-badge">-{Math.round(discount)}%</span>
                </>
              )}
            </div>

            <p className="pd-description">{product.description}</p>

            <div className="pd-info-grid">
              {typeof product.stock !== 'undefined' && (
                <div className="pd-info-item">
                  <span className="pd-info-label">Stock</span>
                  <span className="pd-info-value">{product.stock} units</span>
                </div>
              )}
              {product.availabilityStatus && (
                <div className="pd-info-item">
                  <span className="pd-info-label">Availability</span>
                  <span className="pd-info-value">{product.availabilityStatus}</span>
                </div>
              )}
              {product.shippingInformation && (
                <div className="pd-info-item">
                  <span className="pd-info-label">Shipping</span>
                  <span className="pd-info-value">{product.shippingInformation}</span>
                </div>
              )}
              {product.returnPolicy && (
                <div className="pd-info-item">
                  <span className="pd-info-label">Return Policy</span>
                  <span className="pd-info-value">{product.returnPolicy}</span>
                </div>
              )}
              {product.warrantyInformation && (
                <div className="pd-info-item">
                  <span className="pd-info-label">Warranty</span>
                  <span className="pd-info-value">{product.warrantyInformation}</span>
                </div>
              )}
            </div>

            <div className="pd-quantity-row">
              <span className="pd-info-label">Quantity</span>
              <div className="qty-selector">
                <button
                  type="button"
                  onClick={decreaseQty}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={increaseQty}
                  disabled={product.stock === 0 || quantity >= product.stock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pd-actions">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
              </button>
              <Link to="/cart" className="btn btn-secondary btn-lg">
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="toast-container">
          <div className="toast success" role="status">
            ✅ Added {quantity} × "{product.title}" to cart
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetails