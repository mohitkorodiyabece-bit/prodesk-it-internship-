# AI Cover Letter Generator

A responsive, SaaS-style landing page and tool for generating professional cover letters. Built with plain HTML5, CSS3, and vanilla JavaScript (ES6) — no frameworks, no build step.

## Features

- **Landing page** — sticky navbar, animated hero, feature highlights, about section, and footer
- **Cover letter generator** — form with name, job role, target company, and key skills
- **Template gallery** — choose from 5 visual styles (Modern, Classic, Minimal, Creative, Executive) that instantly restyle the generated letter
- **Client-side validation** — required fields with inline error states and focus effects
- **Resume upload (architecture only)** — PDF-only file input with a placeholder text-extraction function, ready for a real `pdf.js` / `pdf-parse` integration
- **AI integration (architecture only)** — placeholder `generateWithAI()` function showing where a real Gemini/OpenAI API call would go, with no hardcoded API key
- **Copy to clipboard** — one-click copy with a "Copied!" confirmation
- **Dark mode** — toggle with preference saved to `localStorage`
- **Form memory** — last entered values and selected template are restored on return visits via `localStorage`
- **Fully responsive** — desktop, tablet, and mobile layouts

## File structure

```
.
├── index.html   # Page structure and markup
├── style.css    # Theme, layout, and responsive styles
├── script.js    # Form logic, validation, templates, and generation
└── README.md
```

## Getting started

No build tools or dependencies are required.

1. Download or clone the three files (`index.html`, `style.css`, `script.js`) into the same folder.
2. Open `index.html` directly in a browser, **or** serve the folder with any static server, for example:
   ```bash
   npx serve .
   ```
3. Navigate to the **Generator** section, fill in the form, and click **Generate Cover Letter**.

## Connecting a real AI provider (optional)

The current letter generation runs entirely client-side using a template string — no external API calls are made. To connect a real AI provider such as OpenAI or Gemini:

1. Never put a real API key directly in `script.js` — client-side keys are publicly visible.
2. Create a small backend (serverless function, Node/Express route, etc.) that holds the API key as an environment variable and forwards requests to the provider.
3. Update the `AI_ENDPOINT` constant in `script.js` to point at your backend route instead of the provider directly.
4. Replace the placeholder logic inside `generateWithAI()` with a real `fetch()` call to your backend.

## Connecting real resume parsing (optional)

`extractResumeText()` in `script.js` currently returns a placeholder string. To parse real PDF resumes:

- **Client-side:** integrate [pdf.js](https://mozilla.github.io/pdf.js/) to extract text directly in the browser.
- **Server-side:** send the uploaded file to a backend endpoint using `pdf-parse` (or similar) and return the extracted text to the frontend.

## Browser support

Works in all modern evergreen browsers (Chrome, Firefox, Safari, Edge). Uses `IntersectionObserver`, the Clipboard API, and CSS custom properties, all widely supported.

## License

Free to use and modify for personal or commercial projects.