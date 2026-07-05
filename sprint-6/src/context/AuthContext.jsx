import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'ecommerce_auth'

function safeParseAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof parsed.name === 'string' &&
      parsed.isAuthenticated === true
    ) {
      return parsed
    }
    return null
  } catch (error) {
    console.warn('Failed to parse auth from localStorage, resetting auth.', error)
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(safeParseAuth)

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (error) {
      console.warn('Failed to persist auth to localStorage.', error)
    }
  }, [user])

  const loginAsGuest = () => {
    setUser({
      name: 'Guest User',
      isAuthenticated: true,
    })
  }

  const logout = () => {
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: Boolean(user && user.isAuthenticated),
    loginAsGuest,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}