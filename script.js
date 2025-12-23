let indice = 0;
let pontuacao = 0;
let jogador = "";

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

function iniciarQuiz() {
  jogador = document.getElementById("nome").value.trim();
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

/* ===== RANKING ===== */

function salvarRanking() {
  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.push({ nome: jogador, pontos: pontuacao });
  ranking.sort((a, b) => b.pontos - a.pontos);
  localStorage.setItem("ranking", JSON.stringify(ranking.slice(0, 15)));
}

}
function renderizarRanking(idLista) {
  const lista = document.getElementById(idLista);
  lista.innerHTML = "";

  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];

  ranking.slice(0, 15).forEach((item, i) => {
    const li = document.createElement("li");

    let medalha = "";
    if (i === 0) medalha = "🥇 ";
    else if (i === 1) medalha = "🥈 ";
    else if (i === 2) medalha = "🥉 ";
    else medalha = `${i + 1}º `;

    li.innerText = `${medalha}${item.nome} – ${item.pontos} pontos`;
    lista.appendChild(li);
  });
}

function mostrarRankingFinal() {
  document.getElementById("quiz").style.display = "none";
  document.getElementById("final").style.display = "block";
  renderizarRanking("rankingFinal");

  if (pontuacao >= 8) dispararConfete();
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

/* ===== CONFETE ===== */

function dispararConfete() {
  const fim = Date.now() + 2000;
  (function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < fim) requestAnimationFrame(frame);
  })();
}
function mostrarRankingInicio() {
  document.getElementById("inicio").style.display = "none";
  document.getElementById("quiz").style.display = "none";
  document.getElementById("final").style.display = "none";

  document.getElementById("rankingTela").style.display = "block";

  renderizarRanking("rankingInicio");
}
