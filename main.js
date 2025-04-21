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

    state.baseData = base;
    state.addData = additives;
    state.stimData = stimulators;

    renderMethods(base.methods);
  } catch (e) {
    console.error('Ошибка при загрузке данных:', e);
  }
}

// 2. Рендер методов
function renderMethods(methods) {
  const methodSelect = document.getElementById('method-select');
  methodSelect.innerHTML = '';
  methods.forEach(method => {
    const btn = document.createElement('button');
    btn.textContent = method.name;
    btn.onclick = () => {
      state.method = method.name;
      renderBaseInputs(); // если стадия выбрана — покажется база
      const methodData = state.baseData.methods.find(m => m.name === state.method);
      renderStages(methodData.stages); // рендерим стадии отдельно
    };
    methodSelect.appendChild(btn);
  });
}

// 3. Рендер стадий
function renderStages(stages) {
  const stageSelect = document.getElementById('stage-select');
  stageSelect.innerHTML = '';
  stages.forEach(stage => {
    const btn = document.createElement('button');
    btn.textContent = stage.name;
    btn.onclick = () => {
      state.stage = stage.name;
      renderBaseInputs();     // стадия выбрана — покажем базу
      renderAdditives();
      renderStimulators();
    };
    stageSelect.appendChild(btn);
  });
}

// 4. Рендер базовых удобрений (в разделе 1)
function renderBaseInputs() {
  const baseContainer = document.getElementById('base-options');
  baseContainer.innerHTML = '';

  if (!state.method || !state.stage) return;

  const method = state.baseData.methods.find(m => m.name === state.method);
  const stage = method?.stages.find(s => s.name === state.stage);
  if (!stage) return;

  stage.base.forEach(item => {
    if (item.value !== '—') {
      const div = document.createElement('div');
      div.textContent = `${item.name}: ${item.value} мл/л`;
      baseContainer.appendChild(div);
    }
  });
}

// 5. Рендер добавок
function renderAdditives() {
  const addContainer = document.getElementById('additives-options');
  const stage = state.stage;
  const list = state.addData.additives;

  addContainer.innerHTML = '';

  const active = [];
  const inactive = [];

  list.forEach(add => {
    const stageObj = add.stages.find(s => s.name === stage);
    const isActive = stageObj && stageObj.value !== '—';
    const dose = stageObj?.value || '—';

    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.name = add.name;
    checkbox.dataset.value = dose;
    checkbox.disabled = !isActive;

    const nameSpan = document.createElement('span');
    nameSpan.textContent = ` ${add.name}`;
    if (!isActive) {
      nameSpan.style.textDecoration = 'line-through';
      nameSpan.style.color = '#c44';
    }

    const doseDiv = document.createElement('div');
    doseDiv.textContent = `[${dose} мл/л]`;
    doseDiv.style.fontSize = '0.9em';
    doseDiv.style.marginLeft = '1.5em';
    doseDiv.style.color = isActive ? '#444' : '#999';

    label.appendChild(checkbox);
    label.appendChild(nameSpan);
    label.appendChild(doseDiv);

    if (isActive) {
      active.push(label);
    } else {
      inactive.push(label);
    }
  });

  [...active, ...inactive].forEach(el => addContainer.appendChild(el));
}



// 6. Рендер стимуляторов
function renderAdditives() {
  const addContainer = document.getElementById('stimulators-options');
  const stage = state.stage;
  const list = state.stimData.additives;

  addContainer.innerHTML = '';

  const active = [];
  const inactive = [];

  list.forEach(add => {
    const stageObj = stim.stages.find(s => s.name === stage);
    const isActive = stageObj && stageObj.value !== '—';
    const dose = stageObj?.value || '—';

    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.name = stim.name;
    checkbox.dataset.value = dose;
    checkbox.disabled = !isActive;

    const nameSpan = document.createElement('span');
    nameSpan.textContent = ` ${stim.name}`;
    if (!isActive) {
      nameSpan.style.textDecoration = 'line-through';
      nameSpan.style.color = '#c44';
    }

    const doseDiv = document.createElement('div');
    doseDiv.textContent = `[${dose} мл/л]`;
    doseDiv.style.fontSize = '0.9em';
    doseDiv.style.marginLeft = '1.5em';
    doseDiv.style.color = isActive ? '#444' : '#999';

    label.appendChild(checkbox);
    label.appendChild(nameSpan);
    label.appendChild(doseDiv);

    if (isActive) {
      active.push(label);
    } else {
      inactive.push(label);
    }
  });

  [...active, ...inactive].forEach(el => stimContainer.appendChild(el));
}


// 7. Расчёт
function calculate() {
  const volume = parseFloat(document.getElementById('water-volume').value);
  state.volume = volume;

  const resultContainer = document.getElementById('recipe-output');
  resultContainer.innerHTML = '<h3>Рецепт</h3>';

  const method = state.baseData.methods.find(m => m.name === state.method);
  const stage = method?.stages.find(s => s.name === state.stage);

  if (!method || !stage) {
    resultContainer.innerHTML += `<p>Ошибка: метод или стадия не выбраны.</p>`;
    return;
  }

  const list = [];

  // База
  stage.base.forEach(b => {
    if (b.value !== '—') {
      list.push({ name: b.name, value: b.value });
    }
  });

  // Добавки
  document.querySelectorAll('#additives-options input:checked').forEach(input => {
    list.push({ name: input.dataset.name, value: input.dataset.value });
  });

  // Стимуляторы
  document.querySelectorAll('#stimulators-options input:checked').forEach(input => {
    list.push({ name: input.dataset.name, value: input.dataset.value });
  });

  // Вывод
  list.forEach(item => {
    const doses = item.value.split('–').map(str => parseFloat(str));
    let result = '';
    if (doses.length === 2) {
      const minDose = (doses[0] * volume).toFixed(2);
      const maxDose = (doses[1] * volume).toFixed(2);
      result = `${minDose}–${maxDose} мл (на ${volume} л)`;
    } else {
      const single = (doses[0] * volume).toFixed(2);
      result = `${single} мл (на ${volume} л)`;
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

// Кнопка запуска
document.getElementById('calculate-btn').addEventListener('click', calculate);

// Старт
loadData();
