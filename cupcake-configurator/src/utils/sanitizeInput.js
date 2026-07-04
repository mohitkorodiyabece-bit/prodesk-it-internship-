/**
 * Sanitizes a text input by trimming whitespace and neutralizing
 * characters that could be used for basic HTML/XSS injection before
 * the value is stored in React state.
 * @param {string} value - raw user input
 * @returns {string} sanitized string safe for storing/rendering as text
 */
export function sanitizeInput(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}