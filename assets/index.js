
const App = () => {
  const [data, setData] = React.useState(null);
  const [additives, setAdditives] = React.useState(null);
  const [stage, setStage] = React.useState('');
  const [liters, setLiters] = React.useState(1);
  const [selectedAdditives, setSelectedAdditives] = React.useState([]);
  const [result, setResult] = React.useState(null);
  const [extras, setExtras] = React.useState({});

  React.useEffect(() => {
    Promise.all([
      fetch('./simplex_coco.json').then(res => res.json()),
      fetch('./additives.json').then(res => res.json())
    ]).then(([base, adds]) => {
      const d = base["Simplex Coco"];
      const a = adds["Добавки и стимуляторы"];
      setData(d);
      setAdditives(a);
      const defaultStage = Object.keys(d)[0];
      setStage(defaultStage);
      setSelectedAdditives(Object.keys(a[defaultStage] || {}));
    });
  }, []);

  const handleCalculate = () => {
    const stageData = data[stage] || {};
    const additivesData = additives[stage] || {};

    const merged = { ...stageData };

    Object.entries(additivesData).forEach(([name, value]) => {
      if (selectedAdditives.includes(name)) {
        merged[name] = value;
      }
    });

    const res = {};
    const extra = {};

    Object.entries(merged).forEach(([key, val]) => {
      if (val === '—') {
        (key === 'pH' || key === 'EC' ? extra : res)[key] = '—';
        return;
      }
      if (key === 'pH' || key === 'EC') {
        extra[key] = val;
      } else {
        const [min, max] = val.split('–').map(parseFloat);
        const from = min * liters;
        const to = max ? max * liters : from;
        res[key] = from === to ? `${from.toFixed(1)} мл` : `${from.toFixed(1)} – ${to.toFixed(1)} мл`;
      }
    });

    setResult(res);
    setExtras(extra);
  };

  if (!data || !additives) {
    return React.createElement('p', null, 'Загрузка...');
  }

  return React.createElement('div', { style: { fontFamily: 'sans-serif', padding: '2rem' } }, [
    React.createElement('h1', { style: { fontSize: '24px' } }, '✅ Simplex Калькулятор'),

    React.createElement('label', {}, 'Этап роста:'),
    React.createElement('select', {
      value: stage,
      onChange: (e) => {
        const newStage = e.target.value;
        setStage(newStage);
        setSelectedAdditives(Object.keys(additives[newStage] || {}));
      },
      style: { display: 'block', marginBottom: '1rem', padding: '0.5rem' }
    }, Object.keys(data).map(s =>
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

    React.createElement('h3', {}, 'Добавки и стимуляторы:'),
    ...Object.keys(additives[stage] || {}).map(name =>
      React.createElement('label', { key: name, style: { display: 'block' } }, [
        React.createElement('input', {
          type: 'checkbox',
          checked: selectedAdditives.includes(name),
          onChange: () =>
            setSelectedAdditives(selectedAdditives.includes(name)
              ? selectedAdditives.filter(n => n !== name)
              : [...selectedAdditives, name])
        }),
        ' ', name
      ])
    ),

    React.createElement('button', {
      onClick: handleCalculate,
      style: { marginTop: '1rem', padding: '0.5rem 1rem' }
    }, 'Рассчитать'),

    result && React.createElement('div', { style: { marginTop: '2rem' } }, [
      React.createElement('h2', {}, 'Результаты:'),
      React.createElement('ul', {}, Object.entries(result).map(([k, v]) =>
        React.createElement('li', { key: k }, `${k}: ${v}`)
      )),
      React.createElement('h3', { style: { marginTop: '1rem' } }, 'Показатели раствора:'),
      React.createElement('ul', {}, Object.entries(extras).map(([k, v]) =>
        React.createElement('li', { key: k }, `${k}: ${v}`)
      ))
    ])
  ]);
};

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(React.createElement(App), document.getElementById('root'));
});
