import { useState } from "react";

function format(number) {
  return /\.\d{5}/.test(number) ? Number(number).toFixed(4) : number;
}

export default function App() {
  const [celsius, setCelsius] = useState("");
  const [fahrenheit, setFahrenheit] = useState("");

  function convert(value, setDestination, calculateValue) {
    const numericValue = Number(value);
    const isValid = !Number.isNaN(numericValue) && Boolean(value);
    setDestination(isValid ? format(calculateValue(numericValue)) : "");
  }

  return (
    <>
      <div>
      <label>
        <input
          type="number"
          value={celsius}
          onChange={(event) => {
            const newValue = event.target.value;
            setCelsius(newValue);
            convert(newValue, setFahrenheit, (value) => (value * 9) / 5 + 32);
          }}
        />
        <div>Celsius</div>
        </label>
      </div>
      
      <div> = </div>

      <label>
        <input
          type="number"
          value={fahrenheit}
          onChange={(event) => {
            const newValue = event.target.value;
            setFahrenheit(newValue);
            convert(newValue, setCelsius, (value) => ((value - 32) * 5) / 9);
          }}
        />
        <div>Fahrenheit</div>
      </label>
      <div></div>
    </>
  );
}