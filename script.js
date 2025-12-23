const questoes = [
  {
    caso: "Paciente idoso, pós-AVC, apresenta tosse frequente durante alimentação, voz molhada e engasgos.",
    alternativas: ["Nutricionista", "Fonoaudiólogo", "Fisioterapeuta", "Psicólogo"],
    correta: 1,
    justificativa: "O fonoaudiólogo avalia e maneja alterações da deglutição (disfagia)."
  },
  {
    caso: "Paciente acamado em CTI, com secreção pulmonar espessa e dificuldade para expandir o tórax.",
    alternativas: ["Enfermeiro", "Fisioterapeuta", "Fonoaudiólogo", "Assistente social"],
    correta: 1,
    justificativa: "O fisioterapeuta atua na higiene brônquica e mecânica respiratória."
  },
  {
    caso: "Paciente com perda ponderal importante, baixa aceitação alimentar e risco nutricional.",
    alternativas: ["Nutricionista", "Psicólogo", "Enfermeiro", "Fonoaudiólogo"],
    correta: 0,
    justificativa: "O nutricionista avalia ingestão, estado nutricional e prescrição dietética."
  },
  {
    caso: "Paciente com diagnóstico recente de câncer, apresentando sofrimento emocional intenso e ansiedade.",
    alternativas: ["Assistente social", "Psicólogo", "Fonoaudiólogo", "Nutricionista"],
    correta: 1,
    justificativa: "O psicólogo atua no suporte emocional e saúde mental."
  },
  {
    caso: "Paciente com dificuldades para realizar atividades básicas de vida diária após trauma neurológico.",
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
    caso: "Paciente traqueostomizado, com dificuldade para comunicação oral.",
    alternativas: ["Fonoaudiólogo", "Fisioterapeuta", "Psicólogo", "Enfermeiro"],
    correta: 0,
    justificativa: "O fonoaudiólogo atua na comunicação e uso de válvulas de fala."
  },
  {
    caso: "Paciente com risco elevado de lesão por pressão devido à imobilidade prolongada.",
    alternativas: ["Nutricionista", "Fonoaudiólogo", "Fisioterapeuta", "Psicólogo"],
    correta: 2,
    justificativa: "O fisioterapeuta atua no posicionamento e mobilização."
  },
  {
    caso: "Paciente com recusa alimentar associada a comportamento depressivo.",
    alternativas: ["Nutricionista", "Psicólogo", "Fonoaudiólogo", "Assistente social"],
    correta: 1,
    justificativa: "O psicólogo avalia fatores emocionais associados à recusa alimentar."
  },
  {
    caso: "Paciente com alteração de voz persistente após intubação orotraqueal prolongada.",
    alternativas: ["Fisioterapeuta", "Enfermeiro", "Fonoaudiólogo", "Psicólogo"],
    correta: 2,
    justificativa: "O fonoaudiólogo avalia e reabilita distúrbios vocais."
  }
];


let indice = 0;
let pontuacao = 0;
let jogador = "";

function iniciarQuiz() {
  jogador = document.getElementById("nome").value;
  if (!jogador) return alert("Digite seu nome");

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

  const div = document.getElementById("alternativas");
  div.innerHTML = "";

  questoes[indice].alternativas.forEach((alt, i) => {
    const btn = document.createElement("button");
    btn.innerText = alt;
    btn.onclick = () => verificarResposta(i);
    div.appendChild(btn);
  });
}

function verificarResposta(resposta) {
  const fb = document.getElementById("feedback");
  document.getElementById("btnProximo").style.display = "block";

  if (resposta === questoes[indice].correta) {
    pontuacao++;
    fb.innerText = "Correto. " + questoes[indice].justificativa;
    fb.style.color = "green";
  } else {
    fb.innerText = "Incorreto. " + questoes[indice].justificativa;
    fb.style.color = "red";
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


carregarQuestao();
