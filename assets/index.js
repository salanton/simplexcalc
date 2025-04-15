import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';

const CalculatorForm = ({ stages, onCalculate }) => {
  const [stage, setStage] = useState(stages[0]);
  const [liters, setLiters] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(stage, liters);
  };

  return React.createElement('form', { onSubmit: handleSubmit, style: { marginBottom: '2rem' } }, [
    React.createElement('label', {}, 'Этап роста:'),
    React.createElement('select', {
      value: stage,
      onChange: (e) => setStage(e.target.value),
      style: { display: 'block', marginBottom: '1rem', padding: '0.5rem' }
    }, stages.map(s =>
      React.createElement('option', { key: s, value: s }, s)
    )),
    React.createElement('label', {}, 'Объем раствора (л):'),
    React.createElement('input', {
      type: 'number',
      value: liters,
      min: 0.1,
      step: 0.1,
      onChange: (e) => setLiters(parseFloat(e.target.value)),
      style: { display: 'block', marginBottom: '1rem', padding: '0.5rem' }
    }),
    React.createElement('button', {
      type: 'submit',
      style: { padding: '0.5rem 1rem' }
    }, 'Рассчитать')
  ]);
};

const ResultsDisplay = ({ stage, liters, result }) => {
  return React.createElement('section', {}, [
    React.createElement('h2', {}, `Результаты для этапа: ${stage}`),
    React.createElement('p', {}, `Объем раствора: ${liters} л`),
    React.createElement('ul', {},
      Object.entries(result).map(([name, val]) =>
        React.createElement('li', { key: name }, `${name}: ${val}`)
      )
    )
  ]);
};

const App = () => {
  const [data, setData] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetch('./simplex_coco.json')
      .then(res => res.json())
      .then(json => setData(json["Simplex Coco"]));
  }, []);

  const handleCalculate = (stage, liters) => {
    if (!data || !data[stage]) return;
    const result = Object.entries(data[stage]).reduce((acc, [key, value]) => {
      if (value === '—') {
        acc[key] = '—';
        return acc;
      }
      const [min, max] = value.split('–').map(parseFloat);
      const from = min * liters;
      const to = max ? max * liters : from;
      acc[key] = from === to ? `${from.toFixed(1)} мл` : `${from.toFixed(1)} – ${to.toFixed(1)} мл`;
      return acc;
    }, {});
    setResults({ stage, liters, result });
  };

  if (!data) return React.createElement('p', null, 'Загрузка...');

  return React.createElement('main', { style: { fontFamily: 'sans-serif', padding: '2rem' } }, [
    React.createElement('h1', { style: { fontSize: '24px', marginBottom: '1rem' } }, '✅ Simplex Калькулятор'),
    React.createElement(CalculatorForm, { stages: Object.keys(data), onCalculate: handleCalculate }),
    results && React.createElement(ResultsDisplay, results)
  ]);
};

window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
});
