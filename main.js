// Global state variables
let currentOp = "";
let prevOp = "";
let operator = undefined;

// DOM element references
let prevText;
let currentText;

// --- UTILITY FUNCTIONS ---

function roundLongDecimals(result) {
  if (result.toString().indexOf(".") !== -1) {
    if (result.toString().split(".")[1].length > 5) {
      return parseFloat(result.toFixed(5));
    }
  }
  return result;
}

function getDisplayNumber(number) {
  const stringNumber = number.toString();
  const integerDigits = parseFloat(stringNumber.split(".")[0]);
  const decimalDigits = stringNumber.split(".")[1];
  let integerDisplay;
  if (isNaN(integerDigits)) {
    integerDisplay = "";
  } else {
    integerDisplay = integerDigits.toLocaleString("en", {
      maximumFractionDigits: 0,
    });
  }
  if (decimalDigits != null) {
    return `${integerDisplay}.${decimalDigits}`;
  } else {
    return integerDisplay;
  }
}

// --- CORE CALCULATOR FUNCTIONS ---

function clear() {
  currentOp = "";
  prevOp = "";
  operator = undefined;
  updateDisplay();
}

function del() {
  currentOp = currentOp.toString().slice(0, -1);
  updateDisplay();
}

function appendNumber(number) {
  if (number === "." && currentOp.includes(".")) return;
  if (currentOp.length > 15) return;
  currentOp = currentOp.toString() + number.toString();
  updateDisplay();
}

function chooseOperation(op) {
  if (currentOp === "") return;
  if (prevOp !== "") {
    compute();
  }
  operator = op;
  prevOp = currentOp;
  currentOp = "";
  updateDisplay();
}

function compute() {
  let computation;
  const prev = parseFloat(prevOp);
  const current = parseFloat(currentOp);

  if (isNaN(prev) || isNaN(current)) return;

  switch (operator) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "×":
      computation = prev * current;
      break;
    case "÷":
      if (current === 0) {
        alert("Error: Can't divide by zero!");
        clear();
        return;
      }
      computation = prev / current;
      break;
    default:
      return;
  }

  currentOp = roundLongDecimals(computation).toString();
  operator = undefined;
  prevOp = "";
}

function updateDisplay() {
  currentText.innerText = getDisplayNumber(currentOp);
  if (operator != null) {
    prevText.innerText = `${getDisplayNumber(prevOp)} ${operator}`;
  } else {
    prevText.innerText = "";
  }
}

// --- EVENT LISTENERS ---

document.addEventListener("DOMContentLoaded", () => {
  const numberBtn = document.querySelectorAll(".numberButton");
  const operandBtn = document.querySelectorAll(".operandButton");
  const equalBtn = document.querySelector(".equalButton");
  const delBtn = document.querySelector(".deleteButton");
  const ACBtn = document.querySelector(".ACBtn");

  prevText = document.getElementById("previous-op");
  currentText = document.getElementById("current-op");

  clear(); // Initialize display

  numberBtn.forEach((button) => {
    button.addEventListener("click", () => {
      appendNumber(button.innerText);
    });
  });

  operandBtn.forEach((button) => {
    button.addEventListener("click", () => {
      chooseOperation(button.innerText);
    });
  });

  equalBtn.addEventListener("click", () => {
    if (prevOp === "" || currentOp === "") return;
    compute();
    updateDisplay();
  });

  ACBtn.addEventListener("click", clear);

  delBtn.addEventListener("click", del);
});
