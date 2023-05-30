const formList = document.querySelector("[data-new-list-form]");
const inputList = document.querySelector("[data-new-list-input]");
let listsContainer = document.querySelector("[data-lists]");
const deleteListButton = document.querySelector("[data-delete-list-button]");
const tasksContainer = document.querySelector("[data-tasks]");
const taskDisplayContainer = document.querySelector(
  "[data-list-display-container]"
);
const taskTitle = document.querySelector("[data-list-title]");
const taskCounter = document.querySelector("[data-list-count]");
const templateTask = document.querySelector("#task-template");
const formTasks = document.querySelector("[data-new-task-form]");
const inputTasks = document.querySelector("[data-new-task-input]");
const clearCompleteTasksButton = document.querySelector(
  "[data-clear-complete-tasks-button]"
);

const LOCAL_STORAGE_LIST_KEY = "list.key";
const LOCAL_STORAGE_LIST_KEY_ID = "list.key.listId";

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_LIST_KEY_ID);

deleteListButton.addEventListener("click", () => {
  lists = lists.filter((e) => e.id !== selectedListId);
  selectedListId = null;
  saveRender();
});

clearCompleteTasksButton.addEventListener("click", () => {
  const selectedList = lists.find((e) => e.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter((e) => !e.complete);
  saveRender();
});

listsContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.listId;
    saveRender();
  }
});

tasksContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = lists.find((e) => e.id === selectedListId);
    const selectedTasks = selectedList.tasks.find(
      (task) => task.id === e.target.id
    ); //here we compare our task is with the (e) >>> checkbox id
    selectedTasks.complete = e.target.checked;
    saveLocal();
    renderTaskCount(selectedList);
  }
});

formTasks.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = inputTasks.value;
  if (task == null || task === "") return;
  const newTask = createTask(task);
  inputTasks.value = null;
  const selectedList = lists.find((e) => e.id === selectedListId);
  selectedList.tasks.push(newTask);
  saveRender();
});

formList.addEventListener("submit", (e) => {
  e.preventDefault();
  const list = inputList.value;
  if (list == null || list === "") return;
  const newList = createList(list);
  lists.push(newList);
  inputList.value = null;
  saveRender();
});

function createList(name) {
  return {
    id: Date().toString(),
    name: name,
    tasks: [],
  };
}

function createTask(name) {
  return { id: Date().toString(), name: name, complete: false };
}

function saveRender() {
  render();
  saveLocal();
}
function saveLocal() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY_ID, selectedListId);
}

function render() {
  clearElements(listsContainer);
  renderList();

  const selectedList = lists.find((e) => e.id === selectedListId);

  if (selectedListId == null) {
    taskDisplayContainer.style.display = "none";
  } else {
    taskDisplayContainer.style.display = "";
    taskTitle.innerText = selectedList.name;
    renderTaskCount(selectedList);
    clearElements(tasksContainer);
    renderTask(selectedList);
  }
}

function renderTask(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(templateTask.content, true);
    console.log(taskElement);
    const checkbox = taskElement.querySelector("input");
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector("label");
    label.htmlFor = task.id;
    label.append(task.name);
    tasksContainer.appendChild(taskElement);
  });
}

function renderTaskCount(selectedList) {
  const incompleteTasks = selectedList.tasks.filter((e) => !e.complete).length;
  const pluralCheck = incompleteTasks === 1 ? "task" : "tasks";
  taskCounter.innerText = `${incompleteTasks} ${pluralCheck} remaining`;
}
function renderList() {
  lists.forEach((list) => {
    const listElement = document.createElement("li");
    listElement.classList.add("list-name");
    listElement.innerText = list.name;
    listElement.dataset.listId = list.id;
    if (list.id === selectedListId) {
      listElement.classList.add("active-list");
    }
    listsContainer.appendChild(listElement);
  });
}
function clearElements(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
render();
