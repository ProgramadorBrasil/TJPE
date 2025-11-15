/**
 * SISTEMA DE NARRAÇÃO COM VOZ FEMININA NATURAL
 * TJPE - Curso de Leilão Judicial
 * Utiliza Web Speech API para Text-to-Speech
 */

class SistemaNarrador {
  constructor() {
    this.synth = window.speechSynthesis;
    this.vozAtual = null;
    this.velocidade = 1.0;
    this.ativo = false;
    this.textoAtual = '';
    this.utterance = null;

    this.inicializar();
  }

  /**
   * Inicializa o sistema de narração
   */
  inicializar() {
    // Aguarda carregamento das vozes
    if (this.synth.getVoices().length > 0) {
      this.carregarVozes();
    } else {
      this.synth.addEventListener('voiceschanged', () => {
        this.carregarVozes();
      });
    }

    // Configura controles
    this.configurarControles();
  }

  /**
   * Carrega vozes disponíveis e seleciona voz feminina em português
   */
  carregarVozes() {
    const vozes = this.synth.getVoices();

    // Prioridades de vozes femininas em português
    const prioridades = [
      'Microsoft Maria - Portuguese (Brazil)',
      'Google português do Brasil',
      'Luciana', // Voz feminina iOS
      'Fernanda', // Voz feminina macOS
      'pt-BR', // Qualquer voz pt-BR
      'pt' // Qualquer voz português
    ];

    // Busca melhor voz disponível
    for (const prioridade of prioridades) {
      this.vozAtual = vozes.find(voz =>
        voz.name.includes(prioridade) ||
        voz.lang.includes(prioridade)
      );
      if (this.vozAtual) break;
    }

    // Fallback: primeira voz em português
    if (!this.vozAtual) {
      this.vozAtual = vozes.find(voz => voz.lang.startsWith('pt'));
    }

    console.log('Voz selecionada:', this.vozAtual?.name || 'Voz padrão');
  }

  /**
   * Configura controles de narração
   */
  configurarControles() {
    // Botão de narrar/pausar
    const btnNarrar = document.getElementById('btn-narrar');
    if (btnNarrar) {
      btnNarrar.addEventListener('click', () => this.toggleNarracao());
    }

    // Botão de parar
    const btnParar = document.getElementById('btn-parar-narracao');
    if (btnParar) {
      btnParar.addEventListener('click', () => this.parar());
    }

    // Controle de velocidade
    const selectVelocidade = document.getElementById('narrador-velocidade');
    if (selectVelocidade) {
      selectVelocidade.addEventListener('change', (e) => {
        this.velocidade = parseFloat(e.target.value);
        if (this.ativo) {
          this.reiniciar();
        }
      });
    }

    // Ativar/desativar sistema
    const toggleNarrador = document.getElementById('toggle-narrador');
    if (toggleNarrador) {
      toggleNarrador.addEventListener('change', (e) => {
        if (!e.target.checked && this.ativo) {
          this.parar();
        }
      });
    }
  }

  /**
   * Inicia ou retoma narração
   * @param {string} texto - Texto para narrar (opcional)
   */
  narrar(texto = null) {
    // Verifica se sistema está ativado
    const toggleNarrador = document.getElementById('toggle-narrador');
    if (toggleNarrador && !toggleNarrador.checked) {
      alert('Por favor, ative o sistema de narração primeiro.');
      return;
    }

    // Se está pausado, retoma
    if (this.synth.paused) {
      this.synth.resume();
      this.ativo = true;
      this.atualizarInterface();
      return;
    }

    // Se já está narrando, pausa
    if (this.synth.speaking) {
      this.synth.pause();
      this.ativo = false;
      this.atualizarInterface();
      return;
    }

    // Obtém texto para narrar
    if (texto) {
      this.textoAtual = texto;
    } else {
      this.textoAtual = this.obterTextoConteudo();
    }

    if (!this.textoAtual || this.textoAtual.trim() === '') {
      alert('Nenhum texto encontrado para narrar.');
      return;
    }

    // Limpa e prepara texto
    this.textoAtual = this.prepararTexto(this.textoAtual);

    // Cria utterance
    this.utterance = new SpeechSynthesisUtterance(this.textoAtual);
    this.utterance.voice = this.vozAtual;
    this.utterance.rate = this.velocidade;
    this.utterance.pitch = 1.0;
    this.utterance.volume = 1.0;
    this.utterance.lang = 'pt-BR';

    // Eventos
    this.utterance.onstart = () => {
      this.ativo = true;
      this.atualizarInterface();
      this.mostrarNarradorContainer();
    };

    this.utterance.onend = () => {
      this.ativo = false;
      this.atualizarInterface();
    };

    this.utterance.onerror = (erro) => {
      console.error('Erro na narração:', erro);
      this.ativo = false;
      this.atualizarInterface();
    };

    // Inicia narração
    this.synth.speak(this.utterance);
  }

  /**
   * Pausa ou retoma narração
   */
  toggleNarracao() {
    if (this.synth.speaking) {
      if (this.synth.paused) {
        this.synth.resume();
        this.ativo = true;
      } else {
        this.synth.pause();
        this.ativo = false;
      }
      this.atualizarInterface();
    } else {
      this.narrar();
    }
  }

  /**
   * Para completamente a narração
   */
  parar() {
    this.synth.cancel();
    this.ativo = false;
    this.textoAtual = '';
    this.atualizarInterface();
    this.ocultarNarradorContainer();
  }

  /**
   * Reinicia narração com novas configurações
   */
  reiniciar() {
    const textoTemp = this.textoAtual;
    this.parar();
    setTimeout(() => {
      this.narrar(textoTemp);
    }, 100);
  }

  /**
   * Obtém texto do conteúdo atual
   */
  obterTextoConteudo() {
    const conteudoPrincipal = document.querySelector('.modulo-conteudo');
    if (!conteudoPrincipal) return '';

    // Remove elementos que não devem ser narrados
    const clone = conteudoPrincipal.cloneNode(true);
    const elementosRemover = clone.querySelectorAll('button, .btn, script, style, .narrador-container');
    elementosRemover.forEach(el => el.remove());

    return clone.textContent;
  }

  /**
   * Prepara texto para narração
   */
  prepararTexto(texto) {
    // Remove múltiplos espaços
    texto = texto.replace(/\s+/g, ' ');

    // Remove quebras de linha excessivas
    texto = texto.replace(/\n+/g, '. ');

    // Substitui abreviações comuns
    const substituicoes = {
      'Art.': 'Artigo',
      'arts.': 'artigos',
      'CPC': 'Código de Processo Civil',
      'CTN': 'Código Tributário Nacional',
      'TJPE': 'Tribunal de Justiça de Pernambuco',
      'STJ': 'Superior Tribunal de Justiça',
      'CNJ': 'Conselho Nacional de Justiça',
      'IPTU': 'I P T U',
      'ITBI': 'I T B I',
      'R$': 'reais',
      '§': 'parágrafo',
      'Nº': 'número',
      'nº': 'número'
    };

    for (const [abrev, completo] of Object.entries(substituicoes)) {
      const regex = new RegExp(abrev.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      texto = texto.replace(regex, completo);
    }

    // Trim e retorno
    return texto.trim();
  }

  /**
   * Atualiza interface dos controles
   */
  atualizarInterface() {
    const btnNarrar = document.getElementById('btn-narrar');
    const iconeBtnNarrar = btnNarrar?.querySelector('.narrador-icone');

    if (btnNarrar && iconeBtnNarrar) {
      if (this.ativo) {
        iconeBtnNarrar.textContent = '⏸️';
        btnNarrar.querySelector('.narrador-texto')?.remove();
        const texto = document.createElement('span');
        texto.className = 'narrador-texto';
        texto.textContent = 'Pausar';
        btnNarrar.appendChild(texto);
      } else if (this.synth.paused) {
        iconeBtnNarrar.textContent = '▶️';
        btnNarrar.querySelector('.narrador-texto')?.remove();
        const texto = document.createElement('span');
        texto.className = 'narrador-texto';
        texto.textContent = 'Retomar';
        btnNarrar.appendChild(texto);
      } else {
        iconeBtnNarrar.textContent = '🔊';
        btnNarrar.querySelector('.narrador-texto')?.remove();
        const texto = document.createElement('span');
        texto.className = 'narrador-texto';
        texto.textContent = 'Narrar';
        btnNarrar.appendChild(texto);
      }
    }
  }

  /**
   * Mostra container do narrador
   */
  mostrarNarradorContainer() {
    const container = document.getElementById('narrador-container');
    if (container) {
      container.classList.add('ativo');

      // Atualiza texto exibido
      const textoDisplay = container.querySelector('.narrador-texto');
      if (textoDisplay) {
        textoDisplay.textContent = this.textoAtual.substring(0, 200) + '...';
      }
    }
  }

  /**
   * Oculta container do narrador
   */
  ocultarNarradorContainer() {
    const container = document.getElementById('narrador-container');
    if (container) {
      container.classList.remove('ativo');
    }
  }

  /**
   * Narra um elemento específico
   * @param {HTMLElement} elemento
   */
  narrarElemento(elemento) {
    const texto = elemento.textContent;
    this.narrar(texto);
  }
}

// Inicializa sistema ao carregar página
let narrador;
document.addEventListener('DOMContentLoaded', () => {
  narrador = new SistemaNarrador();
  console.log('Sistema de Narração inicializado');
});

// Exporta para uso global
window.SistemaNarrador = SistemaNarrador;
