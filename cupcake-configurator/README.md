# 🧁 Cupcake Configurator for Artisan Bakery

A responsive **Vite + React** application that helps Artisan Bakery staff create, validate, store, and manage cupcake configurations digitally.

The project replaces manual paper-based and spreadsheet workflows with a structured, accessible, and reliable interface designed for bakery floor staff.

---

## 📌 Ticket Information

- **Ticket ID:** ENG-52972
- **Epic:** Core Infrastructure Overhaul
- **Priority:** P1 (High)
- **Story Points:** 5
- **Project:** Cupcake Configurator for Artisan Bakery

---

## 🎯 Project Objective

Artisan Bakery currently manages cupcake configurations using paper records and Excel sheets. This can lead to:

- Data loss
- Operational delays
- Inconsistent records
- Manual entry errors

The Cupcake Configurator provides a digital workflow where staff can quickly create and manage structured cupcake configurations.

---

## ✨ Features

### Cupcake Configuration Form

Users can configure:

- Customer Name
- Cupcake Flavor
- Cupcake Size
- Frosting
- Topping
- Quantity
- Special Instructions

### Configuration Management

- Add new cupcake configurations
- View all saved configurations
- Delete individual configurations
- Clear all configurations
- Display total configuration count
- Display total cupcake quantity

### Validation and Error Handling

The application handles invalid input by:

- Preventing invalid submissions
- Highlighting invalid fields
- Showing inline error messages
- Keeping valid entered data when validation fails
- Moving focus to the first invalid field where practical

### Empty State

When no cupcake configurations exist, the interface displays:

> No data found

with supporting guidance instead of showing a blank screen.

### Slow Connectivity Simulation

The project simulates asynchronous saving to represent slow or unstable connectivity:

- Visual loading spinner
- Disabled submit button while saving
- Duplicate submission prevention
- Loading status text

### Local Persistence

Cupcake configurations are stored in browser `localStorage`.

This allows data to remain available after page refreshes and improves reliability in spotty-connectivity environments.

The implementation safely handles:

- Corrupted localStorage data
- JSON parsing failures
- Unavailable localStorage access

### Security

User-generated text is sanitized before storage.

The project:

- Sanitizes Customer Name
- Sanitizes Special Instructions
- Avoids `dangerouslySetInnerHTML`
- Avoids raw HTML rendering
- Protects against basic XSS injection attempts

### Accessibility

The interface is designed with accessibility in mind:

- Semantic HTML
- Visible form labels
- Keyboard navigation
- `aria-invalid`
- `aria-describedby`
- Accessible loading states
- Visible `:focus-visible` styles
- Clear validation messages
- Reduced-motion support

### Telemetry Simulation

Primary actions log simulated analytics events to the browser console.

Examples:

```text
[Analytics] User interacted with Cupcake Configurator - Configuration Added
```

```text
[Analytics] User interacted with Cupcake Configurator - Configuration Deleted
```

```text
[Analytics] User interacted with Cupcake Configurator - All Configurations Cleared
```

No analytics data is sent to an external server.

---

## 🛠️ Tech Stack

- React
- Vite
- JavaScript
- CSS3
- Oxlint

React fundamentals used:

- `useState`
- `useEffect`
- Props
- Prop drilling

The project intentionally does **not** use:

- Redux
- React Router
- Context API
- TypeScript
- Tailwind CSS
- Bootstrap
- External state-management libraries
- Backend APIs

---

## 📁 Project Structure

```text
cupcake-configurator/
├── src/
│   ├── components/
│   │   ├── CupcakeForm.jsx
│   │   ├── CupcakeList.jsx
│   │   ├── CupcakeCard.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── EmptyState.jsx
│   ├── utils/
│   │   └── sanitizeInput.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── README.md
```

---

## 🚀 Running the Project Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Open the local Vite URL

Vite will display a local development URL in the terminal, typically:

```text
http://localhost:5173/
```

---

## 🧹 Linting

This project uses **Oxlint** instead of ESLint.

Run the lint command configured in the project:

```bash
npm run lint
```

The project is intended to pass linting with:

- Zero warnings
- Zero errors
- No unused imports
- No unused variables

---

## 🧁 Cupcake Configuration Data Model

Each saved configuration follows a consistent object structure:

```js
{
  id: "unique-id",
  customerName: "Mohit",
  flavor: "Chocolate",
  size: "Regular",
  frosting: "Vanilla Buttercream",
  topping: "Sprinkles",
  quantity: 6,
  specialInstructions: "Less sweet",
  createdAt: "timestamp"
}
```

---

## ✅ Validation Rules

### Customer Name

- Required
- Minimum 2 characters
- Maximum 50 characters

### Flavor

- Required

### Size

- Required

### Frosting

- Required

### Topping

- Required

### Quantity

- Required
- Minimum 1
- Maximum 100
- Must be numeric

### Special Instructions

- Optional
- Maximum 250 characters

---

## 💾 Local Storage

The application stores data using the following browser storage key:

```text
artisanBakeryCupcakes
```

The application safely falls back to an empty list if stored data is malformed or unavailable.

---

## 🔐 Security Notes

- No API keys are required
- No real API keys are hardcoded
- No sensitive PII is hardcoded
- No backend is used
- User text is sanitized before storage
- Raw HTML injection is not used

---

## 📱 Responsive Design

The interface supports:

- Large desktop screens
- Laptops
- Tablets
- Mobile devices

Desktop layouts use a two-column structure where space allows, while smaller screens switch to a stacked single-column layout.

---

## 📋 Definition of Done

- [x] Vite + React architecture
- [x] React `useState`
- [x] React `useEffect`
- [x] Props and prop drilling
- [x] Cupcake configuration form
- [x] Input validation
- [x] Empty state
- [x] Loading indicator
- [x] Duplicate submission prevention
- [x] LocalStorage persistence
- [x] Corrupted storage handling
- [x] Text sanitization
- [x] Basic XSS protection
- [x] Accessibility-focused markup
- [x] Keyboard navigation support
- [x] Analytics simulation
- [x] Responsive layout
- [x] Individual delete action
- [x] Clear-all action
- [x] Dashboard summary statistics
- [x] No real API keys
- [x] Oxlint-compatible code structure

---

## 👨‍💻 Author

**Mohit**

Developed as part of the Prodesk IT internship sprint work.

---

## 📄 License

This project is created for educational and internship purposes.
