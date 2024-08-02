const container = document.querySelector('.container') //основной контейнер
const formAddTodo = document.querySelector('.add_text') //вся форма создания туду
const inputTodo = document.querySelector('.write_text') //поле ввода текста туду
const buttonSubmit = document.querySelector('.submit_text') //кнопка оздания туду
const containerTodo = document.querySelector('.todo-list') //контейнер всех тудушек
const removeAllActive = document.querySelector('.change-list_remove') //кнопка удаления всех активных тудушек
const checkAll = document.querySelector('.check-all_checkbox') //chckbox для выделения всех, как активных
const btnsTabs = document.querySelector('.filter') //контейнер кнопок табуляции
const paginationDiv = document.querySelector('.pagination') //контейнер с кнопками страниц
const pageBtn = document.querySelector('.page') //кнопка страницы

/* КОНСТАНТЫ */
const COUNT_PAGE = 5
const ENTER_KEY = 13
const ESC_KEY = 27
const DOUBLE_CLIK = 2
const MAX_LENGTH_TODO = 255

let totalPage = 1
let currentPage = 1
let paginationArr = [] //глобальный массив постраничных записей
let arrayAllTodo = [] //глобальный массив всех тудушек
let filter = "all"

/* КЛАСС ДЛЯ ФОРМИРОВАНИЯ ОБЪЕКТА ТУДУШКИ */
class Todoitem {
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
    const newTodo = new Todoitem(inputTodo.value)
    arrayAllTodo.push(newTodo)
    inputTodo.value = ''
    inputTodo.focus
    pageCounter(arrayAllTodo)
    currentPage = currentPage === totalPage ? currentPage : ++currentPage
    render()
  }
}
const inputSubmit = (event) => { //добавление по ENTER
  if (event.keycode === ENTER_KEY) {
    addTodo(event)
  }
}

/* ПАГИНАЦИЯ */
const pageCounter = (array) => { //счетчик страниц
  if (array.length <= COUNT_PAGE) {
    totalPage = 1
  } else {
    totalPage = Math.ceil(array.length / COUNT_PAGE)
  }
}
const paginationSlice = (array, page) => { //создаем массив страницы
  const start = (page - 1) * 5
  const end = page * 5
  paginationArr = array.slice(start, end) 
}
const changePage = (event) => { //изменение текущей страницы по клику
  currentPage = parseInt(event.target.textContent)
  render()
}

/* РЕНДЕР */
const render = () => { //общий рендер
  if (filter === 'all') {
    pageCounter(arrayAllTodo)
    renderTodo()
  }
  if (filter === 'active') {
    const executedArr = arrayAllTodo.filter(item => item.isChecked === true)
    pageCounter(executedArr)
    renderTodo(executedArr)
  }
  if (filter === 'complited') {
    const unfulfilledArr = arrayAllTodo.filter(item => item.isChecked === false)
    pageCounter(unfulfilledArr)
    renderTodo(unfulfilledArr)
  }
  renderPagination()
}
const renderPagination = () => { //с 0 отрисовывает элементы страниц
  paginationDiv.innerHTML = ""
  for (let i = 1; i <= totalPage; i++) {
    const pages = 
    `<button class="page${+ currentPage === i ? " active" : ""}"}>
      ${i}
    </button>`
    paginationDiv.innerHTML += pages
  }
}
const renderTodo = (arrayTodos = arrayAllTodo) => { //общий рендер тудушек
  containerTodo.innerHTML = ""
  pageCounter(arrayTodos)
  paginationSlice(arrayTodos, currentPage)
  paginationArr.forEach(element => {
    const task = 
      `<li data-id=${element.id} class="todo-list_item">
          <input type="checkbox" class="checkbox" ${element.isChecked ? 'checked' : ''}>
          <p class="todo-list_text">${element.text}</p>
          <input type="text" class="todo-list_reset-text" 
            placeholder="перепиши меня" 
            value="${element.text}"
          >
          <button class="todo-list-button">X</button>
      </li>`
      containerTodo.innerHTML += task
  });
}
const renderTab = (event) => { //функция табуляции
  if (event.target.matches('.renderAll')) {
    filter = 'all'
    render()
  }
  currentPage = 1
  if (event.target.matches('.renderActive')) {
    filter = 'active'
    render()
  }
  if (event.target.matches('.renderComplited')) {
    filter = 'complited'
    render()
  }
}

/* ОБЩИЕ ФУНКЦИИ ДЛЯ РАБОТЫ С ОДНОЙ ЗАПИСЬЮ */
const changeTask = (event) =>{
  const todoId = parseInt(event.target.parentNode.dataset.id)
  const arrElementId = arrayAllTodo.findIndex(item => item.id === todoId)
  if (event.target.matches('.todo-list_text') && event.detail === DOUBLE_CLIK) {
    const todoItemReset = event.target.nextElementSibling
    const textTodoOld = event.target
    todoItemReset.style = "display: block"
    textTodoOld.style = "display: none"
    todoItemReset.focus()
  }
  if (event.target.matches('.checkbox')) {
    arrayAllTodo[arrElementId].isChecked = !arrayAllTodo[arrElementId].isChecked
    render()
  }
  if (event.target.matches('.todo-list-button')) {
    const newArr = arrayAllTodo.filter(item => item.id !== todoId)
    arrayAllTodo = newArr
    render()   
  }
}
const edit = (event) => { //подготовка к перезаписи
  const todoLi = event.target.parentNode
  const todoId = parseInt(todoLi.dataset.id)
  const arrElementId = arrayAllTodo.findIndex(item => item.id === todoId)
  if (event.keyCode === ESC_KEY) { 
    renderTodo()
  } else {
    if ((event.keyCode === ENTER_KEY || event.type === 'blur') &&
    event.target.matches('.todo-list_reset-text')) {
      const todoItem = todoLi.querySelector('.todo-list_reset-text')
      const text = validationText(todoItem.value)
      if (text.length === 0) {
        renderTodo()
      } else {
        if (text.length > MAX_LENGTH_TODO) {
          const text = text.slice(0,MAX_LENGTH_TODO)
          arrayAllTodo[arrElementId].text = text
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
  const newArr = arrayAllTodo.filter(item => item.isChecked !== true)
  arrayAllTodo = newArr
  pageCounter(arrayAllTodo)
  currentPage = 1
  render()
}
const checkAllElementArr = (event) => { //сделать все активными/неактивными
  arrayAllTodo.forEach(item => item.isChecked = event.target.checked)
  renderTodo()
}

/* ПЕРВОНАЧАЛЬНЫЙ РЕНДЕР */
pageCounter(arrayAllTodo)
render()

buttonSubmit.addEventListener('click', addTodo) //для добавления тудушки
inputTodo.addEventListener('keydown', inputSubmit) //добавление по нажатию на ENTER
containerTodo.addEventListener('click', changeTask) //слушатель для изменения текста туду
containerTodo.addEventListener('keyup', edit) //слушатель для реагирования на редактирование
containerTodo.addEventListener('blur', edit, true) //если нажал не по полю ввода
removeAllActive.addEventListener('click', removeAllCheckElementArr) //удалить все активные
checkAll.addEventListener('click', checkAllElementArr) //пометка всех как активных/нективных
btnsTabs.addEventListener('click', renderTab) // общий слушатель для табуляции
paginationDiv.addEventListener('click',  changePage) //переключение страницы