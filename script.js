import { checkAllTodo, createTodo, deleteAllCheckedTodo, deleteOneTodo, getAlltodos, updateCheckboxTodo, updateTextTodo } from "./api.js";

(() => {
  const inputTodo = document.querySelector('#addTodoItem');
  const buttonSubmit = document.querySelector('#submitTodo');
  const containerTodo = document.querySelector('#containerTodo');
  const removeAllActive = document.querySelector('#removeAllActive');
  const checkAll = document.querySelector('#checkboxCheckAll');
  const filterButtonsContainer = document.querySelector('#filter');
  const paginationContainer = document.querySelector('#pagination');
  const modalWindow = document.querySelector('#modal-window');
  const textModalWindow = document.querySelector('#modal-text');
  const closeBtnModalWindow = document.querySelector('#modal-close');
  const contentContainer = document.querySelector('#content-container');

  const TOTAL_COUNT_TODOS_ON_PAGE = 5;
  const QUANTITY_TODOS_ADDITION = 5;
  const ENTER_KEY = 13;
  const ESC_KEY = 27;
  const DOUBLE_CLIK = 2;
  const FILTER_ENUMERATION = {
    all: 'all',
    completed: 'completed',
    unfulfilled: 'unfulfilled'
  };

  const NUMBER_INPUT_IN_TODO_LIST = 2;
  const TIME_OF_APPEARANCE_MODAL = 3000;

  let countPage = 1;
  let currentPage = 1;
  let currentActivePage = 1;
  let countTodosOnPage = TOTAL_COUNT_TODOS_ON_PAGE;
  let arrayAllTodo = [];
  let filter = FILTER_ENUMERATION.all;
  let isFlagESC = false;

  const validationText = (text) => {
    return _.escape(text.trim().replace(/s+/g, ' '));
  };

  const getTodos = async () => {
    showLoader();
    const allTodos = await getAlltodos();
    arrayAllTodo = [...allTodos];
    if (arrayAllTodo.length) {
      checkAll.checked = arrayAllTodo.every((todo) => todo.isChecked);
    }
    showModal(allTodos)
    render();
  };

  const addTodo = async (event) => {
    event.preventDefault();
    if (inputTodo.value.trim()) {
      const newTodo = {
        text: inputTodo.value,
      };
      inputTodo.value = '';
      inputTodo.focus();
      showLoader();
      const todo = await createTodo(newTodo);
      showModal(todo);
      if (!('message' in todo)) {
        arrayAllTodo.push(todo);
        const condition = Math.ceil(arrayAllTodo.length+1 / TOTAL_COUNT_TODOS_ON_PAGE);
        if (countPage !== condition) countPage = condition;
        if (currentPage !== countPage) currentActivePage = currentPage = countPage;
        filter = FILTER_ENUMERATION.all;
        checkAll.checked = false;
        countTodosOnPage = TOTAL_COUNT_TODOS_ON_PAGE;
        render();
      }
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
    currentActivePage = currentPage = parseInt(event.target.textContent);
    countTodosOnPage = TOTAL_COUNT_TODOS_ON_PAGE;
    render();
  };

  const renderBtnShowMore = (arrayTodos = arrayAllTodo) => {
    if (arrayTodos.length <= TOTAL_COUNT_TODOS_ON_PAGE) return;
    if (currentActivePage === countPage) return;
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
      `<button class='page${+ currentActivePage === i ? ' active' : ''}'}>
        ${i}
      </button>`;
      paginationContainer.innerHTML += pages;
    }
  };

  const renderTodo = (arrayTodos = arrayAllTodo) => {
    containerTodo.innerHTML = '';
    const newLength = !arrayTodos.length ? 1 : arrayTodos.length;
    getNumberPages(newLength);
    if (currentPage >= countPage) currentActivePage = currentPage = countPage;
    const paginationArr = trimArrayByPage(arrayTodos, currentPage);
    paginationArr.forEach(todo => {
      const validatedText = validationText(todo.text);
      const todoHTML =
        `<li data-id=${todo.id} class="todo-list_item">
            <input 
              type="checkbox" 
              class="checkbox" ${todo.isChecked ? 'checked' : ''}
            >
            <p class="todo-list_text">${validatedText}</p>
            <input 
              type="text" 
              class="todo-list_reset-text" 
              placeholder="перепиши меня" 
              value="${validatedText}"
              hidden="hidden"
              maxlength="256"
            >
            <button class="todo-list-button">X</button>
        </li>`;
      containerTodo.innerHTML += todoHTML;
    });
  };

  const renderFilterButtonsContainer = () => {
    filterButtonsContainer.innerHTML = '';
    let lengthArrayFilter;
    const completedArr = arrayAllTodo.filter(todo => todo.isChecked);
    const unfulfilledArr = arrayAllTodo.filter(todo => !todo.isChecked);
    for (const key in FILTER_ENUMERATION) {
      lengthArrayFilter = arrayAllTodo.length;
      if (FILTER_ENUMERATION[key] === FILTER_ENUMERATION.completed) {
        lengthArrayFilter = completedArr.length;
      }

      if (FILTER_ENUMERATION[key] === FILTER_ENUMERATION.unfulfilled) {
        lengthArrayFilter = unfulfilledArr.length;
      }

      const filterButtons =
          `<button id='${FILTER_ENUMERATION[key]}' 
          class='${filter === FILTER_ENUMERATION[key] ? 'active': ''}'>
          ${FILTER_ENUMERATION[key]} (${lengthArrayFilter})</button>`;
      filterButtonsContainer.innerHTML += filterButtons;
    }

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

  const render = async () => {
    getNumberPages(arrayAllTodo.length);
    const returnArray = renderFilterButtonsContainer();
    checkAll.disabled = !arrayAllTodo.length;
    renderTodo(returnArray);
    renderBtnShowMore(returnArray);
    renderPagination();
  };

  const changeFilter = (event) => {
    countTodosOnPage = TOTAL_COUNT_TODOS_ON_PAGE;
    switch (event.target.id) {
    case FILTER_ENUMERATION.all:
      filter = FILTER_ENUMERATION.all;
      render();
      break;
    case FILTER_ENUMERATION.completed:
      filter = FILTER_ENUMERATION.completed;
      currentActivePage = currentPage = 1;
      render();
      break;
    case FILTER_ENUMERATION.unfulfilled:
      filter = FILTER_ENUMERATION.unfulfilled;
      currentActivePage = currentPage = 1;
      render();
      break;
    default:
      break;
    }
  };

  const changeTask = async (event) =>{
    const todoId = parseInt(event.target.parentNode.dataset.id);
    const arrElementId = arrayAllTodo.findIndex(todo => todo.id === todoId);
    const newArr = arrayAllTodo.filter(todo => todo.id !== todoId);
    switch (event.target.className) {
    case 'todo-list_text':
      if (event.detail === DOUBLE_CLIK) {
        const todoItemReset = event.target.nextElementSibling;
        const textTodoOld = event.target;
        todoItemReset.hidden = '';
        textTodoOld.hidden = 'false';
        todoItemReset.focus();
        isFlagESC = !isFlagESC;
      }

      break;
    case 'checkbox':
      event.preventDefault();
      checkAll.disabled = true;
      const updateTodo = await updateCheckboxTodo(todoId, !arrayAllTodo[arrElementId].isChecked);
      console.log(updateTodo);
      showModal(updateTodo);
      arrayAllTodo[arrElementId].isChecked = updateTodo.isChecked;
      checkAll.checked = arrayAllTodo.every((todo) => todo.isChecked);
      render();
      break;
    case 'todo-list-button':
      console.log('todoId = ', todoId);
      arrayAllTodo = newArr;
      if (arrayAllTodo.length) {
        checkAll.checked = arrayAllTodo.every((todo) => todo.isChecked);
      }
      showLoader();
      const deleteTodo = await deleteOneTodo(todoId);
      showModal(deleteTodo);
      console.log(deleteTodo);
      render();
      break;
    case 'showMore':
      countTodosOnPage += QUANTITY_TODOS_ADDITION;
      currentActivePage += 1;
      render();
      break;
    default:
      break;
    }
  };

  const rewriteTodo = async (event) => {
    const todoList = event.target.parentNode;
    const todoId = parseInt(todoList.dataset.id);
    const arrElementId = arrayAllTodo.findIndex(todo => todo.id === todoId);
    if (event.keyCode === ESC_KEY) {
      isFlagESC = !isFlagESC;
      return renderTodo();
    }

    if ((event.keyCode === ENTER_KEY || event.type === 'blur') && isFlagESC) {
      isFlagESC = !isFlagESC;
      const todoItem = todoList.children[NUMBER_INPUT_IN_TODO_LIST];
      if (!todoItem.value.length || arrayAllTodo[arrElementId].text === todoItem.value) {
        renderTodo();
        renderBtnShowMore();
      } else {
        showLoader();
        const updateText = await updateTextTodo(todoId, todoItem.value);
        console.log(updateText);
        showModal(updateText);
        arrayAllTodo[arrElementId].text = todoItem.value;
        render();
      }
    }
  };

  const removeAllCheckElementArr = async (event) => {
    event.preventDefault();
    if (arrayAllTodo.length) {
      showLoader();
      const deleteAll = await deleteAllCheckedTodo();
      showModal(deleteAll);
      const newArr = arrayAllTodo.filter(todo => !todo.isChecked);
      arrayAllTodo = newArr;
      getNumberPages(arrayAllTodo.length);
      currentActivePage = currentPage = 1;
      render();
    }
  };

  const checkAllElementArr = async (event) => {
    event.preventDefault();
    checkAll.disabled = true;
    showLoader();
    const check = await checkAllTodo(event.target.checked);
    showModal(check);
    console.log(event.target.checked);
    console.log(checkAll.checked);
    arrayAllTodo.forEach(todo => todo.isChecked = !event.target.checked);
    checkAll.checked = !event.target.checked;
    render();
  };

  const showModal = (error) => {
    if (Array.isArray(error) || typeof error !== 'string') return;
    if (typeof error === 'string' && error.includes('{')) {
      const objError = JSON.parse(error);
      textModalWindow.textContent = objError.message;
      modalWindow.style.opacity = '1';
      modalWindow.style.visibility = 'visible';
      setTimeout(() => { closeModal(); getTodos() }, TIME_OF_APPEARANCE_MODAL);
    } 
  };

  const closeModal = () => {
    modalWindow.style.opacity = '0';
    modalWindow.style.visibility = 'hidden';
  };

  const showLoader = () => {
    containerTodo.innerHTML = '';
    const loader = 
      `<div id="loader-container">
        <div id="loader"></div>
      </div>`;
    containerTodo.innerHTML += loader;
  }

  getTodos();

  buttonSubmit.addEventListener('click', addTodo);
  inputTodo.addEventListener('keydown', addTodosByPressingEnter);
  containerTodo.addEventListener('click', changeTask);
  containerTodo.addEventListener('keyup', rewriteTodo);
  containerTodo.addEventListener('blur', rewriteTodo, true);
  removeAllActive.addEventListener('click', removeAllCheckElementArr);
  checkAll.addEventListener('click', checkAllElementArr);
  filterButtonsContainer.addEventListener('click', changeFilter);
  paginationContainer.addEventListener('click', changePage);
  closeBtnModalWindow.addEventListener('click', closeModal);
})();
