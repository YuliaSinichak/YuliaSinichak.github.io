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
  buildInfo.textContent = `Ціна: ${cost.budget} ₴, матеріали: ${cost.materials}, робітники: ${cost.workers}.`;;
}


buildButton.addEventListener('click', () => {
  if (!selectedCell) {
    selectedCellInfo.textContent = 'Жодної клітинки не обрано';
    buildInfo.textContent = 'Жодної клітинки не обрано'; 
    return;
  }

  if (selectedCell.textContent !== '') {
    alert('У цій клітинці вже є об\'єкт!');
    return;
  }

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

 
  selectedCell.classList.remove('selected-cell');  
  selectedCell = null;  
   selectedCellInfo.textContent = 'Жодної клітинки не обрано';
 
  buildInfo.textContent = '';  
});

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