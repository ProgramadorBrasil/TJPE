# 🎯 PROMPT COMANDO MESTRE - SISTEMA COMPLETO TJPE V2.0

## 📋 COMANDO PRINCIPAL

```
Crie um sistema completo de curso online para o TJPE (Tribunal de Justiça de Pernambuco) sobre "Leilão Judicial para Servidores Públicos" com as seguintes especificações técnicas:

### 1. ARQUITETURA DO SISTEMA
- HTML5 puro (sem frameworks frontend)
- CSS3 com design system moderno (Microsoft Fluent + Apple HIG)
- JavaScript ES6+ vanilla
- Estrutura modular JSON para conteúdo
- Sistema de navegação SPA (Single Page Application)
- Local storage para persistência de progresso

### 2. ESTRUTURA DE ARQUIVOS OBRIGATÓRIA
```
TJPE/
├── index.html (interface original)
├── index-v2.html (interface moderna V2)
├── painel-admin.html (painel administrativo)
├── config.json (configuração global)
├── restore-points.json (pontos de restauração)
├── styles/
│   ├── global.css
│   ├── curso.css
│   ├── admin.css
│   ├── acessibilidade.css
│   ├── design-system-v2.css (✨ V2 moderno)
│   ├── audio-player.css (✨ Sistema de áudio)
│   └── legal-tooltips.css (✨ Tooltips legais)
├── scripts/
│   ├── app.js (aplicação principal)
│   ├── narrador.js (TTS narração)
│   ├── libras.js (VLibras integração)
│   ├── search.js (sistema de busca)
│   ├── admin.js (painel admin)
│   ├── restore.js (backup/restore)
│   ├── audio-player.js (✨ Player de áudio profissional)
│   ├── legal-tooltips.js (✨ Sistema de tooltips)
│   ├── sound-effects.js (✨ Efeitos sonoros)
│   └── animations.js (✨ Micro-animações)
├── modules/
│   ├── modulo-01.json (Fundamentos Legais)
│   ├── modulo-02.json (Edital de Leilão)
│   ├── modulo-03.json (Notificações)
│   ├── modulo-04.json (Avaliação de Bens)
│   ├── modulo-05.json (Averbação)
│   ├── modulo-06.json (Débitos Fiscais)
│   ├── modulo-07.json (Formas de Pagamento)
│   ├── modulo-08.json (Publicação)
│   ├── modulo-09.json (Pós-Leilão)
│   └── modulo-10.json (Casos Práticos)
├── data/
│   └── legal-articles-database.json (✨ Database de artigos legais)
├── assets/
│   ├── audio/ (arquivos MP3 dos módulos)
│   ├── logos/ (logotipos TJPE e Gracie)
│   └── images/ (imagens do curso)
└── README.md
```

### 3. FUNCIONALIDADES ESSENCIAIS

#### 3.1 Sistema de Navegação
- Menu lateral com 10 módulos
- Breadcrumb de localização
- Barra de progresso global
- Sistema de busca full-text
- Favoritos e marcadores
- Navegação por teclado (acessibilidade)

#### 3.2 Sistema de Áudio (✨ NOVO)
- Player profissional fixo (bottom-right)
- Auto-play ao iniciar módulo
- Controles:
  - Play/Pause
  - Volume (0-100%)
  - Velocidade (0.75x, 1x, 1.25x, 1.5x, 2x)
  - Loop on/off
  - Download
  - Barra de progresso interativa
  - Visualizador de ondas animado
- Responsivo para mobile
- Estilo: Gradient purple (#667eea → #764ba2)

#### 3.3 Sistema de Tooltips Legais (✨ NOVO)
- Detecção automática de artigos: CPC, CTN, Lei 9.514/97, CF, CC
- Tooltip ao hover com detalhes completos:
  - Texto do artigo
  - Aplicação prática
  - Jurisprudência
  - Observações importantes
- Design moderno com gradient
- Posicionamento inteligente (evita bordas)
- Mobile-friendly (tap to toggle)
- Acessível (keyboard navigation, Esc to close)

#### 3.4 Acessibilidade WCAG 2.1 AAA
- VLibras (Libras brasileiro)
- Narrador TTS (Web Speech API)
- Alto contraste
- Redimensionamento de fonte
- Navegação por teclado completa
- ARIA labels adequados
- Modo escuro/claro

#### 3.5 Design System V2
**Inspiração:** Microsoft Fluent Design + Apple Human Interface Guidelines

**Cores Primárias:**
- Primary: #6366f1 (Indigo)
- Secondary: #10b981 (Emerald)
- Accent Blue: #0ea5e9
- Accent Purple: #a855f7
- Accent Pink: #ec4899
- Accent Orange: #f97316

**Gradientes:**
- Primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)
- Success: linear-gradient(135deg, #10b981 0%, #34d399 100%)
- Warm: linear-gradient(135deg, #f97316 0%, #ec4899 100%)

**Efeitos:**
- Glassmorphism (backdrop-filter: blur(20px))
- Soft shadows (Fluent Shadow)
- Micro-animations (250ms cubic-bezier)
- Smooth transitions

#### 3.6 Painel Administrativo
- Login com autenticação
- Dashboard com estatísticas
- Editor de módulos (CRUD)
- Sistema de backup manual
- Exportar/Importar JSON
- Gerenciar usuários
- Logs de acesso

#### 3.7 Sistema de Backup/Restore
- Pontos de restauração automáticos
- Backup antes de qualquer edit
- Nomenclatura: "AAAA-MM-DD-HH-MM-descrição"
- Restauração com um clique
- Histórico completo de versões

### 4. CONTEÚDO DOS 10 MÓDULOS

**Módulo 1:** Fundamentos Legais do Leilão Judicial
- Base legal: CPC, Lei 9.514/97, CTN
- Duração: 45min
- Ícone: ⚖️

**Módulo 2:** Elaboração do Edital de Leilão
- Elementos obrigatórios e procedimentos
- Duração: 60min
- Ícone: 📋

**Módulo 3:** Notificações e Intimações
- Quem notificar e como fazer corretamente
- Duração: 40min
- Ícone: 📧

**Módulo 4:** Avaliação de Bens e Atualização de Valores
- Validade e procedimentos de atualização
- Duração: 35min
- Ícone: 💰

**Módulo 5:** Averbação na Matrícula do Imóvel
- Procedimentos registrais obrigatórios
- Duração: 30min
- Ícone: 📝

**Módulo 6:** Débitos Fiscais e Condominiais
- Art. 130 CTN e Tema 1.134/2024 do STJ
- Duração: 50min
- Ícone: 💳

**Módulo 7:** Formas de Pagamento e Parcelamento
- À vista e parcelado - Art. 895 CPC
- Duração: 35min
- Ícone: 💵

**Módulo 8:** Publicação e Transparência
- Publicação obrigatória e prazos
- Duração: 25min
- Ícone: 📢

**Módulo 9:** Procedimentos Pós-Leilão
- Auto, carta de arrematação e imissão na posse
- Duração: 40min
- Ícone: ✅

**Módulo 10:** Casos Práticos e Erros Comuns
- Situações reais e como evitar problemas
- Duração: 45min
- Ícone: ⚠️

### 5. ESTRUTURA JSON DOS MÓDULOS

Cada módulo deve ter:
```json
{
  "id": 1,
  "titulo": "Nome do Módulo",
  "descricao": "Descrição curta",
  "duracao": "XXmin",
  "icone": "emoji",
  "audioUrl": "assets/audio/modulo-XX.mp3",
  "version": "1.0.0",
  "ultimaAtualizacao": "2025-11-15",
  "autor": "Renato Gracie - Leiloeiro Oficial JUCEPE 366",
  "objetivos": ["objetivo 1", "objetivo 2"],
  "alertasCriticos": [
    {
      "tipo": "critico|importante|alerta",
      "titulo": "TÍTULO DO ALERTA",
      "conteudo": "Texto do alerta",
      "icone": "emoji"
    }
  ],
  "secoes": [
    {
      "id": 1,
      "titulo": "Seção",
      "descricao": "Descrição",
      "topicos": [
        {
          "id": 1.1,
          "titulo": "Tópico",
          "tipo": "conteudo|exemplo|exercicio",
          "conteudo": "Texto HTML permitido",
          "detalhes": {
            "principios": [],
            "artigos": []
          }
        }
      ]
    }
  ],
  "questoesRevisao": [
    {
      "id": 1,
      "pergunta": "Questão?",
      "opcoes": ["A", "B", "C", "D"],
      "respostaCorreta": 0,
      "explicacao": "Explicação detalhada"
    }
  ],
  "casosExemplo": [
    {
      "id": 1,
      "titulo": "Caso prático",
      "situacao": "Descrição do caso",
      "solucao": "Como resolver",
      "alertas": ["alerta 1"]
    }
  ]
}
```

### 6. DEPLOY E INTEGRAÇÃO

#### 6.1 GitHub Pages
- Repositório: ProgramadorBrasil/TJPE
- Branch: main
- GitHub Actions configurado
- Deploy automático a cada push

#### 6.2 Workflow (.github/workflows/deploy.yml)
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

### 7. INSTRUÇÕES ESPECIAIS

#### 7.1 Áudio dos Módulos
- Criar pasta `assets/audio/`
- Arquivos: modulo-01.mp3 até modulo-10.mp3
- Formato: MP3, 128-192 kbps, 44.1 kHz
- Conteúdo: Narração completa do módulo
- Opções: Gravação profissional ou TTS de alta qualidade

#### 7.2 Database de Artigos Legais
Criar `data/legal-articles-database.json` com todos os artigos citados:
- CPC: 824, 825, 826, 827, 835, 880, 881, 895, 897
- Lei 9.514/97: 27, 28
- CTN: 130, 131, 132
- CF: 5º (XXII, XXIII), 170
- CC: 1336, 1345
- Lei 6.015/73: 167, 237

Estrutura de cada artigo:
```json
{
  "codigo": "CPC",
  "artigo": "824",
  "livro": "Livro II - Execução",
  "titulo": "Título do artigo",
  "texto": "Texto integral do artigo",
  "aplicacao": "Aplicação prática no leilão judicial",
  "referencia": "Lei XXX/AAAA",
  "jurisprudencia": "STJ Tema XXXX (se houver)",
  "observacoes": "Observações importantes"
}
```

#### 7.3 Responsividade
- Desktop: >= 1024px
- Tablet: 768px - 1023px
- Mobile: < 768px
- Design mobile-first
- Breakpoints: 480px, 768px, 1024px, 1440px

#### 7.4 Performance
- Lazy loading de módulos
- Cache de módulos carregados
- Debounce em busca (300ms)
- Throttle em scroll events
- Minificação de CSS/JS (produção)

### 8. TESTING CHECKLIST

- [ ] Todas as 10 módulos carregam corretamente
- [ ] Audio player aparece e funciona
- [ ] Controles de volume e velocidade funcionam
- [ ] Tooltips aparecem ao hover em artigos legais
- [ ] Tooltips mostram informações corretas
- [ ] VLibras carrega e funciona
- [ ] Narrador TTS funciona
- [ ] Alto contraste funciona
- [ ] Navegação por teclado funciona
- [ ] Busca retorna resultados corretos
- [ ] Progresso é salvo em localStorage
- [ ] Painel admin autent ica corretamente
- [ ] Backup/Restore funcionam
- [ ] Responsivo em mobile
- [ ] Deploy no GitHub Pages funciona

### 9. MARCA E IDENTIDADE

**Instrutor:** Renato Gracie - Leiloeiro Oficial JUCEPE 366

**Cores da marca:**
- TJPE: Azul institucional (#003366)
- Gracie Leilões: Dourado (#DAA520)
- Híbrido V2: Gradient purple/indigo

**Logos:**
- TJPE: Brasão oficial do Tribunal
- Gracie Leilões: Logo profissional

### 10. LINKS IMPORTANTES

- URL GitHub: https://github.com/ProgramadorBrasil/TJPE
- URL Deploy: https://programadorbrasil.github.io/TJPE/
- Instruções: Ver INSTRUCOES-DEPLOY.md
- Documentação: Ver DOCUMENTACAO.md

### 11. VERSÃO E METADATA

- **Versão do Sistema:** 2.0.0
- **Data de Criação:** 15/11/2025
- **Última Atualização:** 15/11/2025
- **Status:** Produção
- **Licença:** Uso exclusivo TJPE

---

## 🚀 COMANDO DE EXECUÇÃO RÁPIDA

```bash
# Clone o repositório
git clone https://github.com/ProgramadorBrasil/TJPE.git
cd TJPE

# Inicie servidor local
python -m http.server 8080

# Acesse
http://localhost:8080/index-v2.html
```

---

## 📞 SUPORTE

Para problemas, consulte:
1. DOCUMENTACAO.md
2. INSTRUCOES-DEPLOY.md
3. Issues: https://github.com/ProgramadorBrasil/TJPE/issues

---

**✨ Sistema desenvolvido com Claude Code**
**📅 Novembro de 2025**
**🎯 100% Funcional e Documentado**
```

## 🎯 NOTAS FINAIS

Este prompt comando mestre contém **TODAS** as instruções necessárias para recriar o sistema completo do zero. Inclui:

✅ Arquitetura completa
✅ Estrutura de arquivos
✅ Especificações técnicas
✅ Design system V2
✅ Sistema de áudio
✅ Sistema de tooltips legais
✅ Acessibilidade WCAG 2.1 AAA
✅ Conteúdo dos 10 módulos
✅ Deploy GitHub Pages
✅ Testing checklist

**Total de arquivos:** 35+
**Linhas de código:** ~15.000+
**Tempo estimado de recriação:** 8-12 horas

---
**Versão:** 1.0.0
**Data:** 15/11/2025
**Autor:** Claude Code + Renato Gracie
