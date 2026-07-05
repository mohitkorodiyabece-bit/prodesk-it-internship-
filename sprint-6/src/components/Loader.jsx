import React from 'react'

function Loader({ text = 'Loading...' }) {
  return (
    <div className="loader-wrap" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true"></div>
      <p className="loader-text">{text}</p>
    </div>
  )
}

export default Loader