# Design System V2 - TJPE Academy

Documentação completa da nova interface moderna para o curso TJPE com especificações de design, componentes, animações e audio.

## Visão Geral

A versão 2 da plataforma TJPE utiliza um design system moderno com:
- **Glassmorphism**: Efeitos de vidro translúcido com backdrop blur
- **Gradientes Premium**: Combinações de cores modernas e vibrantes
- **Sombras Fluent**: Sombras e profundidade estilo Microsoft Fluent Design
- **Micro-animações**: Transições suaves e feedback visual delicado
- **Responsividade Total**: Funciona em todos os dispositivos
- **Acessibilidade**: Suporta preferências de redução de movimento

## Arquivos Criados

### 1. index-v2.html
Página principal com interface completa contendo:

#### Seção "Sobre o Curso"
- Cards de estatísticas (10 módulos, 9h duração, Certificado)
- 3 cards de objetivos com checkmarks verdes
- Seção público-alvo com bullet points
- Seção "O que você vai aprender" com checkmarks
- Player de áudio integrado para visão geral

#### Seção "Módulos do Curso"
- 3 Tabs: Visão Geral | Módulos do Curso | Meu Progresso
- Barra de progresso animada
- 10 módulos expansíveis com:
  - Título e descrição
  - Número de aulas e duração
  - Lista de aulas ao expandir
  - Cada aula: círculo de status, título, duração, botão "Iniciar"

### 2. scripts/audio-player.js
Player de áudio profissional com:

**Recursos:**
- Interface moderna com visualizador de ondas
- Controles: Play/Pause, Progress, Volume, Velocidade
- 5 velocidades: 0.75x, 1x, 1.25x, 1.5x, 2x
- Loop toggle
- Download de áudio
- Status em tempo real
- Formatação inteligente de tempo

**Classe AudioPlayer:**
```javascript
const player = new AudioPlayer(container, {
    title: 'Visão Geral do Curso TJPE',
    url: '/assets/sounds/course-intro.mp3',
    autoplay: false,
    volume: 0.7,
    playbackRate: 1.0,
    loop: false
});
```

### 3. scripts/sound-effects.js
Sistema de efeitos sonoros com síntese de áudio:

**Efeitos Disponíveis:**
- `click`: Som de clique (800Hz, 0.1s)
- `hover`: Som de hover (600Hz, 0.08s)
- `success`: Sequência ascendente (0.15s)
- `error`: Tom grave (300Hz, 0.2s)
- `page-transition`: Varredura de frequência (0.3s)
- `tab-switch`: Tom puro (700Hz, 0.12s)
- `module-expand`: Varredura ascendente (0.25s)
- `lesson-complete`: Sequência musical (0.12s)
- `lesson-start`: Varredura ascendente longa (0.4s)
- `notification`: Pulso (900Hz, 0.3s)

**Controle de Som:**
```javascript
SoundEffects.playSound('click');
SoundEffects.setMasterVolume(0.5);
SoundEffects.toggleMute();
SoundEffects.setMute(true);
```

**Eventos Automáticos:**
- Cliques em botões reproduzem som 'click'
- Hover em elementos reproduzem som 'hover'
- Transições de página reproduzem 'page-transition'

### 4. scripts/animations.js
Sistema de micro-animações inteligentes:

**Funções Disponíveis:**
- `animatePageEntry()`: Anima entrada de elementos da página
- `fadeIn(element, duration)`: Desvanecimento de entrada
- `fadeOut(element, duration)`: Desvanecimento de saída
- `scaleIn(element, duration)`: Crescimento com fade
- `slideDown(element, duration)`: Deslizamento para baixo
- `slideUp(element, duration)`: Deslizamento para cima
- `pulse(element, duration)`: Pulso de destaque
- `animateProgressBar(element, percent, duration)`: Barra de progresso animada
- `rotate(element, degrees, duration)`: Rotação suave
- `bounce(element, distance, duration)`: Efeito de pulo
- `shake(element, intensity, duration)`: Tremor
- `animateCounter(element, target, duration)`: Contador animado
- `typeWriter(element, text, duration)`: Efeito de digitação
- `createFloatingParticles(container, count)`: Partículas flutuantes

**Respeita Preferências de Acessibilidade:**
- Detecta `prefers-reduced-motion`
- Desativa animações para usuários que preferem

## Design System V2

### Paleta de Cores

#### Cores Primárias
```css
--primary: #6366f1 (Índigo)
--primary-dark: #4f46e5
--primary-light: #818cf8
```

#### Cores Secundárias
```css
--secondary: #10b981 (Verde Esmeralda)
--secondary-dark: #059669
--secondary-light: #34d399
```

#### Cores Neutras (Escala Cinza)
```css
--neutral-50: #f9fafb
--neutral-100: #f3f4f6
--neutral-200: #e5e7eb
--neutral-300: #d1d5db
--neutral-400: #9ca3af
--neutral-500: #6b7280
--neutral-600: #4b5563
--neutral-700: #374151
--neutral-800: #1f2937
--neutral-900: #111827
```

#### Acentos
```css
--accent-blue: #0ea5e9
--accent-purple: #a855f7
--accent-pink: #ec4899
--accent-orange: #f97316
```

### Gradientes

```css
--gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)
--gradient-success: linear-gradient(135deg, #10b981 0%, #34d399 100%)
--gradient-warm: linear-gradient(135deg, #f97316 0%, #ec4899 100%)
```

### Sombras Fluent

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
--shadow-glass: 0 8px 32px rgba(31, 38, 135, 0.37)
```

### Espaçamento

```css
--space-xs: 0.25rem
--space-sm: 0.5rem
--space-md: 1rem
--space-lg: 1.5rem
--space-xl: 2rem
--space-2xl: 3rem
```

### Tipografia

```css
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
--font-mono: 'Fira Code', 'Courier New', monospace
```

### Transições

```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1)
```

## Componentes Principais

### Card
Componente base para conteúdo:
```html
<div class="card">
    <h3>Título</h3>
    <p>Conteúdo</p>
</div>
```

**Características:**
- Fundo translúcido com glassmorphism
- Bordas sutis
- Sombra fluent
- Transição ao hover

### Stat Card
Para exibir estatísticas:
```html
<div class="stat-card">
    <div class="stat-value">10</div>
    <div class="stat-label">Módulos</div>
</div>
```

### Module Card
Para módulos do curso:
- Cabeçalho com título e descrição
- Meta informações (aulas, duração)
- Expandível para mostrar aulas
- Cada aula com círculo de status

### Progress Bar
Barra de progresso animada:
```html
<div class="progress-bar">
    <div class="progress-fill" id="progress-fill"></div>
</div>
```

### Tabs
Sistema de abas:
```html
<div class="tabs-container">
    <button class="tab-button active" data-tab="tab1">Tab 1</button>
    <button class="tab-button" data-tab="tab2">Tab 2</button>
</div>
```

## Funcionalidades Interativas

### Sistema de Navegação por Abas
- Transições suaves entre abas
- Indicador visual de aba ativa
- Sons de transição

### Módulos Expansíveis
- Click para expandir/recolher
- Animação suave de deslizamento
- Lista de aulas com status visual

### Barra de Progresso Animada
- Anima de forma suave
- Efeito glow
- Atualiza em tempo real

### Player de Áudio
- Reprodução com controles intuitivos
- Visualizador de ondas
- Controle de velocidade e volume
- Opção de download

## Responsividade

A interface é totalmente responsiva:

### Desktop (>1200px)
- Layout de grid completo
- Todos os controles visíveis
- Animações em velocidade normal

### Tablet (768px - 1200px)
- Grid ajustado
- Navegação otimizada
- Espaçamento reduzido

### Mobile (<768px)
- Stack vertical
- Controles compactos
- Menu suspenso
- Fonte reduzida
- Sem visualizador de ondas
- Volume slider oculto

## Acessibilidade

### Suporte a Redução de Movimento
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

### Contraste e Legibilidade
- Texto claro sobre fundos translúcidos
- Fontes legíveis
- Espaçamento adequado
- Indicadores de foco visíveis

## Estrutura de Dados dos Módulos

```javascript
const courseData = {
    modules: [
        {
            id: 1,
            number: 1,
            title: "Introdução ao TJPE",
            description: "Conheça a estrutura...",
            duration: 45,
            lessons: [
                { id: 1, title: "História do TJPE", duration: 15 },
                { id: 2, title: "Estrutura Organizacional", duration: 15 },
                { id: 3, title: "Competências e Atribuições", duration: 15 }
            ]
        },
        // ... mais 9 módulos
    ]
};
```

## Como Usar

### 1. Acessar a Interface
```
Abra o arquivo: C:/Users/renat/TJPE/index-v2.html
```

### 2. Reproduzir Áudio
```javascript
const player = new AudioPlayer(container, {
    title: 'Meu Áudio',
    url: '/assets/sounds/seu-arquivo.mp3'
});
```

### 3. Reproduzir Sons de Efeito
```javascript
SoundEffects.playSound('click');
SoundEffects.playSound('success');
SoundEffects.setMasterVolume(0.5);
```

### 4. Usar Animações
```javascript
Animations.fadeIn(element, 300);
Animations.animateProgressBar(progressBar, 50, 1000);
Animations.pulse(element);
```

## Integração com Narração Automática

O sistema suporta narração automática do conteúdo. Para integrar:

1. **Gerar Áudio com Text-to-Speech:**
   - Google Cloud Text-to-Speech
   - Amazon Polly
   - Azure Speech Services
   - Festival (Open Source)

2. **Salvar em `/assets/sounds/`:**
   ```
   /assets/sounds/course-intro.mp3
   /assets/sounds/module-1.mp3
   /assets/sounds/module-2.mp3
   ```

3. **Carregar no Player:**
   ```javascript
   const player = new AudioPlayer(container, {
       title: 'Visão Geral do Curso',
       url: '/assets/sounds/course-intro.mp3'
   });
   ```

## Performance

### Otimizações Implementadas

1. **CSS-in-JS Mínimo**: Estilos inline apenas quando necessário
2. **Animações Eficientes**: Usa `transform` e `opacity` (GPU-accelerated)
3. **Lazy Loading**: Áudio carregado sob demanda
4. **Síntese de Áudio**: Sons gerados via Web Audio API (sem downloads)
5. **Event Delegation**: Escuta global de eventos
6. **RequestAnimationFrame**: Sincronizado com refresh rate

### Métricas Esperadas

- **FCP (First Contentful Paint)**: <1s
- **LCP (Largest Contentful Paint)**: <2.5s
- **CLS (Cumulative Layout Shift)**: <0.1
- **TTI (Time to Interactive)**: <3s

## Compatibilidade

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile: iOS 14+, Android 8+

## Licença

Desenvolvido para TJPE Academy - 2025

## Suporte

Para questões sobre o design system, consulte:
- Documentação HTML inline
- Comentários no código
- Exemplos nos arquivos JavaScript
