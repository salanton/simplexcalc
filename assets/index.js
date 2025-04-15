import React from 'https://cdn.skypack.dev/react';
import ReactDOM from 'https://cdn.skypack.dev/react-dom/client';

const App = () => {
  return React.createElement('main', {
    style: {
      fontFamily: 'sans-serif',
      padding: '2rem',
      maxWidth: '600px',
      margin: '0 auto'
    }
  }, [
    React.createElement('h1', {
      style: { fontSize: '24px', marginBottom: '1rem' }
    }, '✅ Simplex Калькулятор'),
    React.createElement('p', null, 'Приложение успешно монтируется через CDN без сборки.')
  ]);
};

window.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  ReactDOM.createRoot(root).render(React.createElement(App));
});
