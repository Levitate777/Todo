//const URL = 'https://api.t4.academy.dunice-testing.com/api/todos';
const URL = 'http://localhost:3000/api/todos';

export function createTodo(newTodo) {
  return fetch(`${URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTodo),
  }).then(response => response.json())
    .catch(error => error.message);
}

export function getAlltodos() {
  return fetch(`${URL}/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json())
    .catch(error => error.message);
}

export function updateCheckboxTodo(todoId, todoIsChecked) {
  return fetch(`${URL}/update/${todoId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({isChecked: todoIsChecked})
  }).then(response => response.json())
    .catch(error => error.message);
}

export function updateTextTodo(todoId, newText) {
  return fetch(`${URL}/update/${todoId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({text: newText})
  }).then(response => response.json())
    .catch(error => error.message);
}

export function deleteOneTodo(todoId) {
  return fetch(`${URL}/delete/${todoId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.text())
    .catch(error => error.message);
}

export function deleteAllCheckedTodo() {
  return fetch(`${URL}/delete-all-checked`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.text())
    .catch(error => error.message);
}

export function checkAllTodo(checked) {
  return fetch(`${URL}/check-all`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({isChecked: checked})
  }).then(response => response.text())
    .catch(error => error.message);
}
