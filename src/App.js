import React, { useState } from "react";
import "./App.css";

function App() {
  const [displayValue, setDisplayValue] = useState("0");
  const [operand1, setOperand1] = useState(null);
  const [operator, setOperator] = useState(null);

  const handleNumberClick = (num) => {
    if (displayValue === "0" && num !== ".") {
      setDisplayValue(num.toString());
    } else if (num === "." && displayValue.includes(".")) {
      return; // Allow only one decimal point
    } else {
      setDisplayValue(displayValue + num.toString());
    }
  };

  const handleOperatorClick = (op) => {
    setOperator(op);
    setOperand1(parseFloat(displayValue));
    setDisplayValue("0");
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
      setDisplayValue(result.toString());
      setOperand1(null);
      setOperator(null);
    }
  };

  const handleClear = () => {
    setDisplayValue("0");
    setOperand1(null);
    setOperator(null);
  };

  const handleDelete = () => {
    if (displayValue.length === 1 || displayValue === "-") {
      setDisplayValue("0");
    } else {
      setDisplayValue(displayValue.slice(0, -1));
    }
  };

  return (
    <div className="App">
      <div className="container_calculadora">
        <div className="pantalla">{displayValue}</div>
        <div className="buttons_calc">
          <button className="grey ac" onClick={handleClear}>AC</button>
          <button className="grey" onClick={() => handleNumberClick("(")}>(</button>
          <button className="grey">%</button>
          <button className="grey" onClick={() => handleOperatorClick("÷")}>÷</button>
          <button onClick={() => handleNumberClick("7")}>7</button>
          <button onClick={() => handleNumberClick("8")}>8</button>
          <button onClick={() => handleNumberClick("9")}>9</button>
          <button className="grey" onClick={() => handleOperatorClick("X")}>X</button>
          <button onClick={() => handleNumberClick("4")}>4</button>
          <button onClick={() => handleNumberClick("5")}>5</button>
          <button onClick={() => handleNumberClick("6")}>6</button>
          <button className="grey" onClick={() => handleOperatorClick("-")}>-</button>
          <button onClick={() => handleNumberClick("1")}>1</button>
          <button onClick={() => handleNumberClick("2")}>2</button>
          <button onClick={() => handleNumberClick("3")}>3</button>
          <button className="grey" onClick={() => handleOperatorClick("+")}>+</button>
          <button onClick={() => handleNumberClick("0")}>0</button>
          <button onClick={() => handleNumberClick(".")}>.</button>
          <button onClick={handleDelete}>⌫</button>
          <button className="grey" onClick={handleEqualClick}>=</button>
        </div>
      </div>
    </div>
  );
}

export default App;
