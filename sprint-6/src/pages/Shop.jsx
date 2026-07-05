import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img"></div>
      <div className="skeleton-body">
        <div className="skeleton skeleton-line short"></div>
        <div className="skeleton skeleton-line"></div>
        <div className="skeleton skeleton-line short"></div>
      </div>
    </div>
  )
}

function Shop() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')

  const fetchProducts = async () => {
    setStatus('loading')
    setErrorMessage('')
    try {
      const response = await fetch('https://dummyjson.com/products?limit=100')
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }
      const data = await response.json()
      setProducts(Array.isArray(data.products) ? data.products : [])
      setStatus('success')
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setErrorMessage('We could not load the products right now. Please try again.')
      setStatus('error')
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="page">
      <div className="container">
        <div className="shop-header">
          <h1>Shop All Products</h1>
          <p>Browse our full catalog and find something you'll love.</p>
        </div>

        {status === 'loading' && (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="state-box">
            <div className="state-icon">⚠️</div>
            <h2 className="state-title">Something went wrong</h2>
            <p className="state-desc">{errorMessage}</p>
            <button type="button" className="btn btn-primary" onClick={fetchProducts}>
              Retry
            </button>
          </div>
        )}

        {status === 'success' && products.length === 0 && (
          <div className="state-box">
            <div className="state-icon">📦</div>
            <h2 className="state-title">No products found</h2>
            <p className="state-desc">Please check back later.</p>
          </div>
        )}

        {status === 'success' && products.length > 0 && (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Shop