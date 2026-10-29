
const formulario = document.getElementById("form-tarefa");
const campoTarefa = document.getElementById("nova-tarefa");
const listaTarefas = document.getElementById("lista-tarefas");

const contadorTotal = document.getElementById("total-tarefas");
const contadorConcluidas = document.getElementById("tarefas-concluidas");
const contadorPendentes = document.getElementById("tarefas-pendentes");

let tarefas = JSON.parse(localStorage.getItem("studyBloomTarefas")) || [];

function atualizarContadores() {
const total = tarefas.length;
const concluidas = tarefas.filter(tarefa => tarefa.concluida).length;
const pendentes = total - concluidas;

contadorTotal.textContent = total;
contadorConcluidas.textContent = concluidas;
contadorPendentes.textContent = pendentes;
}

function mostrarTarefas() {
listaTarefas.innerHTML = "";

if (tarefas.length === 0) {
const mensagem = document.createElement("li");
mensagem.textContent = "Suas tarefas aparecerão aqui! 🌸";
mensagem.className = "mensagem-vazia";
listaTarefas.appendChild(mensagem);
}

tarefas.forEach((tarefa, indice) => {
const item = document.createElement("li");
item.style.padding = "12px";
item.style.marginBottom = "10px";
item.style.borderRadius = "12px";
item.style.background = "#fff5fa";

const texto = document.createElement("span");
texto.textContent = tarefa.nome;

if (tarefa.concluida) {
texto.style.textDecoration = "line-through";
texto.style.opacity = "0.6";
}

const botaoConcluir = document.createElement("button");
botaoConcluir.textContent = tarefa.concluida
? "↩ Desfazer"
: "✓ Concluir";

botaoConcluir.style.marginLeft = "10px";
botaoConcluir.style.marginTop = "8px";

botaoConcluir.addEventListener("click", () => {
tarefas[indice].concluida = !tarefas[indice].concluida;
mostrarTarefas();
atualizarContadores();
});

item.appendChild(texto);
item.appendChild(botaoConcluir);
listaTarefas.appendChild(item);
});

atualizarContadores();
}

formulario.addEventListener("submit", (evento) => {
evento.preventDefault();

const nome = campoTarefa.value.trim();

if (nome === "") {
campoTarefa.focus();
return;
}

tarefas.push({
nome: nome,
concluida: false
});

campoTarefa.value = "";

mostrarTarefas();
campoTarefa.focus();
});

mostrarTarefas();
