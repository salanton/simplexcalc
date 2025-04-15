import { useState, useEffect } from 'react';
import CalculatorForm from './components/CalculatorForm';
import ResultsDisplay from './components/ResultsDisplay';

function App() {
  const [data, setData] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'simplex_coco.json')
      .then((res) => res.json())
      .then((json) => setData(json['Simplex Coco']));
  }, []);

  const handleCalculate = (stage, liters) => {
    if (!data || !data[stage]) return;
    const result = Object.entries(data[stage]).reduce((acc, [name, value]) => {
      if (value === '—') return { ...acc, [name]: '—' };
      const range = value.split('–').map((v) => parseFloat(v));
      const from = range[0] * liters;
      const to = range[1] ? range[1] * liters : from;
      acc[name] = from === to ? `${from.toFixed(1)} мл` : `${from.toFixed(1)} – ${to.toFixed(1)} мл`;
      return acc;
    }, {});
    setResults({ stage, liters, result });
  };

  return (
    <main className="p-4 max-w-xl mx-auto text-sm">
      <h1 className="text-2xl font-bold mb-4">Калькулятор удобрений Simplex Coco</h1>
      {data && <CalculatorForm stages={Object.keys(data)} onCalculate={handleCalculate} />}
      {results && <ResultsDisplay {...results} />}
    </main>
  );
}

export default App;