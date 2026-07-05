import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
  const { loginAsGuest, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = location.state?.from?.pathname || '/checkout'

  const handleGuestLogin = () => {
    loginAsGuest()
    navigate(redirectTo, { replace: true })
  }

  if (isAuthenticated) {
    return (
      <div className="page">
        <div className="container">
          <div className="auth-page">
            <div className="auth-card">
              <div className="auth-icon">✅</div>
              <h1>You're already logged in</h1>
              <p>You are currently signed in as a Guest User.</p>
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={() => navigate('/shop')}
              >
                Go to Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <div className="auth-page">
          <div className="auth-card">
            <div className="auth-icon">🔐</div>
            <h1>Welcome Back</h1>
            <p>Sign in to access checkout and complete your purchase.</p>

            <button
              type="button"
              className="btn btn-primary btn-lg btn-block"
              onClick={handleGuestLogin}
            >
              Continue as Guest
            </button>

            <div className="auth-divider">No account needed</div>

            <p className="auth-note">
              This is a demo login. Clicking "Continue as Guest" signs you in with a mock
              authenticated session so you can access the checkout page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login