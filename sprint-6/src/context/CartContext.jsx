import React, { createContext, useContext, useEffect, useReducer } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'ecommerce_cart'

function safeParseCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item) =>
        item &&
        typeof item === 'object' &&
        typeof item.id !== 'undefined' &&
        typeof item.quantity === 'number'
    )
  } catch (error) {
    console.warn('Failed to parse cart from localStorage, resetting cart.', error)
    return []
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload
      const existingIndex = state.findIndex((item) => item.id === product.id)

      if (existingIndex !== -1) {
        return state.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [
        ...state,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          discountPercentage: product.discountPercentage || 0,
          thumbnail: product.thumbnail,
          brand: product.brand || '',
          category: product.category || '',
          quantity,
        },
      ]
    }

    case 'REMOVE_ITEM': {
      return state.filter((item) => item.id !== action.payload.id)
    }

    case 'INCREASE_QUANTITY': {
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    }

    case 'DECREASE_QUANTITY': {
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    }

    case 'CLEAR_CART': {
      return []
    }

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [cartItems, dispatch] = useReducer(cartReducer, undefined, safeParseCart)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
    } catch (error) {
      console.warn('Failed to persist cart to localStorage.', error)
    }
  }, [cartItems])

  const addToCart = (product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } })
  }

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } })
  }

  const increaseQuantity = (id) => {
    dispatch({ type: 'INCREASE_QUANTITY', payload: { id } })
  }

  const decreaseQuantity = (id) => {
    dispatch({ type: 'DECREASE_QUANTITY', payload: { id } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const cartTotal = cartItems.reduce((sum, item) => {
    const discounted = item.price * (1 - (item.discountPercentage || 0) / 100)
    return sum + discounted * item.quantity
  }, 0)

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalItems,
    cartTotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}