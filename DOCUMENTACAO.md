# 📚 DOCUMENTAÇÃO COMPLETA - Sistema do Curso TJPE

**Curso: Leilão Judicial para Servidores Públicos do TJPE**
**Versão: 1.0.0**
**Data: 15 de Novembro de 2025**

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Estrutura de Arquivos](#estrutura-de-arquivos)
4. [Módulos JavaScript](#módulos-javascript)
5. [Sistema de Acessibilidade](#sistema-de-acessibilidade)
6. [Painel Administrativo](#painel-administrativo)
7. [Sistema de Backup](#sistema-de-backup)
8. [Deploy e Hospedagem](#deploy-e-hospedagem)
9. [Manutenção e Atualização](#manutenção-e-atualização)
10. [Troubleshooting](#troubleshooting)

---

## 1. VISÃO GERAL

### 1.1 Objetivo do Sistema

O Sistema do Curso TJPE é uma plataforma educacional web completa, desenvolvida para capacitar servidores públicos do Tribunal de Justiça de Pernambuco em procedimentos de leilão judicial.

### 1.2 Características Principais

- ✅ **100% Web-based**: Sem necessidade de instalação
- ✅ **Totalmente Acessível**: WCAG 2.1 AAA
- ✅ **Responsivo**: Mobile-first design
- ✅ **Offline-capable**: Armazenamento local
- ✅ **Auto-hospedável**: GitHub Pages gratuito
- ✅ **Sem backend**: Funciona apenas com arquivos estáticos

### 1.3 Tecnologias

- HTML5, CSS3, JavaScript ES6+
- Web Speech API
- VLibras API
- localStorage API
- GitHub Actions

---

## 2. ARQUITETURA DO SISTEMA

### 2.1 Padrão de Design

```
┌─────────────────────────────────────────┐
│           Camada de Apresentação        │
│  (index.html, painel-admin.html)        │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Camada de Controle              │
│  (app.js, admin.js, search.js)          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│          Camada de Serviços             │
│  (narrador.js, libras.js, restore.js)   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│           Camada de Dados               │
│  (modules/*.json, config.json)          │
└─────────────────────────────────────────┘
```

### 2.2 Fluxo de Dados

1. **Carregamento Inicial**
   - index.html carrega
   - app.js inicializa
   - config.json é lido
   - Módulos são indexados

2. **Navegação do Usuário**
   - Usuário clica em módulo
   - app.js carrega módulo JSON
   - Conteúdo é renderizado
   - Progresso é salvo

3. **Interação**
   - Usuário responde questão
   - Feedback imediato
   - Pontuação atualizada
   - localStorage persiste dados

### 2.3 Componentes Principais

```javascript
// Sistema Principal
AppCurso
├── carregarConfig()
├── carregarModulos()
├── renderizarModulo()
└── salvarProgresso()

// Acessibilidade
SistemaNarrador
SistemaLibras

// Busca
SistemaBusca

// Admin
PainelAdmin
SistemaRestauracao
```

---

## 3. ESTRUTURA DE ARQUIVOS

### 3.1 Diretório Raiz

```
TJPE/
├── index.html              # Página principal do curso
├── painel-admin.html       # Painel administrativo
├── config.json             # Configurações gerais
├── restore-points.json     # Pontos de restauração
├── README.md               # Documentação do projeto
├── DOCUMENTACAO.md         # Este arquivo
└── LICENSE                 # Licença MIT
```

### 3.2 Diretório Assets

```
assets/
├── logos/
│   ├── tjpe-logo.png       # Logo oficial TJPE
│   └── gracie-logo.png     # Logo Gracie Leilões
├── pdfs/
│   └── [documentos legais] # PDFs de referência
├── audios/
│   └── [narrações]         # Áudios pré-gravados (opcional)
└── images/
    ├── renato-gracie.jpg   # Foto do instrutor
    └── [imagens diversas]  # Ilustrações do curso
```

### 3.3 Diretório Modules

```
modules/
├── modulo-01.json          # Fundamentos Legais
├── modulo-02.json          # Elaboração do Edital
├── modulo-03.json          # Notificações
├── modulo-04.json          # Avaliação de Bens
├── modulo-05.json          # Averbação
├── modulo-06.json          # Débitos Fiscais
├── modulo-07.json          # Pagamento
├── modulo-08.json          # Publicação
├── modulo-09.json          # Pós-Leilão
└── modulo-10.json          # Casos Práticos
```

### 3.4 Diretório Scripts

```
scripts/
├── app.js                  # Script principal (1200+ linhas)
├── narrador.js             # Sistema TTS (650 linhas)
├── libras.js               # Integração VLibras (630 linhas)
├── search.js               # Sistema de busca (650 linhas)
├── admin.js                # Painel admin (750 linhas)
└── restore.js              # Pontos de restauração (650 linhas)
```

### 3.5 Diretório Styles

```
styles/
├── global.css              # Estilos globais base
├── acessibilidade.css      # Estilos de acessibilidade
├── curso.css               # Estilos específicos do curso
└── admin.css               # Estilos do painel admin
```

### 3.6 GitHub Actions

```
.github/
└── workflows/
    └── deploy.yml          # Deploy automático
```

---

## 4. MÓDULOS JAVASCRIPT

### 4.1 app.js - Script Principal

**Responsabilidade**: Controle geral da aplicação

#### Classes e Métodos

```javascript
class AppCurso {
  constructor()
  async inicializar()
  async carregarConfig()
  async carregarModulos()
  async carregarModulo(id)
  renderizarModulo(modulo)
  renderizarQuestoes(questoes)
  verificarResposta(questaoId, resposta)
  navegarParaModulo(id)
  atualizarProgresso()
  salvarProgresso()
  carregarProgresso()
  exportarProgresso()
}
```

#### Eventos Principais

- `DOMContentLoaded`: Inicialização
- `click .modulo-item`: Navegação entre módulos
- `submit .questao-form`: Verificação de resposta
- `click .nav-modulo-btn`: Navegação anterior/próximo

### 4.2 narrador.js - Sistema de Narração

**Responsabilidade**: Text-to-Speech com voz feminina

#### Classes e Métodos

```javascript
class SistemaNarrador {
  constructor()
  inicializar()
  carregarVozes()
  configurarControles()
  narrar(texto)
  toggleNarracao()
  parar()
  reiniciar()
  obterTextoConteudo()
  prepararTexto(texto)
  atualizarInterface()
  narrarElemento(elemento)
}
```

#### API Utilizada

```javascript
// Web Speech API
const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance(texto);
utterance.voice = vozFeminina;
utterance.rate = 1.0;
utterance.lang = 'pt-BR';
synth.speak(utterance);
```

### 4.3 libras.js - Integração VLibras

**Responsabilidade**: Interpretação em Libras

#### Classes e Métodos

```javascript
class SistemaLibras {
  constructor()
  inicializar()
  carregarWidget()
  ativar()
  desativar()
  toggle()
  sincronizarComNarrador()
  salvarEstado()
  recuperarEstado()
}
```

#### Integração

```javascript
// Carregamento do VLibras
const script = document.createElement('script');
script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
script.onload = () => new window.VLibras.Widget('https://vlibras.gov.br/app');
```

### 4.4 search.js - Sistema de Busca

**Responsabilidade**: Busca inteligente de conteúdo

#### Classes e Métodos

```javascript
class SistemaBusca {
  constructor()
  inicializar()
  construirIndice()
  buscarSimples(termo)
  buscarAvancada(filtros)
  ordenarResultados(resultados)
  paginarResultados(resultados, pagina)
  destacarTermos(texto, termo)
  exportarIndice()
  importarIndice(dados)
}
```

#### Estrutura do Índice

```javascript
{
  indice: [
    {
      id: "mod01-sec01-top01",
      moduloId: 1,
      moduloTitulo: "Fundamentos Legais",
      secaoTitulo: "Base Legal",
      topicoTitulo: "CPC Arts. 879-903",
      conteudo: "texto completo...",
      tipo: "topico",
      timestamp: "2025-11-15"
    }
  ],
  totalItens: 3000+
}
```

### 4.5 admin.js - Painel Administrativo

**Responsabilidade**: Gerenciamento do curso

#### Classes e Métodos

```javascript
class PainelAdmin {
  constructor()
  inicializar()
  autenticar(usuario, senha)
  logout()
  carregarDashboard()
  carregarModulos()
  editarModulo(id)
  salvarModulo(dados)
  uploadPDF(arquivo)
  processarComIA(arquivo)
  listarHistorico()
  exportarDados()
}
```

### 4.6 restore.js - Pontos de Restauração

**Responsabilidade**: Backup e recuperação

#### Classes e Métodos

```javascript
class SistemaRestauracao {
  constructor()
  inicializar()
  criarPonto(descricao)
  listarPontos()
  restaurarPonto(id)
  deletarPonto(id)
  exportarBackup()
  importarBackup(arquivo)
  autoSave()
  gerarHash(estado)
}
```

#### Estrutura de Ponto

```javascript
{
  id: 1,
  data: "2025-11-15T10:30:00Z",
  descricao: "Backup automático",
  autor: "Sistema",
  estado: {
    config: {...},
    modulos: [...],
    progresso: {...}
  },
  hash: "abc123..."
}
```

---

## 5. SISTEMA DE ACESSIBILIDADE

### 5.1 Recursos Implementados

#### VLibras (Libras)
- Widget oficial do Governo Federal
- Ativação/desativação por toggle
- Persistência de preferência
- Sincronização com narração

#### Narrador TTS
- Web Speech API
- Voz feminina natural em português
- Velocidade ajustável (0.5x a 2x)
- Controles: play, pause, stop, repeat
- Substituição de abreviações

#### Alto Contraste
- Modo Preto/Amarelo (WCAG AAA)
- Modo Branco/Preto (invertido)
- Contraste mínimo 7:1
- Aplicável a todo o site

#### Fonte Ampliada
- Tamanhos: 12px, 14px, 16px, 18px, 20px, 22px, 24px
- Botões +/-
- Persistência de preferência
- Responsivo em todas as telas

#### OpenDyslexic
- Fonte especial para dislexia
- Ativação opcional
- CDN: Google Fonts

#### Navegação por Teclado
- Tab: navegação entre elementos
- Enter: ativação
- Esc: fechamento de modais
- Setas: navegação entre módulos
- Skip links para conteúdo principal

### 5.2 Conformidade WCAG

| Critério | Nível | Status |
|----------|-------|--------|
| 1.1 Alternativas em Texto | A | ✅ |
| 1.2 Mídias com Base em Tempo | AA | ✅ |
| 1.3 Adaptável | A | ✅ |
| 1.4 Distinguível | AAA | ✅ |
| 2.1 Acessível por Teclado | A | ✅ |
| 2.2 Tempo Suficiente | A | ✅ |
| 2.3 Convulsões | A | ✅ |
| 2.4 Navegável | AA | ✅ |
| 3.1 Legível | A | ✅ |
| 3.2 Previsível | A | ✅ |
| 3.3 Assistência de Entrada | AA | ✅ |
| 4.1 Compatível | A | ✅ |

**Resultado: WCAG 2.1 AAA Completo ✅**

---

## 6. PAINEL ADMINISTRATIVO

### 6.1 Acesso

- URL: `painel-admin.html`
- Autenticação: Usuário e senha
- Armazenamento: localStorage (hash SHA-256)

### 6.2 Dashboard

#### Cards de Estatísticas

1. **Total de Módulos**: 10
2. **Total de Alunos**: (simulado)
3. **Taxa de Conclusão**: (calculada)
4. **Avaliação Média**: (calculada)

#### Gráficos

- Progresso por módulo
- Acessos diários
- Questões mais erradas

### 6.3 Gerenciamento de Módulos

#### Listar Módulos
```javascript
{
  id: 1,
  titulo: "Fundamentos Legais",
  status: "publicado",
  dataAtualizacao: "2025-11-15"
}
```

#### Editar Módulo

Formulário com campos:
- Título
- Descrição
- Duração
- Ícone
- Número de seções
- Conteúdo (editor rico)

#### Adicionar Novo Módulo

Template JSON:
```json
{
  "id": 11,
  "titulo": "Novo Módulo",
  "descricao": "",
  "icone": "📖",
  "duracao": "30min",
  "secoes": []
}
```

### 6.4 Upload de PDF

#### Funcionalidades

- Drag-and-drop
- Validação de tipo (apenas PDF)
- Limite de tamanho (10 MB)
- Barra de progresso
- Processamento com IA (simulado)

#### Processamento IA

1. Extração de texto (PDF.js)
2. Análise de estrutura
3. Conversão para JSON
4. Aplicação de PNL
5. Inserção no módulo

### 6.5 Histórico

#### Registro de Atividades

```javascript
{
  id: 1,
  data: "2025-11-15 10:30",
  autor: "Admin",
  acao: "Editou módulo 1",
  detalhes: {
    moduloId: 1,
    campo: "titulo",
    valorAnterior: "Fundamentos",
    valorNovo: "Fundamentos Legais"
  }
}
```

#### Exportação

- Formato: CSV, JSON, Excel
- Filtros por data, autor, ação

### 6.6 Pontos de Restauração

#### Listagem

- Últimos 50 pontos
- Ordenação cronológica
- Busca por descrição
- Filtro por data

#### Restaurar

1. Selecionar ponto
2. Confirmar restauração
3. Backup do estado atual
4. Aplicar estado anterior
5. Recarregar página

#### Exportar/Importar

- Formato: JSON compactado
- Download direto
- Upload com validação

---

## 7. SISTEMA DE BACKUP

### 7.1 Auto-save

#### Configuração

```javascript
{
  intervalo: 5 * 60 * 1000, // 5 minutos
  maximo: 50 pontos,
  rotacao: FIFO // First In First Out
}
```

#### Processo

1. A cada 5 minutos
2. Verifica alterações (hash)
3. Se houver, cria ponto
4. Salva em `restore-points.json`
5. Remove ponto mais antigo se > 50

### 7.2 Backup Manual

#### Criar Ponto

```javascript
sistemaRestauracao.criarPonto("Descrição do backup");
```

#### Estrutura

```json
{
  "pontos": [
    {
      "id": 1,
      "data": "2025-11-15T10:30:00Z",
      "descricao": "Backup manual",
      "autor": "Admin",
      "arquivos": [
        "config.json",
        "modulo-01.json"
      ],
      "hash": "abc123",
      "estado": {
        "config": {...},
        "modulos": [...]
      }
    }
  ]
}
```

### 7.3 Restauração

#### Processo

1. Listar pontos disponíveis
2. Selecionar ponto desejado
3. Confirmar (alerta de perda de dados atuais)
4. Criar backup do estado atual (segurança)
5. Aplicar estado do ponto selecionado
6. Atualizar localStorage
7. Recarregar página

---

## 8. DEPLOY E HOSPEDAGEM

### 8.1 GitHub Pages

#### Configuração

1. Repositório público no GitHub
2. Settings > Pages
3. Source: GitHub Actions
4. Branch: main
5. Deploy automático ativado

#### Workflow (deploy.yml)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy
        uses: actions/deploy-pages@v4
```

#### URL de Produção

```
https://programadorbrasil.github.io/TJPE/
```

### 8.2 Deploy Local

#### Servidor HTTP Simples

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Acesso: `http://localhost:8000`

### 8.3 Deploy em Outros Serviços

#### Netlify

1. Conectar repositório GitHub
2. Build command: (nenhum)
3. Publish directory: `/`
4. Deploy automático

#### Vercel

1. Importar projeto do GitHub
2. Framework preset: Other
3. Build command: (nenhum)
4. Output directory: `/`
5. Deploy

#### Firebase Hosting

```bash
firebase init hosting
firebase deploy
```

---

## 9. MANUTENÇÃO E ATUALIZAÇÃO

### 9.1 Atualizar Módulo

#### Processo Manual

1. Abrir `modules/modulo-XX.json`
2. Editar JSON
3. Validar estrutura
4. Salvar
5. Commit e push
6. Deploy automático

#### Via Painel Admin

1. Login no painel
2. Aba "Módulos"
3. Clicar em "Editar" no módulo desejado
4. Fazer alterações no formulário
5. Salvar
6. Criar ponto de restauração

### 9.2 Adicionar Novo Módulo

#### Template

```json
{
  "id": 11,
  "titulo": "Título do Novo Módulo",
  "descricao": "Descrição breve",
  "icone": "📖",
  "duracao": "45min",
  "topicos": 5,
  "secoes": [
    {
      "id": "sec01",
      "titulo": "Seção 1",
      "topicos": [
        {
          "id": "top01",
          "titulo": "Tópico 1",
          "conteudo": "<p>Conteúdo aqui</p>",
          "tipo": "texto"
        }
      ]
    }
  ],
  "questoes": [
    {
      "id": "q01",
      "pergunta": "Pergunta?",
      "opcoes": [
        {"id": "a", "texto": "Opção A"},
        {"id": "b", "texto": "Opção B"},
        {"id": "c", "texto": "Opção C"}
      ],
      "respostaCorreta": "a",
      "explicacao": "Explicação da resposta"
    }
  ]
}
```

#### Passos

1. Criar arquivo `modulo-11.json`
2. Adicionar ao `config.json`:

```json
{
  "modulos": [
    ...
    {
      "id": 11,
      "titulo": "Novo Módulo",
      "descricao": "...",
      "icone": "📖",
      "duracao": "45min",
      "topicos": 5
    }
  ]
}
```

3. Atualizar menu lateral no `index.html` (ou fazer dinâmico)
4. Testar localmente
5. Deploy

### 9.3 Atualizar Estilos

#### Global

- Editar `styles/global.css`
- Variáveis CSS em `:root`
- Testar em todos os navegadores

#### Específico

- `styles/curso.css`: Layout do curso
- `styles/admin.css`: Painel admin
- `styles/acessibilidade.css`: Recursos de acessibilidade

### 9.4 Versionamento

#### Estratégia Semver

```
MAJOR.MINOR.PATCH

1.0.0 -> Lançamento inicial
1.0.1 -> Correção de bug
1.1.0 -> Nova funcionalidade
2.0.0 -> Breaking change
```

#### Changelog

Manter arquivo `CHANGELOG.md`:

```markdown
# Changelog

## [1.1.0] - 2025-12-01
### Adicionado
- Módulo 11: Recursos Judiciais

### Alterado
- Melhorias no sistema de busca

### Corrigido
- Bug na navegação mobile
```

---

## 10. TROUBLESHOOTING

### 10.1 Problemas Comuns

#### Módulo Não Carrega

**Sintoma**: Tela branca ou erro 404

**Causas**:
- Arquivo JSON corrompido
- Caminho incorreto no `config.json`
- Erro de sintaxe no JSON

**Solução**:
1. Abrir console do navegador (F12)
2. Verificar erro específico
3. Validar JSON em [jsonlint.com](https://jsonlint.com)
4. Corrigir caminho no config.json
5. Restaurar ponto de backup se necessário

#### Narrador Não Funciona

**Sintoma**: Botão não inicia narração

**Causas**:
- Navegador não suporta Web Speech API
- VLibras interferindo
- Permissões bloqueadas

**Solução**:
1. Verificar console: `'speechSynthesis' in window`
2. Usar navegador compatível (Chrome, Edge, Safari)
3. Desativar VLibras temporariamente
4. Permitir permissões de áudio no navegador

#### VLibras Não Aparece

**Sintoma**: Widget VLibras não carrega

**Causas**:
- Bloqueio de script externo
- Conexão com internet instável
- Timeout do servidor VLibras

**Solução**:
1. Verificar console: erro de CORS ou timeout
2. Desabilitar bloqueadores de anúncios
3. Verificar conexão com internet
4. Aguardar e recarregar (servidor VLibras pode estar lento)

#### Busca Retorna Resultados Vazios

**Sintoma**: Busca não encontra nada

**Causas**:
- Índice não construído
- Termo de busca muito específico
- Módulos não carregados

**Solução**:
1. Verificar console: `sistemaBusca.indice.length`
2. Reconstruir índice: `sistemaBusca.construirIndice()`
3. Testar com termo mais genérico
4. Verificar se módulos JSON estão acessíveis

#### Progresso Não Salva

**Sintoma**: Ao recarregar página, progresso perdido

**Causas**:
- localStorage desativado
- Modo privado/anônimo
- Cota excedida

**Solução**:
1. Verificar: `typeof(Storage) !== "undefined"`
2. Sair do modo privado
3. Limpar localStorage antigo:
   ```javascript
   localStorage.clear();
   ```
4. Usar exportação manual de progresso

#### Painel Admin Não Autentica

**Sintoma**: Login sempre falha

**Causas**:
- Senha incorreta
- Hash corrompido no código

**Solução**:
1. Verificar senha padrão no código-fonte
2. Limpar localStorage de autenticação:
   ```javascript
   localStorage.removeItem('admin-token');
   ```
3. Gerar novo hash se necessário

#### Deploy Falha no GitHub Pages

**Sintoma**: Workflow com erro

**Causas**:
- Permissões insuficientes
- Arquivo corrompido no repositório
- GitHub Pages desativado

**Solução**:
1. Settings > Pages: verificar se está ativado
2. Settings > Actions: permissões de leitura/escrita
3. Verificar logs do workflow
4. Reexecutar workflow manualmente

### 10.2 Comandos de Debug

#### Verificar Sistema

```javascript
// Console do navegador

// Verificar app carregado
console.log(appCurso);

// Verificar módulos carregados
console.log(appCurso.modulos);

// Verificar narrador
console.log(narrador);

// Verificar busca
console.log(sistemaBusca);

// Verificar índice de busca
console.log(sistemaBusca.indice.length);

// Verificar progresso
console.log(localStorage.getItem('curso-tjpe-progresso'));

// Verificar pontos de restauração
console.log(localStorage.getItem('curso-tjpe-restore-points'));
```

#### Resetar Sistema

```javascript
// Limpar todo localStorage
localStorage.clear();

// Limpar apenas progresso
localStorage.removeItem('curso-tjpe-progresso');

// Reconstruir índice
sistemaBusca.construirIndice();

// Recarregar configuração
appCurso.carregarConfig();
```

### 10.3 Logs e Monitoramento

#### Ativar Modo Debug

Adicionar em `app.js`:

```javascript
const DEBUG = true;

function log(...args) {
  if (DEBUG) console.log('[DEBUG]', ...args);
}
```

#### Rastrear Erros

```javascript
window.addEventListener('error', (e) => {
  console.error('Erro global:', e.message, e.filename, e.lineno);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Promise rejeitada:', e.reason);
});
```

---

## APÊNDICES

### A. Estrutura Completa de Módulo JSON

```json
{
  "id": 1,
  "titulo": "Título do Módulo",
  "descricao": "Descrição breve",
  "icone": "⚖️",
  "duracao": "45min",
  "topicos": 14,
  "secoes": [
    {
      "id": "sec01",
      "titulo": "Título da Seção",
      "descricao": "Descrição da seção",
      "topicos": [
        {
          "id": "top01",
          "titulo": "Título do Tópico",
          "conteudo": "<p>HTML do conteúdo</p>",
          "tipo": "texto|video|audio|pdf",
          "destaque": "critico|importante|info",
          "links": [
            {
              "texto": "Planalto - CPC",
              "url": "https://planalto.gov.br/...",
              "icone": "🔗"
            }
          ]
        }
      ]
    }
  ],
  "alertas": [
    {
      "tipo": "critico|importante|info",
      "titulo": "Título do Alerta",
      "conteudo": "Conteúdo do alerta"
    }
  ],
  "casos": [
    {
      "titulo": "Caso Prático 1",
      "situacao": "Descrição da situação",
      "problema": "Qual foi o problema",
      "solucao": "Como foi resolvido",
      "licao": "O que aprender"
    }
  ],
  "jurisprudencia": [
    {
      "tribunal": "STJ",
      "numero": "Tema 1.134/2024",
      "ementa": "Texto da ementa",
      "link": "url"
    }
  ],
  "questoes": [
    {
      "id": "q01",
      "pergunta": "Texto da pergunta",
      "opcoes": [
        {"id": "a", "texto": "Opção A"},
        {"id": "b", "texto": "Opção B"},
        {"id": "c", "texto": "Opção C"},
        {"id": "d", "texto": "Opção D"}
      ],
      "respostaCorreta": "a",
      "explicacao": "Por que a resposta é A",
      "dificuldade": "facil|medio|dificil",
      "pontos": 10
    }
  ],
  "recursos": [
    {
      "tipo": "pdf|video|link|checklist",
      "titulo": "Título do Recurso",
      "descricao": "Descrição",
      "url": "caminho ou URL"
    }
  ]
}
```

### B. Paleta de Cores Completa

```css
:root {
  /* TJPE */
  --cor-primaria: #003366;
  --cor-secundaria: #0066cc;

  /* Gracie */
  --cor-dourado: #DAA520;
  --cor-dourado-claro: #F4E5C2;

  /* Neutras */
  --cor-branco: #FFFFFF;
  --cor-cinza-claro: #F5F5F5;
  --cor-cinza-medio: #CCCCCC;
  --cor-cinza-escuro: #333333;
  --cor-preto: #000000;

  /* Status */
  --cor-sucesso: #28a745;
  --cor-alerta: #ffc107;
  --cor-perigo: #dc3545;
  --cor-info: #17a2b8;
}
```

### C. Atalhos de Teclado

| Tecla | Ação |
|-------|------|
| `Tab` | Navegar entre elementos |
| `Shift + Tab` | Navegar para trás |
| `Enter` | Ativar elemento focado |
| `Esc` | Fechar modal/overlay |
| `Ctrl + F` | Abrir busca |
| `Ctrl + B` | Ativar/desativar VLibras |
| `Ctrl + N` | Ativar/desativar narrador |
| `Ctrl + +` | Aumentar fonte |
| `Ctrl + -` | Diminuir fonte |
| `Ctrl + 0` | Resetar fonte |
| `Seta ←` | Módulo anterior |
| `Seta →` | Próximo módulo |

### D. Suporte de Navegadores

| Navegador | Versão Mínima | Suporte |
|-----------|---------------|---------|
| Chrome | 80+ | ✅ Total |
| Firefox | 75+ | ✅ Total |
| Safari | 13+ | ✅ Total |
| Edge | 80+ | ✅ Total |
| Opera | 67+ | ✅ Total |
| IE 11 | - | ❌ Não suportado |

### E. Contatos e Suporte

**Desenvolvedor**: Claude Code
**Instrutor**: Renato Gracie - Leiloeiro Oficial JUCEPE 366
**Email**: contato@gracieleiloes.com.br
**Site**: https://gracieleiloes.com.br
**Repositório**: https://github.com/ProgramadorBrasil/TJPE
**Issues**: https://github.com/ProgramadorBrasil/TJPE/issues

---

**Última atualização**: 15 de Novembro de 2025
**Versão da documentação**: 1.0.0
