let displayValue = "0";
let operand1 = null;
let operator = null;

const display = document.getElementById("display");

const handleNumberClick = (num) => {
  if (displayValue === "0" && num !== ".") {
    displayValue = num.toString();
  } else if (num === "." && displayValue.includes(".")) {
    return;
  } else {
    displayValue += num.toString();
  }
  display.textContent = displayValue;
};

const handleOperatorClick = (op) => {
  operator = op;
  operand1 = parseFloat(displayValue);
  displayValue = "0";
};

const handleEqualClick = () => {
  if (operand1 !== null && operator !== null) {
    const operand2 = parseFloat(displayValue);
    let result = 0;
    switch (operator) {
      case "+":
        result = operand1 + operand2;
        break;
      case "-":
        result = operand1 - operand2;
        break;
      case "X":
        result = operand1 * operand2;
        break;
      case "÷":
        result = operand1 / operand2;
        break;
      default:
        break;
    }
    if (result === NaN) {
      displayValue = 'Sintax Error';
    } else {
      displayValue = result.toString();
    }
    display.textContent = displayValue;
    operand1 = null;
    operator = null;
  }
};

const handleClear = () => {
  displayValue = "0";
  operand1 = null;
  operator = null;
  display.textContent = displayValue;
};

const handleDelete = () => {
  if (displayValue.length === 1 || displayValue === "-") {
    displayValue = "0";
  } else {
    displayValue = displayValue.slice(0, -1);
  }
  display.textContent = displayValue;
};
