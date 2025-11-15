/**
 * SISTEMA DE PONTOS DE RESTAURAÇÃO
 * TJPE - Curso de Leilão Judicial
 * Gerencia backup e restauração de estados do sistema
 */

class SistemaRestauracao {
  constructor() {
    this.pontosRestauracao = [];
    this.pontoAtual = null;
    this.maxPontos = 50;
    this.arquivosMonitorizados = [
      'config.json',
      'restore-points.json'
    ];

    this.inicializar();
  }

  /**
   * Inicializa o sistema de restauração
   */
  inicializar() {
    this.carregarPontos();
    this.configurarAutoSave();
    this.configurarControles();
  }

  /**
   * Carrega pontos de restauração do localStorage
   */
  carregarPontos() {
    try {
      const dados = localStorage.getItem('sistema-pontos-restauracao');
      if (dados) {
        this.pontosRestauracao = JSON.parse(dados);
        console.log(`${this.pontosRestauracao.length} pontos de restauração carregados`);
      } else {
        this.criarPontoInicial();
      }
    } catch (erro) {
      console.error('Erro ao carregar pontos:', erro);
      this.criarPontoInicial();
    }
  }

  /**
   * Cria ponto inicial do sistema
   */
  criarPontoInicial() {
    const pontoInicial = {
      id: 1,
      data: new Date().toISOString(),
      descricao: 'Inicialização do sistema - Versão 1.0',
      autor: 'Sistema Automatizado',
      arquivos: this.arquivosMonitorizados,
      hash: this.gerarHash(),
      estado: this.capturarEstado(),
      versao: '1.0.0'
    };

    this.pontosRestauracao.push(pontoInicial);
    this.salvarPontos();
  }

  /**
   * Cria um novo ponto de restauração manual
   * @param {string} descricao - Descrição do ponto
   * @param {string} autor - Autor da criação
   */
  criarPonto(descricao = 'Ponto de restauração manual', autor = 'Admin TJPE') {
    if (this.pontosRestauracao.length >= this.maxPontos) {
      // Remove ponto mais antigo
      this.pontosRestauracao.shift();
    }

    const novoPonto = {
      id: Math.max(...this.pontosRestauracao.map(p => p.id), 0) + 1,
      data: new Date().toISOString(),
      descricao: descricao,
      autor: autor,
      arquivos: this.arquivosMonitorizados,
      hash: this.gerarHash(),
      estado: this.capturarEstado(),
      versao: this.obterVersao()
    };

    this.pontosRestauracao.push(novoPonto);
    this.pontoAtual = novoPonto;
    this.salvarPontos();

    console.log(`Ponto de restauração criado: #${novoPonto.id}`);
    return novoPonto;
  }

  /**
   * Configura auto-save periódico
   */
  configurarAutoSave() {
    // Auto-save a cada 5 minutos
    setInterval(() => {
      if (this.houveAlterações()) {
        this.criarPonto('Auto-save automático', 'Sistema');
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Verifica se houve alterações
   */
  houveAlterações() {
    if (this.pontosRestauracao.length === 0) {
      return false;
    }

    const ultimoPonto = this.pontosRestauracao[this.pontosRestauracao.length - 1];
    const hashAtual = this.gerarHash();

    return hashAtual !== ultimoPonto.hash;
  }

  /**
   * Configura controles de restauração
   */
  configurarControles() {
    // Botão de criar ponto
    const btnCriarPonto = document.getElementById('btn-criar-ponto');
    if (btnCriarPonto) {
      btnCriarPonto.addEventListener('click', () => {
        const descricao = prompt('Descrição do ponto de restauração:');
        if (descricao) {
          this.criarPonto(descricao);
          alert('Ponto criado com sucesso!');
        }
      });
    }

    // Botão de restaurar
    const btnRestaurar = document.querySelector('[data-action="restaurar"]');
    if (btnRestaurar) {
      btnRestaurar.addEventListener('click', () => {
        this.exibirSeletorPontos();
      });
    }
  }

  /**
   * Exibe seletor de pontos para restauração
   */
  exibirSeletorPontos() {
    const opcoes = this.pontosRestauracao
      .map(p => `${p.id}: ${p.descricao} (${new Date(p.data).toLocaleDateString('pt-BR')})`)
      .join('\n');

    const escolha = prompt(`Qual ponto deseja restaurar?\n\n${opcoes}\n\nDigite o ID do ponto:`, '');

    if (escolha) {
      const id = parseInt(escolha);
      this.restaurarPonto(id);
    }
  }

  /**
   * Restaura um ponto de restauração específico
   * @param {number} id - ID do ponto
   */
  restaurarPonto(id) {
    const ponto = this.pontosRestauracao.find(p => p.id === id);

    if (!ponto) {
      alert('Ponto não encontrado!');
      return;
    }

    if (!confirm(`Restaurar para: ${ponto.descricao}?\n\nIsto pode perder alterações recentes.`)) {
      return;
    }

    try {
      // Restaura estado
      this.restaurarEstado(ponto.estado);
      this.pontoAtual = ponto;

      console.log(`Sistema restaurado para ponto #${id}`);
      alert('Sistema restaurado com sucesso!');

      // Registra restauração
      this.registrarRestauracao(ponto);

      // Recarrega página
      setTimeout(() => location.reload(), 1000);
    } catch (erro) {
      console.error('Erro ao restaurar:', erro);
      alert('Erro ao restaurar o sistema.');
    }
  }

  /**
   * Captura estado atual do sistema
   */
  capturarEstado() {
    const estado = {
      timestamp: new Date().toISOString(),
      localStorage: {},
      sessionStorage: {},
      config: window.cursoConfig || null
    };

    // Captura dados do localStorage
    for (let chave in localStorage) {
      if (localStorage.hasOwnProperty(chave)) {
        try {
          estado.localStorage[chave] = localStorage.getItem(chave);
        } catch (e) {
          // Ignora erros de acesso
        }
      }
    }

    // Captura dados do sessionStorage
    for (let chave in sessionStorage) {
      if (sessionStorage.hasOwnProperty(chave)) {
        try {
          estado.sessionStorage[chave] = sessionStorage.getItem(chave);
        } catch (e) {
          // Ignora erros de acesso
        }
      }
    }

    return estado;
  }

  /**
   * Restaura estado do sistema
   * @param {Object} estado - Estado a restaurar
   */
  restaurarEstado(estado) {
    // Restaura localStorage
    if (estado.localStorage) {
      for (const [chave, valor] of Object.entries(estado.localStorage)) {
        localStorage.setItem(chave, valor);
      }
    }

    // Restaura sessionStorage
    if (estado.sessionStorage) {
      for (const [chave, valor] of Object.entries(estado.sessionStorage)) {
        sessionStorage.setItem(chave, valor);
      }
    }

    // Restaura configurações globais
    if (estado.config) {
      window.cursoConfig = estado.config;
    }
  }

  /**
   * Gera hash do estado atual
   */
  gerarHash() {
    const estado = JSON.stringify(this.capturarEstado());
    let hash = 0;

    for (let i = 0; i < estado.length; i++) {
      const char = estado.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Converte para 32-bit integer
    }

    return Math.abs(hash).toString(16);
  }

  /**
   * Obtém versão do sistema
   */
  obterVersao() {
    return window.cursoConfig?.curso?.versao || '1.0.0';
  }

  /**
   * Salva pontos no localStorage
   */
  salvarPontos() {
    try {
      localStorage.setItem('sistema-pontos-restauracao', JSON.stringify(this.pontosRestauracao));
    } catch (erro) {
      console.error('Erro ao salvar pontos:', erro);
    }
  }

  /**
   * Registra evento de restauração
   * @param {Object} ponto - Ponto restaurado
   */
  registrarRestauracao(ponto) {
    const registro = {
      tipo: 'restauracao',
      data: new Date().toISOString(),
      pontoId: ponto.id,
      descricao: ponto.descricao,
      anterior: this.pontoAtual?.id || null
    };

    let historico = JSON.parse(localStorage.getItem('historico-restauracoes') || '[]');
    historico.push(registro);

    // Mantém apenas últimos 100 registros
    if (historico.length > 100) {
      historico = historico.slice(-100);
    }

    localStorage.setItem('historico-restauracoes', JSON.stringify(historico));
  }

  /**
   * Obtém histórico de restaurações
   */
  obterHistoricoRestauracoes() {
    return JSON.parse(localStorage.getItem('historico-restauracoes') || '[]');
  }

  /**
   * Lista todos os pontos disponíveis
   */
  listarPontos() {
    return this.pontosRestauracao.map(p => ({
      id: p.id,
      descricao: p.descricao,
      data: p.data,
      autor: p.autor,
      versao: p.versao
    }));
  }

  /**
   * Obtém detalhes de um ponto específico
   * @param {number} id - ID do ponto
   */
  obterPonto(id) {
    return this.pontosRestauracao.find(p => p.id === id);
  }

  /**
   * Deleta um ponto de restauração
   * @param {number} id - ID do ponto
   */
  deletarPonto(id) {
    if (this.pontosRestauracao.length <= 1) {
      alert('Não é possível deletar o último ponto de restauração!');
      return false;
    }

    const indice = this.pontosRestauracao.findIndex(p => p.id === id);
    if (indice !== -1) {
      this.pontosRestauracao.splice(indice, 1);
      this.salvarPontos();
      return true;
    }
    return false;
  }

  /**
   * Exporta pontos para backup
   */
  exportarBackup() {
    const backup = {
      versao: '1.0.0',
      dataExportacao: new Date().toISOString(),
      pontos: this.pontosRestauracao,
      historico: this.obterHistoricoRestauracoes()
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-tjpe-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    console.log('Backup exportado');
    return backup;
  }

  /**
   * Importa backup
   * @param {File} arquivo - Arquivo de backup
   */
  async importarBackup(arquivo) {
    try {
      const conteudo = await arquivo.text();
      const backup = JSON.parse(conteudo);

      if (!backup.pontos || !Array.isArray(backup.pontos)) {
        throw new Error('Formato de backup inválido');
      }

      this.pontosRestauracao = backup.pontos;
      this.salvarPontos();

      console.log('Backup importado com sucesso');
      return true;
    } catch (erro) {
      console.error('Erro ao importar backup:', erro);
      alert('Erro ao importar backup');
      return false;
    }
  }

  /**
   * Obtém status do sistema
   */
  obterStatus() {
    return {
      pontosAtivos: this.pontosRestauracao.length,
      maxPontos: this.maxPontos,
      pontoAtual: this.pontoAtual?.id || null,
      ultimoPonto: this.pontosRestauracao[this.pontosRestauracao.length - 1] || null,
      houveAlteracoes: this.houveAlterações()
    };
  }

  /**
   * Obtém configuração exportável
   */
  exportarConfiguracao() {
    return {
      sistema: 'restauracao',
      versao: '1.0.0',
      pontos: this.pontosRestauracao.length,
      status: this.obterStatus()
    };
  }
}

// Inicializa sistema ao carregar página
let sistemaRestauracao;
document.addEventListener('DOMContentLoaded', () => {
  sistemaRestauracao = new SistemaRestauracao();
  console.log('Sistema de Restauração inicializado');
});

// Exporta para uso global
window.SistemaRestauracao = SistemaRestauracao;
