(() => {
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
  const FILTER_ENUMERATION = {
    all: 'all',
    completed: 'completed',
    unfulfilled: 'unfulfilled'
  };
  const URL = 'http://localhost:3000/api/todo';
  const NUMBER_INPUT_IN_TODO_LIST = 2;

  let countPage = 1;
  let currentPage = 1;
  let currentActivePage = 1;
  let countTodosOnPage = TOTAL_COUNT_TODOS_ON_PAGE;
  let arrayAllTodo = [];
  let filter = FILTER_ENUMERATION.all;
  let isFlagESC = false;

  const validationText = (text) => {
    return text
      .trim()
      .replace(/ {2,}/g, ' ')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"|'/g, '\'');
  };

  const addTodo = async (event) => {
    event.preventDefault();
    if (inputTodo.value.trim()) {
      const validatedText = validationText(inputTodo.value);
      const newTodo = {
        text: validatedText,
      };
      await fetch(`${URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      }).then((res) => {
        if (!res.ok) {
          throw new Error('text must be shorter than or equal to 255 characters');
        }

        return res.json();
      }).then(() => {
        inputTodo.value = '';
        inputTodo.focus();
        const condition = Math.ceil(arrayAllTodo.length+1 / TOTAL_COUNT_TODOS_ON_PAGE);
        if (countPage !== condition) countPage = condition;
        if (currentPage !== countPage) currentActivePage = currentPage = countPage;
        filter = FILTER_ENUMERATION.all;
        checkAll.checked = false;
        countTodosOnPage = TOTAL_COUNT_TODOS_ON_PAGE;
        render();
      }).catch((error) => {
        window.alert(error.message);
      });
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
      const todoHTML =
        `<li data-id=${todo.id} class="todo-list_item">
            <input 
              type="checkbox" 
              class="checkbox" ${todo.isChecked ? 'checked' : ''}
            >
            <p class="todo-list_text">${todo.text}</p>
            <input 
              type="text" 
              class="todo-list_reset-text" 
              placeholder="перепиши меня" 
              value="${todo.text}"
              hidden="hidden"
              maxlength="255"
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
    await fetch(`${URL}/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json())
      .then((array) => arrayAllTodo = [...array])
      .catch(error => window.alert(error.message));
    getNumberPages(arrayAllTodo.length);
    const returnArray = renderFilterButtonsContainer();
    checkAll.checked = arrayAllTodo.every((todo) => todo.isChecked);
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
      await fetch(`${URL}/update/${todoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({isChecked: !arrayAllTodo[arrElementId].isChecked})
      }).then( () => {
        render();
      }).catch(error => window.alert(error.message));
      break;
    case 'todo-list-button':
      await fetch(`${URL}/delete/${todoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then( () => render())
        .catch(error => window.alert(error.message));
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
    if (event.keyCode === ESC_KEY) {
      isFlagESC = !isFlagESC;
      return renderTodo();
    }

    if ((event.keyCode === ENTER_KEY || event.type === 'blur') && isFlagESC) {
      isFlagESC = !isFlagESC;
      const todoItem = todoList.children[NUMBER_INPUT_IN_TODO_LIST];
      const validatedText = validationText(todoItem.value);
      if (!validatedText.length) {
        renderTodo();
        renderBtnShowMore();
      } else {
        await fetch(`${URL}/update/${todoId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: validatedText}),
        }).then( () => {
          render();
        }).catch(error => {
          window.alert(error.message);
        });
      }
    }
  };

  const removeAllCheckElementArr = async (event) => {
    event.preventDefault();
    await fetch(`${URL}/delete-all-checked`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then( () => {
      currentActivePage = currentPage = 1;
      render();
    });
  };

  const checkAllElementArr = async (event) => {
    await fetch(`${URL}/check-all`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({isChecked: event.target.checked})
    }).then( () => {
      render();
    });
  };

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
})();
