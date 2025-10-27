// Estado
let expression = ""; // cadena con operadores/paréntesis
let current = "0"; // número que se está escribiendo
let result = null; // último resultado calculado
let history = []; // [{expr, res}]

// Elementos
const display = document.getElementById("display");
const displayExpr = document.getElementById("displayExpr");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const toggleHistoryBtn = document.getElementById("toggle-history");
const clearHistoryBtn = document.getElementById("clearHistory");
const themeToggle = document.getElementById("themeToggle");

// Utilidades
const isOperator = (c) => ["+", "-", "X", "÷", "*", "/"].includes(c);
const sanitize = (expr) => {
  return expr
    .replace(/×|X/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/[^0-9+\-*/().% ]/g, "");
};

const updateDisplay = () => {
  displayExpr.textContent = expression.trim() || "\u00A0";
  display.textContent = (result !== null ? result.toString() : current) || "0";
};

const pushToHistory = (expr, res) => {
  history.unshift({ expr, res });
  history = history.slice(0, 50);
  localStorage.setItem("calc_history", JSON.stringify(history));
  renderHistory();
};

const renderHistory = () => {
  if (!historyList) return;
  historyList.innerHTML = "";
  history.forEach((item, idx) => {
    const li = document.createElement("li");
    const expr = document.createElement("div");
    expr.className = "expr";
    expr.textContent = item.expr;
    const res = document.createElement("div");
    res.className = "res";
    res.textContent = item.res;
    li.appendChild(expr);
    li.appendChild(res);
    li.addEventListener("click", () => {
      // Cargar resultado para continuar operando
      expression = "";
      current = String(item.res);
      result = null;
      updateDisplay();
    });
    historyList.appendChild(li);
  });
};

// Carga inicial
(() => {
  try {
    const saved = JSON.parse(localStorage.getItem("calc_history") || "[]");
    if (Array.isArray(saved)) history = saved;
  } catch {}
  // Tema
  const savedTheme = localStorage.getItem("calc_theme") || "dark";
  document.body.setAttribute("data-theme", savedTheme);
  if (savedTheme === "light") themeToggle.checked = true;
  renderHistory();
  updateDisplay();
})();

// Handlers de UI
const commitCurrentIfNeeded = () => {
  if (current !== "" && current !== "0") {
    expression = `${expression} ${current}`.trim();
    current = "0";
  }
};

const handleNumberClick = (num) => {
  result = null;
  const n = String(num);
  if (current === "0" && n !== ".") current = n;
  else if (n === "." && current.includes(".")) return;
  else current += n;
  updateDisplay();
};

const handleDot = () => handleNumberClick(".");

const handleOperatorClick = (op) => {
  // cambiar operador si el último token fue operador
  result = null;
  if (
    expression &&
    isOperator(expression.trim().slice(-1)) &&
    (current === "0" || current === "")
  ) {
    expression = expression.trim().slice(0, -1) + op;
  } else {
    commitCurrentIfNeeded();
    if (expression === "" && result !== null) expression = String(result);
    expression = `${expression} ${op}`.trim();
  }
  updateDisplay();
};

const handleParen = (paren) => {
  result = null;
  if (paren === "(") {
    // inserta multiplicación implícita si corresponde
    if (current !== "0") {
      // 2( -> 2 × (
      commitCurrentIfNeeded();
      expression = `${expression} X (`.trim();
    } else if (expression && /[0-9)]$/.test(expression.trim())) {
      expression = `${expression} X (`.trim();
    } else {
      expression = `${expression} (`.trim();
    }
  } else {
    // Cerrar paréntesis: añade current si existe
    if (current !== "0") commitCurrentIfNeeded();
    expression = `${expression} )`.trim();
  }
  updateDisplay();
};

const handlePercent = () => {
  // Si hay operador previo: a op b% => a * (b/100)
  const match = expression.trim().match(/(-?\d+(?:\.\d+)?)(?:\s*[+\-X÷]\s*)$/);
  if (match && current && current !== "0") {
    const a = parseFloat(match[1]);
    const b = parseFloat(current);
    const pct = (a * b) / 100;
    current = String(pct);
  } else {
    // Solo dividir current por 100
    current = String(parseFloat(current) / 100);
  }
  result = null;
  updateDisplay();
};

const handleToggleSign = () => {
  if (current === "0") return;
  if (current.startsWith("-")) current = current.slice(1);
  else current = "-" + current;
  result = null;
  updateDisplay();
};

const handleSqrt = () => {
  const v = parseFloat(current);
  if (isNaN(v) || v < 0) {
    result = "Math Error";
  } else {
    current = String(Math.sqrt(v));
    result = null;
  }
  updateDisplay();
};

const handleEqualClick = () => {
  try {
    const full = (expression + (current !== "0" ? ` ${current}` : "")).trim();
    if (!full) return;
    const sanitized = sanitize(full);
    const evaluated = Function(`"use strict"; return (${sanitized});`)();
    if (typeof evaluated === "number" && isFinite(evaluated)) {
      const rounded = +parseFloat(evaluated.toFixed(10));
      result = rounded;
      pushToHistory(full.replace(/X/g, "×").replace(/\//g, "÷"), rounded);
      // preparar para continuar operando con el resultado
      expression = "";
      current = String(rounded);
    } else {
      result = "Error";
    }
  } catch (e) {
    result = "Sintax Error";
  }
  updateDisplay();
};

const handleClear = () => {
  expression = "";
  current = "0";
  result = null;
  updateDisplay();
};

const handleClearEntry = () => {
  current = "0";
  result = null;
  updateDisplay();
};

const handleDelete = () => {
  result = null;
  if (current.length <= 1 || (current.length === 2 && current.startsWith("-")))
    current = "0";
  else current = current.slice(0, -1);
  updateDisplay();
};

// Teclado
window.addEventListener("keydown", (e) => {
  const k = e.key;
  if (/^\d$/.test(k)) return handleNumberClick(k);
  if (k === ".") return handleDot();
  if (k === "+" || k === "-") return handleOperatorClick(k);
  if (k === "*" || k.toLowerCase() === "x") return handleOperatorClick("X");
  if (k === "/") return handleOperatorClick("÷");
  if (k === "%") return handlePercent();
  if (k === "(") return handleParen("(");
  if (k === ")") return handleParen(")");
  if (k === "Enter" || k === "=") return handleEqualClick();
  if (k === "Backspace") return handleDelete();
  if (k === "Escape") return handleClear();
});

// Historial y tema
toggleHistoryBtn?.addEventListener("click", () => {
  const hidden = historyPanel.hasAttribute("hidden");
  if (hidden) historyPanel.removeAttribute("hidden");
  else historyPanel.setAttribute("hidden", "");
});

clearHistoryBtn?.addEventListener("click", () => {
  history = [];
  localStorage.removeItem("calc_history");
  renderHistory();
});

themeToggle?.addEventListener("change", (e) => {
  const next = e.target.checked ? "light" : "dark";
  document.body.setAttribute("data-theme", next);
  localStorage.setItem("calc_theme", next);
});

// Exponer handlers globales para los botones
window.handleNumberClick = handleNumberClick;
window.handleDot = handleDot;
window.handleOperatorClick = handleOperatorClick;
window.handleEqualClick = handleEqualClick;
window.handleClear = handleClear;
window.handleClearEntry = handleClearEntry;
window.handleDelete = handleDelete;
window.handleParen = handleParen;
window.handlePercent = handlePercent;
window.handleToggleSign = handleToggleSign;
window.handleSqrt = handleSqrt;
