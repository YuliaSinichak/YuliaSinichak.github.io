const selectedObject = document.getElementById('objectType');
const buildInfo = document.getElementById('buildInfo');
const buildButton = document.getElementById('buildButton');

const budgetEl = document.getElementById('budget');
const materialsEl = document.getElementById('materials');
const workersEl = document.getElementById('workers');
const selectedCellInfo = document.getElementById('selectedCellInfo');

let selectedCell = null;
let selectedCellRow = null;
let selectedCellCol = null;

const objectCosts = {
  '🏠': { budget: 1000, materials: 100, workers: 2 },
  '🛣️': { budget: 500, materials: 50, workers: 1 },
  '🏭': { budget: 3000, materials: 200, workers: 5 }
};

const upgradeCosts = {
  '🏠': { budget: 800, materials: 80, workers: 1, upgradedIcon: '🏘️' },
  '🛣️': { budget: 400, materials: 30, workers: 1, upgradedIcon: '🛤️' },
  '🏭': { budget: 2000, materials: 150, workers: 3, upgradedIcon: '🏢' }
};

function createGrid() {
  const grid = document.querySelector('#city .grid');
  grid.innerHTML = '';

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.setAttribute('data-row', row);
      cell.setAttribute('data-col', col);
      cell.style.backgroundColor = (row + col) % 2 === 0 ? '#98908757' : '#7ca52957'; 

      
      cell.addEventListener('click', () => {
        if (selectedCell) {
          selectedCell.classList.remove('selected-cell');  
        }
        selectedCell = cell;  
        selectedCellRow = row;
        selectedCellCol = col;
        selectedCell.classList.add('selected-cell'); 
        updateBuildInfo();
      });

      grid.appendChild(cell);
    }
  }
}
createGrid();

function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}


function updateBuildInfo() {
  if (!selectedCell) return;

  const type = selectedObject.value;
  const cost = objectCosts[type];
  selectedCellInfo.textContent = `Рядок: ${selectedCellRow + 1}, Стовпець: ${selectedCellCol + 1}`;

  if (selectedCell.textContent === '') {
    buildInfo.textContent = `Ціна: ${cost.budget} ₴, матеріали: ${cost.materials}, робітники: ${cost.workers}.`;
    actionButton.textContent = 'Будувати';
  } else {
    const upgrade = upgradeCosts[selectedCell.textContent];
    if (upgrade) {
      buildInfo.textContent = `Покращення: ${upgrade.budget} ₴, матеріали: ${upgrade.materials}, робітники: ${upgrade.workers}.`;
      actionButton.textContent = 'Покращити будівлю';
    } else {
      buildInfo.textContent = 'Цю будівлю не можна покращити.';
      actionButton.textContent = 'Неможливо покращити';
    }
  }
}


buildButton.addEventListener('click', () => {
  if (!selectedCell) {
    selectedCellInfo.textContent = 'Жодної клітинки не обрано';
    buildInfo.textContent = 'Жодної клітинки не обрано';
    return;
  }

  const current = selectedCell.textContent;

 
  if (current === '') {
    const type = selectedObject.value;
    const cost = objectCosts[type];

    let budget = parseInt(budgetEl.textContent);
    let materials = parseInt(materialsEl.textContent);
    let workers = parseInt(workersEl.textContent);

    if (
      budget < cost.budget ||
      materials < cost.materials ||
      workers < cost.workers
    ) {
      alert('Недостатньо ресурсів!');
      return;
    }

    budgetEl.textContent = budget - cost.budget;
    materialsEl.textContent = materials - cost.materials;
    workersEl.textContent = workers - cost.workers;

    selectedCell.textContent = type;
    selectedCell.style.fontWeight = 'bold';

  } else {
    const upgrade = upgradeCosts[current];

    if (!upgrade) {
      alert('Цю будівлю не можна покращити!');
      return;
    }

    let budget = parseInt(budgetEl.textContent);
    let materials = parseInt(materialsEl.textContent);
    let workers = parseInt(workersEl.textContent);

    if (
      budget < upgrade.budget ||
      materials < upgrade.materials ||
      workers < upgrade.workers
    ) {
      alert('Недостатньо ресурсів для покращення!');
      return;
    }

    budgetEl.textContent = budget - upgrade.budget;
    materialsEl.textContent = materials - upgrade.materials;
    workersEl.textContent = workers - upgrade.workers;

    selectedCell.textContent = upgrade.upgradedIcon;
    selectedCell.style.color = '#444'; 
  }

  selectedCell.classList.remove('selected-cell');
  selectedCell = null;
  selectedCellInfo.textContent = 'Жодної клітинки не обрано';
  buildInfo.textContent = '';
});
function showCityStatus() {
  const cityStatusEl = document.getElementById('cityStatus');

  if (cityStatusEl.style.display === 'block') {
    cityStatusEl.style.display = 'none'; 
  } else {
    cityStatusEl.style.display = 'block'; 

    const grid = document.querySelector('#city .grid');
    const cells = grid.querySelectorAll('.cell');
    
    let index = 0;
    let buildingsInfo = '';
    let buildingCount = 0;

    do {
      const cell = cells[index];
      const content = cell.textContent.trim();
      if (content !== '') {
        const row = cell.getAttribute('data-row');
        const col = cell.getAttribute('data-col');
        buildingsInfo += `Будівля: ${content}, позиція: [${parseInt(row) + 1}, ${parseInt(col) + 1}]<br>`;
        buildingCount++;
      }
      index++;
    } while (index < cells.length);

    if (buildingCount === 0) {
      buildingsInfo = 'Наразі немає жодної будівлі.<br>';
    }

    const resources = `
      <strong>Ресурси міста:</strong><br>
      Бюджет: ${budgetEl.textContent} ₴<br>
      Матеріали: ${materialsEl.textContent}<br>
      Робітники: ${workersEl.textContent}<br><br>
    `;

    cityStatusEl.innerHTML = resources + '<strong>Будівлі:</strong><br>' + buildingsInfo;
  }
}


const resourceForm = document.getElementById('resourceForm');
const resourceNameInput = document.getElementById('resourceName');
const resourceAmountInput = document.getElementById('resourceAmount');

resourceForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const resource = resourceNameInput.value;
  const amount = parseInt(resourceAmountInput.value);

  if (!amount || amount <= 0) {
    alert('Введіть додатне число!');
    return;
  }

  if (resource === 'budget') {
    budgetEl.textContent = parseInt(budgetEl.textContent) + amount;
  } else if (resource === 'materials') {
    materialsEl.textContent = parseInt(materialsEl.textContent) + amount;
  } else if (resource === 'workers') {
    workersEl.textContent = parseInt(workersEl.textContent) + amount;
  }

  resourceAmountInput.value = '';
});



const objectType = document.getElementById('objectType');
  const addBuildingForm = document.getElementById('addBuildingForm');

  addBuildingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('buildingName').value.trim();
    const emoji = document.getElementById('buildingEmoji').value.trim();
    const budget = parseInt(document.getElementById('buildingBudget').value);
    const materials = parseInt(document.getElementById('buildingMaterials').value);
    const workers = parseInt(document.getElementById('buildingWorkers').value);

    if (!name || !emoji || isNaN(budget) || isNaN(materials) || isNaN(workers)) {
      alert('Будь ласка, заповніть всі поля коректно.');
      return;
    }

    
    const newOption = document.createElement('option');
    newOption.value = emoji;
    newOption.textContent = name;
    objectType.appendChild(newOption);

   
    objectCosts[emoji] = {
      budget: budget,
      materials: materials,
      workers: workers
    };

    
    addBuildingForm.reset();
  })