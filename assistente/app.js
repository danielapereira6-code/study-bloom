
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

  mostrarBoasVindas(false);
  adicionarMensagem(pergunta, "usuario");
  conversa.push({ role: "user", content: pergunta });

  campoPergunta.value = "";
  campoPergunta.style.height = "auto";
  botaoEnviar.disabled = true;

  const carregando = adicionarMensagem(
    "A preparar uma resposta para ti... 🌷",
    "ia"
  );

  try {
    const resposta = await puter.ai.chat(pergunta);

    let conteudo = "";

    if (typeof resposta === "string") {
      conteudo = resposta;
    } else if (typeof resposta?.message?.content === "string") {
      conteudo = resposta.message.content;
    } else if (Array.isArray(resposta?.message?.content)) {
      conteudo = resposta.message.content
        .map((parte) => parte.text || "")
        .filter(Boolean)
        .join("\n");
    } else if (typeof resposta?.text === "string") {
      conteudo = resposta.text;
    }

    if (!conteudo) {
      conteudo = "Não consegui apresentar a resposta. Podes tentar novamente? 🌷";
    }

    carregando.textContent = conteudo;
    conversa.push({ role: "assistant", content: conteudo });
  } catch (erro) {
    carregando.textContent =
      "Não consegui responder agora. Verifica a tua ligação à internet e, se necessário, inicia sessão no Puter. Depois, tenta novamente. 🌷";

    carregando.classList.add("erro");
    console.error("Erro no assistente:", erro);
  } finally {
    botaoEnviar.disabled = false;
    campoPergunta.focus();
    scroller.scrollTop = scroller.scrollHeight;
  }
}

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
