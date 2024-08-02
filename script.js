const container = document.querySelector('.container') //основной контейнер
const formAddTodo = document.querySelector('.add_text') //вся форма создания туду
const inputTodo = document.querySelector('.write_text') //поле ввода текста туду
const buttonSubmit = document.querySelector('.submit_text') //кнопка оздания туду
const containerTodo = document.querySelector('.todo-list') //контейнер всех тудушек
const removeAllActive = document.querySelector('.change-list_remove') //кнопка удаления всех активных тудушек
const checkAll = document.querySelector('.check-all_checkbox') //chckbox для выделения всех, как активных
const btnRenderAll = document.querySelector('.renderAll') //кнопка вывода всех задач (пагинация учитывается)
const btnRenderComplited = document.querySelector('.renderComplited') //кнопка вывода выполненных задач
const btnRenderNoComplited = document.querySelector('.renderNoComplited') //кнопка вывода НЕ выполненных задач
const paginationDiv = document.querySelector('.pagination') //контейнер с кнопками страниц
const pageBtn = document.querySelector('.page') //кнопка страницы


/* КОНСТАНТЫ */
const COUNT_PAGE = 5
const ENTER_KEY = 13
const ESC_KEY = 27
const DOUBLE_CLIK = 2
let totalPage = 1
let currentPage = 1

class Todoitem {
    constructor(text, bool) {
        this.id = Date.now();
        this.text = text;
        this.check = bool;
    } 
}
let paginationArr = [] //глобальный массив постраничных записей
let arrayAllTodo = [] //глобальный массив всех тудушек


const validationText = (text) => { //проверка текста на наличие тегов
    return text
            .trim()
            .replace(/ {2,}/g, " ")
            .replace(/</g, "&lt")
            .replace(/>/g, '&gt')
}

/* ДОБАЛЕНИЕ ЗАПИСИ */
const addTodo = (e) => { //общее добавление
    if (inputTodo.value.trim() === '') {return 0}
    e.preventDefault()
    const newTodo = new Todoitem(inputTodo.value, false)
    arrayAllTodo.push(newTodo)
    inputTodo.value = ''
    inputTodo.focus
    pageCounter(arrayAllTodo)
    render(arrayAllTodo, totalPage)
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
    render(arrayAllTodo, totalPage)
}

/* РЕНДЕР */
const render = (array, page) => { //общий рендер
    renderTodo(array)
    renderPagination(page)
}
const renderPagination = (page) => { //с 0 отрисовывает элементы страниц
    paginationDiv.innerHTML = ""
    for (let i = 1; i <= page; i++) {
        const pages = 
        `<button class="page${+ currentPage === i ? " active" : ""}"}>
            ${i}
        </button>`
        paginationDiv.innerHTML += pages
    }
}
const renderTodo = (array) => { //общий рендер тудушек
    containerTodo.innerHTML = ""
    pageCounter(array)
    paginationSlice(array, currentPage)
    paginationArr.forEach(element => {
        const task = 
            `<li data-id=${element.id} class="todo-list_item">
                <input type="checkbox" class="checkbox" ${element.check ? 'checked' : ''}>
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
const renderAll = (array) => { //вывести все
    pageCounter(array)
    render(array, totalPage)
}
const renderComplitedTodo = () => { //рендер только активных
    const complitedArr = arrayAllTodo.filter(item => item.check === true)
    pageCounter(complitedArr)
    render(complitedArr, totalPage)
}
const renderNoComplitedTodo = () => { //рендер только неактивных
    const complitedArr = arrayAllTodo.filter(item => item.check === false)
    pageCounter(complitedArr)
    render(complitedArr, totalPage)
}

/* ПЕРВОНАЧАЛЬНЫЙ РЕНДЕР */
pageCounter(arrayAllTodo)
render(arrayAllTodo, totalPage)

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
        renderTodo(arrayAllTodo)
    } else {
        if ((e.keyCode === ENTER_KEY || e.type === 'blur') &&
            e.target.matches('.todo-list_reset-text')) {
            const todoItem = todoLi.querySelector('.todo-list_reset-text')
            const text = validationText(todoItem.value)
            if (text.length === 0) {
                renderTodo(arrayAllTodo)
            } else {
                if (text.length > 255) {
                    const text = text.slice(0,255)
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
    renderTodo(arrayAllTodor)
}
const invertCheckbox = (id) => { //меняем состояние выполнения
    const arrElementId = arrayAllTodo.findIndex(item => item.id === id)
    arrayAllTodo[arrElementId].check = !arrayAllTodo[arrElementId].check
    renderTodo(arrayAllTodo)
}
const removeElementArr = (id) => { //удаляем тудушку
    const newArr = arrayAllTodo.filter(item => item.id !== id)
    arrayAllTodo = newArr
    renderTodo(arrayAllTodo)
}
const removeAllCheckElementArr = (e) => { //удаление всех активных
    e.preventDefault()
    const newArr = arrayAllTodo.filter(item => item.check !== true)
    arrayAllTodo = newArr
    pageCounter(arrayAllTodo)
    render(arrayAllTodo, totalPage)
}
const checkAllElementArr = (e) => { //сделать все активными
    if (e.target.checked) {
      arrayAllTodo.forEach(item => item.check = true)
    } else {
      arrayAllTodo.forEach(item => item.check = false)
    }
    renderTodo(arrayAllTodo)
}



buttonSubmit.addEventListener('click', e => addTodo(e)) //для добавления тудушки
inputTodo.addEventListener('keydown', e => inputSubmit(e)) //добавление по нажатию на ENTER
containerTodo.addEventListener('click', e => changeTask(e)) //слушатель для изменения текста туду
containerTodo.addEventListener('keyup', e => edit(e)) //слушатель для реагирования на редактирование
containerTodo.addEventListener('blur', e => edit(e), true)
removeAllActive.addEventListener('click', e => removeAllCheckElementArr(e)) //удалить все активные
checkAll.addEventListener('click', e => checkAllElementArr(e)) //пометка всех как активных/нективных
btnRenderAll.addEventListener('click', () => renderAll(arrayAllTodo)) //вывести все
btnRenderComplited.addEventListener('click', renderComplitedTodo) //вывести все выполненные
btnRenderNoComplited.addEventListener('click', renderNoComplitedTodo) //вывести все невыполненные
paginationDiv.addEventListener('click',  e => changePage(e)) //переключение страницы