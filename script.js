/* ============================================================
   CASH-FLOW · script.js
   ============================================================ */

"use strict";

// ── State ───────────────────────────────────────────────────
const state = {
  salary: 0,
  expenses: [],
  currency: "INR",
  rates: {}
};

// ── Currency Symbols ────────────────────────────────────────
const SYMBOLS = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };

// ── DOM References ──────────────────────────────────────────
const salaryInput     = document.getElementById("salaryInput");
const setSalaryBtn    = document.getElementById("setSalary");
const salaryError     = document.getElementById("salaryError");
const expenseName     = document.getElementById("expenseName");
const expenseAmount   = document.getElementById("expenseAmount");
const addExpenseBtn   = document.getElementById("addExpense");
const expenseError    = document.getElementById("expenseError");
const expenseList     = document.getElementById("expenseList");
const emptyState      = document.getElementById("emptyState");
const displaySalary   = document.getElementById("displaySalary");
const displayExpenses = document.getElementById("displayExpenses");
const displayBalance  = document.getElementById("displayBalance");
const warningBanner   = document.getElementById("warningBanner");
const currencySelect  = document.getElementById("currencySelect");
const downloadPdfBtn  = document.getElementById("downloadPdf");
const resetBtn        = document.getElementById("resetBtn");
const chartHint       = document.getElementById("chartHint");

// ── Chart ───────────────────────────────────────────────────
let pieChart = null;

function initChart() {
  const ctx = document.getElementById("pieChart").getContext("2d");
  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Remaining Balance", "Total Expenses"],
      datasets: [{
        data: [0, 0],
        backgroundColor: ["#34d399", "#f87171"],
        borderColor: ["#1f2436", "#1f2436"],
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#8a93b2",
            font: { family: "Inter", size: 13 },
            padding: 16,
            boxWidth: 12,
            boxHeight: 12
          }
        },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              const sym = SYMBOLS[state.currency] || state.currency;
              const val = convertAmount(ctx.raw);
              return ` ${sym}${formatNumber(val)}`;
            }
          }
        }
      }
    }
  });
}

function updateChart() {
  const totalExpenses = getTotalExpenses();
  const remaining     = Math.max(state.salary - totalExpenses, 0);

  if (!pieChart) return;

  pieChart.data.datasets[0].data = [remaining, totalExpenses];
  pieChart.update();

  if (state.salary > 0) {
    chartHint.textContent = "";
  } else {
    chartHint.textContent = "Set a salary to see your breakdown.";
  }
}

// ── Helpers ─────────────────────────────────────────────────
function getTotalExpenses() {
  return state.expenses.reduce((sum, e) => sum + e.amount, 0);
}

function formatNumber(num) {
  return num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function convertAmount(amount) {
  if (state.currency === "INR" || !state.rates[state.currency]) {
    return amount;
  }
  return amount * (state.rates[state.currency] || 1);
}

function formatCurrency(amount) {
  const sym = SYMBOLS[state.currency] || state.currency + " ";
  return sym + formatNumber(convertAmount(amount));
}

function generateId() {
  return "exp_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
}

function showError(el, msg) {
  el.textContent = msg;
  el.classList.remove("hidden");
}

function clearError(el) {
  el.textContent = "";
  el.classList.add("hidden");
}

// ── Render ───────────────────────────────────────────────────
function renderSummary() {
  const total     = getTotalExpenses();
  const remaining = state.salary - total;

  displaySalary.textContent   = state.salary > 0 ? formatCurrency(state.salary) : "—";
  displayExpenses.textContent = total > 0 || state.salary > 0 ? formatCurrency(total) : "—";
  displayBalance.textContent  = state.salary > 0 ? formatCurrency(remaining) : "—";

  const threshold = state.salary * 0.1;
  const isLow     = state.salary > 0 && remaining < threshold;

  if (isLow) {
    warningBanner.classList.remove("hidden");
    displayBalance.classList.add("low-balance");
  } else {
    warningBanner.classList.add("hidden");
    displayBalance.classList.remove("low-balance");
  }
}

function renderExpenseItem(expense) {
  const existing = document.getElementById(expense.id);
  if (existing) return;

  emptyState.style.display = "none";

  const li = document.createElement("li");
  li.classList.add("expense-item");
  li.id = expense.id;

  li.innerHTML = `
    <div class="expense-info">
      <span class="expense-name">${escapeHtml(expense.name)}</span>
      <span class="expense-amount" data-raw="${expense.amount}">− ${formatCurrency(expense.amount)}</span>
    </div>
    <button class="delete-btn" data-id="${expense.id}">Delete</button>
  `;

  li.querySelector(".delete-btn").addEventListener("click", () => {
    deleteExpense(expense.id);
  });

  expenseList.appendChild(li);
}

function renderAllExpenses() {
  // Clear list (except emptyState)
  Array.from(expenseList.querySelectorAll(".expense-item")).forEach(el => el.remove());
  emptyState.style.display = state.expenses.length === 0 ? "" : "none";

  state.expenses.forEach(renderExpenseItem);
}

function refreshDisplayedAmounts() {
  // Update all rendered expense amounts when currency changes
  document.querySelectorAll(".expense-amount[data-raw]").forEach(el => {
    const raw = parseFloat(el.getAttribute("data-raw"));
    el.textContent = "− " + formatCurrency(raw);
  });
  renderSummary();
}

// ── Set Salary ───────────────────────────────────────────────
function handleSetSalary() {
  clearError(salaryError);
  const val = parseFloat(salaryInput.value);

  if (salaryInput.value.trim() === "") {
    showError(salaryError, "Please enter a salary amount.");
    return;
  }
  if (isNaN(val) || val < 0) {
    showError(salaryError, "Salary must be a positive number.");
    return;
  }

  state.salary = val;
  saveToStorage();
  renderSummary();
  updateChart();
  salaryInput.value = "";
}

// ── Add Expense ──────────────────────────────────────────────
function handleAddExpense() {
  clearError(expenseError);

  const name   = expenseName.value.trim();
  const amount = parseFloat(expenseAmount.value);

  if (!name) {
    showError(expenseError, "Please enter an expense name.");
    return;
  }
  if (expenseAmount.value.trim() === "" || isNaN(amount)) {
    showError(expenseError, "Please enter a valid amount.");
    return;
  }
  if (amount <= 0) {
    showError(expenseError, "Amount must be greater than zero.");
    return;
  }

  const expense = { id: generateId(), name, amount };
  state.expenses.push(expense);

  saveToStorage();
  renderExpenseItem(expense);
  renderSummary();
  updateChart();

  expenseName.value   = "";
  expenseAmount.value = "";
  expenseName.focus();
}

// ── Delete Expense ───────────────────────────────────────────
function deleteExpense(id) {
  state.expenses = state.expenses.filter(e => e.id !== id);

  const li = document.getElementById(id);
  if (li) li.remove();

  if (state.expenses.length === 0) {
    emptyState.style.display = "";
  }

  saveToStorage();
  renderSummary();
  updateChart();
}

// ── localStorage ─────────────────────────────────────────────
function saveToStorage() {
  localStorage.setItem("cf_salary",   JSON.stringify(state.salary));
  localStorage.setItem("cf_expenses", JSON.stringify(state.expenses));
  localStorage.setItem("cf_currency", state.currency);
}

function loadFromStorage() {
  const salary   = localStorage.getItem("cf_salary");
  const expenses = localStorage.getItem("cf_expenses");
  const currency = localStorage.getItem("cf_currency");

  if (salary   !== null) state.salary   = JSON.parse(salary);
  if (expenses !== null) state.expenses = JSON.parse(expenses);
  if (currency !== null) state.currency = currency;
}

// ── Currency / Exchange Rate ──────────────────────────────────
async function fetchRates() {
  try {
    const res  = await fetch("https://api.frankfurter.app/latest?from=INR");
    const data = await res.json();
    if (data && data.rates) {
      state.rates = data.rates;
    }
  } catch (err) {
    // API failure — display values stay in INR
    console.warn("Exchange rate fetch failed. Falling back to INR.");
  }
}

async function handleCurrencyChange() {
  state.currency = currencySelect.value;
  saveToStorage();

  if (state.currency !== "INR" && !state.rates[state.currency]) {
    await fetchRates();
  }

  refreshDisplayedAmounts();
  updateChart();
}

// ── PDF Download ──────────────────────────────────────────────
function handleDownloadPdf() {
  const { jsPDF } = window.jspdf;
  const doc        = new jsPDF();
  const sym        = SYMBOLS[state.currency] || state.currency + " ";
  const now        = new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  });
  const total      = getTotalExpenses();
  const balance    = state.salary - total;

  let y = 20;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(40, 60, 140);
  doc.text("Cash-Flow Report", 14, y);

  y += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 120);
  doc.text(`Generated on ${now}`, 14, y);

  y += 12;
  doc.setDrawColor(200, 200, 220);
  doc.line(14, y, 196, y);
  y += 10;

  // Summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 60);
  doc.text("Summary", 14, y);
  y += 8;

  const summaryData = [
    ["Total Salary",     sym + formatNumber(convertAmount(state.salary))],
    ["Total Expenses",   sym + formatNumber(convertAmount(total))],
    ["Remaining Balance",sym + formatNumber(convertAmount(balance))]
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  summaryData.forEach(([label, value]) => {
    doc.setTextColor(80, 80, 100);
    doc.text(label + ":", 14, y);
    doc.setTextColor(30, 30, 60);
    doc.setFont("helvetica", "bold");
    doc.text(value, 80, y);
    doc.setFont("helvetica", "normal");
    y += 8;
  });

  if (balance < state.salary * 0.1 && state.salary > 0) {
    y += 4;
    doc.setTextColor(200, 60, 60);
    doc.setFontSize(10);
    doc.text("⚠ Balance is below 10% of salary.", 14, y);
    y += 6;
  }

  y += 6;
  doc.setDrawColor(200, 200, 220);
  doc.line(14, y, 196, y);
  y += 10;

  // Expense list
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 60);
  doc.text("Expense Log", 14, y);
  y += 8;

  if (state.expenses.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.setTextColor(150, 150, 170);
    doc.text("No expenses recorded.", 14, y);
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    state.expenses.forEach((exp, i) => {
      if (y > 270) { doc.addPage(); y = 20; }

      doc.setTextColor(80, 80, 100);
      doc.text(`${i + 1}. ${exp.name}`, 14, y);
      doc.setTextColor(180, 60, 60);
      doc.setFont("helvetica", "bold");
      doc.text(sym + formatNumber(convertAmount(exp.amount)), 140, y);
      doc.setFont("helvetica", "normal");
      y += 8;
    });
  }

  doc.save("cashflow-report.pdf");
}

// ── Escape HTML ───────────────────────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ── Reset ─────────────────────────────────────────────────────
function handleReset() {
  if (!confirm("Reset everything? This will clear your salary, all expenses, and saved data.")) return;

  state.salary   = 0;
  state.expenses = [];
  state.currency = "INR";
  state.rates    = {};

  localStorage.removeItem("cf_salary");
  localStorage.removeItem("cf_expenses");
  localStorage.removeItem("cf_currency");

  currencySelect.value = "INR";
  salaryInput.value    = "";
  expenseName.value    = "";
  expenseAmount.value  = "";

  clearError(salaryError);
  clearError(expenseError);

  renderAllExpenses();
  renderSummary();
  updateChart();
}

// ── Init ──────────────────────────────────────────────────────
function init() {
  loadFromStorage();

  // Set currency select to saved value
  currencySelect.value = state.currency;

  initChart();
  renderAllExpenses();
  renderSummary();
  updateChart();

  // Fetch rates if not base currency
  if (state.currency !== "INR") {
    fetchRates().then(() => {
      refreshDisplayedAmounts();
      updateChart();
    });
  }

  // Event Listeners
  setSalaryBtn.addEventListener("click",   handleSetSalary);
  addExpenseBtn.addEventListener("click",  handleAddExpense);
  downloadPdfBtn.addEventListener("click", handleDownloadPdf);
  resetBtn.addEventListener("click",       handleReset);
  currencySelect.addEventListener("change", handleCurrencyChange);

  // Allow Enter key on inputs
  salaryInput.addEventListener("keydown",   e => { if (e.key === "Enter") handleSetSalary(); });
  expenseName.addEventListener("keydown",   e => { if (e.key === "Enter") handleAddExpense(); });
  expenseAmount.addEventListener("keydown", e => { if (e.key === "Enter") handleAddExpense(); });
}

document.addEventListener("DOMContentLoaded", init);