
const formulario = document.getElementById("form-chat");
const campoPergunta = document.getElementById("pergunta");
const mensagens = document.getElementById("mensagens");
const boasVindas = document.getElementById("boas-vindas");
const botaoEnviar = document.getElementById("enviar");
const botaoNovoChat = document.getElementById("novo-chat");
const scroller = document.getElementById("scroller");

let conversa = [];

function adicionarMensagem(texto, tipo) {
  const mensagem = document.createElement("div");
  mensagem.className = `mensagem ${tipo}`;
  mensagem.textContent = texto;

  mensagens.appendChild(mensagem);
  scroller.scrollTop = scroller.scrollHeight;

  return mensagem;
}

function mostrarBoasVindas(mostrar) {
  boasVindas.hidden = !mostrar;
}


async function enviarPergunta(texto) {
  const pergunta = texto.trim();

  if (!pergunta || botaoEnviar.disabled) return;

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  await enviarPergunta(campoPergunta.value);
});

campoPergunta.addEventListener("input", () => {
  campoPergunta.style.height = "auto";

  campoPergunta.style.height =
    Math.min(campoPergunta.scrollHeight, 120) + "px";
});

campoPergunta.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter" && !evento.shiftKey) {
    evento.preventDefault();
    formulario.requestSubmit();
  }
});

document.querySelectorAll(".sugestao").forEach((botao) => {
  botao.addEventListener("click", () => {
    enviarPergunta(botao.dataset.prompt);
  });
});

botaoNovoChat.addEventListener("click", () => {
  mensagens.replaceChildren();

  conversa = [];

  mostrarBoasVindas(true);

  campoPergunta.value = "";
  campoPergunta.style.height = "auto";

  scroller.scrollTop = 0;
  campoPergunta.focus();
});
