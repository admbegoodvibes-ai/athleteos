// Simulação do Banco de Dados Inicial
let atletasDB = [
    {
        id: 1,
        nome: "João Silva",
        dataNascimento: "2009-03-15",
        categoria: "Sub-17",
        posicao: "Atacante",
        peDominante: "Destro",
        regiao: "SP",
        altura: "1.75m",
        peso: "68kg",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 2,
        nome: "Pedro Santos",
        dataNascimento: "2011-08-20",
        categoria: "Sub-15",
        posicao: "Meio-Campo",
        peDominante: "Canhoto",
        regiao: "RJ",
        altura: "1.68m",
        peso: "60kg",
        videoUrl: ""
    },
    {
        id: 3,
        nome: "Marcos Vinícius",
        dataNascimento: "2013-01-10",
        categoria: "Sub-13",
        posicao: "Zagueiro",
        peDominante: "Destro",
        regiao: "MG",
        altura: "1.60m",
        peso: "52kg",
        videoUrl: ""
    }
];

// --- LÓGICA DE LOGIN E PERMISSÕES (ROLES) ---
const loginScreen = document.getElementById('login-screen');
const appWrapper = document.getElementById('app-wrapper');

const navDashboard = document.getElementById('nav-dashboard');
const navCadastro = document.getElementById('nav-cadastro');
const navMeusAlunos = document.getElementById('nav-meus-alunos');
const navFinanceiro = document.getElementById('nav-financeiro');
const navMeuPerfil = document.getElementById('nav-meu-perfil');
const navPremium = document.getElementById('nav-premium');
let currentRole = "";

function fazerLogin(role) {
    currentRole = role;
    
    // Esconder login, mostrar app
    loginScreen.classList.remove('active');
    appWrapper.classList.remove('hidden');
    
    // Resetar visibilidade dos botoes
    navDashboard.classList.add('hidden');
    navCadastro.classList.add('hidden');
    navMeusAlunos.classList.add('hidden');
    navFinanceiro.classList.add('hidden');
    navMeuPerfil.classList.add('hidden');
    navPremium.classList.add('hidden');
    document.getElementById('btn-contact-scout').classList.add('hidden');
    document.getElementById('btn-edit-profile').classList.add('hidden');
    
    // Esconder todas as telas
    sections.forEach(s => s.classList.remove('active'));
    navBtns.forEach(b => b.classList.remove('active'));

    // Configurar layout baseado no Role
    if (role === 'olheiro') {
        navDashboard.classList.remove('hidden');
        navDashboard.classList.add('active');
        document.getElementById('dashboard-section').classList.add('active');
        document.getElementById('btn-contact-scout').classList.remove('hidden');
        renderAthletes(atletasDB, 'athletes-grid', true);
    } 
    else if (role === 'escolinha') {
        navMeusAlunos.classList.remove('hidden');
        navCadastro.classList.remove('hidden');
        navFinanceiro.classList.remove('hidden');
        
        navMeusAlunos.classList.add('active');
        document.getElementById('meus-alunos-section').classList.add('active');
        renderAthletes(atletasDB, 'meus-alunos-grid', false); // Lista alunos
    }
    else if (role === 'atleta') {
        navMeuPerfil.classList.remove('hidden');
        navPremium.classList.remove('hidden');
        
        navMeuPerfil.classList.add('active');
        document.getElementById('btn-edit-profile').classList.remove('hidden');
        abrirPerfil(1, true); 
    }
}

function fazerLogout() {
    currentRole = "";
    appWrapper.classList.add('hidden');
    loginScreen.classList.add('active');
}

// --- LÓGICA DO FINANCEIRO ---
function renderFinanceiro() {
    const tbody = document.getElementById('finance-table-body');
    tbody.innerHTML = '';
    
    atletasDB.forEach((atleta, index) => {
        // Simulando que o primeiro ta pago e os outros nao, so pra visualizar
        const status = index === 0 ? 'Pago' : 'Pendente';
        const cssClass = index === 0 ? 'status-pago' : 'status-pendente';
        const vencimento = `10/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
        
        tbody.innerHTML += `
            <tr>
                <td><strong>${atleta.nome}</strong><br><small style="color: var(--text-muted)">${atleta.categoria}</small></td>
                <td>${vencimento}</td>
                <td class="${cssClass}">${status}</td>
            </tr>
        `;
    });
}

// --- NAVEGAÇÃO ---
const navBtns = document.querySelectorAll('.nav-btn:not([onclick])');
const sections = document.querySelectorAll('.content-section');

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if(btn.classList.contains('hidden')) return; // Nao deixa clicar se ta oculto

        navBtns.forEach(b => b.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        
        if (targetId === 'perfil-section') {
            abrirPerfil(1, true); // Simula o proprio perfil
        } else {
            document.getElementById(targetId).classList.add('active');
            
            if(targetId === 'dashboard-section') {
                renderAthletes(atletasDB, 'athletes-grid', true);
            } else if (targetId === 'meus-alunos-section') {
                renderAthletes(atletasDB, 'meus-alunos-grid', false);
            } else if (targetId === 'financeiro-section') {
                renderFinanceiro();
            }
        }
    });
});


// --- LÓGICA DE CÁLCULO DE CATEGORIA SUB ---
function calcularCategoriaSUB(dataNascimento) {
    if (!dataNascimento) return null;
    
    const anoNascimento = parseInt(dataNascimento.split('-')[0]);
    const anoAtual = new Date().getFullYear(); // 2026
    const idadeNoAno = anoAtual - anoNascimento;
    
    // Regra oficial CBF baseada em anos ímpares/pares
    if (idadeNoAno <= 11) return "Sub-11";
    if (idadeNoAno <= 13) return "Sub-13";
    if (idadeNoAno <= 15) return "Sub-15";
    if (idadeNoAno <= 17) return "Sub-17";
    if (idadeNoAno <= 20) return "Sub-20";
    return "Profissional/Amador";
}

// Atualizar badge ao digitar data
const cadDataInput = document.getElementById('cad-data');
const badgeCat = document.getElementById('cad-categoria-badge');
const cadCatHidden = document.getElementById('cad-categoria-hidden');

cadDataInput.addEventListener('change', (e) => {
    const categoria = calcularCategoriaSUB(e.target.value);
    if (categoria) {
        badgeCat.textContent = categoria;
        badgeCat.classList.add('active');
        cadCatHidden.value = categoria;
    } else {
        badgeCat.textContent = "Preencha a data";
        badgeCat.classList.remove('active');
        cadCatHidden.value = "";
    }
});


// --- LÓGICA DE CADASTRO ---
const formCadastro = document.getElementById('cadastro-form');
const feedbackMsg = document.getElementById('feedback-msg');

formCadastro.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Tratamento basico do link do youtube para embed
    let videoLink = document.getElementById('cad-video') ? document.getElementById('cad-video').value : "";
    if(videoLink.includes("watch?v=")) {
        videoLink = videoLink.replace("watch?v=", "embed/");
    }

    const novoAtleta = {
        id: Date.now(),
        nome: document.getElementById('cad-nome').value,
        dataNascimento: document.getElementById('cad-data').value,
        categoria: document.getElementById('cad-categoria-hidden').value,
        posicao: document.getElementById('cad-posicao').value,
        peDominante: document.getElementById('cad-pe').value,
        regiao: document.getElementById('cad-regiao').value,
        altura: "N/A", // Pode adicionar inputs no futuro
        peso: "N/A",
        videoUrl: videoLink
    };
    
    // Salvar no "banco"
    atletasDB.push(novoAtleta);
    
    // Feedback
    formCadastro.reset();
    badgeCat.textContent = "Preencha a data";
    badgeCat.classList.remove('active');
    
    feedbackMsg.classList.remove('hidden');
    setTimeout(() => {
        feedbackMsg.classList.add('hidden');
    }, 3000);
});


// --- LÓGICA DO DASHBOARD (VITRINE E FILTROS) ---
const btnSearch = document.getElementById('btn-search');

function renderAthletes(atletas, gridId = 'athletes-grid', isScout = true) {
    const grid = document.getElementById(gridId);
    if(!grid) return;

    grid.innerHTML = '';
    
    if (atletas.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1;">Nenhum atleta encontrado.</p>';
        return;
    }
    
    atletas.forEach(atleta => {
        const card = document.createElement('div');
        card.className = 'athlete-card';
        card.innerHTML = `
            <div class="card-header">
                <h3 class="athlete-name">${atleta.nome}</h3>
                <span class="badge">${atleta.categoria}</span>
            </div>
            <div class="athlete-info">
                <span>📍 ${atleta.regiao}</span>
                <span>⚽ ${atleta.posicao}</span>
                <span>👟 Pé: ${atleta.peDominante}</span>
                <span>📅 Nasc: ${atleta.dataNascimento.split('-').reverse().join('/')}</span>
            </div>
            ${isScout ? `<button class="card-action" onclick="abrirPerfil(${atleta.id})">Ver Vídeos e Stats</button>` : `<button class="card-action" style="border-color: var(--text-muted); color: var(--text-muted);" disabled>Atleta Ativo</button>`}
        `;
        grid.appendChild(card);
    });
}

// Filtros
btnSearch.addEventListener('click', () => {
    const fCat = document.getElementById('filter-categoria').value;
    const fPos = document.getElementById('filter-posicao').value;
    const fReg = document.getElementById('filter-regiao').value;
    
    const filtrados = atletasDB.filter(atleta => {
        const matchCat = fCat === "" || atleta.categoria === fCat;
        const matchPos = fPos === "" || atleta.posicao === fPos;
        const matchReg = fReg === "" || atleta.regiao === fReg;
        
        return matchCat && matchPos && matchReg;
    });
    
    renderAthletes(filtrados, 'athletes-grid', true);
});


// --- LÓGICA DE ABERTURA DO PERFIL ---
function abrirPerfil(idAtleta, forceSelfProfile = false) {
    const atleta = atletasDB.find(a => a.id === idAtleta);
    if (!atleta) return;
    
    // Esconder seções e mostrar perfil
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById('perfil-section').classList.add('active');
    
    // Mostrar ou esconder botao voltar dependendo de quem chamou
    const btnBack = document.getElementById('btn-back-dashboard');
    if(forceSelfProfile) {
        btnBack.classList.add('hidden'); // Atleta logado nao tem "vitrine" pra voltar
    } else {
        btnBack.classList.remove('hidden');
    }
    
    // Injetar dados no DOM
    document.getElementById('profile-name').textContent = atleta.nome;
    document.getElementById('profile-cat').textContent = atleta.categoria;
    document.getElementById('profile-pos').textContent = atleta.posicao;
    document.getElementById('profile-height').textContent = atleta.altura || "N/A";
    document.getElementById('profile-weight').textContent = atleta.peso || "N/A";
    document.getElementById('profile-foot').textContent = atleta.peDominante;
    
    // Calculando idade para exibir
    const anoAtual = new Date().getFullYear();
    const idade = anoAtual - parseInt(atleta.dataNascimento.split('-')[0]);
    document.getElementById('profile-age').textContent = `${idade} anos`;
    
    document.getElementById('profile-region').textContent = `📍 ${atleta.regiao}`;
    
    // Tratando Video
    const videoContainer = document.querySelector('.video-container');
    if (atleta.videoUrl && atleta.videoUrl.trim() !== "") {
        videoContainer.innerHTML = `<iframe src="${atleta.videoUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else {
        videoContainer.innerHTML = `
            <div id="profile-video-placeholder" class="video-placeholder">
                <p>Nenhum vídeo disponível para este atleta</p>
            </div>
        `;
    }
}

// Botão voltar do perfil
document.getElementById('btn-back-dashboard').addEventListener('click', () => {
    document.getElementById('perfil-section').classList.remove('active');
    document.getElementById('dashboard-section').classList.add('active');
});

// --- LÓGICA DE EDIÇÃO DO PERFIL (ATLETA) ---
const btnEditProfile = document.getElementById('btn-edit-profile');
const formEditProfile = document.getElementById('edit-profile-form');
const btnCancelEdit = document.getElementById('btn-cancel-edit');
let editAtletaId = 1; // Fixo no 1 para o mock

btnEditProfile.addEventListener('click', () => {
    const atleta = atletasDB.find(a => a.id === editAtletaId);
    if(!atleta) return;
    
    // Preencher form com dados atuais
    document.getElementById('edit-altura').value = atleta.altura === "N/A" ? "" : atleta.altura;
    document.getElementById('edit-peso').value = atleta.peso === "N/A" ? "" : atleta.peso;
    document.getElementById('edit-pe').value = atleta.peDominante;
    document.getElementById('edit-regiao').value = atleta.regiao;
    
    // Reverter url de embed para URL de watch se necessário
    let url = atleta.videoUrl;
    if(url.includes("embed/")) {
        url = url.replace("embed/", "watch?v=");
    }
    document.getElementById('edit-video').value = url;
    
    // Mostrar tela de edicao
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById('edit-profile-section').classList.add('active');
});

btnCancelEdit.addEventListener('click', () => {
    abrirPerfil(editAtletaId, true);
});

formEditProfile.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const atleta = atletasDB.find(a => a.id === editAtletaId);
    if(atleta) {
        atleta.altura = document.getElementById('edit-altura').value || "N/A";
        atleta.peso = document.getElementById('edit-peso').value || "N/A";
        atleta.peDominante = document.getElementById('edit-pe').value;
        atleta.regiao = document.getElementById('edit-regiao').value;
        
        let videoLink = document.getElementById('edit-video').value;
        if(videoLink.includes("watch?v=")) {
            videoLink = videoLink.replace("watch?v=", "embed/");
        }
        atleta.videoUrl = videoLink;
    }
    
    // Voltar pro perfil e ver alteracoes
    abrirPerfil(editAtletaId, true);
});
