// main.js

const state = {
  method: null,
  stage: null,
  baseData: null,
  addData: null,
  stimData: null,
  volume: 1.0,
};

// 1. Загрузка JSON
async function loadData() {
  try {
    const [base, additives, stimulators] = await Promise.all([
      fetch('data/simplex/simplexbase.json').then(r => r.json()),
      fetch('data/simplex/simplexadd.json').then(r => r.json()),
      fetch('data/simplex/simplexstim.json').then(r => r.json()),
    ]);
    console.log('baseData:', base);
    console.log('addData:', additives);
    console.log('stimData:', stimulators);

    state.baseData = base;
    state.addData = additives;
    state.stimData = stimulators;
    renderMethods(base.methods);
  } catch (e) {
    console.error('Ошибка при загрузке данных:', e);
  }
}


// 2. Рендер методов (Coco, Terra, Hydro)
function renderMethods(methods) {
  const methodSelect = document.getElementById('method-select');
  methodSelect.innerHTML = '';
  methods.forEach(method => {
    const btn = document.createElement('button');
    btn.textContent = method.name;
    btn.onclick = () => {
      state.method = method.name;
      renderStages(method.stages);
    };
    methodSelect.appendChild(btn);
  });
}

// 3. Рендер стадий для выбранного метода
function renderStages(stages) {
  const stageSelect = document.getElementById('stage-select');
  stageSelect.innerHTML = '';
  stages.forEach(stage => {
    const btn = document.createElement('button');
    btn.textContent = stage.name;
    btn.onclick = () => {
      state.stage = stage.name;
      renderBaseInputs(stage.base);
      renderAdditives();
      renderStimulators();
    };
    stageSelect.appendChild(btn);
  });
}

// 4. Рендер базовых удобрений
function renderBaseInputs(baseList) {
  const baseContainer = document.getElementById('base-container');
  baseContainer.innerHTML = '';
  baseList.forEach(item => {
    if (item.value !== '—') {
      const div = document.createElement('div');
      div.textContent = `${item.name}: ${item.value} мл/л`;
      baseContainer.appendChild(div);
    }
  });
}

// 5. Рендер добавок
function renderAdditives() {
  const addContainer = document.getElementById('additives-container');
  const stage = state.stage;
  const list = state.addData.additives;
  addContainer.innerHTML = '';
  list.forEach(add => {
    const stageObj = add.stages.find(s => s.name === stage);
    if (stageObj && stageObj.value !== '—') {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.dataset.name = add.name;
      checkbox.dataset.value = stageObj.value;
      label.appendChild(checkbox);
      label.append(` ${add.name}: ${stageObj.value} мл/л`);
      addContainer.appendChild(label);
    }
  });
}

// 6. Рендер стимуляторов
function renderStimulators() {
  const stimContainer = document.getElementById('stimulators-container');
  const stage = state.stage;
  const list = state.stimData.stimulators;
  stimContainer.innerHTML = '';
  list.forEach(stim => {
    const stageObj = stim.stages.find(s => s.name === stage);
    if (stageObj && stageObj.value !== '—') {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.dataset.name = stim.name;
      checkbox.dataset.value = stageObj.value;
      label.appendChild(checkbox);
      label.append(` ${stim.name}: ${stageObj.value} мл/л`);
      stimContainer.appendChild(label);
    }
  });
}

// 7. Обработка расчёта
function calculate() {
  const volume = parseFloat(document.getElementById('volume-input').value);
  state.volume = volume;

  const resultContainer = document.getElementById('result-container');
  resultContainer.innerHTML = '<h3>Рецепт</h3>';
  
  const list = [];

  // База
  const method = state.baseData.methods.find(m => m.name === state.method);
  const stage = method.stages.find(s => s.name === state.stage);
  stage.base.forEach(b => {
    if (b.value !== '—') {
      list.push({ name: b.name, value: b.value });
    }
  });

  // Добавки
  document.querySelectorAll('#additives-container input:checked').forEach(input => {
    list.push({ name: input.dataset.name, value: input.dataset.value });
  });

  // Стимуляторы
  document.querySelectorAll('#stimulators-container input:checked').forEach(input => {
    list.push({ name: input.dataset.name, value: input.dataset.value });
  });

  // Вывод
  list.forEach(item => {
    const doses = item.value.split('–').map(str => parseFloat(str));
    let result = '';
    if (doses.length === 2) {
      result = `${(doses[0] * volume).toFixed(2)}–${(doses[1] * volume).toFixed(2)} мл`;
    } else {
      result = `${(doses[0] * volume).toFixed(2)} мл`;
    }
    const div = document.createElement('div');
    div.textContent = `${item.name}: ${result}`;
    resultContainer.appendChild(div);
  });

  // pH и EC
  const pH = stage.ph;
  const ec = stage.ec;
  const phBlock = document.createElement('div');
  phBlock.innerHTML = `<strong>pH:</strong> ${pH} <br> <strong>EC:</strong> ${ec}`;
  resultContainer.appendChild(phBlock);
}

// Привязка кнопки
document.getElementById('calculate-btn').addEventListener('click', calculate);

// Запуск
loadData();
