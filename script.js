/* ===============================
   QUIZ CLÍNICO MULTIPROFISSIONAL
   Script completo e funcional
   =============================== */

/* -------- BANCO DE QUESTÕES -------- */

const questoes = [
  {
    caso: "Paciente idoso, pós-AVC, apresenta tosse frequente durante alimentação, voz molhada e engasgos.",
    alternativas: ["Nutricionista", "Fonoaudiólogo", "Fisioterapeuta", "Psicólogo"],
    correta: 1,
    justificativa: "O fonoaudiólogo é o profissional responsável pela avaliação e manejo da disfagia."
  },
  {
    caso: "Paciente acamado em CTI, com secreção pulmonar espessa e dificuldade para expandir o tórax.",
    alternativas: ["Enfermeiro", "Fisioterapeuta", "Fonoaudiólogo", "Assistente social"],
    correta: 1,
    justificativa: "O fisioterapeuta atua na higiene brônquica e na mecânica respiratória."
  },
  {
    caso: "Paciente com perda ponderal importante, baixa aceitação alimentar e risco nutricional.",
    alternativas: ["Nutricionista", "Psicólogo", "Enfermeiro", "Fonoaudiólogo"],
    correta: 0,
    justificativa: "O nutricionista avalia ingestão, estado nutricional e prescrição dietética."
  },
  {
    caso: "Paciente com sofrimento emocional intenso após diagnóstico de doença grave.",
    alternativas: ["Assistente social", "Psicólogo", "Fonoaudiólogo", "Nutricionista"],
    correta: 1,
    justificativa: "O psicólogo atua no cuidado da saúde mental e suporte emocional."
  },
  {
    caso: "Paciente com dificuldade para realizar atividades básicas de vida diária após trauma neurológico.",
    alternativas: ["Fisioterapeuta", "Terapeuta ocupacional", "Psicólogo", "Enfermeiro"],
    correta: 1,
    justificativa: "O terapeuta ocupacional atua na funcionalidade e independência."
  },
  {
    caso: "Paciente hospitalizado, sem rede de apoio familiar e com dificuldades socioeconômicas.",
    alternativas: ["Psicólogo", "Enfermeiro", "Assistente social", "Nutricionista"],
    correta: 2,
    justificativa: "O assistente social intervém nas questões sociais e de suporte."
  },
  {
    caso: "Paciente traqueostomizado com dificuldade de comunicação oral.",
    alternativas: ["Fonoaudiólogo", "Fisioterapeuta", "Psicólogo", "Enfermeiro"],
    correta: 0,
    justificativa: "O fonoaudiólogo atua na comunicação e no uso de válvulas de fala."
  },
  {
    caso: "Paciente com risco elevado de lesão por pressão devido à imobilidade prolongada.",
    alternativas: ["Nutricionista", "Fonoaudiólogo", "Fisioterapeuta", "Psicólogo"],
    correta: 2,
    justificativa: "O fisioterapeuta atua no posicionamento e mobilização."
  },
  {
    caso: "Paciente com recusa alimentar associada a quadro depressivo.",
    alternativas: ["Nutricionista", "Psicólogo", "Fonoaudiólogo", "Assistente social"],
    correta: 1,
    justificativa: "O psicólogo avalia fatores emocionais associados à recusa alimentar."
  },
  {
    caso: "Paciente com alteração vocal persistente após intubação orotraqueal prolongada.",
    alternativas: ["Fisioterapeuta", "Enfermeiro", "Fonoaudiólogo", "Psicólogo"],
    correta: 2,
    justificativa: "O fonoaudiólogo avalia e reabilita distúrbios vocais."
  }
];

/* -------- VARIÁVEIS DE CONTROLE -------- */

let indice = 0;
let pontuacao = 0;
let jogador = "";

/* -------- FUNÇÕES PRINCIPAIS -------- */

/* ESTA FUNÇÃO PRECISA SER GLOBAL */
function iniciarQuiz() {
  jogador = document.getElementById("nome").value;

  if (!jogador) {
    alert("Por favor, digite seu nome.");
    return;
  }

  document.getElementById("inicio").style.display = "none";
  document.getElementById("quiz").style.display = "block";

  indice = 0;
  pontuacao = 0;

  carregarQuestao();
}

function carregarQuestao() {
  document.getElementById("progresso").innerText =
    `Questão ${indice + 1} de ${questoes.length}`;

  document.getElementById("caso").innerText = questoes[indice].caso;
  document.getElementById("feedback").innerText = "";
  document.getElementById("btnProximo").style.display = "none";

  const alternativasDiv = document.getElementById("alternativas");
  alternativasDiv.innerHTML = "";

  questoes[indice].alternativas.forEach((texto, i) => {
    const botao = document.createElement("button");
    botao.innerText = texto;
    botao.onclick = () => verificarResposta(i);
    alternativasDiv.appendChild(botao);
  });
}

function verificarResposta(resposta) {
  const feedback = document.getElementById("feedback");
  document.getElementById("btnProximo").style.display = "block";

  if (resposta === questoes[indice].correta) {
    pontuacao++;
    feedback.innerText = "Resposta correta. " + questoes[indice].justificativa;
    feedback.style.color = "green";
  } else {
    feedback.innerText = "Resposta incorreta. " + questoes[indice].justificativa;
    feedback.style.color = "red";
  }
}

function proximaQuestao() {
  indice++;
  if (indice < questoes.length) {
    carregarQuestao();
  } else {
    salvarRanking();
    mostrarRanking();
  }
}

/* -------- RANKING -------- */

function salvarRanking() {
  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.push({ nome: jogador, pontos: pontuacao });
  ranking.sort((a, b) => b.pontos - a.pontos);
  localStorage.setItem("ranking", JSON.stringify(ranking));
}

function mostrarRanking() {
  document.getElementById("quiz").style.display = "none";
  document.getElementById("final").style.display = "block";

  const lista = document.getElementById("ranking");
  lista.innerHTML = "";

  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.forEach(item => {
    const li = document.createElement("li");
    li.innerText = `${item.nome} – ${item.pontos} pontos`;
    lista.appendChild(li);
  });
}
