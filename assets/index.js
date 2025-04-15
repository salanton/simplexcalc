import React from 'https://cdn.skypack.dev/react';
import ReactDOM from 'https://cdn.skypack.dev/react-dom/client';

const App = () => {
  return React.createElement('main', { style: { fontFamily: 'sans-serif', padding: '2rem' } }, [
    React.createElement('h1', { style: { fontSize: '24px', marginBottom: '1rem' } }, '✅ Simplex Калькулятор'),
    React.createElement('p', null, 'Приложение успешно загружено и работает через CDN.')
  ]);
};

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
