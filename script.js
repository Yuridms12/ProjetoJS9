const button = document.querySelector("#taskForm");
button.addEventListener("submit", adicionarNaLista);
window.addEventListener("load", () => {
  carregarTarefas();
  verificarTarefasUrgentes();
});

let isEditing = false;
let editingTaskName = "";

function adicionarNaLista(e) {
  e.preventDefault();
  const taskName = document.querySelector("#name").value;
  const taskDate = document.querySelector("#dateInput").value;
  const taskPriority = document.querySelector("#priority").value;

  if (isEditing) {
    if (localStorage.getItem(taskName) && taskName !== editingTaskName) {
      alert("Uma tarefa com esse nome já existe!");
      return;
    }
    const updatedTask = {
      name: taskName,
      data: taskDate,
      priority: taskPriority,
      status: "Pendente",
    };
    localStorage.removeItem(editingTaskName);
    localStorage.setItem(taskName, JSON.stringify(updatedTask));

    isEditing = false;
    button.querySelector("button[type='submit']").innerText = "Adicionar tarefa";
  } else {
    if (localStorage.getItem(taskName)) {
      alert("Uma tarefa com esse nome já existe!");
      return;
    }

    const task = {
      name: taskName,
      data: taskDate,
      priority: taskPriority,
      status: "Pendente",
    };

    localStorage.setItem(taskName, JSON.stringify(task));
  }

  carregarTarefas();
  verificarTarefasUrgentes(); 
  limparInput();
}

function carregarTarefas() {
  const keys = Object.keys(localStorage);
  const list = document.querySelector(".task-list");
  list.innerHTML = ""; 

  for (const key of keys) {
    const task = JSON.parse(localStorage.getItem(key));
    adicionarNaPagina(task);
  }
}

function adicionarNaPagina(task) {
  const list = document.querySelector(".task-list");
  const newTask = document.createElement("li");
  newTask.innerHTML = `${task.name} - ${task.data} - ${task.priority} - (${task.status}) 
    <button onclick="editarTarefa('${task.name}')">Editar</button>`;
  list.append(newTask);
}

function editarTarefa(taskName) {
  const task = JSON.parse(localStorage.getItem(taskName));
  document.querySelector("#name").value = task.name;
  document.querySelector("#dateInput").value = task.data;
  document.querySelector("#priority").value = task.priority;

  isEditing = true;
  editingTaskName = taskName;
  button.querySelector("button[type='submit']").innerText = "Salvar Tarefa";
}

function limparInput() {
  document.querySelector("#name").value = "";
  document.querySelector("#dateInput").value = "";
  document.querySelector("#priority").value = "baixa";
}

function limparTarefas() {
  localStorage.clear();
  const list = document.querySelector(".task-list");
  list.innerHTML = "";
}

const btnClear = document.querySelector("#btn-clear");
btnClear.addEventListener("click", limparTarefas);

const btnFilterPriority = document
  .querySelector("#btn-filterpriority")
  .addEventListener("click", filterPriority);

const btnFilterStatus = document
  .querySelector("#btn-filterstatus")
  .addEventListener("click", filterStatus);

function filterPriority() {
  const priority = document.querySelector("#filter-priority").value;
  const tasks = Object.keys(localStorage);
  const list = document.querySelector(".task-list");
  list.innerHTML = "";

  for (const taskName of tasks) {
    const task = JSON.parse(localStorage.getItem(taskName));
    if (priority === "todos" || task.priority === priority) {
      adicionarNaPagina(task);
    }
  }
}

function filterStatus() {
  const status = document.querySelector("#filter-status").value;
  const tasks = Object.keys(localStorage);
  const list = document.querySelector(".task-list");
  list.innerHTML = "";

  for (const taskName of tasks) {
    const task = JSON.parse(localStorage.getItem(taskName));
    if (status === "todos" || task.status === status) {
      adicionarNaPagina(task);
    }
  }
}
function verificarTarefasUrgentes() {
  const today = new Date().toISOString().split("T")[0]; 
  const tasks = Object.keys(localStorage);
  let urgentTasks = [];

  for (const taskName of tasks) {
    const task = JSON.parse(localStorage.getItem(taskName));
    if (task.data === today && task.status === "Pendente") {
      urgentTasks.push(task);
    }
  }


  urgentTasks.forEach(task => {
    exibirNotificacao(task.name, task.data);
  });
}

function exibirNotificacao(nome, data) {
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.innerText = `A tarefa "${nome}" está próxima do prazo de conclusão (Data: ${data}).`;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}
