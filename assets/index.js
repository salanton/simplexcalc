const App = () => {
  return React.createElement('div', { style: { fontFamily: 'sans-serif', padding: '2rem' } }, [
    React.createElement('h1', { style: { fontSize: '24px' } }, '✅ Simplex Калькулятор'),
    React.createElement('p', null, 'Приложение загружено через UMD React и ReactDOM.render')
  ]);
};

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(React.createElement(App), document.getElementById('root'));
});
