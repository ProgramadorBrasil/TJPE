/**
 * APP.JS - Script Principal do Curso Leilão Judicial TJPE
 * Integra todos os módulos, controles de navegação e funcionalidades
 * Autor: Renato Gracie
 * Data: 15/11/2025
 */

// ============================================================
// CONFIGURAÇÃO E DADOS GLOBAIS
// ============================================================

let modulosData = {};
let currentModule = null;
let currentSection = null;
let config = {};

const API_BASE = 'modules/';
const CONFIG_FILE = 'config.json';

// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando aplicação...');
    carregarConfiguracao();
    verificarSessao();
});

/**
 * Carrega configuração global do curso
 */
async function carregarConfiguracao() {
    try {
        const response = await fetch(CONFIG_FILE);
        config = await response.json();
        console.log('Configuração carregada:', config);
        renderizarNavegacao();
        carregarModuloInicial();
    } catch (error) {
        console.error('Erro ao carregar configuração:', error);
        mostrarErro('Erro ao carregar configuração do curso');
    }
}

/**
 * Carrega módulo inicial (bem-vindo)
 */
async function carregarModuloInicial() {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    mainContent.innerHTML = `
        <div class="welcome-section">
            <h1>${config.curso?.titulo || 'Leilão Judicial TJPE'}</h1>
            <p style="font-size: 18px; color: #666;">Bem-vindo ao curso de treinamento profissional sobre leilões judiciais.</p>
            <p style="color: #999;">Instrutor: ${config.curso?.instrutor?.nome || 'Renato Gracie'}</p>

            <div class="welcome-modules" id="welcomeModules"></div>
        </div>
    `;

    renderizarCartaoModulos();
}

/**
 * Renderiza navegação sidebar
 */
async function renderizarNavegacao() {
    const moduleList = document.getElementById('moduleList');
    if (!moduleList || !config.modulos) return;

    let html = '';
    config.modulos.forEach(mod => {
        const ativo = currentModule === mod.id ? 'active' : '';
        html += `
            <div class="module-item ${ativo}" onclick="carregarModulo(${mod.id})" role="button" tabindex="0">
                <span class="module-number">${mod.id}</span>
                <span class="module-icon">${mod.icone}</span>
                <span>${mod.titulo}</span>
            </div>
        `;
    });
    moduleList.innerHTML = html;
}

/**
 * Renderiza cartões de módulos na página inicial
 */
function renderizarCartaoModulos() {
    const welcomeModules = document.getElementById('welcomeModules');
    if (!welcomeModules || !config.modulos) return;

    let html = '';
    config.modulos.forEach(mod => {
        html += `
            <div class="module-card" onclick="carregarModulo(${mod.id})">
                <div class="module-card-icon">${mod.icone}</div>
                <div class="module-card-content">
                    <h3>Módulo ${mod.id}</h3>
                    <p><strong>${mod.titulo}</strong></p>
                    <p style="font-size: 12px;">${mod.descricao}</p>
                    <div class="module-card-meta">
                        <span><i class="fas fa-clock"></i> ${mod.duracao}</span>
                        <span><i class="fas fa-book"></i> ${mod.topicos} tópicos</span>
                    </div>
                </div>
            </div>
        `;
    });
    welcomeModules.innerHTML = html;
}

/**
 * Carrega um módulo específico
 */
async function carregarModulo(moduleId) {
    console.log(`Carregando módulo ${moduleId}...`);
    currentModule = moduleId;

    try {
        const response = await fetch(`${API_BASE}modulo-${String(moduleId).padStart(2, '0')}.json`);
        const moduleData = await response.json();
        modulosData[moduleId] = moduleData;

        renderizarModulo(moduleData);
        renderizarNavegacao();
        atualizarBreadcrumb(moduleData);
        salvarProgresso(moduleId);
    } catch (error) {
        console.error(`Erro ao carregar módulo ${moduleId}:`, error);
        mostrarErro(`Erro ao carregar módulo ${moduleId}`);
    }
}

/**
 * Renderiza conteúdo do módulo
 */
function renderizarModulo(moduleData) {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    // Cabeçalho do módulo
    let html = `
        <div class="breadcrumb-custom">
            <a href="#" onclick="carregarModuloInicial(); return false;">Início</a> /
            <span>Módulo ${moduleData.id}</span>
        </div>

        <div class="module-header">
            <div class="module-header-icon">${moduleData.icone}</div>
            <div>
                <h1>${moduleData.titulo}</h1>
                <p>${moduleData.descricao}</p>
                <small style="color: #999;">
                    <i class="fas fa-clock"></i> ${moduleData.duracao} |
                    <i class="fas fa-user"></i> ${moduleData.autor}
                </small>
            </div>
        </div>

        <div class="progress-bar-custom">
            <div class="progress">
                <div class="progress-bar" style="width: ${calcularProgresso()}%"></div>
            </div>
            <small>${calcularProgresso()}% completo</small>
        </div>
    `;

    // Objetivos
    if (moduleData.objetivos && moduleData.objetivos.length > 0) {
        html += `
            <div class="card-custom">
                <div class="card-header"><i class="fas fa-target"></i> Objetivos de Aprendizagem</div>
                <div class="card-body">
                    <ul style="margin-bottom: 0;">
        `;
        moduleData.objetivos.forEach(obj => {
            html += `<li>${obj}</li>`;
        });
        html += `</ul></div></div>`;
    }

    // Alertas críticos
    if (moduleData.alertasCriticos && moduleData.alertasCriticos.length > 0) {
        moduleData.alertasCriticos.forEach(alerta => {
            const classe = `alert-${alerta.tipo}`;
            html += `
                <div class="alert-custom ${classe}">
                    <strong><span style="font-size: 16px;">${alerta.icone}</span> ${alerta.titulo}</strong>
                    <p style="margin-bottom: 0; margin-top: 5px;">${alerta.conteudo}</p>
                </div>
            `;
        });
    }

    // Seções e tópicos
    if (moduleData.secoes && moduleData.secoes.length > 0) {
        moduleData.secoes.forEach(section => {
            html += `
                <div class="section">
                    <h2 class="section-title">
                        <i class="fas fa-book-open"></i> ${section.titulo}
                    </h2>
                    <p class="section-description">${section.descricao}</p>
            `;

            if (section.topicos && section.topicos.length > 0) {
                section.topicos.forEach(topico => {
                    html += renderizarTopico(topico);
                });
            }

            html += `</div>`;
        });
    }

    // Questões de revisão
    if (moduleData.questoesRevisao && moduleData.questoesRevisao.length > 0) {
        html += renderizarQuestoes(moduleData);
    }

    // Casos exemplo
    if (moduleData.casosExemplo && moduleData.casosExemplo.length > 0) {
        html += renderizarCasos(moduleData);
    }

    // Navegação
    html += renderizarNavegacaoModulos(moduleData.id);

    mainContent.innerHTML = html;
    window.scrollTo(0, 0);
}

/**
 * Renderiza um tópico individual
 */
function renderizarTopico(topico) {
    let html = `
        <div class="topic">
            <div class="topic-title">
                <span style="font-size: 18px;">📌</span>
                ${topico.titulo}
            </div>
    `;

    if (topico.conteudo) {
        html += `<div class="topic-content">${topico.conteudo}</div>`;
    }

    if (topico.detalhes) {
        html += `<div style="background: #f9f9f9; padding: 12px; border-radius: 4px; margin-top: 10px;">`;
        html += renderizarDetalhes(topico.detalhes);
        html += `</div>`;
    }

    if (topico.exemploPratico) {
        html += `
            <div style="background: #e8f4f8; padding: 12px; border-radius: 4px; margin-top: 10px;">
                <strong><i class="fas fa-lightbulb"></i> Exemplo Prático:</strong>
                ${renderizarExemplo(topico.exemploPratico)}
            </div>
        `;
    }

    html += `</div>`;
    return html;
}

/**
 * Renderiza detalhes de um tópico
 */
function renderizarDetalhes(detalhes) {
    let html = '';

    if (typeof detalhes === 'object') {
        for (const [chave, valor] of Object.entries(detalhes)) {
            if (Array.isArray(valor)) {
                html += `<p><strong>${formatarChave(chave)}:</strong></p><ul>`;
                valor.forEach(item => {
                    if (typeof item === 'string') {
                        html += `<li>${item}</li>`;
                    } else {
                        html += `<li><strong>${Object.values(item)[0]}</strong></li>`;
                    }
                });
                html += `</ul>`;
            } else if (typeof valor === 'object') {
                html += `<p><strong>${formatarChave(chave)}:</strong></p>`;
                html += renderizarDetalhes(valor);
            } else {
                html += `<p><strong>${formatarChave(chave)}:</strong> ${valor}</p>`;
            }
        }
    }

    return html;
}

/**
 * Renderiza exemplo prático
 */
function renderizarExemplo(exemplo) {
    let html = '';

    if (typeof exemplo === 'string') {
        html = exemplo;
    } else if (typeof exemplo === 'object') {
        for (const [chave, valor] of Object.entries(exemplo)) {
            if (Array.isArray(valor)) {
                html += `<p style="margin: 10px 0;"><strong>${formatarChave(chave)}:</strong></p><ul style="margin: 5px 0;">`;
                valor.forEach(item => {
                    html += `<li style="font-size: 13px;">${item}</li>`;
                });
                html += `</ul>`;
            } else {
                html += `<p style="margin: 5px 0;"><strong>${formatarChave(chave)}:</strong> ${valor}</p>`;
            }
        }
    }

    return html;
}

/**
 * Renderiza questões de revisão
 */
function renderizarQuestoes(moduleData) {
    let html = `
        <div class="section">
            <h2 class="section-title"><i class="fas fa-question-circle"></i> Questões de Revisão</h2>
    `;

    if (moduleData.questoesRevisao && moduleData.questoesRevisao.length > 0) {
        moduleData.questoesRevisao.forEach((questao, idx) => {
            html += `
                <div class="card-custom">
                    <div class="card-header">Questão ${questao.id}</div>
                    <div class="card-body">
                        <p><strong>${questao.pergunta}</strong></p>
                        <div id="question_${questao.id}">
            `;

            questao.opcoes.forEach((opcao, oidx) => {
                html += `
                    <div class="form-check" style="margin-bottom: 10px;">
                        <input class="form-check-input" type="radio" name="q${questao.id}"
                               id="opt_${questao.id}_${oidx}" value="${oidx}"
                               onchange="verificarResposta(${questao.id}, ${oidx}, ${questao.respostaCorreta})">
                        <label class="form-check-label" for="opt_${questao.id}_${oidx}">
                            ${opcao}
                        </label>
                    </div>
                `;
            });

            html += `
                        </div>
                        <div id="feedback_${questao.id}"></div>
                    </div>
                </div>
            `;
        });
    }

    html += `</div>`;
    return html;
}

/**
 * Verifica resposta de questão
 */
function verificarResposta(questionId, selectedAnswer, correctAnswer) {
    const feedbackElement = document.getElementById(`feedback_${questionId}`);
    if (!feedbackElement) return;

    if (selectedAnswer === correctAnswer) {
        feedbackElement.innerHTML = `
            <div class="alert alert-success mt-2">
                <i class="fas fa-check"></i> Resposta correta!
            </div>
        `;
        registrarResposta(questionId, true);
    } else {
        feedbackElement.innerHTML = `
            <div class="alert alert-danger mt-2">
                <i class="fas fa-times"></i> Resposta incorreta. Tente novamente.
            </div>
        `;
        registrarResposta(questionId, false);
    }
}

/**
 * Renderiza casos exemplo
 */
function renderizarCasos(moduleData) {
    let html = `
        <div class="section">
            <h2 class="section-title"><i class="fas fa-book"></i> Casos Práticos</h2>
    `;

    if (moduleData.casosExemplo && moduleData.casosExemplo.length > 0) {
        moduleData.casosExemplo.forEach(caso => {
            html += `
                <div class="card-custom">
                    <div class="card-header"><strong>${caso.titulo}</strong></div>
                    <div class="card-body">
                        <p><em>${caso.descricao}</em></p>
            `;

            for (const [chave, valor] of Object.entries(caso)) {
                if (!['id', 'titulo', 'descricao'].includes(chave)) {
                    if (Array.isArray(valor)) {
                        html += `<p><strong>${formatarChave(chave)}:</strong></p><ul>`;
                        valor.forEach(item => {
                            html += `<li>${typeof item === 'string' ? item : JSON.stringify(item)}</li>`;
                        });
                        html += `</ul>`;
                    } else if (typeof valor === 'object') {
                        html += `<details style="margin: 10px 0;"><summary><strong>${formatarChave(chave)}</strong></summary>`;
                        html += renderizarDetalhes(valor);
                        html += `</details>`;
                    } else {
                        html += `<p><strong>${formatarChave(chave)}:</strong> ${valor}</p>`;
                    }
                }
            }

            html += `</div></div>`;
        });
    }

    html += `</div>`;
    return html;
}

/**
 * Renderiza navegação entre módulos
 */
function renderizarNavegacaoModulos(moduleId) {
    const prevId = moduleId > 1 ? moduleId - 1 : null;
    const nextId = moduleId < 10 ? moduleId + 1 : null;

    let html = `<div class="navigation-controls">`;

    if (prevId) {
        html += `
            <button class="btn btn-nav btn-outline-primary" onclick="carregarModulo(${prevId})">
                <i class="fas fa-arrow-left"></i> Anterior (Módulo ${prevId})
            </button>
        `;
    } else {
        html += `<button class="btn btn-nav btn-outline-secondary" disabled><i class="fas fa-arrow-left"></i> Anterior</button>`;
    }

    html += `<button class="btn btn-nav btn-outline-primary" onclick="carregarModuloInicial()"><i class="fas fa-home"></i> Início</button>`;

    if (nextId) {
        html += `
            <button class="btn btn-nav btn-outline-primary" onclick="carregarModulo(${nextId})">
                Próximo (Módulo ${nextId}) <i class="fas fa-arrow-right"></i>
            </button>
        `;
    } else {
        html += `<button class="btn btn-nav btn-outline-secondary" disabled>Próximo <i class="fas fa-arrow-right"></i></button>`;
    }

    html += `</div>`;
    return html;
}

/**
 * Atualiza breadcrumb
 */
function atualizarBreadcrumb(moduleData) {
    // Implementado no renderizarModulo
}

/**
 * Calcula progresso
 */
function calcularProgresso() {
    if (!currentModule) return 0;
    return Math.round((currentModule / 10) * 100);
}

/**
 * Formata chave para exibição
 */
function formatarChave(chave) {
    return chave
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^./, str => str.toUpperCase());
}

/**
 * Salva progresso do usuário
 */
function salvarProgresso(moduleId) {
    const progresso = {
        ultimoModulo: moduleId,
        data: new Date().toISOString(),
        modulos: Array.from({length: 10}, (_, i) => i + 1)
    };
    localStorage.setItem('progressoTJPE', JSON.stringify(progresso));
    console.log('Progresso salvo:', progresso);
}

/**
 * Registra resposta a questão
 */
function registrarResposta(questionId, acertou) {
    const respostas = JSON.parse(localStorage.getItem('respostasTJPE') || '{}');
    if (!respostas[currentModule]) {
        respostas[currentModule] = {};
    }
    respostas[currentModule][questionId] = acertou;
    localStorage.setItem('respostasTJPE', JSON.stringify(respostas));
}

/**
 * Verifica sessão do usuário
 */
function verificarSessao() {
    const sessao = localStorage.getItem('sessaoTJPE');
    if (!sessao) {
        const novaSessao = {
            id: 'user_' + Date.now(),
            inicio: new Date().toISOString(),
            ultimoAcceso: new Date().toISOString()
        };
        localStorage.setItem('sessaoTJPE', JSON.stringify(novaSessao));
    }
}

/**
 * Mostra erro ao usuário
 */
function mostrarErro(mensagem) {
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading"><i class="fas fa-exclamation-triangle"></i> Erro</h4>
                <p>${mensagem}</p>
            </div>
        `;
    }
}

/**
 * Funcionalidade de busca (simplificada)
 */
function buscarConteudo(termo) {
    console.log('Buscando por:', termo);
    // Implementar busca completa nos módulos
    return [];
}

/**
 * Exporta progresso
 */
function exportarProgresso() {
    const progresso = localStorage.getItem('progressoTJPE');
    const respostas = localStorage.getItem('respostasTJPE');
    const dados = {
        progresso: JSON.parse(progresso || '{}'),
        respostas: JSON.parse(respostas || '{}'),
        data: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(dados, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progresso-tjpe-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
}

// Expor funções globalmente
window.carregarModulo = carregarModulo;
window.carregarModuloInicial = carregarModuloInicial;
window.verificarResposta = verificarResposta;
window.buscarConteudo = buscarConteudo;
window.exportarProgresso = exportarProgresso;
