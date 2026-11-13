
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

  conversa.push({
    role: "user",
    content: pergunta
  });

  campoPergunta.value = "";
  campoPergunta.style.height = "auto";
  botaoEnviar.disabled = true;

  const carregando = adicionarMensagem(
    "Estou preparando uma resposta para você... 🌷",
    "ia"
  );

  try {
    const resposta = await fetch(
      "https://study-bloom-api.daniela-pereira6.workers.dev",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: conversa
        })
      }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.error || "Erro na conexão com a IA.");
    }

    carregando.textContent = dados.answer;

    conversa.push({
      role: "assistant",
      content: dados.answer
    });

  } catch (erro) {
    carregando.textContent =
      "Não consegui responder agora. Tente novamente! 🌷";

    carregando.classList.add("erro");
    conversa.pop();

    console.error("Erro no Study Bloom:", erro);

  } finally {
    botaoEnviar.disabled = false;
    campoPergunta.focus();
    scroller.scrollTop = scroller.scrollHeight;
  }
}


  mostrarBoasVindas(false);

  adicionarMensagem(pergunta, "usuario");

  conversa.push({
    role: "user",
    content: pergunta
  });

  campoPergunta.value = "";
  campoPergunta.style.height = "auto";
  botaoEnviar.disabled = true;

  const carregando = adicionarMensagem(
    "Estou preparando uma resposta para você... 🌷",
    "ia"
  );

  try {
    const resposta = await puter.ai.chat(conversa);

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
      throw new Error("A IA retornou uma resposta vazia.");
    }

    carregando.textContent = conteudo;

    conversa.push({
      role: "assistant",
      content: conteudo
    });

  } catch (erro) {
    carregando.textContent =
      "Não consegui responder agora. Verifique sua conexão e tente novamente. 🌷";

    carregando.classList.add("erro");

    // Remove a pergunta que falhou do histórico.
    conversa.pop();

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
