/* ======================================================
   1. DADOS DO QUIZ (Você precisa definir as perguntas)
   ====================================================== */
const questoes = [
    {
        caso: "Paciente de 65 anos, hipertenso, apresenta edema em membros inferiores e dispneia aos esforços.",
        alternativas: ["Insuficiência Cardíaca", "Trombose Venosa", "Asma Brônquica", "Anemia Ferropriva"],
        correta: 0, // Índice da resposta certa (0 é a primeira)
        justificativa: "Os sintomas de edema e dispneia em paciente hipertenso sugerem IC."
    },
    {
        caso: "Paciente relata sede excessiva, aumento da frequência urinária e perda de peso inexplicada.",
        alternativas: ["Hipotireoidismo", "Diabetes Mellitus", "Infecção Urinária", "Gastrite"],
        correta: 1,
        justificativa: "Polidipsia, poliúria e perda de peso são a tríade clássica do Diabetes."
    },
    {
        caso: "Criança com febre alta, rigidez na nuca e manchas vermelhas na pele.",
        alternativas: ["Gripe", "Dengue", "Meningite", "Sarampo"],
        correta: 2,
        justificativa: "Rigidez de nuca e febre alta são sinais de alerta para Meningite."
    }
];

/* ======================================================
   2. VARIÁVEIS GLOBAIS
   ====================================================== */
let indice = 0;
let pontuacao = 0;
let jogador = "";

/* ======================================================
   3. FUNÇÕES PRINCIPAIS DO JOGO
   ====================================================== */

function iniciarQuiz() {
    jogador = document.getElementById("nome").value.trim();
    
    if (!jogador) {
        alert("Por favor, digite seu nome para começar!");
        return;
    }

    // Reinicia variáveis
    indice = 0;
    pontuacao = 0;

    // Embaralha as perguntas
    embaralharQuestoes(questoes);

    // Troca de tela
    document.getElementById("inicio").style.display = "none";
    document.getElementById("rankingTela").style.display = "none";
    document.getElementById("final").style.display = "none";
    document.getElementById("quiz").style.display = "block";

    carregarQuestao();
}

function embaralharQuestoes(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function carregarQuestao() {
    // Verifica se há perguntas
    if (!questoes || questoes.length === 0) {
        console.error("Nenhuma questão encontrada!");
        return;
    }

    // Atualiza progresso
    document.getElementById("progresso").innerText = `Questão ${indice + 1} de ${questoes.length}`;
    
    // Carrega textos
    document.getElementById("caso").innerText = questoes[indice].caso;
    document.getElementById("feedback").innerText = "";
    document.getElementById("btnProximo").style.display = "none";

    // Gera botões de alternativas
    const alt = document.getElementById("alternativas");
    alt.innerHTML = ""; // Limpa botões anteriores

    questoes[indice].alternativas.forEach((texto, i) => {
        const btn = document.createElement("button");
        btn.innerText = texto;
        btn.onclick = () => verificarResposta(i, btn);
        alt.appendChild(btn);
    });
}

function verificarResposta(respostaEscolhida, botaoClicado) {
    const feedback = document.getElementById("feedback");
    const divAlternativas = document.getElementById("alternativas");
    
    // Desabilita todos os botões para não clicar duas vezes
    const botoes = divAlternativas.getElementsByTagName("button");
    for (let btn of botoes) {
        btn.disabled = true;
        btn.style.cursor = "not-allowed";
    }

    document.getElementById("btnProximo").style.display = "block";

    if (respostaEscolhida === questoes[indice].correta) {
        pontuacao++;
        feedback.innerText = "Resposta Correta! ✅ " + questoes[indice].justificativa;
        feedback.style.color = "green";
        botaoClicado.style.backgroundColor = "#4CAF50"; // Verde
    } else {
        feedback.innerText = "Resposta Incorreta ❌. " + questoes[indice].justificativa;
        feedback.style.color = "red";
        botaoClicado.style.backgroundColor = "#F44336"; // Vermelho
    }
}

function proximaQuestao() {
    indice++;
    if (indice < questoes.length) {
        carregarQuestao();
    } else {
        finalizarJogo();
    }
}

function finalizarJogo() {
    salvarRanking();
    mostrarRankingFinal();
}

/* ======================================================
   4. SISTEMA DE RANKING
   ====================================================== */

function salvarRanking() {
    const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
    ranking.push({ nome: jogador, pontos: pontuacao });
    
    // Ordena do maior para o menor
    ranking.sort((a, b) => b.pontos - a.pontos);
    
    // Salva apenas os top 15
    localStorage.setItem("ranking", JSON.stringify(ranking.slice(0, 15)));
}

// CORREÇÃO AQUI: Removemos a chave '}' extra que existia antes desta função
function renderizarRanking(idLista) {
    const lista = document.getElementById(idLista);
    
    // Proteção contra erro de null (caso o ID esteja errado no HTML)
    if (!lista) {
        console.error(`Elemento com id '${idLista}' não encontrado no HTML.`);
        return;
    }

    lista.innerHTML = "";

    const ranking = JSON.parse(localStorage.getItem("ranking")) || [];

    if (ranking.length === 0) {
        lista.innerHTML = "<li>Ainda não há jogadores no ranking.</li>";
        return;
    }

    ranking.slice(0, 15).forEach((item, i) => {
        const li = document.createElement("li");

        let medalha = `${i + 1}º `;
        if (i === 0) medalha = "🥇 ";
        if (i === 1) medalha = "🥈 ";
        if (i === 2) medalha = "🥉 ";

        li.innerText = `${medalha}${item.nome} – ${item.pontos} pontos`;
        lista.appendChild(li);
    });
}

function mostrarRankingInicio() {
    document.getElementById("inicio").style.display = "none";
    document.getElementById("quiz").style.display = "none";
    document.getElementById("final").style.display = "none";
    
    document.getElementById("rankingTela").style.display = "block";
    renderizarRanking("rankingInicio");
}

function mostrarRankingFinal() {
    document.getElementById("quiz").style.display = "none";
    document.getElementById("final").style.display = "block";
    
    renderizarRanking("rankingFinal");

    // Lógica do confete (acima de 50% de acerto, por exemplo)
    if (pontuacao > 0) dispararConfete();
}

function voltarParaInicio() {
    document.getElementById("rankingTela").style.display = "none";
    document.getElementById("final").style.display = "none";
    document.getElementById("inicio").style.display = "block";
    
    // Limpa o input
    document.getElementById("nome").value = "";
}

function reiniciarQuiz() {
    voltarParaInicio();
}

/* ======================================================
   5. EFEITOS VISUAIS (CONFETE)
   ====================================================== */

function dispararConfete() {
    // Verifica se a biblioteca foi carregada
    if (typeof confetti === "undefined") return;

    const fim = Date.now() + 2000;
    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < fim) requestAnimationFrame(frame);
    })();
}