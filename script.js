
const formulario = document.getElementById("form-tarefa");
const campoTarefa = document.getElementById("nova-tarefa");
const listaTarefas = document.getElementById("lista-tarefas");

const contadorTotal = document.getElementById("total-tarefas");
const contadorConcluidas = document.getElementById("tarefas-concluidas");
const contadorPendentes = document.getElementById("tarefas-pendentes");

let tarefas = JSON.parse(localStorage.getItem("studyBloomTarefas")) || [];

function salvarTarefas() {
localStorage.setItem("studyBloomTarefas", JSON.stringify(tarefas));
}

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
salvarTarefas();
mostrarTarefas();
atualizarContadores();
});

item.appendChild(texto);
item.appendChild(botaoConcluir);

const botaoExcluir = document.createElement("button");
botaoExcluir.textContent = "🗑️ Excluir";
botaoExcluir.style.marginLeft = "10px";
botaoExcluir.style.marginTop = "8px";

botaoExcluir.addEventListener("click", () => {
tarefas.splice(indice, 1);
salvarTarefas();
mostrarTarefas();
});

item.appendChild(botaoExcluir);
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

  salvarTarefas();
campoTarefa.value = "";

mostrarTarefas();
campoTarefa.focus();
});

mostrarTarefas();
// ===== CRONÔMETRO POMODORO =====

const cronometro = document.getElementById("cronometro");
const botaoIniciar = document.getElementById("iniciar-pomodoro");
const botaoReiniciar = document.getElementById("reiniciar-pomodoro");
const mensagemPomodoro = document.getElementById("mensagem-pomodoro");

let segundosRestantes = 25 * 60;
let intervaloPomodoro = null;

function atualizarCronometro() {
const minutos = Math.floor(segundosRestantes / 60);
const segundos = segundosRestantes % 60;

cronometro.textContent =
String(minutos).padStart(2, "0") + ":" +
String(segundos).padStart(2, "0");
}

botaoIniciar.addEventListener("click", () => {
if (intervaloPomodoro !== null) {
clearInterval(intervaloPomodoro);
intervaloPomodoro = null;
botaoIniciar.textContent = "▶ Iniciar";
mensagemPomodoro.textContent = "Pausa feita! Descanse um pouquinho. ♡";
return;
}

if (segundosRestantes === 0) {
return;
}

botaoIniciar.textContent = "⏸ Pausar";
mensagemPomodoro.textContent = "Concentre-se nos seus estudos! ♡";

intervaloPomodoro = setInterval(() => {
segundosRestantes--;
atualizarCronometro();

if (segundosRestantes <= 0) {
clearInterval(intervaloPomodoro);
intervaloPomodoro = null;
botaoIniciar.textContent = "▶ Iniciar";
mensagemPomodoro.textContent =
"Parabéns! Hora de fazer uma pausa. 🌷";
}
}, 1000);
});

botaoReiniciar.addEventListener("click", () => {
clearInterval(intervaloPomodoro);
intervaloPomodoro = null;
segundosRestantes = 25 * 60;

atualizarCronometro();
botaoIniciar.textContent = "▶ Iniciar";
mensagemPomodoro.textContent = "Um passo de cada vez! ♡";
});

atualizarCronometro();
