
import React from 'https://cdn.skypack.dev/react';
import ReactDOM from 'https://cdn.skypack.dev/react-dom/client';

const App = () => {
  return React.createElement('main', { style: { fontFamily: 'sans-serif', padding: '2rem' } }, [
    React.createElement('h1', { style: { fontSize: '24px' } }, '✅ Simplex Калькулятор'),
    React.createElement('p', null, 'Это финальная production-сборка.')
  ]);
};

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(React.createElement(App));
