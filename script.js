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
const paginationDiv = document.querySelector('.pagination')
const pageBtn = document.querySelector('.page')

//console.log(inputTodo);

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
let paginationArr = []
let arr = [ // массив, в котором все тудушки
    {
        id: 0,
        text: '1 Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
        check: false,
    },
    {
        id: 1,
        text: '2 amet consectetur adipisicing elit.',
        check: false,
    },
    {
        id: 2,
        text: '3 Lorem ipsum',
        check: false,
    },
    {
        id: 3,
        text: '4 Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
        check: false,
    },
    {
        id: 4,
        text: '5 amet consectetur adipisicing elit.',
        check: false,
    },
    {
        id: 5,
        text: '6 Lorem ipsum',
        check: false,
    },
    {
        id: 6,
        text: '7 Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
        check: false,
    },
    {
        id: 7,
        text: '8 amet consectetur adipisicing elit.',
        check: false,
    },
    {
        id: 8,
        text: '9 Lorem ipsum',
        check: false,
    },
] 
//renderTodo(arr)
pageCounter()
render(arr, totalPage)


function validationText(text) {
    return text
            .trim()
            .replace(/ {2,}/g, " ")
            .replace(/</g, "&lt")
            .replace(/>/g, '&gt')
}

function addTodo(e) { //общее добавление
    if (inputTodo.value.trim() === '') {return 0}
    e.preventDefault()
    const newTodo = new Todoitem(inputTodo.value, false)
    //console.log(newTodo);
    arr.push(newTodo)
    //console.log(arr);
    inputTodo.value = ''
    inputTodo.focus
    pageCounter()
    render(arr, totalPage)
}

function inputSubmit(e) { //добавление по ENTER
    if (e.keycode === ENTER_KEY) {
        addTodo(e)
    }
}

function pageCounter() { //счетчик страниц
    if (arr.length <= COUNT_PAGE) {
        totalPage = 1
    } else {
        totalPage = Math.ceil(arr.length / COUNT_PAGE)
    }
}
function paginationSlice(page) { //создаем массив страницы
    const start = (page - 1) * 5
    const end = page * 5
    //console.log(start, end);
    paginationArr = arr.slice(start, end)
    //console.log(pagitationArr);
}
function changePage(e) { //изменение текущей страницы по клику
    //console.log(e.target.textContent);
    //console.log(arr);
    currentPage = parseInt(e.target.textContent)
    render(paginationArr, totalPage)
}

function render(array, page) { //общий рендер
    renderTodo(array)
    renderPagination(page)
}

function renderPagination(page) { //с 0 отрисовывает элементы страниц
    paginationDiv.innerHTML = ""
    for (let i = 1; i <= page; i++) {
        const pages = 
        `<button class="page${+ currentPage === i ? " active" : ""}"}>
            ${i}
        </button>`
        paginationDiv.innerHTML += pages
    }
}

function renderTodo(array) { //общий рендер тудушек
    containerTodo.innerHTML = ""
    pageCounter()
    console.log(totalPage);
    paginationSlice(currentPage)
    console.log(paginationArr);
    array = paginationArr
    array.forEach(element => {
        const task = 
            `<li data-id=${element.id} class="todo-list_item">
                <input type="checkbox" id="checkbox" ${element.check ? 'checked' : ''}>
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
function renderComplitedTodo() {
    const complitedArr = paginationArr.filter(item => item.check === true)
    renderTodo(complitedArr)
}
function renderNoComplitedTodo() {
    const complitedArr = paginationArr.filter(item => item.check === false)
    renderTodo(complitedArr)
}

function changeTask(e) {
    const todoId = parseInt(e.target.parentNode.dataset.id)
    //console.log(todoLi);
    //const todoId = todoLi.dataset.id

    if (e.target.matches('.todo-list_text') && e.detail === DOUBLE_CLIK) {
        //const todoItemReset = todoLi.querySelector('.todo-list_reset-text')
        const todoItemReset = e.target.nextElementSibling
        const textTodoOld = e.target
        //console.log(todoItemReset);
        //console.log(textTodoOld);
        todoItemReset.style = "display: block"
        textTodoOld.style = "display: none"
        todoItemReset.focus()
        //edit(e)
        //console.log(todoItemReset.value);

    }

    if (e.target.matches('#checkbox')) {
        invertCheckbox(todoId)
    }

    if (e.target.matches('.todo-list-button')) {
        removeElementArr(todoId)
    }
}

function edit(e) { //подготовка к перезаписи
    const todoLi = e.target.parentNode
    //console.log(todoLi);
    const todoId = parseInt(todoLi.dataset.id)
    //console.log(todoId);
    //console.log(e.keyCode === 13 || e.type === 'blur');
    //console.log(e.target);
    //console.log(e.target.matches('.todo-list_reset-text'));
    //console.log(e.keyCode); 
    if (e.keyCode === ESC_KEY) { 
        renderTodo(arr)
    } else {
        if ((e.keyCode === ENTER_KEY || e.type === 'blur') &&
            e.target.matches('.todo-list_reset-text')) {
            const todoItem = todoLi.querySelector('.todo-list_reset-text')
            const text = validationText(todoItem.value)
            if (text.length === 0) {
                //todoText.style = "display: none"
                //todoLi.querySelector('.todo-list_text').style = 'display: inline-block'
                renderTodo(arr)
            } else {
                console.log(text.length);
                if (text.length > 255) {
                    const text = text.slice(0,255)
                    //console.log(text.length);
                    resetText(text, todoId)
                }
                console.log(text);
                resetText(text, todoId)
            }
        }
    }
    
}

function resetText(text, id) { //изменение текста туду
    
    //console.log(arr[0].id);
    const arrElementId = arr.findIndex(item => item.id === id)
    console.log(arrElementId);
    arr[arrElementId].text = text

    renderTodo(arr)
}
function invertCheckbox(id) { //меняем состояние выполнения
    const arrElementId = arr.findIndex(item => item.id === id)
    //console.log(arrElementId);
    arr[arrElementId].check = !arr[arrElementId].check
    //console.log(arr[arrElementId].check);

    renderTodo(arr)
}
function removeElementArr(id) { //удаляем тудушку
    //console.log(typeof id);
    const newArr = arr.filter(item => item.id !== id)
    //console.log(newArr);
    arr = newArr
    //console.log(arr);

    renderTodo(arr)
}
function removeAllCheckElementArr(e) {
    e.preventDefault()
    const newArr = arr.filter(item => item.check !== true)
    console.log(newArr);
    arr = newArr
    console.log(arr);
    renderTodo(arr)
}
function checkAllElementArr(e) {
    //console.log(e.target.checked);
    if (e.target.checked) {
        arr.forEach(item => item.check = true)
    } else {
        arr.forEach(item => item.check = false)
    }
    renderTodo(arr)
}


/////// удали из render лишний аргумент


buttonSubmit.addEventListener('click', e => addTodo(e)) //для добавления тудушки
inputTodo.addEventListener('keydown', e => inputSubmit(e)) //добавление по нажатию на ENTER
containerTodo.addEventListener('click', e => changeTask(e)) //слушатель для изменения текста туду
containerTodo.addEventListener('keyup', e => edit(e)) //слушатель для реагирования на редактирование
removeAllActive.addEventListener('click', e => removeAllCheckElementArr(e)) //удалить все активные
checkAll.addEventListener('click', e => checkAllElementArr(e)) //пометка всех как активных/нективных
btnRenderAll.addEventListener('click', () => render(paginationAll, totalPage)) //вывести все по странице
btnRenderComplited.addEventListener('click', renderComplitedTodo) //вывести все выполненные
btnRenderNoComplited.addEventListener('click', renderNoComplitedTodo) //вывести все невыполненные
paginationDiv.addEventListener('click',  e => changePage(e)) //переключение страницы


