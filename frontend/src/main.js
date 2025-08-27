import $ from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "bootstrap";
import "./main.css";

const API_URL = "http://localhost:5000/api/todos";

const FormAddBtn = $(".form__btn");
const toDoList = $(".todos-wrapper");
const formInput = $(".form__input");

// 📌 Получение списка с сервера
async function fetchTodos() {
  const res = await fetch(API_URL);
  return await res.json();
}

// 📌 Добавить новый
async function addTodo(text) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return await res.json();
}

// 📌 Обновить (toggle checkbox или изменить текст)
async function updateTodo(id, updatedTodo) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTodo),
  });
  return await res.json();
}

// 📌 Удалить
async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}

// 📌 Рендер
async function renderTodos() {
  toDoList.empty();
  const todos = await fetchTodos();

  todos.forEach((todo) => {
    const $item = $("<li></li>").addClass("todo-item");
    if (todo.completed) {
      $item.addClass("todo-item-checked");
    }

    const $checkbox = $("<input type='checkbox'>").prop("checked", todo.completed);
    $item.append($checkbox);

    const $span = $("<span></span>")
      .addClass("todo-item__description")
      .text(todo.text);
    $item.append($span);

    const $delBtn = $("<button></button>")
      .addClass("todo-item__delete")
      .text("Видалити");
    $item.append($delBtn);

    // 🔹 сохраняем id (MongoDB _id)
    $item.attr("data-id", todo._id);

    toDoList.append($item);
  });
}

// 🔹 Первичная загрузка
$(function () {
  renderTodos();
});

// 🔹 Добавить
FormAddBtn.on("click", async (e) => {
  e.preventDefault();
  const inputValue = formInput.val().trim();
  if (!inputValue) return;

  await addTodo(inputValue);
  formInput.val("");
  renderTodos();
});

// 🔹 Делегирование

// toggle checkbox
toDoList.on("change", "input[type='checkbox']", async function (e) {
  e.stopPropagation();
  const id = $(this).closest(".todo-item").data("id");
  const completed = $(this).is(":checked");

  await updateTodo(id, { completed });
  renderTodos();
});

// delete button
toDoList.on("click", ".todo-item__delete", async function (e) {
  e.stopPropagation();
  const id = $(this).closest(".todo-item").data("id");

  await deleteTodo(id);
  renderTodos();
});

// modal
const modalElement = document.getElementById("myModal");
const myModal = new Modal(modalElement, { backdrop: "static" });

toDoList.on("click", "li", function (e) {
  if ($(e.target).is("input, button")) return;

  const text = $(this).find(".todo-item__description").text();
  $(".todoModalText").text(text);
  myModal.show();
});
