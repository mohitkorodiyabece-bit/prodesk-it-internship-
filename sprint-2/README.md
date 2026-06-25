# 💸 Cash-Flow

A personal finance dashboard built with pure HTML, CSS, and Vanilla JavaScript. Track your salary, log expenses, visualize spending, and export reports — all in the browser with no frameworks or build tools required.

---

## 📁 Project Structure

```
cash-flow/
├── index.html      # App layout and structure
├── style.css       # All styling (dark theme, responsive)
├── script.js       # All logic (state, localStorage, chart, PDF)
└── README.md       # This file
```

---

## 🚀 How to Run

1. Download or clone the project folder
2. Open the `cash-flow/` folder in **VS Code**
3. Install the **Live Server** extension (if you haven't already)
4. Right-click `index.html` → click **Open with Live Server**
5. The app opens at `http://127.0.0.1:5500`

> No npm, no build step, no terminal commands needed.

---

## ✨ Features

| Feature | Description |
|---|---|
| 💰 Salary Input | Set your monthly salary |
| ➕ Add Expenses | Log expenses with a name and amount |
| 🗑 Delete Expenses | Remove any expense instantly |
| 📊 Pie Chart | Visual breakdown of expenses vs remaining balance |
| 🧮 Live Totals | Summary cards update in real time |
| ⚠️ Low Balance Warning | Banner + red text when balance drops below 10% of salary |
| 💾 localStorage | All data persists across page reloads |
| 🌍 Currency Selector | Switch between INR, USD, EUR, GBP with live exchange rates |
| 📄 PDF Report | Download a formatted report with one click |
| 🔄 Reset Button | Clear all data with a confirmation prompt |

---

## 🛠 Tech Stack

- **HTML5** — structure
- **CSS3** — styling (dark theme, CSS variables, responsive grid)
- **Vanilla JavaScript (ES6+)** — all logic, no frameworks

### CDN Libraries

| Library | Version | Purpose |
|---|---|---|
| [Chart.js](https://www.chartjs.org/) | Latest | Pie chart visualization |
| [jsPDF](https://github.com/parallax/jsPDF) | 2.5.1 | PDF report generation |
| [Frankfurter API](https://www.frankfurter.app/) | Free / no key | Live currency exchange rates |

---

## 📖 How to Use

### 1. Set Your Salary
Enter your monthly salary in the **Set Monthly Salary** field and click **Set Salary**.

### 2. Add an Expense
Fill in the **Expense Name** and **Amount** fields, then click **Add Expense**. The expense appears in the log and the chart updates instantly.

### 3. Delete an Expense
Click the **Delete** button next to any expense to remove it. Totals and the chart update immediately.

### 4. Change Currency
Use the dropdown in the header to switch between ₹ INR, $ USD, € EUR, and £ GBP. Exchange rates are fetched live from the Frankfurter API. If the API is unavailable, values stay in INR.

### 5. Download PDF Report
Click **⬇ PDF Report** in the header to download a formatted report with your salary, expenses, remaining balance, and the current date.

### 6. Reset Everything
Click **↺ Reset** in the header. A confirmation dialog will appear. Confirming clears all data from the app and localStorage.

---

## ⚠️ Low Balance Warning

If your **Remaining Balance falls below 10% of your salary**, the app will:
- Show a yellow warning banner at the top of the page
- Turn the Remaining Balance card value **red**

The warning disappears automatically once the balance goes back above the threshold.

---

## 💾 Data Persistence

The following data is saved to `localStorage` and restored on every page reload:

- Salary
- All expenses (name, amount, ID)
- Selected currency

---

## 🌐 Currency Support

Base currency is **INR**. Exchange rates are fetched from:

```
https://api.frankfurter.app/latest?from=INR
```

Supported currencies:
- ₹ INR (Indian Rupee) — base
- $ USD (US Dollar)
- € EUR (Euro)
- £ GBP (British Pound)

> If the API call fails (e.g. no internet), the app continues to work normally in INR without any errors.

---

## 📄 PDF Report Contents

The downloaded `cashflow-report.pdf` includes:

- Report title and generation date
- Total Salary
- Total Expenses
- Remaining Balance
- Low balance warning (if applicable)
- Full numbered expense log with amounts

---

## 🖥 Browser Support

Works in all modern browsers:

- Google Chrome ✅
- Mozilla Firefox ✅
- Microsoft Edge ✅
- Safari ✅

---

## 📝 License

Free to use for personal projects.