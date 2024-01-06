//Query Selectors
const submitFormular = document.querySelector("#submit-formular");
const todoText = document.querySelector("#todo-text");
const addBtn = document.querySelector("#add-btn");
const list = document.querySelector("#list");
const deleteBtn = document.querySelector("#delete-button");

let myTodos = [];
//Get data from backend
function getTodos() {
  fetch("http://localhost:4730/todos")
    .then((request) => request.json())
    .then((todos) => {
      myTodos = todos;
      list.innerText = "";
      renderTodo();
    });
}
//render Todos
function renderTodo() {
  myTodos.forEach((element) => {
    const newLi = document.createElement("li");
    newLi.classList = "list-element";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = element.done;
    checkbox.id = element.id;
    checkbox.classList = "checkbox-style";

    const desc = document.createTextNode(element.description);

    newLi.appendChild(checkbox);
    newLi.appendChild(desc);

    showTodos(newLi, element);
    list.appendChild(newLi);
    changeStat(newLi, checkbox);
  });
}

function newTodo() {
  const newTodo = {
    description: todoText.value,
    done: false,
  };
  fetch("http://localhost:4730/todos", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(newTodo),
  }).then((res) => res.json());
}

function changeStat(newLi, checkbox) {
  checkbox.addEventListener("change", () => {
    const updatetTodo = {
      id: checkbox.id,
      description: newLi.innerText,
      done: checkbox.checked,
    };
    fetch("http://localhost:4730/todos/" + checkbox.id, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(updatetTodo),
    })
      .then((res) => res.json())
      .then(getTodos());
  });
}

function deleteTodo() {
  myTodos.forEach((element) => {
    if (element.done === true) {
      fetch("http://localhost:4730/todos/" + element.id, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(getTodos());
    }
  });
}

function showTodos(newLi, element) {
  const show = document.querySelector("#show");
  show.addEventListener("change", (e) => {
    if (e.target.id === "all") {
      newLi.style.display = "";
    } else if (e.target.id === "todo") {
      if (element.done === true) {
        newLi.style.display = "none";
      } else {
        newLi.style.display = "";
      }
    } else if (e.target.id === "done") {
      if (element.done === false) {
        newLi.style.display = "none";
      } else {
        newLi.style.display = "";
      }
    }
  });
}

submitFormular.addEventListener("submit", newTodo);

deleteBtn.addEventListener("click", deleteTodo);
getTodos();
