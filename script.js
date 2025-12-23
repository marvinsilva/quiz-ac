/* ===============================
   QUIZ CLÍNICO MULTIPROFISSIONAL
   =============================== */

const questoes = [
  {
    caso: "Paciente idoso, pós-AVC, apresenta tosse frequente durante alimentação, voz molhada e engasgos.",
    alternativas: ["Nutricionista", "Fonoaudiólogo", "Fisioterapeuta", "Psicólogo"],
    correta: 1,
    justificativa: "O fonoaudiólogo é responsável pela avaliação e manejo da disfagia."
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
    justificativa: "O nutricionista avalia ingestão e prescrição dietética."
  },
  {
    caso: "Paciente em CTI apresenta ansiedade intensa e choro recorrente.",
    alternativas: ["Fonoaudiólogo", "Enfermeiro", "Psicólogo", "Assistente social"],
    correta: 2,
    justificativa: "O psicólogo atua no manejo do sofrimento psíquico."
  },
  {
    caso: "Paciente hospitalizado sem rede de apoio familiar.",
    alternativas: ["Psicólogo", "Enfermeiro", "Assistente social", "Nutricionista"],
    correta: 2,
    justificativa: "O assistente social atua nas questões sociais."
  },
  {
    caso: "Paciente traqueostomizado com dificuldade de comunicação.",
    alternativas: ["Fonoaudiólogo", "Fisioterapeuta", "Psicólogo", "Enfermeiro"],
    correta: 0,
    justificativa: "O fonoaudiólogo atua na comunicação e fala."
  },
  {
    caso: "Paciente com risco de lesão por pressão por imobilidade.",
    alternativas: ["Nutricionista", "Fonoaudiólogo", "Fisioterapeuta", "Psicólogo"],
    correta: 2,
    justificativa: "O fisioterapeuta atua no posicionamento."
  },
  {
    caso: "Paciente com recusa alimentar associada à depressão.",
    alternativas: ["Nutricionista", "Psicólogo", "Fonoaudiólogo", "Assistente social"],
    correta: 1,
    justificativa: "O psicólogo avalia fatores emocionais."
  },
  {
    caso: "Paciente com alteração vocal após intubação prolongada.",
    alternativas: ["Fisioterapeuta", "Enfermeiro", "Fonoaudiólogo", "Psicólogo"],
    correta: 2,
    justificativa: "O fonoaudiólogo reabilita distúrbios vocais."
  },
  {
    caso: "Paciente com dor e dificuldades no manejo diário dos cuidados.",
    alternativas: ["Fisioterapeuta", "Fonoaudiólogo", "Enfermeiro", "Psicólogo"],
    correta: 2,
    justificativa: "O enfermeiro coordena o cuidado integral."
  }
];

let indice = 0;
let pontuacao = 0;
let jogador = "";

/* -------- UTILIDADES -------- */

function embaralharQuestoes(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function obterMedalha(posicao) {
  if (posicao === 0) return "🥇";
  if (posicao === 1) return "🥈";
  if (posicao === 2) return "🥉";
  return `${posicao + 1}º`;
}

/* -------- QUIZ -------- */

function iniciarQuiz() {
  jogador = document.getElementById("nome").value;
  if (!jogador) {
    alert("Digite seu nome.");
    return;
  }

  embaralharQuestoes(questoes);
  indice = 0;
  pontuacao = 0;

  document.getElementById("inicio").style.display = "none";
  document.getElementById("quiz").style.display = "block";

  carregarQuestao();
}

function carregarQuestao() {
  document.getElementById("progresso").innerText =
    `Questão ${indice + 1} de ${questoes.length}`;
  document.getElementById("caso").innerText = questoes[indice].caso;
  document.getElementById("feedback").innerText = "";
  document.getElementById("btnProximo").style.display = "none";

  const alt = document.getElementById("alternativas");
  alt.innerHTML = "";

  questoes[indice].alternativas.forEach((texto, i) => {
    const btn = document.createElement("button");
    btn.innerText = texto;
    btn.onclick = () => verificarResposta(i);
    alt.appendChild(btn);
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
    mostrarRankingFinal();
  }
}

/* -------- RANKING -------- */

function salvarRanking() {
  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.push({ nome: jogador, pontos: pontuacao });
  ranking.sort((a, b) => b.pontos - a.pontos);
  localStorage.setItem("ranking", JSON.stringify(ranking.slice(0, 15)));
}

function mostrarRankingFinal() {
  document.getElementById("quiz").style.display = "none";
  document.getElementById("final").style.display = "block";

  const lista = document.getElementById("rankingFinal");
  lista.innerHTML = "";

  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerText = `${obterMedalha(i)} ${item.nome} – ${item.pontos} pontos`;
    lista.appendChild(li);
  });

  if (pontuacao >= 8) dispararConfete();
}

function mostrarRankingInicio() {
  document.getElementById("inicio").style.display = "none";
  document.getElementById("rankingTela").style.display = "block";

  const lista = document.getElementById("rankingInicio");
  lista.innerHTML = "";

  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerText = `${obterMedalha(i)} ${item.nome} – ${item.pontos} pontos`;
    lista.appendChild(li);
  });
}

function voltarParaInicio() {
  document.getElementById("rankingTela").style.display = "none";
  document.getElementById("inicio").style.display = "block";
}

function reiniciarQuiz() {
  document.getElementById("final").style.display = "none";
  document.getElementById("inicio").style.display = "block";
  document.getElementById("nome").value = "";
}

/* -------- CONFETE -------- */

function dispararConfete() {
  const fim = Date.now() + 2000;
  (function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < fim) requestAnimationFrame(frame);
  })();
}
