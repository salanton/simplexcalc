
import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';

const BaseSelector = ({ selectedBase, setSelectedBase }) =>
  React.createElement('section', { style: { marginBottom: '1rem' } }, [
    React.createElement('h3', {}, 'База:'),
    ['Simplex Coco', 'Advanced X (скоро)', 'Custom Base (скоро)'].map((base, i) =>
      React.createElement('label', { key: i, style: { display: 'block' } }, [
        React.createElement('input', {
          type: 'radio',
          value: base,
          checked: selectedBase === base,
          onChange: () => setSelectedBase(base)
        }),
        ' ', base
      ])
    )
  ]);

const AdditivesSelector = ({ allAdditives, selected, setSelected }) =>
  React.createElement('section', {}, [
    React.createElement('h3', {}, 'Добавки и стимуляторы:'),
    Object.keys(allAdditives).map((name) =>
      React.createElement('label', { key: name, style: { display: 'block' } }, [
        React.createElement('input', {
          type: 'checkbox',
          checked: selected.includes(name),
          onChange: () =>
            setSelected(selected.includes(name)
              ? selected.filter(n => n !== name)
              : [...selected, name])
        }),
        ' ', name
      ])
    )
  ]);

const CalculatorForm = ({ stages, selectedBase, setSelectedBase, additivesList, selectedAdditives, setSelectedAdditives, onCalculate }) => {
  const [stage, setStage] = useState(stages[0]);
  const [liters, setLiters] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(stage, liters, selectedAdditives);
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
    )),
    React.createElement(BaseSelector, { selectedBase, setSelectedBase }),
    React.createElement('div', { style: { marginBottom: '1rem' } },
      React.createElement('strong', {}, 'Показатели раствора будут отображены ниже')),
    React.createElement(AdditivesSelector, {
      allAdditives: additivesList,
      selected: selectedAdditives,
      setSelected: setSelectedAdditives
    }),
    React.createElement('button', {
      type: 'submit',
      style: { marginTop: '1rem', padding: '0.5rem 1rem' }
    }, 'Рассчитать')
  ]);
};

const ResultsDisplay = ({ stage, liters, result, extras }) => {
  return React.createElement('section', {}, [
    React.createElement('h2', {}, `Результаты для этапа: ${stage}`),
    React.createElement('p', {}, `Объем раствора: ${liters} л`),
    React.createElement('ul', {},
      Object.entries(result).map(([name, val]) =>
        React.createElement('li', { key: name }, `${name}: ${val}`)
      )
    ),
    React.createElement('hr'),
    React.createElement('p', { style: { marginTop: '1rem' } }, 'Показатели раствора:'),
    React.createElement('ul', {},
      Object.entries(extras).map(([key, val]) =>
        React.createElement('li', { key: key }, `${key}: ${val}`)
      )
    )
  ]);
};

const App = () => {
  const [data, setData] = useState(null);
  const [additives, setAdditives] = useState(null);
  const [results, setResults] = useState(null);
  const [extras, setExtras] = useState({});
  const [selectedBase, setSelectedBase] = useState('Simplex Coco');
  const [selectedAdditives, setSelectedAdditives] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('./simplex_coco.json').then(res => res.json()),
      fetch('./additives.json').then(res => res.json())
    ]).then(([main, adds]) => {
      setData(main["Simplex Coco"]);
      setAdditives(adds["Добавки и стимуляторы"]);
    });
  }, []);

  const handleCalculate = (stage, liters, selectedAdditiveList) => {
    const merge = { ...(data?.[stage] || {}) };

    if (additives?.[stage]) {
      Object.entries(additives[stage]).forEach(([name, val]) => {
        if (selectedAdditiveList.includes(name)) {
          merge[name] = val;
        }
      });
    }

    const result = {};
    const extras = {};

    Object.entries(merge).forEach(([key, value]) => {
      if (value === '—') {
        (key === 'pH' || key === 'EC' ? extras : result)[key] = '—';
        return;
      }
      if (key === 'pH' || key === 'EC') {
        extras[key] = value;
      } else {
        const [min, max] = value.split('–').map(parseFloat);
        const from = min * liters;
        const to = max ? max * liters : from;
        result[key] = from === to ? `${from.toFixed(1)} мл` : `${from.toFixed(1)} – ${to.toFixed(1)} мл`;
      }
    });

    setResults({ stage, liters, result });
    setExtras(extras);
  };

  if (!data || !additives) return React.createElement('p', null, 'Загрузка...');

  return React.createElement('main', { style: { fontFamily: 'sans-serif', padding: '2rem' } }, [
    React.createElement('h1', { style: { fontSize: '24px', marginBottom: '1rem' } }, '✅ Simplex Калькулятор'),
    React.createElement(CalculatorForm, {
      stages: Object.keys(data),
      selectedBase,
      setSelectedBase,
      additivesList: Object.keys(additives["Вегетативный рост"] || {}),
      selectedAdditives,
      setSelectedAdditives,
      onCalculate: handleCalculate
    }),
    results && React.createElement(ResultsDisplay, { ...results, extras })
  ]);
};

window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
});
