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

/* КЛАСС ДЛЯ ФОРМИРОВАНИЯ ОБЪЕКТА ТУДУШКИ */
class Todoitem {
  constructor(text, bool) {
      this.id = Date.now();
      this.text = text;
      this.isExecuted = bool;
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
const addTodo = (e) => { //общее добавление
  e.preventDefault()
  if (!(inputTodo.value.trim() === '')) {
    const newTodo = new Todoitem(inputTodo.value, false)
    arrayAllTodo.push(newTodo)
    inputTodo.value = ''
    inputTodo.focus
    pageCounter(arrayAllTodo)
    render()
  }
}
const inputSubmit = (e) => { //добавление по ENTER
    if (e.keycode === ENTER_KEY) {
        addTodo(e)
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
const changePage = (e) => { //изменение текущей страницы по клику
    currentPage = parseInt(e.target.textContent)
    render()
}

/* РЕНДЕР */
const render = () => { //общий рендер
    renderTodo()
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
const renderTodo = (array = arrayAllTodo) => { //общий рендер тудушек
    containerTodo.innerHTML = ""
    pageCounter(array)
    paginationSlice(array, currentPage)
    paginationArr.forEach(element => {
        const task = 
            `<li data-id=${element.id} class="todo-list_item">
                <input type="checkbox" class="checkbox" ${element.isExecuted ? 'checked' : ''}>
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
const renderTab = (e) => { //функция табуляции
  if (e.target.matches('.renderAll')) {
    pageCounter(arrayAllTodo)
    renderTodo()
  }
  if (e.target.matches('.renderExecuted')) {
    const executedArr = arrayAllTodo.filter(item => item.isExecuted === true)
    pageCounter(executedArr)
    renderTodo(executedArr)
  }
  if (e.target.matches('.renderUnfulfilled')) {
    const unfulfilledArr = arrayAllTodo.filter(item => item.isExecuted === false)
    pageCounter(unfulfilledArr)
    renderTodo(unfulfilledArr)
  }
  renderPagination()
}

/* ПЕРВОНАЧАЛЬНЫЙ РЕНДЕР */
pageCounter(arrayAllTodo)
render()

/* ОБЩИЕ ФУНКЦИИ ДЛЯ РАБОТЫ С ОДНОЙ ЗАПИСЬЮ */
const changeTask = (e) =>{
    const todoId = parseInt(e.target.parentNode.dataset.id)
    if (e.target.matches('.todo-list_text') && e.detail === DOUBLE_CLIK) {
        const todoItemReset = e.target.nextElementSibling
        const textTodoOld = e.target
        todoItemReset.style = "display: block"
        textTodoOld.style = "display: none"
        todoItemReset.focus()
    }
    if (e.target.matches('.checkbox')) {
        invertCheckbox(todoId)
    }
    if (e.target.matches('.todo-list-button')) {
        removeElementArr(todoId)
    }
}
const edit = (e) => { //подготовка к перезаписи
    const todoLi = e.target.parentNode
    const todoId = parseInt(todoLi.dataset.id)
    if (e.keyCode === ESC_KEY) { 
        renderTodo()
    } else {
        if ((e.keyCode === ENTER_KEY || e.type === 'blur') &&
            e.target.matches('.todo-list_reset-text')) {
            const todoItem = todoLi.querySelector('.todo-list_reset-text')
            const text = validationText(todoItem.value)
            if (text.length === 0) {
                renderTodo()
            } else {
                if (text.length > MAX_LENGTH_TODO) {
                    const text = text.slice(0,MAX_LENGTH_TODO)
                    resetText(text, todoId)
                }
                resetText(text, todoId)
            }
        }
    }
}

/* ФУНКЦИИ ДЛЯ ЛОКАЛЬНОЙ РАБОТЫ */
const resetText = (text, id) => { //изменение текста туду
    const arrElementId = arrayAllTodo.findIndex(item => item.id === id)
    arrayAllTodo[arrElementId].text = text
    render()
}
const invertCheckbox = (id) => { //меняем состояние выполнения
    const arrElementId = arrayAllTodo.findIndex(item => item.id === id)
    arrayAllTodo[arrElementId].isExecuted = !arrayAllTodo[arrElementId].isExecuted
    render()
}
const removeElementArr = (id) => { //удаляем тудушку
    const newArr = arrayAllTodo.filter(item => item.id !== id)
    arrayAllTodo = newArr
    render()
}
const removeAllCheckElementArr = (e) => { //удаление всех активных
    e.preventDefault()
    const newArr = arrayAllTodo.filter(item => item.isExecuted !== true)
    arrayAllTodo = newArr
    pageCounter(arrayAllTodo)
    render()
}
const checkAllElementArr = (e) => { //сделать все активными/неактивными
    arrayAllTodo.forEach(item => item.isExecuted = e.target.checked)
    renderTodo()
}



buttonSubmit.addEventListener('click', addTodo) //для добавления тудушки
inputTodo.addEventListener('keydown', inputSubmit) //добавление по нажатию на ENTER
containerTodo.addEventListener('click', changeTask) //слушатель для изменения текста туду
containerTodo.addEventListener('keyup', edit) //слушатель для реагирования на редактирование
containerTodo.addEventListener('blur', edit, true)
removeAllActive.addEventListener('click', removeAllCheckElementArr) //удалить все активные
checkAll.addEventListener('click', checkAllElementArr) //пометка всех как активных/нективных
btnsTabs.addEventListener('click', renderTab) // общий слушатель для табуляции
paginationDiv.addEventListener('click',  changePage) //переключение страницы