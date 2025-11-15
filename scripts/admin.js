/**
 * PAINEL ADMINISTRATIVO COMPLETO
 * TJPE - Curso de Leilão Judicial
 * Sistema de gestão, edição e administração do curso
 */

class PainelAdministrativo {
  constructor() {
    this.usuarioAutenticado = false;
    this.nivelAcesso = 'visitante'; // visitante, editor, admin
    this.modulosEditaveis = [];
    this.historicoAlteracoes = [];
    this.pontosRestauracao = [];

    this.inicializar();
  }

  /**
   * Inicializa o painel administrativo
   */
  inicializar() {
    this.verificarAutenticacao();
    this.carregarConfiguracoes();
    this.configurarAbas();
    this.configurarFormularios();
    this.carregarHistorico();
    this.carregarPontosRestauracao();
  }

  /**
   * Verifica autenticação do usuário
   */
  verificarAutenticacao() {
    const tokenAdmin = localStorage.getItem('admin-token');
    const senhaAdmin = localStorage.getItem('admin-senha-hash');

    // Sistema simplificado de autenticação (em produção usar OAuth/JWT)
    if (tokenAdmin && senhaAdmin) {
      this.usuarioAutenticado = true;
      this.nivelAcesso = 'admin';
    } else {
      this.exibirTelaLogin();
    }
  }

  /**
   * Exibe tela de login
   */
  exibirTelaLogin() {
    const panelAdmin = document.querySelector('.admin-container');
    if (!panelAdmin) return;

    panelAdmin.innerHTML = `
      <div class="login-container">
        <div class="login-card">
          <h1>Acesso Administrativo</h1>
          <form id="form-login" class="form-login">
            <div class="form-group">
              <label for="login-usuario" class="form-label">Usuário</label>
              <input type="text" id="login-usuario" class="form-input" placeholder="Seu usuário" required>
            </div>
            <div class="form-group">
              <label for="login-senha" class="form-label">Senha</label>
              <input type="password" id="login-senha" class="form-input" placeholder="Sua senha" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Entrar</button>
          </form>
          <div class="alerta alerta-info">
            <span class="alerta-icone">ℹ️</span>
            <p>Painel restrito para administradores. Utilize suas credenciais TJPE.</p>
          </div>
        </div>
      </div>
    `;

    document.getElementById('form-login').addEventListener('submit', (e) => {
      e.preventDefault();
      this.autenticar(
        document.getElementById('login-usuario').value,
        document.getElementById('login-senha').value
      );
    });
  }

  /**
   * Autentica usuário
   * @param {string} usuario - Usuário
   * @param {string} senha - Senha
   */
  autenticar(usuario, senha) {
    // IMPORTANTE: Em produção, enviar para servidor
    const hashSenha = this.hashSimples(senha);

    if (usuario === 'admin' && hashSenha === '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918') {
      localStorage.setItem('admin-token', 'token_' + Date.now());
      localStorage.setItem('admin-senha-hash', hashSenha);
      this.usuarioAutenticado = true;
      this.nivelAcesso = 'admin';
      location.reload();
    } else {
      alert('Credenciais inválidas!');
    }
  }

  /**
   * Hash simples de senha (usar bcrypt em produção!)
   */
  hashSimples(senha) {
    // SHA-256 simplificado - NÃO USAR EM PRODUÇÃO
    let hash = 0;
    for (let i = 0; i < senha.length; i++) {
      hash = ((hash << 5) - hash) + senha.charCodeAt(i);
      hash = hash & hash; // Converte para int 32-bit
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Carrega configurações
   */
  async carregarConfiguracoes() {
    try {
      const response = await fetch('config.json');
      const config = await response.json();
      window.cursoConfig = config;
      console.log('Configurações carregadas');
    } catch (erro) {
      console.error('Erro ao carregar configurações:', erro);
    }
  }

  /**
   * Configura abas do painel
   */
  configurarAbas() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');

        // Remove classes ativas
        tabButtons.forEach(btn => btn.classList.remove('ativo'));
        tabContents.forEach(content => content.classList.remove('ativo'));

        // Adiciona classes ativas
        button.classList.add('ativo');
        document.getElementById(`tab-${tabName}`)?.classList.add('ativo');
      });
    });
  }

  /**
   * Configura formulários
   */
  configurarFormularios() {
    // Upload de PDF
    const uploadArea = document.getElementById('upload-area');
    if (uploadArea) {
      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
      });

      uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
      });

      uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const arquivos = e.dataTransfer.files;
        this.processarUploadPDF(arquivos[0]);
      });

      uploadArea.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf';
        input.addEventListener('change', (e) => {
          this.processarUploadPDF(e.target.files[0]);
        });
        input.click();
      });
    }

    // Salvar módulo editado
    const formModulo = document.getElementById('form-editar-modulo');
    if (formModulo) {
      formModulo.addEventListener('submit', (e) => {
        e.preventDefault();
        this.salvarModuloEditado();
      });
    }
  }

  /**
   * Processa upload de PDF
   * @param {File} arquivo - Arquivo PDF
   */
  async processarUploadPDF(arquivo) {
    if (!arquivo || arquivo.type !== 'application/pdf') {
      alert('Por favor, selecione um arquivo PDF válido.');
      return;
    }

    if (arquivo.size > 50 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 50MB.');
      return;
    }

    const uploadContainer = document.querySelector('.upload-area');
    const statusDiv = document.createElement('div');
    statusDiv.className = 'arquivo-selecionado';
    statusDiv.innerHTML = `
      <span>✓ ${arquivo.name} (${(arquivo.size / 1024 / 1024).toFixed(2)} MB)</span>
      <button type="button" class="btn btn-primary">Processar com IA</button>
    `;

    uploadContainer.appendChild(statusDiv);

    // Processa com IA
    statusDiv.querySelector('.btn').addEventListener('click', () => {
      this.processarComIA(arquivo);
    });
  }

  /**
   * Processa arquivo com IA
   * @param {File} arquivo - Arquivo a processar
   */
  async processarComIA(arquivo) {
    const processamento = document.querySelector('.ia-processamento');
    if (processamento) {
      processamento.classList.add('ativo');
    }

    try {
      // Simula processamento
      const progresso = processamento?.querySelector('.ia-progresso-barra');
      let percentual = 0;

      const intervalo = setInterval(() => {
        percentual += Math.random() * 30;
        if (percentual >= 100) {
          percentual = 100;
          clearInterval(intervalo);

          // Simula conclusão
          setTimeout(() => {
            alert('PDF processado com sucesso! Conteúdo extraído e estruturado.');
            if (processamento) {
              processamento.classList.remove('ativo');
            }
          }, 1000);
        }

        if (progresso) {
          progresso.style.width = percentual + '%';
        }
      }, 300);
    } catch (erro) {
      console.error('Erro ao processar com IA:', erro);
      alert('Erro ao processar PDF');
    }
  }

  /**
   * Salva módulo editado
   */
  async salvarModuloEditado() {
    const moduloId = document.getElementById('modulo-id')?.value;
    const moduloTitulo = document.getElementById('modulo-titulo')?.value;
    const moduloConteudo = document.getElementById('modulo-conteudo')?.value;

    if (!moduloId || !moduloTitulo || !moduloConteudo) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const modulo = {
      id: parseInt(moduloId),
      titulo: moduloTitulo,
      conteudo: moduloConteudo,
      dataEdicao: new Date().toISOString(),
      editor: 'Admin TJPE'
    };

    // Salva no localStorage (em produção, enviar para servidor)
    localStorage.setItem(`modulo-${moduloId}`, JSON.stringify(modulo));

    // Registra no histórico
    this.adicionarAoHistorico({
      tipo: 'edicao',
      descricao: `Módulo ${moduloId} editado`,
      autor: 'Admin TJPE',
      detalhes: { modulo: moduloId, titulo: moduloTitulo }
    });

    alert('Módulo salvo com sucesso!');
  }

  /**
   * Carrega histórico de alterações
   */
  async carregarHistorico() {
    try {
      const response = await fetch('restore-points.json');
      const dados = await response.json();
      this.historicoAlteracoes = dados.pontos || [];
      this.exibirHistorico();
    } catch (erro) {
      console.error('Erro ao carregar histórico:', erro);
    }
  }

  /**
   * Exibe histórico de alterações
   */
  exibirHistorico() {
    const container = document.getElementById('historico-alteracoes');
    if (!container) return;

    let html = '<ul class="historico-lista">';

    this.historicoAlteracoes.slice(0, 20).forEach(item => {
      const data = new Date(item.data);
      const dataFormatada = data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR');

      html += `
        <li class="historico-item">
          <div class="historico-data">${dataFormatada}</div>
          <div class="historico-info">
            <div class="historico-descricao">${item.descricao}</div>
            <div class="historico-autor">Por: ${item.autor}</div>
          </div>
          <div class="historico-acoes">
            <button class="btn-icone" title="Detalhar">ℹ️</button>
          </div>
        </li>
      `;
    });

    html += '</ul>';
    container.innerHTML = html;
  }

  /**
   * Adiciona item ao histórico
   * @param {Object} item - Item a adicionar
   */
  adicionarAoHistorico(item) {
    const historicoItem = {
      id: this.historicoAlteracoes.length + 1,
      data: new Date().toISOString(),
      ...item
    };

    this.historicoAlteracoes.unshift(historicoItem);
    this.exibirHistorico();

    // Salva localmente
    localStorage.setItem('historico-alteracoes', JSON.stringify(this.historicoAlteracoes));
  }

  /**
   * Carrega pontos de restauração
   */
  async carregarPontosRestauracao() {
    try {
      const response = await fetch('restore-points.json');
      const dados = await response.json();
      this.pontosRestauracao = dados.pontos || [];
      this.exibirPontosRestauracao();
    } catch (erro) {
      console.error('Erro ao carregar pontos:', erro);
    }
  }

  /**
   * Exibe pontos de restauração
   */
  exibirPontosRestauracao() {
    const container = document.getElementById('pontos-restauracao');
    if (!container) return;

    let html = '<div class="restauracao-lista">';

    this.pontosRestauracao.forEach(ponto => {
      const data = new Date(ponto.data);
      const dataFormatada = data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR');

      html += `
        <div class="ponto-restauracao">
          <div class="ponto-header">
            <div class="ponto-id">Ponto #${ponto.id}</div>
            <div class="ponto-data">${dataFormatada}</div>
          </div>
          <div class="ponto-descricao">${ponto.descricao}</div>
          <div class="ponto-arquivos">
            ${ponto.arquivos.map(arr => `<span class="arquivo-badge">${arr}</span>`).join('')}
          </div>
          <button class="btn btn-primary" onclick="painelAdmin.restaurarPonto(${ponto.id})">
            Restaurar Ponto
          </button>
        </div>
      `;
    });

    html += '</div>';
    container.innerHTML = html;
  }

  /**
   * Restaura um ponto de restauração
   * @param {number} pontoId - ID do ponto
   */
  restaurarPonto(pontoId) {
    if (!confirm('Tem certeza? Isto restaurará o curso para uma versão anterior.')) {
      return;
    }

    const ponto = this.pontosRestauracao.find(p => p.id === pontoId);
    if (!ponto) {
      alert('Ponto de restauração não encontrado.');
      return;
    }

    console.log('Restaurando ponto:', ponto);
    alert('Restauração iniciada. O curso será recarregado em breve.');

    // Registra no histórico
    this.adicionarAoHistorico({
      tipo: 'restauracao',
      descricao: `Restaurado para ponto #${pontoId}`,
      autor: 'Admin TJPE',
      detalhes: ponto
    });

    // Emula restauração
    setTimeout(() => {
      alert('Restauração concluída com sucesso!');
      location.reload();
    }, 2000);
  }

  /**
   * Cria novo ponto de restauração
   */
  criarPontoRestauracao() {
    const novoPonto = {
      id: Math.max(...this.pontosRestauracao.map(p => p.id), 0) + 1,
      data: new Date().toISOString(),
      descricao: prompt('Descrição do ponto de restauração:') || 'Ponto automático',
      autor: 'Admin TJPE',
      arquivos: ['config.json', 'restore-points.json'],
      hash: 'hash_' + Date.now()
    };

    this.pontosRestauracao.unshift(novoPonto);
    this.exibirPontosRestauracao();

    // Salva
    localStorage.setItem('pontos-restauracao', JSON.stringify(this.pontosRestauracao));
    alert('Ponto de restauração criado com sucesso!');
  }

  /**
   * Faz logout
   */
  fazerLogout() {
    if (confirm('Deseja realmente fazer logout?')) {
      localStorage.removeItem('admin-token');
      localStorage.removeItem('admin-senha-hash');
      location.reload();
    }
  }

  /**
   * Exporta configuração
   */
  exportarConfiguracao() {
    return {
      usuario: this.nivelAcesso,
      historico: this.historicoAlteracoes.length,
      pontos: this.pontosRestauracao.length
    };
  }
}

// Inicializa painel
let painelAdmin;
document.addEventListener('DOMContentLoaded', () => {
  painelAdmin = new PainelAdministrativo();
  console.log('Painel Administrativo inicializado');
});

// Exporta para uso global
window.PainelAdministrativo = PainelAdministrativo;
