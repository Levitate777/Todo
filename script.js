const inputTodo = document.querySelector('#addTodoItem')
const buttonSubmit = document.querySelector('#submitTodo')
const containerTodo = document.querySelector('#containerTodo')
const removeAllActive = document.querySelector('#removeAllActive')
const checkAll = document.querySelector('#checkboxCheckAll')
const filterButtonsContainer = document.querySelector('#filter')
const paginationContainer = document.querySelector('#pagination')

const TOTAL_COUNT_TODOS_ON_PAGE = 5
const QUANTITY_TODOS_ADDITION = 5
const ENTER_KEY = 13
const ESC_KEY = 27
const DOUBLE_CLIK = 2
const MAX_LENGTH_TODO = 255

let countPage = 1
let currentPage = 1
let countTodosOnPage = 5
let arrayAllTodo = [
  {
    id: 0,
    text: 1,
    isChecked: false
  },
  {
    id: 1,
    text: 2,
    isChecked: false
  },
  {
    id: 2,
    text: 3,
    isChecked: false
  },
  {
    id: 3,
    text: 4,
    isChecked: false
  },
  {
    id: 4,
    text: 5,
    isChecked: false
  },
  {
    id: 5,
    text: 6,
    isChecked: false
  },
  {
    id: 6,
    text: 7,
    isChecked: false
  },
  {
    id: 7,
    text: 8,
    isChecked: false
  },
  {
    id: 8,
    text: 9,
    isChecked: false
  },
  {
    id: 9,
    text: 0,
    isChecked: false
  },
]
let filter = "all"

class TodoItem {
  constructor(text) {
    this.id = Date.now();
    this.text = text;
    this.isChecked = false;
  } 
}

const validationText = (text) => {
  return text
          .trim()
          .replace(/ {2,}/g, " ")
          .replace(/</g, "&lt")
          .replace(/>/g, '&gt')
}

const addTodo = (event) => {
  event.preventDefault()
  if (!(inputTodo.value.trim() === '')) {
    const text = validationText(inputTodo.value)
    const newTodo = new TodoItem(text)
    arrayAllTodo.push(newTodo)
    inputTodo.value = ''
    inputTodo.focus
    calculateTotalNumberOfPages(arrayAllTodo.length)
    currentPage = currentPage === countPage ? currentPage : countPage
    render()
  }
}
const addTodosByPressingEnter = (event) => {
  if (event.keyCode === ENTER_KEY) {
    addTodo(event)
  }
}

const calculateTotalNumberOfPages = (arrayLength) => {
  if (arrayLength <= TOTAL_COUNT_TODOS_ON_PAGE) {
    countPage = 1
  } else {
    countPage = Math.ceil(arrayLength / TOTAL_COUNT_TODOS_ON_PAGE)
  }
}
const trimArrayByPage = (array, page) => {
  const start = (page - 1) * countTodosOnPage
  const end = page * countTodosOnPage
  return array.slice(start, end) 
}
const changePage = (event) => {
  currentPage = parseInt(event.target.textContent)
  countTodosOnPage = 5
  render()
}

const render = () => {
  const returnArray = renderFilterButtonsContainer()
  renderTodo(returnArray)
  renderBtnShowMore()
  renderPagination()
}
const renderBtnShowMore = () => {
  if (arrayAllTodo.length < 6) {
    return;
  }
  if (currentPage === countPage) {
    return;
  }
  const btnShowMore = 
          `<div id="showMoreContainer">
            <button id="showMore">Давай больше</button>
          </div>`
  containerTodo.innerHTML += btnShowMore
}
const renderPagination = () => {
  paginationContainer.innerHTML = ""
  for (let i = 1; i <= countPage; i++) {
    const pages = 
    `<button class="page${+ currentPage === i ? " active" : ""}"}>
      ${i}
    </button>`
    paginationContainer.innerHTML += pages
  }
}
const renderTodo = (arrayTodos = arrayAllTodo) => {
  containerTodo.innerHTML = ""
  calculateTotalNumberOfPages(arrayTodos.length)
  currentPage = currentPage >= countPage ? countPage : currentPage
  const paginationArr = trimArrayByPage(arrayTodos, currentPage)
  paginationArr.forEach(element => {
    const task = 
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
      </li>`
      containerTodo.innerHTML += task
  });
}
const renderFilterButtonsContainer = () => {
  filterButtonsContainer.innerHTML = ""
  const complitedArr = arrayAllTodo.filter(todo => todo.isChecked)
  const unfulfilledArr = arrayAllTodo.filter(todo => !todo.isChecked)
  const filterButtonsContainer = 
        `<button id="renderAll">Все (${arrayAllTodo.length})</button>
        <button id="renderActive">Выполненные (${complitedArr.length})</button>
        <button id="renderComplited">Не выполненные (${unfulfilledArr.length})</button>`
        filterButtonsContainer.innerHTML += filterButtonsContainer
  if (filter === 'all') {
    calculateTotalNumberOfPages(arrayAllTodo.length)
    return ;
  }
  if (filter === 'complited') {
    calculateTotalNumberOfPages(complitedArr.length)
    if (!complitedArr.length) {
      filter = 'all'
      return ;
    }
    return complitedArr
  }
  if (filter === 'unfulfilled') {
    calculateTotalNumberOfPages(unfulfilledArr.length)
    if (!unfulfilledArr.length) {
      filter = 'all'
      return ;
    }
    return unfulfilledArr
  }
}

const changeFilter = (event) => {
  if (event.target.matches('#renderAll')) {
    filter = 'all'
    render()
  }
  currentPage = 1
  if (event.target.matches('#renderComplited')) {
    filter = 'complited'
    render()
  }
  if (event.target.matches('#renderUnfulfilled')) {
    filter = 'unfulfilled'
    render()
  }
}
const changeTask = (event) =>{
  const todoId = parseInt(event.target.parentNode.dataset.id)
  const arrElementId = arrayAllTodo.findIndex(todo => todo.id === todoId)
  if (event.target.matches('.todo-list_text') && event.detail === DOUBLE_CLIK) {
    const todoItemReset = event.target.nextElementSibling
    const textTodoOld = event.target
    todoItemReset.hidden = ""
    textTodoOld.hidden = "false"
    todoItemReset.focus()
  }
  if (event.target.matches('.checkbox')) {
    arrayAllTodo[arrElementId].isChecked = !arrayAllTodo[arrElementId].isChecked
    const activityCheck = arrayAllTodo.every((todo) => todo.isChecked)
    checkAll.checked = activityCheck ? true : false
    render()
  }
  if (event.target.matches('.todo-list-button')) {
    const newArr = arrayAllTodo.filter(todo => todo.id !== todoId)
    arrayAllTodo = newArr
    render()   
  }
  if (event.target.matches('#showMore')) {
    countTodosOnPage += QUANTITY_TODOS_ADDITION
    render()
  }
}
const rewriteTodo = (event) => {
  const todoLi = event.target.parentNode
  const todoId = parseInt(todoLi.dataset.id)
  const arrElementId = arrayAllTodo.findIndex(todo => todo.id === todoId)
  if (event.keyCode === ESC_KEY) { 
    renderTodo()
    return;
  }
  if (!(event.keyCode === ENTER_KEY || event.type === 'blur')) {
    return;
  }
  if (event.target.matches('.todo-list_reset-text')) {
    const todoItem = todoLi.childNodes[5]
    const text = validationText(todoItem.value)
    if (text.length === 0) {
      renderTodo()
      renderBtnShowMore()
    } else {
      if (text.length > MAX_LENGTH_TODO) {
        const trimText = text.slice(0,MAX_LENGTH_TODO)
        arrayAllTodo[arrElementId].text = trimText
      }
      arrayAllTodo[arrElementId].text = text
      render()
    }
  }
}

const removeAllCheckElementArr = (event) => {
  event.preventDefault()
  const newArr = arrayAllTodo.filter(todo => !todo.isChecked)
  arrayAllTodo = newArr
  calculateTotalNumberOfPages(arrayAllTodo.length)
  currentPage = 1
  render()
}
const checkAllElementArr = (event) => {
  arrayAllTodo.forEach(todo => todo.isChecked = event.target.checked)
  renderTodo()
}

calculateTotalNumberOfPages(arrayAllTodo.length)
render()

buttonSubmit.addEventListener('click', addTodo)
inputTodo.addEventListener('keydown', addTodosByPressingEnter)
containerTodo.addEventListener('click', changeTask)
containerTodo.addEventListener('keyup', rewriteTodo)
containerTodo.addEventListener('blur', rewriteTodo, true)
removeAllActive.addEventListener('click', removeAllCheckElementArr)
checkAll.addEventListener('click', checkAllElementArr)
filterButtonsContainer.addEventListener('click', changeFilter)
paginationContainer.addEventListener('click',  changePage)