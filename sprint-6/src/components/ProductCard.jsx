import React from 'react'
import { useNavigate } from 'react-router-dom'

const FALLBACK_IMAGE = 'https://placehold.co/400x400?text=No+Image'

function ProductCard({ product }) {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate(`/product/${product.id}`)
  }

  const handleImageError = (event) => {
    event.target.onerror = null
    event.target.src = FALLBACK_IMAGE
  }

  const discount = product.discountPercentage || 0
  const originalPrice = product.price
  const finalPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice

  return (
    <div
      className="product-card"
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleNavigate()
      }}
      aria-label={`View details for ${product.title}`}
    >
      <div className="product-card-image">
        {discount > 0 && <span className="discount-tag">-{Math.round(discount)}%</span>}
        <img
          src={product.thumbnail || FALLBACK_IMAGE}
          alt={product.title}
          onError={handleImageError}
          loading="lazy"
        />
      </div>

      <div className="product-card-body">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title">{product.title}</h3>
        <div className="product-rating">
          <span>⭐ {product.rating?.toFixed?.(1) ?? product.rating ?? 'N/A'}</span>
        </div>
        <div className="product-price-row">
          <span className="product-price">${finalPrice.toFixed(2)}</span>
          {discount > 0 && (
            <span className="product-price-old">${originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>

      <div className="product-card-footer">
        <button
          type="button"
          className="btn btn-secondary btn-block"
          onClick={(e) => {
            e.stopPropagation()
            handleNavigate()
          }}
        >
          View Product
        </button>
      </div>
    </div>
  )
}

export default ProductCard