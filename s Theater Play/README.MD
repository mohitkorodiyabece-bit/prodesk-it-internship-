# The Last Curtain — Theater Play Landing Page

A responsive, accessible static landing page for a fictional theater production, "The Last Curtain." Built with semantic HTML5, vanilla CSS3, and vanilla JavaScript ES6+ — no frameworks, no build tools, no dependencies.

## Overview

This project replaces a manual, paper-and-spreadsheet-based workflow with a single static page that floor staff can use to view the performance schedule and take reservation requests. It is designed to run entirely in the browser with no backend or external API.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure and content |
| `style.css` | Design system and responsive styling |
| `script.js` | Interactivity, validation, and simulated async behavior |

## How to Run

No installation or build step is required.

1. Open `index.html` directly in a browser, **or**
2. Serve the folder with VS Code's Live Server extension for auto-reload during editing.

## Features

- **Responsive layout** — tested down to 320px, with breakpoints at 1024px, 900px, 768px, and 480px
- **Accessible navigation** — skip link, keyboard-operable mobile menu with correct `aria-expanded` state
- **Performance schedule** — live search/filter across 6 sample performances, with an accessible empty state when no results match
- **Reservation form** — full client-side validation (name, email, performance selection, seat count, message length) with inline error messages, `aria-invalid`, and `aria-describedby`
- **Input sanitization** — a reusable `sanitizeInput()` utility guards against basic XSS before values are stored or rendered; all dynamic content is inserted with `textContent`, never `innerHTML`
- **Simulated async submission** — the reservation form simulates network latency with a Promise/`setTimeout`, showing a disabled button, spinner, and `aria-busy` state, wrapped in `async/await` with `try/catch/finally`
- **Reduced motion support** — respects `prefers-reduced-motion`
- **Console analytics simulation** — logs simulated, PII-free analytics events (e.g. schedule search, mobile nav open, reservation submitted) to the browser console only

## Design System

All colors, spacing, and radii are defined as CSS custom properties in `:root` in `style.css`, using a strict monochromatic palette (black, near-black, white, off-white, grays) and an 8px-based spacing scale (8 / 16 / 24 / 32 / 48 / 64).

## Browser Support

Any modern evergreen browser (Chrome, Firefox, Safari, Edge). No polyfills are included or required.

## Notes

- This is a static frontend only — there is no backend, database, or real network request. Form "submission" and analytics logging are simulated for demonstration purposes.
- No API keys, secrets, or real credentials are used anywhere in this project.