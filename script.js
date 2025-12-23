const questoes = [
  {
    caso: "Paciente idoso, pós-AVC, apresenta tosse frequente durante alimentação, voz molhada e engasgos.",
    alternativas: [
      "Nutricionista",
      "Fonoaudiólogo",
      "Fisioterapeuta",
      "Psicólogo"
    ],
    correta: 1,
    justificativa: "O fonoaudiólogo é responsável pela avaliação e manejo da disfagia."
  },
  {
    caso: "Paciente acamado em CTI, com mobilidade reduzida e risco de broncoaspiração.",
    alternativas: [
      "Assistente social",
      "Psicólogo",
      "Fisioterapeuta",
      "Enfermeiro"
    ],
    correta: 2,
    justificativa: "O fisioterapeuta atua no posicionamento e função respiratória."
  }
];

let indice = 0;

function carregarQuestao() {
  document.getElementById("progresso").innerText =
    `Questão ${indice + 1} de ${questoes.length}`;

  document.getElementById("caso").innerText = questoes[indice].caso;
  document.getElementById("feedback").innerText = "";
  document.getElementById("btnProximo").style.display = "none";

  const alternativasDiv = document.getElementById("alternativas");
  alternativasDiv.innerHTML = "";

  questoes[indice].alternativas.forEach((alt, i) => {
    const btn = document.createElement("button");
    btn.innerText = alt;
    btn.onclick = () => verificarResposta(i);
    alternativasDiv.appendChild(btn);
  });
}

function verificarResposta(resposta) {
  const feedback = document.getElementById("feedback");
  document.getElementById("btnProximo").style.display = "block";

  if (resposta === questoes[indice].correta) {
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
    document.getElementById("quiz-box").innerHTML =
      "<h2>Quiz finalizado</h2><p>Obrigado por participar.</p>";
  }
}

carregarQuestao();
