# 🚀 Multi-Step Onboarding Wizard

A modern, responsive, and production-style multi-step onboarding wizard built with **React**, **Vite**, **React Hook Form**, and **Zod**.

This project demonstrates advanced form architecture, step-based navigation, real-time validation, persistent form data across views, schema-based validation, and a polished SaaS-style user experience.

---

## 📌 Project Overview

Modern SaaS and FinTech applications avoid overwhelming users with large forms containing many fields at once.

This project solves that problem by dividing the onboarding process into multiple focused steps:

1. **Personal Information**
2. **Account Details**
3. **Review & Submit**
4. **Success State**

The application preserves all user-entered data while navigating between steps and validates input in real time.

---

## ✨ Features

### ✅ Multi-Step Form Architecture

The onboarding process is divided into three distinct views:

* Personal Info
* Account Details
* Review & Submit

React conditional rendering is used to display only the currently active step.

---

### ✅ Step Navigation

Users can navigate through the onboarding flow using:

* Next
* Back
* Submit
* Start Over

Navigation behavior:

```text
Step 1 → Step 2 → Step 3 → Success
```

Users can also move backward without losing previously entered information.

---

### ✅ Persistent Form Data

Form data remains available when users navigate between steps.

Example:

```text
Step 1
↓
Step 2
↓
Back to Step 1
```

All previously entered values remain preserved.

---

### ✅ React Hook Form Integration

The project uses:

```text
react-hook-form
```

React Hook Form manages:

* Form registration
* Field values
* Validation state
* Error handling
* Submission
* Reset behavior
* Step-specific validation

This reduces unnecessary re-renders and avoids manually managing every field with separate `useState` hooks.

---

### ✅ Zod Schema Validation

The project uses:

```text
zod
```

All validation rules are defined inside a centralized schema.

The schema validates:

* Full Name
* Email Address
* Phone Number
* Date of Birth
* Username
* Password
* Confirm Password
* Account Type

---

### ✅ React Hook Form + Zod Resolver

The application connects React Hook Form with Zod using:

```text
@hookform/resolvers/zod
```

This provides centralized schema-based form validation.

---

### ✅ Real-Time Validation

Validation occurs while the user is typing.

The application does not wait until final form submission.

Examples:

* Invalid email immediately displays an error
* Short password immediately displays validation feedback
* Password mismatch immediately appears
* Invalid username immediately displays an error

---

### ✅ Conditional Button Disabling

The `Next` button remains disabled until all required fields in the current step are valid.

#### Step 1

The user must correctly complete:

* Full Name
* Email
* Phone Number
* Date of Birth

#### Step 2

The user must correctly complete:

* Username
* Password
* Confirm Password
* Account Type

---

### ✅ Show / Hide Password

The Account Details step includes password visibility controls.

Users can dynamically toggle between:

```text
password
```

and:

```text
text
```

for both:

* Password
* Confirm Password

---

### ✅ Dynamic Progress Indicator

A responsive progress indicator displays the user's current position in the onboarding process.

The progress states include:

* Active Step
* Completed Step
* Upcoming Step

Progress updates dynamically while navigating forward or backward.

---

### ✅ Review & Submit Screen

Before final submission, users can review all entered information.

The Review screen displays:

* Full Name
* Email
* Phone
* Date of Birth
* Username
* Masked Password
* Account Type

For security, the actual password is not displayed on the review screen.

---

### ✅ Final Submission Payload

When the user submits the completed onboarding form, the final unified data object is logged to the browser console.

Example:

```js
console.log("Final Onboarding Payload:", finalData);
```

---

### ✅ Success UI State

After successful submission, the wizard is replaced with a polished success screen.

The success state includes:

* Success checkmark
* Completion heading
* Personalized message
* Start Over button

---

### ✅ Start Over Functionality

The `Start Over` button:

* Clears all form values
* Resets React Hook Form
* Resets validation
* Resets progress
* Returns to Step 1

---

## 🛠️ Tech Stack

| Technology      | Purpose                               |
| --------------- | ------------------------------------- |
| React           | Component-based frontend architecture |
| Vite            | Fast development and build tooling    |
| JavaScript ES6+ | Application logic                     |
| React Hook Form | Form state management                 |
| Zod             | Schema-based validation               |
| Zod Resolver    | React Hook Form and Zod integration   |
| CSS3            | Responsive styling and animations     |

---

## 📂 Project Structure

```text
project-folder/
│
├── index.html
├── package.json
├── vite.config.js
│
├── public/
│
└── src/
    │
    ├── components/
    │   ├── ProgressBar.jsx
    │   ├── PersonalInfoStep.jsx
    │   ├── AccountDetailsStep.jsx
    │   ├── ReviewStep.jsx
    │   └── SuccessScreen.jsx
    │
    ├── schemas/
    │   └── onboardingSchema.js
    │
    ├── App.jsx
    ├── App.css
    ├── index.css
    └── main.jsx
```

---

## 🧩 Component Architecture

### `App.jsx`

Acts as the main parent orchestrator.

Responsibilities:

* Current step management
* Success state management
* React Hook Form initialization
* Unified payload handling
* Step navigation
* Step-specific validation
* Final submission
* Form reset

---

### `ProgressBar.jsx`

Responsible for:

* Step indicators
* Active step state
* Completed step state
* Upcoming step state
* Progress line
* Dynamic visual progression

---

### `PersonalInfoStep.jsx`

Responsible for Step 1 fields:

* Full Name
* Email Address
* Phone Number
* Date of Birth

Also handles:

* React Hook Form registration
* Validation messages
* Field states
* Next button

---

### `AccountDetailsStep.jsx`

Responsible for Step 2 fields:

* Username
* Password
* Confirm Password
* Account Type

Also handles:

* Real-time validation
* Show/Hide Password
* Back navigation
* Next navigation

---

### `ReviewStep.jsx`

Responsible for:

* Displaying entered information
* Masking the password
* Back navigation
* Final submission

---

### `SuccessScreen.jsx`

Responsible for:

* Success state
* Completion message
* Success visual
* Start Over functionality

---

### `onboardingSchema.js`

Contains the centralized Zod validation schema.

Validation rules include:

* Required fields
* Email format validation
* Phone number validation
* Date validation
* Username regex validation
* Password complexity validation
* Password confirmation matching

---

## ✅ Validation Rules

### Full Name

* Required
* Minimum 2 characters
* Cannot contain only whitespace

---

### Email Address

* Required
* Must be a valid email address

Example:

```text
name@example.com
```

---

### Phone Number

* Required
* Must contain 10 digits

---

### Date of Birth

* Required
* Cannot be a future date

---

### Username

* Required
* Minimum 3 characters
* Maximum 20 characters
* Only letters, numbers, and underscores allowed

Example:

```text
mohit_123
```

---

### Password

Password must contain:

* Minimum 8 characters
* At least one uppercase letter
* At least one lowercase letter
* At least one number
* At least one special character

Example format:

```text
Secure@123
```

---

### Confirm Password

* Required
* Must exactly match the Password field

---

### Account Type

Available options:

* Personal
* Business
* Creator
* Enterprise

---

## 🚀 Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Move into the project directory:

```bash
cd <your-project-folder>
```

Install project dependencies:

```bash
npm install
```

Install required form libraries if they are not already present:

```bash
npm install react-hook-form zod @hookform/resolvers
```

---

## ▶️ Run the Project

Start the Vite development server:

```bash
npm run dev
```

Vite will display a local development URL similar to:

```text
http://localhost:5173/
```

Open the displayed URL in your browser.

---

## 🏗️ Build for Production

Create a production build:

```bash
npm run build
```

The optimized application will be generated inside the:

```text
dist/
```

directory.

---

## 🔍 Preview Production Build

Run:

```bash
npm run preview
```

This allows you to locally preview the production build.

---

## 🎨 UI / UX Design

The project uses a premium SaaS and FinTech-inspired visual style.

Design characteristics include:

* Deep navy background
* Blue and indigo gradients
* Violet accents
* Cyan highlights
* Glassmorphism
* Soft shadows
* Rounded cards
* Animated progress states
* Smooth transitions
* Responsive layouts
* Focus-visible accessibility states

---

## 📱 Responsive Design

The interface is optimized for:

* Desktop
* Laptop
* Tablet
* Mobile

The responsive layout supports smaller screens down to approximately:

```text
320px
```

On larger screens, the page uses a two-column structure:

```text
Branding Panel | Onboarding Wizard
```

On mobile devices, the interface stacks vertically.

---

## ♿ Accessibility

Accessibility features include:

* Semantic HTML
* Proper form labels
* Keyboard-accessible controls
* `aria-invalid`
* `aria-describedby`
* Accessible password toggles
* Visible focus indicators
* Proper disabled button states
* Accessible progress semantics

---

## 🔒 Security Considerations

The project follows basic frontend security practices:

* Passwords are not stored in localStorage
* Passwords are not stored in sessionStorage
* Passwords are masked on the Review screen
* No credentials are sent to external APIs
* No backend server is used
* No external authentication system is used

> Note: The final payload is logged to the browser console only because it is explicitly required by the sprint specification. In a real production application, passwords should never be logged.

---

## 🎯 Sprint Requirement Coverage

### Phase 1 — Base MVP

* ✅ Three distinct onboarding views
* ✅ Conditional rendering
* ✅ Next navigation
* ✅ Back navigation
* ✅ Persistent form values
* ✅ Unified payload
* ✅ Final submission
* ✅ Console logging
* ✅ Success UI

---

### Phase 2 — Priority 1

* ✅ Real-time validation
* ✅ Regex-based validation
* ✅ Conditional Next button disabling
* ✅ Show/Hide Password
* ✅ Dynamic progress indicator
* ✅ Active step states
* ✅ Completed step states

---

### Phase 3 — Stretch Goals

* ✅ React Hook Form
* ✅ Zod schema validation
* ✅ Zod Resolver integration
* ✅ Cross-field password validation
* ✅ Modular component architecture
* ✅ Step-specific validation logic

---

## 🧪 Recommended Testing Scenarios

Test the following application flows:

1. Enter an invalid email and verify immediate validation.
2. Correct the email and verify the error disappears.
3. Verify Step 1 Next remains disabled with incomplete fields.
4. Complete Step 1 and navigate to Step 2.
5. Enter a weak password and verify validation feedback.
6. Enter mismatched passwords and verify the error.
7. Fix the password confirmation.
8. Complete Step 2 and navigate to Review.
9. Verify all entered values are displayed correctly.
10. Verify the real password is not visible.
11. Navigate backward.
12. Verify all data remains preserved.
13. Navigate forward again.
14. Submit the form.
15. Verify the final payload in the browser console.
16. Verify the success screen appears.
17. Click Start Over.
18. Verify the entire form resets.

---

## 📈 Future Improvements

Possible future enhancements include:

* Backend API integration
* User authentication
* OTP verification
* Email verification
* Profile image upload
* KYC document upload
* Multi-factor authentication
* Server-side validation
* Database integration
* Encrypted credential handling
* Save and resume onboarding
* API error states
* Automated unit testing
* End-to-end testing

---

## 👨‍💻 Author

**Mohit Korodiya**

Frontend Development Project
Built as part of a React engineering sprint focused on:

* Component Architecture
* Advanced Form Management
* State Management
* Schema Validation
* Responsive UI Development

---

## 📄 License

This project is created for educational, internship, portfolio, and demonstration purposes.
