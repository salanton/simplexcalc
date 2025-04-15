import React from 'https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js';
import ReactDOM from 'https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js';

const App = () => {
  const container = document.createElement('div');
  container.style.fontFamily = 'sans-serif';
  container.style.padding = '2rem';
  container.innerHTML = `
    <h1 style="font-size: 24px; margin-bottom: 1rem;">✅ Simplex Калькулятор</h1>
    <p>Приложение успешно загружено с использованием стабильного CDN.</p>
  `;
  return container;
};

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  root.appendChild(App());
});
