const inputTodo = document.querySelector('#addTodoItem');
const buttonSubmit = document.querySelector('#submitTodo');
const containerTodo = document.querySelector('#containerTodo');
const removeAllActive = document.querySelector('#removeAllActive');
const checkAll = document.querySelector('#checkboxCheckAll');
const filterButtonsContainer = document.querySelector('#filter');
const paginationContainer = document.querySelector('#pagination');

const TOTAL_COUNT_TODOS_ON_PAGE = 5;
const QUANTITY_TODOS_ADDITION = 5;
const ENTER_KEY = 13;
const ESC_KEY = 27;
const DOUBLE_CLIK = 2;
const MAX_LENGTH_TODO = 255;
const FILTER_ENUMERATION = {
  all: 'all',
  completed: 'completed',
  unfulfilled: 'unfulfilled'
};

let countPage = 1;
let currentPage = 1;
let countTodosOnPage = 5;
let arrayAllTodo = [
  {
    id: 0,
    text: 1,
    isChecked: false,
  },
  {
    id: 1,
    text: 2,
    isChecked: true,
  },
  {
    id: 2,
    text: 3,
    isChecked: false,
  },
  {
    id: 3,
    text: 4,
    isChecked: false,
  },
  {
    id: 4,
    text: 5,
    isChecked: true,
  },
  {
    id: 5,
    text: 6,
    isChecked: false,
  },
  {
    id: 6,
    text: 7,
    isChecked: true,
  },
  {
    id: 7,
    text: 8,
    isChecked: false,
  },
  {
    id: 8,
    text: 9,
    isChecked: false,
  },
  {
    id: 9,
    text: 0,
    isChecked: true,
  },
];
let filter = FILTER_ENUMERATION.all;

const validationText = (text) => {
  return text.trim().replace(/ {2,}/g, ' ').replace(/</g, '&lt').replace(/>/g, '&gt');
};

const addTodo = (event) => {
  event.preventDefault();
  if (!(inputTodo.value.trim() === '')) {
    const textValidation = validationText(inputTodo.value);
    const newTodo = {
      id: Date.now(),
      text: textValidation,
      isChecked: false,
    };
    arrayAllTodo.push(newTodo);
    inputTodo.value = '';
    inputTodo.focus();
    getNumberPages(arrayAllTodo.length);
    if (currentPage !== countPage) {currentPage = countPage;}

    render();
  }
};

const addTodosByPressingEnter = (event) => {
  if (event.keyCode === ENTER_KEY) {
    addTodo(event);
  }
};

const getNumberPages = (arrayLength) => {
  countPage = Math.ceil(arrayLength / TOTAL_COUNT_TODOS_ON_PAGE);
};

const trimArrayByPage = (array, page) => {
  const start = (page - 1) * countTodosOnPage;
  const end = page * countTodosOnPage;
  return array.slice(start, end);
};

const changePage = (event) => {
  currentPage = parseInt(event.target.textContent);
  countTodosOnPage = TOTAL_COUNT_TODOS_ON_PAGE;
  render();
};

const renderBtnShowMore = () => {
  if (arrayAllTodo.length <= TOTAL_COUNT_TODOS_ON_PAGE) {
    return;
  }

  if (currentPage === countPage) {
    return;
  }

  const btnShowMore =
          `<div id="showMoreContainer">
            <button class="showMore">Давай больше</button>
          </div>`;
  containerTodo.innerHTML += btnShowMore;
};

const renderPagination = () => {
  paginationContainer.innerHTML = '';
  for (let i = 1; i <= countPage; i++) {
    const pages =
    `<button class='page${+ currentPage === i ? ' active' : ''}'}>
      ${i}
    </button>`;
    paginationContainer.innerHTML += pages;
  }
};

const renderTodo = (arrayTodos = arrayAllTodo) => {
  containerTodo.innerHTML = '';
  getNumberPages(!arrayTodos.length ? 1 : arrayTodos.length);
  currentPage = currentPage >= countPage ? countPage : currentPage;
  const paginationArr = trimArrayByPage(arrayTodos, currentPage);
  paginationArr.forEach(element => {
    const todo =
      `<li data-id=${element.id} class="todo-list_item">
          <input 
            type="checkbox" 
            class="checkbox" ${element.isChecked ? 'checked' : ''}
          >
          <p class="todo-list_text">${element.text}</p>
          <input type="text" class="todo-list_reset-text" 
            placeholder="перепиши меня" 
            value="${element.text}"
            hidden="hidden"
          >
          <button class="todo-list-button">X</button>
      </li>`;
    containerTodo.innerHTML += todo;
  });
};

const renderFilterButtonsContainer = () => {
  filterButtonsContainer.innerHTML = '';
  const completedArr = arrayAllTodo.filter(todo => todo.isChecked);
  const unfulfilledArr = arrayAllTodo.filter(todo => !todo.isChecked);
  const filterButtons =
        `<button id='All' 
        class='${filter === FILTER_ENUMERATION.all ? 'active': ''}'>
        Все (${arrayAllTodo.length})</button>
        <button id='Completed' 
        class='${filter === FILTER_ENUMERATION.completed ? 'active': ''}'>
        Выполненные (${completedArr.length})</button>
        <button id='Unfulfilled' 
        class='${filter === FILTER_ENUMERATION.unfulfilled ? 'active': ''}'>
        Не выполненные (${unfulfilledArr.length})</button>`;
  filterButtonsContainer.innerHTML += filterButtons;
  switch (filter) {
  case FILTER_ENUMERATION.all:
    return;

  case FILTER_ENUMERATION.completed:
    return completedArr;

  case FILTER_ENUMERATION.unfulfilled:
    return unfulfilledArr;

  default:
    break;
  }
};

const render = () => {
  const returnArray = renderFilterButtonsContainer();
  renderTodo(returnArray);
  renderBtnShowMore();
  renderPagination();
};

const changeFilter = (event) => {
  switch (event.target.id) {
  case 'All':
    filter = FILTER_ENUMERATION.all;
    render();
    break;
  case 'Completed':
    filter = FILTER_ENUMERATION.completed;
    currentPage = 1;
    render();
    break;
  case 'Unfulfilled':
    filter = FILTER_ENUMERATION.unfulfilled;
    currentPage = 1;
    render();
    break;
  default:
    break;
  }
};

const changeTask = (event) =>{
  const todoId = parseInt(event.target.parentNode.dataset.id);
  const arrElementId = arrayAllTodo.findIndex(todo => todo.id === todoId);
  const activityCheck = arrayAllTodo.every((todo) => todo.isChecked);
  const newArr = arrayAllTodo.filter(todo => todo.id !== todoId);
  switch (event.target.className) {
  case 'todo-list_text':
    if (event.detail === DOUBLE_CLIK) {
      const todoItemReset = event.target.nextElementSibling;
      const textTodoOld = event.target;
      todoItemReset.hidden = '';
      textTodoOld.hidden = 'false';
      todoItemReset.focus();
    }

    break;

  case 'checkbox':
    arrayAllTodo[arrElementId].isChecked = !arrayAllTodo[arrElementId].isChecked;
    checkAll.checked = activityCheck;
    render();
    break;

  case 'todo-list-button':
    arrayAllTodo = newArr;
    render();
    break;

  case 'showMore':
    countTodosOnPage += QUANTITY_TODOS_ADDITION;
    render();
    break;
  default:
    break;
  }
};

const rewriteTodo = (event) => {
  const todoList = event.target.parentNode;
  const todoId = parseInt(todoList.dataset.id);
  const arrElementId = arrayAllTodo.findIndex(todo => todo.id === todoId);
  if (event.keyCode === ESC_KEY) {
    renderTodo();
    return;
  }

  if (!(event.keyCode === ENTER_KEY || event.type === 'blur')) {
    return;
  }

  if (event.target.matches('.todo-list_reset-text')) {
    const numberInputInTodoList = 5;
    const startIndex = 0;
    const todoItem = todoList.childNodes[numberInputInTodoList];
    const text = validationText(todoItem.value);
    if (!text.length) {
      renderTodo();
      renderBtnShowMore();
    } else {
      if (text.length > MAX_LENGTH_TODO) {
        const trimText = text.slice(startIndex, MAX_LENGTH_TODO);
        arrayAllTodo[arrElementId].text = trimText;
      }

      arrayAllTodo[arrElementId].text = text;
      render();
    }
  }
};

const removeAllCheckElementArr = (event) => {
  event.preventDefault();
  const newArr = arrayAllTodo.filter(todo => !todo.isChecked);
  arrayAllTodo = newArr;
  getNumberPages(arrayAllTodo.length);
  currentPage = 1;
  render();
};

const checkAllElementArr = (event) => {
  arrayAllTodo.forEach(todo => todo.isChecked = event.target.checked);
  render();
};

getNumberPages(arrayAllTodo.length);
render();

buttonSubmit.addEventListener('click', addTodo);
inputTodo.addEventListener('keydown', addTodosByPressingEnter);
containerTodo.addEventListener('click', changeTask);
containerTodo.addEventListener('keyup', rewriteTodo);
containerTodo.addEventListener('blur', rewriteTodo, true);
removeAllActive.addEventListener('click', removeAllCheckElementArr);
checkAll.addEventListener('click', checkAllElementArr);
filterButtonsContainer.addEventListener('click', changeFilter);
paginationContainer.addEventListener('click', changePage);
