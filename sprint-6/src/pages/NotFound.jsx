import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="page">
      <div className="container">
        <div className="notfound-page">
          <div className="notfound-code">404</div>
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist or may have been moved.</p>
          <Link to="/" className="btn btn-primary btn-lg">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound