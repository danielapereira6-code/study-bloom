
const formulario = document.getElementById("form-tarefa");
const campoTarefa = document.getElementById("nova-tarefa");
const listaTarefas = document.getElementById("lista-tarefas");

const contadorTotal = document.getElementById("total-tarefas");
const contadorConcluidas = document.getElementById("tarefas-concluidas");
const contadorPendentes = document.getElementById("tarefas-pendentes");
const barraProgresso = document.getElementById("barra-progresso");
const textoProgresso = document.getElementById("texto-progresso");
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
  const porcentagem = total === 0
    ? 0
    : Math.round((concluidas / total) * 100);

barraProgresso.style.width = porcentagem + "%";
textoProgresso.textContent = porcentagem + "% concluído";
  atualizarJardim();
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
let modoDescanso = false;
const DURACAO_DESCANSO = 5 * 60;
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
if (!modoDescanso) {
modoDescanso = true;
segundosRestantes = DURACAO_DESCANSO;

document.getElementById("modo-pomodoro").textContent =
"Hora de descansar 🌸";

mensagemPomodoro.textContent =
"Você se dedicou muito! Beba água e relaxe por 5 minutinhos. 💗";

} else {
modoDescanso = false;
segundosRestantes = 25 * 60;

document.getElementById("modo-pomodoro").textContent =
"Hora de estudar 🌱";

mensagemPomodoro.textContent =
"Pausa concluída! Você consegue continuar. ✨";
}

atualizarCronometro();
}
  
}, 1000);
});

botaoReiniciar.addEventListener("click", () => {
clearInterval(intervaloPomodoro);
intervaloPomodoro = null;
segundosRestantes = 25 * 60;
modoDescanso = false;

atualizarCronometro();
botaoIniciar.textContent = "▶ Iniciar";
mensagemPomodoro.textContent = "Um passo de cada vez! ♡";
});

atualizarCronometro();

 
// ===== CALENDÁRIO DE ESTUDOS 🌷 =====

const tituloMesAno = document.getElementById("mes-ano");
const diasCalendario = document.getElementById("dias-calendario");
const botaoMesAnterior = document.getElementById("mes-anterior");
const botaoProximoMes = document.getElementById("proximo-mes");
const dataSelecionadaTexto = document.getElementById("data-selecionada");
const campoEstudo = document.getElementById("tarefa-calendario");
const botaoAdicionarEstudo = document.getElementById("adicionar-calendario");
const listaEstudos = document.getElementById("lista-calendario");

let estudosCalendario = JSON.parse(
    localStorage.getItem("studyBloomCalendario")
) || {};

let dataSelecionada = new Date();
dataSelecionada.setHours(0, 0, 0, 0);

let mesAtual = dataSelecionada.getMonth();
let anoAtual = dataSelecionada.getFullYear();

function criarChaveData(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function salvarEstudosCalendario() {
    localStorage.setItem(
        "studyBloomCalendario",
        JSON.stringify(estudosCalendario)
    );
}

function mostrarCalendario() {
    diasCalendario.innerHTML = "";

    const nomesMeses = [
        "janeiro", "fevereiro", "março", "abril",
        "maio", "junho", "julho", "agosto",
        "setembro", "outubro", "novembro", "dezembro"
    ];

    tituloMesAno.textContent =
        `${nomesMeses[mesAtual]} de ${anoAtual}`;

    const primeiroDia = new Date(anoAtual, mesAtual, 1);
    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0);
    const hoje = criarChaveData(new Date());

    // Espaços antes do primeiro dia do mês
    for (let i = 0; i < primeiroDia.getDay(); i++) {
        const espaco = document.createElement("span");
        diasCalendario.appendChild(espaco);
    }

    // Criar os botões dos dias
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
        const data = new Date(anoAtual, mesAtual, dia);
        const chave = criarChaveData(data);
        const botao = document.createElement("button");

        botao.type = "button";
        botao.textContent = dia;
        botao.setAttribute("aria-label", `Dia ${dia}`);

        if (chave === hoje) {
            botao.classList.add("hoje");
        }

        if (chave === criarChaveData(dataSelecionada)) {
            botao.classList.add("selecionado");
        }

        if (estudosCalendario[chave]?.length > 0) {
            botao.title = "Este dia tem estudos planejados 🌸";
            botao.classList.add("tem-estudo");
        }

        botao.addEventListener("click", () => {
            dataSelecionada = data;
            mostrarCalendario();
            mostrarEstudosDoDia();
        });

        diasCalendario.appendChild(botao);
    }
}

function mostrarEstudosDoDia() {
    const chave = criarChaveData(dataSelecionada);

    dataSelecionadaTexto.textContent =
        dataSelecionada.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    listaEstudos.innerHTML = "";

    const estudos = estudosCalendario[chave] || [];

    if (estudos.length === 0) {
        const itemVazio = document.createElement("li");
        itemVazio.textContent = "Nenhum estudo planejado para este dia 🌱";
        listaEstudos.appendChild(itemVazio);
        return;
    }

    estudos.forEach((estudo, indice) => {
        const item = document.createElement("li");
        const texto = document.createElement("span");
        const botaoExcluir = document.createElement("button");

        texto.textContent = estudo;
        botaoExcluir.textContent = " 🗑️";
        botaoExcluir.type = "button";
        botaoExcluir.setAttribute("aria-label", "Excluir estudo");

        botaoExcluir.addEventListener("click", () => {
            estudosCalendario[chave].splice(indice, 1);

            if (estudosCalendario[chave].length === 0) {
                delete estudosCalendario[chave];
            }

            salvarEstudosCalendario();
            mostrarCalendario();
            mostrarEstudosDoDia();
        });

        item.appendChild(texto);
        item.appendChild(botaoExcluir);
        listaEstudos.appendChild(item);
    });
}

// Voltar um mês
botaoMesAnterior.addEventListener("click", () => {
    mesAtual--;

    if (mesAtual < 0) {
        mesAtual = 11;
        anoAtual--;
    }

    dataSelecionada = new Date(anoAtual, mesAtual, 1);
    mostrarCalendario();
    mostrarEstudosDoDia();
});

// Avançar um mês
botaoProximoMes.addEventListener("click", () => {
    mesAtual++;

    if (mesAtual > 11) {
        mesAtual = 0;
        anoAtual++;
    }

    dataSelecionada = new Date(anoAtual, mesAtual, 1);
    mostrarCalendario();
    mostrarEstudosDoDia();
});

// Adicionar um estudo à data selecionada
botaoAdicionarEstudo.addEventListener("click", () => {
    const nomeEstudo = campoEstudo.value.trim();

    if (nomeEstudo === "") {
        campoEstudo.focus();
        return;
    }

    const chave = criarChaveData(dataSelecionada);

    if (!estudosCalendario[chave]) {
        estudosCalendario[chave] = [];
    }

    estudosCalendario[chave].push(nomeEstudo);

    salvarEstudosCalendario();
    campoEstudo.value = "";
    mostrarCalendario();
    mostrarEstudosDoDia();
    campoEstudo.focus();
});

// Permitir adicionar com a tecla Enter
campoEstudo.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        evento.preventDefault();
        botaoAdicionarEstudo.click();
    }
});

// Mostrar o calendário ao abrir a página
mostrarCalendario();
mostrarEstudosDoDia();

/* ===== NAVEGAÇÃO ENTRE ABAS 🌷 ===== */

const botoesMenu = document.querySelectorAll(".item-menu");
const abasConteudo = document.querySelectorAll(".aba-conteudo");

botoesMenu.forEach((botao) => {
    botao.addEventListener("click", () => {
        const abaDestino = botao.dataset.aba;

        abasConteudo.forEach((aba) => {
            aba.classList.toggle(
                "ativa",
                aba.id === abaDestino
            );
        });

        botoesMenu.forEach((item) => {
            const selecionado = item === botao;

            item.classList.toggle("ativo", selecionado);
            item.setAttribute(
                "aria-current",
                selecionado ? "page" : "false"
            );
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});

/* 🌸 Jardim de Conquistas */

function atualizarJardim() {
    const imagem = document.getElementById("imagem-jardim");
    const mensagem = document.getElementById("mensagem-jardim");

    if (!imagem || !mensagem) return;

    const total = tarefas.length;
    const concluidas = tarefas.filter(tarefa => tarefa.concluida).length;

    const porcentagem = total === 0
        ? 0
        : Math.round((concluidas / total) * 100);

    let estagio;
    let descricao;

    if (porcentagem <= 25) {
        estagio = 0;
        descricao = "Seu jardim está começando a florescer.";
    } else if (porcentagem <= 50) {
        estagio = 1;
        descricao = "Novas flores estão surgindo no seu jardim.";
    } else if (porcentagem <= 75) {
        estagio = 2;
        descricao = "Seu jardim está cada vez mais florido.";
    } else {
        estagio = 3;
        descricao = porcentagem === 100
            ? "Seu jardim floresceu por completo!"
            : "Seu jardim está quase completamente florido.";
    }

    imagem.src = `jardim-${estagio}.png.jpg`;
    imagem.alt = descricao;
    mensagem.textContent = descricao;
}

