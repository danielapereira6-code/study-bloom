
const formulario = document.getElementById("form-chat");
const campoPergunta = document.getElementById("pergunta");
const mensagens = document.getElementById("mensagens");

function adicionarMensagem(texto, tipo) {
  const mensagem = document.createElement("div");
  mensagem.className = `mensagem ${tipo}`;
  mensagem.textContent = texto;
  mensagens.appendChild(mensagem);
  mensagens.scrollTop = mensagens.scrollHeight;
  return mensagem;
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const pergunta = campoPergunta.value.trim();
  if (!pergunta) return;

  adicionarMensagem(pergunta, "usuario");
  campoPergunta.value = "";

  const carregando = adicionarMensagem(
    "Pensando na sua pergunta... 🌷",
    "ia"
  );

  const botao = formulario.querySelector("button");
  botao.disabled = true;

  try {
    const resposta = await puter.ai.chat(pergunta);
    carregando.textContent =
      typeof resposta === "string"
        ? resposta
        : resposta?.message?.content ??
          "Recebi uma resposta, mas não consegui exibi-la. Tente novamente.";
  } catch (erro) {
    carregando.textContent =
      "Não consegui responder agora. Confira sua conexão e se o Puter está disponível. Se for solicitado, entre na sua conta Puter e tente novamente.";
    console.error("Erro no chat:", erro);
  } finally {
    botao.disabled = false;
    campoPergunta.focus();
  }
});
