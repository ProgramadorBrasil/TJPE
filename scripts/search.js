/**
 * SISTEMA DE BUSCA SIMPLES E AVANÇADA
 * TJPE - Curso de Leilão Judicial
 * Busca completa em todos os módulos e conteúdos
 */

class SistemaBusca {
  constructor() {
    this.modulos = [];
    this.indiceGlobal = [];
    this.resultados = [];
    this.buscaAtual = '';
    this.filtrosAtivos = {
      modulo: null,
      tipo: null,
      dataInicio: null,
      dataFim: null
    };
    this.paginaAtual = 1;
    this.resultadosPorPagina = 10;

    this.inicializar();
  }

  /**
   * Inicializa o sistema de busca
   */
  inicializar() {
    this.carregarModulos();
    this.construirIndice();
    this.configurarControles();
    this.configurarAtalhos();
  }

  /**
   * Carrega todos os módulos
   */
  async carregarModulos() {
    try {
      for (let i = 1; i <= 6; i++) {
        const response = await fetch(`modules/modulo-0${i}.json`);
        if (response.ok) {
          const modulo = await response.json();
          this.modulos.push(modulo);
        }
      }
      console.log(`${this.modulos.length} módulos carregados`);
    } catch (erro) {
      console.error('Erro ao carregar módulos:', erro);
    }
  }

  /**
   * Constrói índice global de busca
   */
  construirIndice() {
    this.indiceGlobal = [];

    this.modulos.forEach((modulo) => {
      // Índia título do módulo
      this.indiceGlobal.push({
        id: `modulo-${modulo.id}`,
        tipo: 'modulo',
        modulo: modulo.id,
        titulo: modulo.titulo,
        conteudo: modulo.titulo,
        descricao: modulo.descricao || '',
        url: `#modulo-${modulo.id}`,
        prioridade: 1.5
      });

      // Indexa seções
      modulo.secoes?.forEach((secao, indiceSecao) => {
        this.indiceGlobal.push({
          id: `secao-${modulo.id}-${indiceSecao}`,
          tipo: 'secao',
          modulo: modulo.id,
          titulo: secao.titulo,
          conteudo: secao.titulo,
          descricao: secao.descricao || '',
          url: `#modulo-${modulo.id}`,
          prioridade: 1.2
        });

        // Indexa tópicos
        secao.topicos?.forEach((topico, indiceTopico) => {
          this.indiceGlobal.push({
            id: `topico-${modulo.id}-${indiceSecao}-${indiceTopico}`,
            tipo: 'topico',
            modulo: modulo.id,
            titulo: topico.titulo,
            conteudo: topico.conteudo,
            descricao: topico.descricao || '',
            url: `#modulo-${modulo.id}`,
            prioridade: 1.0
          });
        });
      });

      // Indexa alertas críticos
      modulo.alertasCriticos?.forEach((alerta, indiceAlerta) => {
        this.indiceGlobal.push({
          id: `alerta-${modulo.id}-${indiceAlerta}`,
          tipo: 'alerta',
          modulo: modulo.id,
          titulo: 'Alerta Crítico',
          conteudo: alerta.titulo || alerta.conteudo,
          descricao: alerta.conteudo,
          url: `#modulo-${modulo.id}`,
          prioridade: 1.3
        });
      });
    });

    console.log(`Índice global construído: ${this.indiceGlobal.length} itens`);
  }

  /**
   * Configura controles de busca
   */
  configurarControles() {
    const campoBusca = document.getElementById('campo-busca');
    if (campoBusca) {
      campoBusca.addEventListener('input', (e) => this.buscarSimples(e.target.value));
      campoBusca.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.buscarSimples(e.target.value);
        }
      });
    }

    // Filtros avançados
    const moduloFiltro = document.getElementById('filtro-modulo');
    if (moduloFiltro) {
      moduloFiltro.addEventListener('change', (e) => {
        this.filtrosAtivos.modulo = e.target.value || null;
        this.aplicarFiltros();
      });
    }

    const tipoFiltro = document.getElementById('filtro-tipo');
    if (tipoFiltro) {
      tipoFiltro.addEventListener('change', (e) => {
        this.filtrosAtivos.tipo = e.target.value || null;
        this.aplicarFiltros();
      });
    }
  }

  /**
   * Configura atalhos de teclado
   */
  configurarAtalhos() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + F para busca avançada
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const campoBusca = document.getElementById('campo-busca');
        if (campoBusca) {
          campoBusca.focus();
        }
      }
    });
  }

  /**
   * Realiza busca simples
   * @param {string} termo - Termo de busca
   */
  buscarSimples(termo) {
    this.buscaAtual = termo;
    this.paginaAtual = 1;

    if (!termo || termo.trim() === '') {
      this.resultados = [];
      this.exibirResultados();
      return;
    }

    const termoLower = termo.toLowerCase();
    const termosChave = termo.split(/\s+/).filter(t => t.length > 2);

    this.resultados = this.indiceGlobal
      .filter(item => {
        const textoItem = `${item.titulo} ${item.conteudo} ${item.descricao}`.toLowerCase();

        // Busca por correspondência exata primeiro
        if (textoItem.includes(termoLower)) {
          return true;
        }

        // Depois busca por termos individuais
        return termosChave.some(termo => textoItem.includes(termo));
      })
      .sort((a, b) => {
        // Ordena por prioridade e relevância
        const relevanciaA = this.calcularRelevancia(a, termo);
        const relevanciaB = this.calcularRelevancia(b, termo);
        return (relevanciaB * b.prioridade) - (relevanciaA * a.prioridade);
      })
      .slice(0, 50); // Limita a 50 resultados

    this.exibirResultados();
  }

  /**
   * Realiza busca avançada com múltiplos critérios
   */
  buscarAvancada(opcoes = {}) {
    const {
      termo = '',
      modulo = null,
      tipo = null,
      dataInicio = null,
      dataFim = null,
      operadorLogico = 'E' // 'E' ou 'OU'
    } = opcoes;

    this.buscaAtual = termo;
    this.paginaAtual = 1;

    let resultados = [...this.indiceGlobal];

    // Filtra por termo
    if (termo) {
      const termoLower = termo.toLowerCase();
      resultados = resultados.filter(item => {
        const textoItem = `${item.titulo} ${item.conteudo} ${item.descricao}`.toLowerCase();
        return textoItem.includes(termoLower);
      });
    }

    // Filtra por módulo
    if (modulo) {
      resultados = resultados.filter(item => item.modulo === parseInt(modulo));
    }

    // Filtra por tipo
    if (tipo) {
      resultados = resultados.filter(item => item.tipo === tipo);
    }

    this.resultados = resultados.slice(0, 50);
    this.exibirResultados();
    return this.resultados;
  }

  /**
   * Aplica filtros ativos
   */
  aplicarFiltros() {
    this.buscarAvancada({
      termo: this.buscaAtual,
      modulo: this.filtrosAtivos.modulo,
      tipo: this.filtrosAtivos.tipo
    });
  }

  /**
   * Calcula relevância de um resultado
   * @param {Object} item - Item a avaliar
   * @param {string} termo - Termo de busca
   */
  calcularRelevancia(item, termo) {
    const termoLower = termo.toLowerCase();
    let pontos = 0;

    // Encontrado no título
    if (item.titulo.toLowerCase().includes(termoLower)) {
      pontos += 3;
    }

    // Encontrado na descrição
    if (item.descricao.toLowerCase().includes(termoLower)) {
      pontos += 2;
    }

    // Encontrado no conteúdo
    if (item.conteudo.toLowerCase().includes(termoLower)) {
      pontos += 1;
    }

    // Correspondência exata
    if (item.titulo.toLowerCase() === termoLower) {
      pontos += 2;
    }

    return pontos;
  }

  /**
   * Exibe resultados da busca
   */
  exibirResultados() {
    const containerResultados = document.getElementById('resultados-busca');
    if (!containerResultados) return;

    if (this.resultados.length === 0) {
      containerResultados.innerHTML = `
        <div class="alerta alerta-info">
          <span class="alerta-icone">🔍</span>
          <div>
            <strong>Nenhum resultado encontrado</strong>
            <p>Tente refinar sua busca ou usar termos diferentes.</p>
          </div>
        </div>
      `;
      return;
    }

    const resultadosPaginados = this.obterResultadosPaginados();
    let html = '<div class="resultados-lista">';

    resultadosPaginados.forEach(resultado => {
      const tipoIcones = {
        modulo: '📚',
        secao: '📖',
        topico: '📄',
        alerta: '⚠️'
      };

      html += `
        <div class="resultado-item">
          <div class="resultado-header">
            <span class="resultado-icone">${tipoIcones[resultado.tipo] || '📌'}</span>
            <h4 class="resultado-titulo">${this.destacarTermo(resultado.titulo)}</h4>
          </div>
          <div class="resultado-meta">
            <span class="resultado-modulo">Módulo ${resultado.modulo}</span>
            <span class="resultado-tipo">${resultado.tipo}</span>
          </div>
          <p class="resultado-descricao">${this.destacarTermo(resultado.descricao.substring(0, 150))}</p>
          <a href="${resultado.url}" class="resultado-link">Ver completo →</a>
        </div>
      `;
    });

    html += '</div>';

    // Adiciona paginação
    if (this.totalPaginas > 1) {
      html += this.gerarPaginacao();
    }

    containerResultados.innerHTML = html;
  }

  /**
   * Obtém resultados da página atual
   */
  obterResultadosPaginados() {
    const inicio = (this.paginaAtual - 1) * this.resultadosPorPagina;
    const fim = inicio + this.resultadosPorPagina;
    return this.resultados.slice(inicio, fim);
  }

  /**
   * Calcula total de páginas
   */
  get totalPaginas() {
    return Math.ceil(this.resultados.length / this.resultadosPorPagina);
  }

  /**
   * Gera HTML de paginação
   */
  gerarPaginacao() {
    let html = '<div class="paginacao">';

    if (this.paginaAtual > 1) {
      html += `<button onclick="sistemaBusca.irParaPagina(${this.paginaAtual - 1})" class="btn btn-primary">← Anterior</button>`;
    }

    for (let i = 1; i <= this.totalPaginas; i++) {
      if (i === this.paginaAtual) {
        html += `<span class="pagina-ativa">${i}</span>`;
      } else if (i <= this.paginaAtual + 2 && i >= this.paginaAtual - 2) {
        html += `<button onclick="sistemaBusca.irParaPagina(${i})" class="btn">${i}</button>`;
      }
    }

    if (this.paginaAtual < this.totalPaginas) {
      html += `<button onclick="sistemaBusca.irParaPagina(${this.paginaAtual + 1})" class="btn btn-primary">Próxima →</button>`;
    }

    html += '</div>';
    return html;
  }

  /**
   * Navega para uma página específica
   * @param {number} pagina - Número da página
   */
  irParaPagina(pagina) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
      this.exibirResultados();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Destaca termo de busca nos resultados
   * @param {string} texto - Texto a destaca
   */
  destacarTermo(texto) {
    if (!this.buscaAtual) return texto;

    const regex = new RegExp(`(${this.buscaAtual})`, 'gi');
    return texto.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Obtém sugestões de busca
   * @param {string} termo - Termo parcial
   */
  obterSugestoes(termo) {
    if (!termo || termo.length < 2) {
      return [];
    }

    const termoLower = termo.toLowerCase();
    const sugestoes = new Set();

    this.indiceGlobal.forEach(item => {
      if (item.titulo.toLowerCase().includes(termoLower)) {
        sugestoes.add(item.titulo);
      }
    });

    return Array.from(sugestoes).slice(0, 5);
  }

  /**
   * Exporta configuração de busca
   */
  exportarConfiguracao() {
    return {
      resultados: this.resultados.length,
      buscaAtual: this.buscaAtual,
      filtros: this.filtrosAtivos,
      indiceSize: this.indiceGlobal.length
    };
  }
}

// Inicializa sistema ao carregar página
let sistemaBusca;
document.addEventListener('DOMContentLoaded', () => {
  sistemaBusca = new SistemaBusca();
  console.log('Sistema de Busca inicializado');
});

// Exporta para uso global
window.SistemaBusca = SistemaBusca;
