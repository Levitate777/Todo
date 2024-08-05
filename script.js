const inputTodo = document.querySelector('#addTodoItem') //поле ввода текста туду
const buttonSubmit = document.querySelector('#submitTodo') //кнопка оздания туду
const containerTodo = document.querySelector('#containerTodo') //контейнер всех тудушек
const removeAllActive = document.querySelector('#removeAllActive') //кнопка удаления всех активных тудушек
const checkAll = document.querySelector('#checkboxCheckAll') //chckbox для выделения всех, как активных
const btnsTabs = document.querySelector('#filter') //контейнер кнопок табуляции
const paginationDiv = document.querySelector('#pagination') //контейнер с кнопками страниц

/* КОНСТАНТЫ */
const QUANTITY_TODOS_ADDITION = 5
const ENTER_KEY = 13
const ESC_KEY = 27
const DOUBLE_CLIK = 2
const MAX_LENGTH_TODO = 255

let countPage = 1
let currentPage = 1
let countTodosOnPage = 5
let arrayAllTodo = [] //глобальный массив всех тудушек
let filter = "all"

/* КЛАСС ДЛЯ ФОРМИРОВАНИЯ ОБЪЕКТА ТУДУШКИ */
class TodoItem {
  constructor(text) {
    this.id = Date.now();
    this.text = text;
    this.isChecked = false;
  } 
}

const validationText = (text) => { //проверка текста на наличие тегов
  return text
          .trim()
          .replace(/ {2,}/g, " ")
          .replace(/</g, "&lt")
          .replace(/>/g, '&gt')
}

/* ДОБАЛЕНИЕ ЗАПИСИ */
const addTodo = (event) => { //общее добавление
  event.preventDefault()
  if (!(inputTodo.value.trim() === '')) {
    const text = validationText(inputTodo.value)
    const newTodo = new TodoItem(text)
    arrayAllTodo.push(newTodo)
    inputTodo.value = ''
    inputTodo.focus
    countNumberAllPages(arrayAllTodo.length)
    currentPage = currentPage === countPage ? currentPage : countPage
    render()
  }
}
const addTodosByPressingEnter = (event) => { //добавление по ENTER
  if (event.keyCode === ENTER_KEY) {
    addTodo(event)
  }
}

/* ПАГИНАЦИЯ */
const countNumberAllPages = (arrayLength) => { //счетчик страниц
  if (arrayLength <= countTodosOnPage) {
    countPage = 1
  } else {
    countPage = Math.ceil(arrayLength / countTodosOnPage)
  }
}
const trimArrayByPage = (array, page) => { //создаем массив страницы
  const start = (page - 1) * countTodosOnPage
  const end = page * countTodosOnPage
  return array.slice(start, end) 
}
const changePage = (event) => { //изменение текущей страницы по клику
  currentPage = parseInt(event.target.textContent)
  countTodosOnPage = 5 //при выборе другой стр после нажатия "Давай больше" откатывае колличество тудушек на стр
  render()
}

/* РЕНДЕР */
const render = () => { //общий рендер
  const returnArray = renderFilterButtons()
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
const renderPagination = () => { //с 0 отрисовывает элементы страниц
  paginationDiv.innerHTML = ""
  for (let i = 1; i <= countPage; i++) {
    const pages = 
    `<button class="page${+ currentPage === i ? " active" : ""}"}>
      ${i}
    </button>`
    paginationDiv.innerHTML += pages
  }
}
const renderTodo = (arrayTodos = arrayAllTodo) => { //общий рендер тудушек
  containerTodo.innerHTML = ""
  countNumberAllPages(arrayTodos.length)
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
const renderFilterButtons = () => {
  btnsTabs.innerHTML = ""
  const executedArr = arrayAllTodo.filter(todo => todo.isChecked)
  const unfulfilledArr = arrayAllTodo.filter(todo => !todo.isChecked)
  const buttonsFilter = 
        `<button id="renderAll">Все (${arrayAllTodo.length})</button>
        <button id="renderActive">Выполненные (${executedArr.length})</button>
        <button id="renderComplited">Не выполненные (${unfulfilledArr.length})</button>`
        btnsTabs.innerHTML += buttonsFilter
  if (filter === 'all') {
    countNumberAllPages(arrayAllTodo.length)
    return ;
  }
  if (filter === 'active') {
    countNumberAllPages(executedArr.length)
    if (!executedArr.length) {
      filter = 'all'
      return ;
    }
    return executedArr
  }
  if (filter === 'complited') {
    countNumberAllPages(unfulfilledArr.length)
    if (!unfulfilledArr.length) {
      filter = 'all'
      return ;
    }
    return unfulfilledArr
  }
}
const changeFilter = (event) => { //функция табуляции
  if (event.target.matches('#renderAll')) {
    filter = 'all'
    render()
  }
  currentPage = 1
  if (event.target.matches('#renderActive')) {
    filter = 'active'
    render()
  }
  if (event.target.matches('#renderComplited')) {
    filter = 'complited'
    render()
  }
}

/* ОБЩИЕ ФУНКЦИИ ДЛЯ РАБОТЫ С ОДНОЙ ЗАПИСЬЮ */
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
    const activityCheck = arrayAllTodo.every((todo) => todo.isChecked) //проверяем всех на активность, если прожали чекбоксы у тудушек
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
const rewriteTodo = (event) => { //подготовка к перезаписи
  const todoLi = event.target.parentNode
  const todoId = parseInt(todoLi.dataset.id)
  const arrElementId = arrayAllTodo.findIndex(todo => todo.id === todoId)
  if (event.keyCode === ESC_KEY) { 
    renderTodo()
  } else {
    //что-то сделать с ифом big->small
    if ((event.keyCode === ENTER_KEY || event.type === 'blur')
    && event.target.matches('.todo-list_reset-text')) {
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
}

/* ФУНКЦИИ ДЛЯ ЛОКАЛЬНОЙ РАБОТЫ */
const removeAllCheckElementArr = (event) => { //удаление всех активных
  event.preventDefault()
  const newArr = arrayAllTodo.filter(todo => !todo.isChecked)
  arrayAllTodo = newArr
  countNumberAllPages(arrayAllTodo.length)
  currentPage = 1
  render()
}
const checkAllElementArr = (event) => { //сделать все активными/неактивными
  arrayAllTodo.forEach(todo => todo.isChecked = event.target.checked)
  renderTodo()
}

/* ПЕРВОНАЧАЛЬНЫЙ РЕНДЕР */
countNumberAllPages(arrayAllTodo.length)
render()

buttonSubmit.addEventListener('click', addTodo) //для добавления тудушки
inputTodo.addEventListener('keydown', addTodosByPressingEnter) //добавление по нажатию на ENTER
containerTodo.addEventListener('click', changeTask) //слушатель для изменения текста туду
containerTodo.addEventListener('keyup', rewriteTodo) //слушатель для реагирования на редактирование
containerTodo.addEventListener('blur', rewriteTodo, true) //если нажал не по полю ввода
removeAllActive.addEventListener('click', removeAllCheckElementArr) //удалить все активные
checkAll.addEventListener('click', checkAllElementArr) //пометка всех как активных/нективных
btnsTabs.addEventListener('click', changeFilter) // общий слушатель для табуляции
paginationDiv.addEventListener('click',  changePage) //переключение страницы