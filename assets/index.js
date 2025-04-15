import React from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';

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
    React.createElement('p', null, 'Приложение монтируется через ESM.sh и работает.')
  ]);
};

window.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  ReactDOM.createRoot(root).render(React.createElement(App));
});
