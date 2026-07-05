import React from 'react'
import { Link } from 'react-router-dom'

const categories = [
  { name: 'smartphones', emoji: '📱' },
  { name: 'laptops', emoji: '💻' },
  { name: 'fragrances', emoji: '🌸' },
  { name: 'skincare', emoji: '🧴' },
]

const features = [
  {
    icon: '🚚',
    title: 'Fast Delivery',
    desc: 'Get your orders delivered quickly and reliably, right to your door.',
  },
  {
    icon: '🔒',
    title: 'Secure Shopping',
    desc: 'Shop with confidence knowing your data and orders are protected.',
  },
  {
    icon: '✨',
    title: 'Quality Products',
    desc: 'Carefully curated products that meet the highest quality standards.',
  },
  {
    icon: '↩️',
    title: 'Easy Returns',
    desc: 'Not satisfied? Enjoy a simple and hassle-free return process.',
  },
]

function Home() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">🎉 New arrivals every week</span>
            <h1 className="hero-title">
              Discover Products You'll <span className="highlight">Actually Love</span>
            </h1>
            <p className="hero-subtitle">
              Explore a curated collection of quality products across electronics, beauty,
              fashion, and more — all in one seamless shopping experience.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary btn-lg">
                Shop Now
              </Link>
              <Link to="/cart" className="btn btn-secondary btn-lg">
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Why Choose Us</div>
            <h2 className="section-title">Built for a Better Shopping Experience</h2>
            <p className="section-desc">
              We focus on speed, security, and quality so you can shop with peace of mind.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <div className="feature-card" key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Explore</div>
            <h2 className="section-title">Featured Categories</h2>
            <p className="section-desc">
              Jump straight into the categories our shoppers love the most.
            </p>
          </div>

          <div className="categories-grid">
            {categories.map((category) => (
              <Link to="/shop" className="category-card" key={category.name}>
                <span className="cat-emoji">{category.emoji}</span>
                <span className="cat-name">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-section">
            <h2>Ready to Start Shopping?</h2>
            <p>
              Browse our full catalog of products and find something you'll love today.
            </p>
            <Link to="/shop" className="btn btn-primary btn-lg">
              Browse the Shop
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home