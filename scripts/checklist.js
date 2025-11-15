/**
 * CHECKLIST LEILÃO JUDICIAL - JavaScript
 * Sistema interativo de checklist para servidores TJPE
 */

let checklistData = null;
let tarefasConcluidas = [];
let filtroAtual = 'todas';

// Carregar dados ao iniciar
document.addEventListener('DOMContentLoaded', async () => {
    await carregarChecklist();
    carregarProgresso();
    renderizarChecklist();
    atualizarProgresso();
});

// Carregar dados do JSON
async function carregarChecklist() {
    try {
        const response = await fetch('data/checklist-leilao.json');
        checklistData = await response.json();
    } catch (error) {
        console.error('Erro ao carregar checklist:', error);
        alert('Erro ao carregar checklist. Verifique se o arquivo existe.');
    }
}

// Carregar progresso do localStorage
function carregarProgresso() {
    const progresso = localStorage.getItem('checklist-leilao-progresso');
    if (progresso) {
        tarefasConcluidas = JSON.parse(progresso);
    }
}

// Salvar progresso no localStorage
function salvarProgresso() {
    localStorage.setItem('checklist-leilao-progresso', JSON.stringify(tarefasConcluidas));
    atualizarProgresso();
}

// Renderizar checklist completo
function renderizarChecklist() {
    const container = document.getElementById('checklist-content');
    const observacoesContainer = document.getElementById('observacoes-gerais');

    if (!checklistData) {
        container.innerHTML = '<p>Carregando checklist...</p>';
        return;
    }

    // Renderizar fases
    let html = '';
    checklistData.fases.forEach(fase => {
        html += renderizarFase(fase);
    });
    container.innerHTML = html;

    // Renderizar observações gerais
    let obsHtml = '';
    checklistData.observacoes_gerais.forEach(obs => {
        obsHtml += `
            <div class="observacao-card">
                <h3>${obs.titulo}</h3>
                <ul>
                    ${obs.itens.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
    });
    observacoesContainer.innerHTML = obsHtml;

    // Aplicar filtro se necessário
    aplicarFiltro();
}

// Renderizar uma fase
function renderizarFase(fase) {
    const tarefasConcluidas = contarTarefasConcluidas(fase);
    const totalTarefas = fase.tarefas.length;
    const progresso = ((tarefasConcluidas / totalTarefas) * 100).toFixed(0);

    return `
        <div class="fase-card" data-fase-id="${fase.id}">
            <div class="fase-header">
                <div class="fase-icon" style="background: ${fase.cor}20;">
                    ${fase.icone}
                </div>
                <div class="fase-info">
                    <h2>${fase.fase}</h2>
                    <div class="fase-progress">
                        ${tarefasConcluidas}/${totalTarefas} tarefas concluídas (${progresso}%)
                    </div>
                </div>
            </div>
            <div class="tarefas-list">
                ${fase.tarefas.map(tarefa => renderizarTarefa(tarefa, fase.cor)).join('')}
            </div>
        </div>
    `;
}

// Renderizar uma tarefa
function renderizarTarefa(tarefa, cor) {
    const concluida = tarefasConcluidas.includes(tarefa.id);
    const classeConcluida = concluida ? 'concluida' : '';
    const classeCritica = tarefa.critico ? 'critica' : '';

    return `
        <div class="tarefa-item ${classeConcluida} ${classeCritica}"
             data-tarefa-id="${tarefa.id}"
             data-critica="${tarefa.critico}"
             onclick="toggleTarefa('${tarefa.id}')">
            <div class="tarefa-checkbox">
                <i class="fas fa-check"></i>
            </div>
            <div class="tarefa-content">
                <div class="tarefa-id">Tarefa ${tarefa.id}</div>
                <div class="tarefa-texto">${tarefa.tarefa}</div>
                <div class="tarefa-meta">
                    <span class="tarefa-modulo">
                        <i class="fas fa-book"></i> Módulo ${tarefa.modulo}
                    </span>
                    ${tarefa.prazo ? `
                        <span class="tarefa-prazo">
                            <i class="fas fa-clock"></i> ${tarefa.prazo}
                        </span>
                    ` : ''}
                    ${tarefa.critico ? '<span class="tarefa-critica-badge">CRÍTICA</span>' : ''}
                </div>
                ${tarefa.observacao ? `
                    <div class="tarefa-observacao">
                        <i class="fas fa-info-circle"></i> ${tarefa.observacao}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Toggle tarefa concluída/pendente
function toggleTarefa(tarefaId) {
    const index = tarefasConcluidas.indexOf(tarefaId);
    if (index > -1) {
        tarefasConcluidas.splice(index, 1);
    } else {
        tarefasConcluidas.push(tarefaId);
    }
    salvarProgresso();
    renderizarChecklist();
}

// Contar tarefas concluídas em uma fase
function contarTarefasConcluidas(fase) {
    return fase.tarefas.filter(t => tarefasConcluidas.includes(t.id)).length;
}

// Atualizar barra de progresso geral
function atualizarProgresso() {
    if (!checklistData) return;

    const totalTarefas = checklistData.fases.reduce((acc, fase) => acc + fase.tarefas.length, 0);
    const concluidas = tarefasConcluidas.length;
    const progresso = ((concluidas / totalTarefas) * 100).toFixed(1);

    document.getElementById('progress-bar').style.width = `${progresso}%`;
    document.getElementById('progress-text').textContent = `${progresso}% Concluído`;
    document.getElementById('progress-count').textContent = `${concluidas}/${totalTarefas} tarefas`;
}

// Filtrar tarefas
function filtrarTarefas(filtro) {
    filtroAtual = filtro;

    // Atualizar botões
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filtro) {
            btn.classList.add('active');
        }
    });

    aplicarFiltro();
}

// Aplicar filtro às tarefas
function aplicarFiltro() {
    const tarefas = document.querySelectorAll('.tarefa-item');

    tarefas.forEach(tarefa => {
        const concluida = tarefa.classList.contains('concluida');
        const critica = tarefa.dataset.critica === 'true';

        let mostrar = true;

        if (filtroAtual === 'pendentes') {
            mostrar = !concluida;
        } else if (filtroAtual === 'concluidas') {
            mostrar = concluida;
        } else if (filtroAtual === 'criticas') {
            mostrar = critica;
        }

        tarefa.style.display = mostrar ? 'flex' : 'none';
    });

    // Esconder fases vazias
    document.querySelectorAll('.fase-card').forEach(faseCard => {
        const tarefasVisiveis = faseCard.querySelectorAll('.tarefa-item[style="display: flex;"], .tarefa-item:not([style*="display"])').length;
        faseCard.style.display = tarefasVisiveis > 0 ? 'block' : 'none';
    });
}

// Resetar checklist
function resetarChecklist() {
    if (confirm('Tem certeza que deseja resetar todo o progresso do checklist? Esta ação não pode ser desfeita.')) {
        tarefasConcluidas = [];
        salvarProgresso();
        renderizarChecklist();
        alert('Checklist resetado com sucesso!');
    }
}

// Imprimir checklist
function imprimirChecklist() {
    // Mostrar todas as tarefas antes de imprimir
    filtrarTarefas('todas');
    setTimeout(() => {
        window.print();
    }, 100);
}

// Exportar para PDF
function exportarPDF() {
    alert('Funcionalidade de exportação PDF em desenvolvimento.\n\nPor enquanto, use o botão "Imprimir" e selecione "Salvar como PDF" na janela de impressão.');
    imprimirChecklist();
}

// Adicionar botão de acesso ao checklist no menu principal
function adicionarBotaoChecklist() {
    const checklistBtn = document.createElement('li');
    checklistBtn.innerHTML = `
        <a href="checklist.html" class="checklist-link">
            <i class="fas fa-clipboard-check"></i> Checklist Leilão
        </a>
    `;

    const menu = document.querySelector('.sidebar-menu');
    if (menu) {
        menu.appendChild(checklistBtn);
    }
}

// Executar quando estiver na página principal
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', adicionarBotaoChecklist);
}
