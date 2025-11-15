/**
 * SISTEMA DE INTEGRAÇÃO COM VLIBRAS
 * TJPE - Curso de Leilão Judicial
 * Torna o conteúdo acessível em Libras via VLibras
 */

class SistemaLibras {
  constructor() {
    this.vlibrasAtivo = false;
    this.urlVlibras = 'https://vlibras.gov.br/app';
    this.idContainer = 'vlibras-container';
    this.scriptVlibras = null;
    this.configuracao = {
      autoPlay: false,
      hasWindowOption: false,
      hasOptionDescription: true,
      hasCredits: true
    };

    this.inicializar();
  }

  /**
   * Inicializa o sistema de Libras
   */
  inicializar() {
    this.verificarConfiguracao();
    this.criarContainer();
    this.configurarControles();
    this.recuperarEstado();
  }

  /**
   * Verifica configuração do VLibras
   */
  verificarConfiguracao() {
    const config = window.cursoConfig?.acessibilidade?.vlibras;
    if (config) {
      this.vlibrasAtivo = config.ativo;
      if (config.url) {
        this.urlVlibras = config.url;
      }
    }
  }

  /**
   * Cria container do VLibras
   */
  criarContainer() {
    const container = document.createElement('div');
    container.id = this.idContainer;
    container.setAttribute('aria-label', 'Intérprete de Libras VLibras');
    document.body.appendChild(container);

    if (this.vlibrasAtivo) {
      this.carregarVlibras();
    }
  }

  /**
   * Carrega script do VLibras
   */
  carregarVlibras() {
    if (this.scriptVlibras) {
      return; // Já carregado
    }

    const script = document.createElement('script');
    script.src = this.urlVlibras;
    script.async = true;
    script.onload = () => {
      console.log('VLibras carregado com sucesso');
      this.inicializarVlibras();
    };
    script.onerror = () => {
      console.error('Erro ao carregar VLibras');
      this.mostrarAviso();
    };

    document.body.appendChild(script);
    this.scriptVlibras = script;
  }

  /**
   * Inicializa VLibras
   */
  inicializarVlibras() {
    if (window.VLibras && window.VLibras.Widget) {
      try {
        new window.VLibras.Widget({
          rootElement: '#' + this.idContainer,
          autoPlay: this.configuracao.autoPlay,
          hasWindowOption: this.configuracao.hasWindowOption,
          hasOptionDescription: this.configuracao.hasOptionDescription,
          hasCredits: this.configuracao.hasCredits
        });
        this.vlibrasAtivo = true;
      } catch (erro) {
        console.error('Erro ao inicializar VLibras:', erro);
        this.mostrarAviso();
      }
    }
  }

  /**
   * Configura controles de Libras
   */
  configurarControles() {
    const toggleLibras = document.getElementById('toggle-libras');
    if (toggleLibras) {
      toggleLibras.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.ativar();
        } else {
          this.desativar();
        }
      });
    }

    // Sincroniza com narração
    document.addEventListener('narracao-iniciada', () => {
      if (this.vlibrasAtivo) {
        this.sincronizarComNarracao();
      }
    });
  }

  /**
   * Ativa Libras
   */
  ativar() {
    if (!this.vlibrasAtivo) {
      this.carregarVlibras();
    }
    localStorage.setItem('libras-ativo', 'true');
    this.atualizarInterface();
  }

  /**
   * Desativa Libras
   */
  desativar() {
    const container = document.getElementById(this.idContainer);
    if (container) {
      // Mantém container mas oculta
      container.style.display = 'none';
    }
    localStorage.setItem('libras-ativo', 'false');
    this.atualizarInterface();
  }

  /**
   * Sincroniza Libras com narração
   */
  sincronizarComNarracao() {
    const velocidadeNarracao = window.narrador?.velocidade || 1.0;

    // Ajusta velocidade de exibição do VLibras baseado na velocidade da narração
    if (window.VLibras) {
      // Aplica ajuste ao widget do VLibras
      const container = document.getElementById(this.idContainer);
      if (container) {
        container.style.opacity = '1';
      }
    }
  }

  /**
   * Recupera estado anterior
   */
  recuperarEstado() {
    const librasAnterior = localStorage.getItem('libras-ativo');
    const toggleLibras = document.getElementById('toggle-libras');

    if (toggleLibras && librasAnterior === 'true') {
      toggleLibras.checked = true;
      this.ativar();
    } else if (toggleLibras && librasAnterior === 'false') {
      toggleLibras.checked = false;
      this.desativar();
    }
  }

  /**
   * Atualiza interface
   */
  atualizarInterface() {
    const toggleLibras = document.getElementById('toggle-libras');
    if (toggleLibras) {
      const label = toggleLibras.parentElement?.querySelector('label');
      if (label) {
        label.textContent = toggleLibras.checked ? 'Libras (Ativado)' : 'Libras (Desativado)';
      }
    }
  }

  /**
   * Mostra aviso de indisponibilidade
   */
  mostrarAviso() {
    const alerta = document.createElement('div');
    alerta.className = 'alerta alerta-importante';
    alerta.innerHTML = `
      <span class="alerta-icone">⚠️</span>
      <div>
        <strong>VLibras não disponível</strong>
        <p>No momento não é possível carregar o serviço VLibras. Tente novamente mais tarde.</p>
      </div>
    `;

    const container = document.querySelector('.controles-acessibilidade');
    if (container) {
      container.appendChild(alerta);
      setTimeout(() => alerta.remove(), 5000);
    }
  }

  /**
   * Narra elemento específico em Libras
   * @param {HTMLElement} elemento
   */
  narrarElementoEmLibras(elemento) {
    if (!this.vlibrasAtivo) {
      this.ativar();
    }

    const texto = elemento.textContent;
    const evento = new CustomEvent('narracao-iniciada', {
      detail: { texto: texto }
    });
    document.dispatchEvent(evento);
  }

  /**
   * Obtém status atual
   */
  obterStatus() {
    return {
      ativo: this.vlibrasAtivo,
      carregado: !!this.scriptVlibras,
      configuracao: this.configuracao
    };
  }

  /**
   * Exporta configuração
   */
  exportarConfiguracao() {
    return {
      vlibras: {
        ativo: this.vlibrasAtivo,
        url: this.urlVlibras,
        configuracao: this.configuracao
      }
    };
  }
}

// Inicializa sistema ao carregar página
let sistemaLibras;
document.addEventListener('DOMContentLoaded', () => {
  sistemaLibras = new SistemaLibras();
  console.log('Sistema de Libras inicializado');
});

// Exporta para uso global
window.SistemaLibras = SistemaLibras;
