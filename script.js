/* ======================================================
   CONFIGURAÇÃO DO FIREBASE (IMPORTANTE!)
   ====================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    orderBy, 
    limit 
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA8WLLaMzU7cvMczsMbNnwTsXHGRW_B_vo",
  authDomain: "quiz-ac-2a30f.firebaseapp.com",
  projectId: "quiz-ac-2a30f",
  storageBucket: "quiz-ac-2a30f.firebasestorage.app",
  messagingSenderId: "546401535218",
  appId: "1:546401535218:web:fd9a36247dbf90dbf4fc6b"
};
// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const nomeColecao = "ranking_hcpa"; // Nome da tabela no banco

/* ======================================================
   1. DADOS DO QUIZ
   ====================================================== */
const questoes = [
    // --- FISIOTERAPIA ---
    {
        caso: " Paciente com DPOC exacerbado chega à emergência com dispneia intensa e uso de musculatura acessória. A gasometria mostra acidose respiratória. Além da medicação, qual profissional é crucial para avaliar e iniciar Ventilação Não Invasiva (VNI)?",
        alternativas: ["Fonoaudiologia", "Fisioterapia", "Serviço Social", "Nutrição"],
        correta: 1,
        justificativa: "O Fisioterapeuta é o especialista responsável pelo manejo da ventilação mecânica (invasiva e não invasiva) e terapias de expansão pulmonar."
    },
    {
        caso: " Paciente pós-AVC isquêmico, estável hemodinamicamente, mas apresenta hemiplegia à direita e passou 4 dias acamado. Para prevenir complicações motoras e planejar a mobilização precoce, quem deve ser acionado?",
        alternativas: ["Psicologia", "Farmácia", "Fisioterapia", "Enfermagem"],
        correta: 2,
        justificativa: "A Fisioterapia motora é essencial para avaliar a funcionalidade, prevenir contraturas e iniciar a reabilitação motora o mais cedo possível."
    },
    // --- FONOAUDIOLOGIA ---
    {
        caso: " Paciente idoso admitido por pneumonia aspirativa. Durante a oferta de água via oral, apresenta tosse úmida e voz molhada ('gargarejo'). Qual profissional deve realizar a avaliação da deglutição?",
        alternativas: ["Nutrição", "Fonoaudiologia", "Odontologia", "Fisioterapia"],
        correta: 1,
        justificativa: "A Fonoaudiologia avalia a segurança da deglutição (disfagia) para definir se o paciente pode comer por via oral ou precisa de sonda."
    },
    {
        caso: " Paciente traqueostomizado na emergência está consciente e tenta se comunicar, mas não consegue emitir som, gerando ansiedade. Quem deve avaliar o uso de válvula de fala ou métodos alternativos de comunicação?",
        alternativas: ["Psicologia", "Serviço Social", "Fonoaudiologia", "Enfermagem"],
        correta: 2,
        justificativa: "O Fonoaudiólogo é responsável pela reabilitação da comunicação e pelo manejo de válvulas de fala em pacientes traqueostomizados."
    },
    // --- NUTRIÇÃO ---
    {
        caso: " Paciente oncológico dá entrada na emergência com perda de 15kg em 2 meses e relata não conseguir aceitar a dieta do hospital. Quem deve realizar a triagem nutricional e adequar a dieta?",
        alternativas: ["Farmácia", "Nutrição", "Psicologia", "Serviço Social"],
        correta: 1,
        justificativa: "O Nutricionista deve diagnosticar o risco nutricional, calcular as necessidades calóricas e adaptar a consistência ou suplementação da dieta."
    },
    {
        caso: " Foi definida a passagem de Sonda Nasoenteral (SNE) para um paciente que não pode engolir. Após o raio-x confirmar a posição, quem é responsável por prescrever a fórmula e o volume da dieta enteral?",
        alternativas: ["Enfermagem", "Fonoaudiologia", "Nutrição", "Farmácia"],
        correta: 2,
        justificativa: "A prescrição dietética (tipo de fórmula, calorias, volume e macronutrientes) é competência privativa do Nutricionista."
    },
    // --- FARMÁCIA ---
    {
        caso: " Paciente idoso chega confuso, trazendo uma sacola com 15 medicamentos diferentes de uso domiciliar. Para evitar duplicidade ou interações com a nova prescrição hospitalar, deve-se solicitar:",
        alternativas: ["Farmácia", "Serviço Social", "Nutricão", "Psicologia"],
        correta: 0,
        justificativa: "O Farmacêutico Clínico realiza a conciliação medicamentosa, garantindo que os remédios de casa sejam mantidos, suspensos ou ajustados corretamente."
    },
    {
        caso: " Paciente apresenta piora súbita da função renal (Creatinina subiu de 0.8 para 2.5). Ele está em uso de Vancomicina (antibiótico). Quem deve ser acionado para o ajuste de dose baseado na função renal?",
        alternativas: ["Fisioterapia", "Enfermagem", "Farmácia", "Nutrição"],
        correta: 2,
        justificativa: "A Farmácia Clínica monitora níveis séricos e ajusta a posologia de antimicrobianos e outros fármacos de acordo com a depuração renal (ClCr)."
    },
    // --- SERVIÇO SOCIAL ---
    {
        caso: " Paciente em situação de rua recebe alta médica da emergência, mas não tem para onde ir e necessita de curativos diários. Para articular a rede de apoio ou acolhimento, aciona-se:",
        alternativas: ["Psicologia", "Enfermagem", "Serviço Social", "Fisioterapia"],
        correta: 2,
        justificativa: "O Assistente Social articula a rede de proteção, viabiliza desospitalização segura e conecta o paciente a abrigos ou unidades de saúde."
    },
    {
        caso: " Um paciente chega à emergência trazido pelo SAMU, sem documentos, desacordado e sem acompanhantes. Para busca ativa de familiares e identificação civil, chama-se:",
        alternativas: ["Segurança", "Serviço Social", "Psicologia", "Recepção"],
        correta: 1,
        justificativa: "O Serviço Social atua na busca de familiares e na regularização de documentação civil, fundamental para o seguimento do cuidado."
    },
    // --- PSICOLOGIA ---
    {
        caso: " Paciente jovem, vítima de acidente de moto, acaba de receber a notícia de que terá uma perna amputada. Ele está em estado de choque emocional e negação intensa. Quem deve dar suporte imediato?",
        alternativas: ["Fisioterapia", "Serviço Social", "Psicologia", "Farmácia"],
        correta: 2,
        justificativa: "O Psicólogo Hospitalar atua no suporte emocional frente ao adoecimento, luto, perdas funcionais e notícias difíceis."
    },
    {
        caso: " A equipe nota que um paciente na Sala Vermelha está extremamente ansioso, com medo da morte, dificultando a adesão ao tratamento, mas sem quadro psiquiátrico prévio. Qual consultoria é indicada?",
        alternativas: ["Psicologia", "Fonoaudiologia", "Nutrição", "Serviço Social"],
        correta: 0,
        justificativa: "A Psicologia auxilia no manejo da ansiedade situacional, ajudando o paciente a elaborar o processo de adoecimento e aderir ao tratamento."
    },
    // --- ENFERMAGEM ---
    {
        caso: " Paciente apresenta uma Lesão por Pressão (escara) Sacral Grau 3 com necrose. A equipe médica solicita avaliação especializada para desbridamento e cobertura específica. Quem é a referência técnica?",
        alternativas: ["Fisioterapia", "Enfermagem", "Farmácia", "Nutrição"],
        correta: 1,
        justificativa: "Enfermeiros especialistas (Estomaterapeutas ou da Comissão de Pele) avaliam feridas complexas e prescrevem a cobertura/curativo ideal."
    },
    {
        caso: " Durante a infusão de quimioterapia na emergência, o paciente refere dor e queimação no local do acesso venoso (suspeita de extravasamento). Quem lidera a conduta imediata de segurança?",
        alternativas: ["Farmácia", "Enfermagem", "Fisioterapia", "Serviço Social"],
        correta: 1,
        justificativa: "A equipe de Enfermagem é responsável pela vigilância dos acessos venosos, devendo parar a infusão e aplicar o protocolo de extravasamento imediatamente."
    },
    // --- EXTRA ---
    {
        caso: " (Desafio) Paciente precisa de alta para Home Care (atendimento domiciliar) com oxigenoterapia. O médico deu a alta, mas falta organizar os equipamentos e o cadastro no programa de O2. Quem lidera esse processo logístico?",
        alternativas: ["Nutrição", "Fonoaudiologia", "Serviço Social", "Psicologia"],
        correta: 2,
        justificativa: "Embora a Fisioterapia avalie a necessidade técnica, é o Serviço Social que viabiliza o acesso aos direitos, equipamentos e burocracia para o Home Care."
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
    if (!questoes || questoes.length === 0) {
        console.error("Nenhuma questão encontrada!");
        return;
    }

    document.getElementById("progresso").innerText = `Questão ${indice + 1} de ${questoes.length}`;
    document.getElementById("caso").innerText = questoes[indice].caso;
    document.getElementById("feedback").innerText = "";
    document.getElementById("btnProximo").style.display = "none";

    const alt = document.getElementById("alternativas");
    alt.innerHTML = "";

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
        botaoClicado.style.backgroundColor = "#4CAF50";
    } else {
        feedback.innerText = "Resposta Incorreta ❌. " + questoes[indice].justificativa;
        feedback.style.color = "red";
        botaoClicado.style.backgroundColor = "#F44336";
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
    salvarRanking(); // Agora salva no Firebase
    mostrarRankingFinal();
}

/* ======================================================
   4. SISTEMA DE RANKING (COM FIREBASE)
   ====================================================== */

// Função ASYNC: Envia dados para o Google Firestore
async function salvarRanking() {
    try {
        await addDoc(collection(db, nomeColecao), {
            nome: jogador,
            pontos: pontuacao,
            data: new Date() // Salva a data também
        });
        console.log("Ranking salvo na nuvem!");
    } catch (e) {
        console.error("Erro ao salvar no Firebase: ", e);
        alert("Erro ao salvar ranking. Verifique a internet.");
    }
}

// Função ASYNC: Lê dados do Google Firestore
async function renderizarRanking(idLista) {
    const lista = document.getElementById(idLista);
    if (!lista) return;

    lista.innerHTML = "<li>Carregando ranking global... ⏳</li>";

    try {
        // Busca os Top 15 ordenados por pontos (decrescente)
        const q = query(collection(db, nomeColecao), orderBy("pontos", "desc"), limit(15));
        const querySnapshot = await getDocs(q);

        lista.innerHTML = ""; // Limpa o "carregando"

        if (querySnapshot.empty) {
            lista.innerHTML = "<li>Ainda não há jogadores no ranking. Seja o primeiro!</li>";
            return;
        }

        let posicao = 1;
        querySnapshot.forEach((doc) => {
            const item = doc.data();
            const li = document.createElement("li");

            let medalha = `${posicao}º `;
            if (posicao === 1) medalha = "🥇 ";
            if (posicao === 2) medalha = "🥈 ";
            if (posicao === 3) medalha = "🥉 ";

            li.innerText = `${medalha}${item.nome} – ${item.pontos} pontos`;
            lista.appendChild(li);
            posicao++;
        });

    } catch (error) {
        console.error("Erro ao buscar ranking:", error);
        lista.innerHTML = "<li>Erro ao carregar ranking. Verifique a conexão.</li>";
    }
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

    if (pontuacao >= 8) dispararConfete();
}

function voltarParaInicio() {
    document.getElementById("rankingTela").style.display = "none";
    document.getElementById("final").style.display = "none";
    document.getElementById("inicio").style.display = "block";
    document.getElementById("nome").value = "";
}

function reiniciarQuiz() {
    voltarParaInicio();
}

/* ======================================================
   5. EXPORTAR FUNÇÕES PARA O HTML
   ====================================================== */
// Isso é necessário porque usamos type="module"
window.iniciarQuiz = iniciarQuiz;
window.proximaQuestao = proximaQuestao;
window.mostrarRankingInicio = mostrarRankingInicio;
window.voltarParaInicio = voltarParaInicio;
window.reiniciarQuiz = reiniciarQuiz;

/* ======================================================
   6. EFEITOS VISUAIS
   ====================================================== */

function dispararConfete() {
    if (typeof confetti === "undefined") return;

    const fim = Date.now() + 2000;
    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < fim) requestAnimationFrame(frame);
    })();
}