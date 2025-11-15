# Guia de Uso - Interface V2 TJPE Academy

## Início Rápido

### 1. Acessar a Interface
```
URL: file:///C:/Users/renat/TJPE/index-v2.html
ou
HTTP Local: http://localhost/TJPE/index-v2.html (se servido)
```

### 2. Primeira Execução

A interface carrega com:
- Header com logo "TJPE Academy"
- Badge de usuário "👤 Aprendiz"
- Página inicial "Sobre o Curso" ativa
- Controle de som flutuante no canto inferior direito

### 3. Navegação Básica

**Clique nos botões para:**
- Alternar entre "Sobre o Curso" e "Módulos do Curso"
- Usar as 3 abas na seção de módulos:
  - Visão Geral
  - Módulos do Curso
  - Meu Progresso

## Funcionalidades Principais

### Página "Sobre o Curso"

#### Stats (Estatísticas)
- Mostra: 10 Módulos, 9h Duração, Certificado ✓
- Cards animados ao passar o mouse
- Cores em gradiente primário

#### Seção de Objetivos
3 cards com checkmarks verdes:
1. **Aprendizado Prático**
   - Conceitos fundamentais do TJPE
   - Procedimentos e regulamentações
   - Casos práticos

2. **Desenvolvimento Profissional**
   - Certificação reconhecida
   - Networking profissional
   - Progressão de carreira

3. **Competências Técnicas**
   - Domínio de ferramentas
   - Performance profissional
   - Atualizações contínuas

#### Público-Alvo
Lista de 5 tipos de audiência para o curso

#### O Que Você Vai Aprender
2 cards com 5 tópicos cada de conteúdo prático

#### Player de Áudio
- Reproduz narração da visão geral do curso
- Controles: Play/Pause, Volume, Velocidade, Loop, Download
- Visualizador de ondas animado

### Página "Módulos do Curso"

#### Tab: Visão Geral
- **Barra de Progresso Geral**
  - Mostra percentual de módulos concluídos
  - Anima suavemente
  - Efeito glow verde

- **Barra de Horas de Estudo**
  - Mostra horas estudadas de 9 total
  - Sincroniza com progresso

- **Card de Boas-vindas**
  - Informações sobre o curso
  - Instruções de uso

#### Tab: Módulos do Curso
**10 Módulos Expandíveis:**

Cada módulo exibe:
- Número do módulo (Módulo 1, etc)
- Título do módulo
- Descrição breve
- Meta informações (📚 X aulas, ⏱️ XX min)
- Botão ▼ expandir/recolher

**Ao Expandir, Mostra:**
Lista de aulas com:
- Círculo vazio (status não completo)
- Título da aula
- Duração em minutos
- Botão "Iniciar" em gradiente

#### Tab: Meu Progresso
**3 Estatísticas:**
- Módulos Completos (contador)
- Aulas Concluídas (contador)
- Taxa de Conclusão (percentual)

**Histórico:**
- Mostra progresso de aprendizado
- Atualiza em tempo real

### Controle de Som Flutuante

Localizado no canto inferior direito:

**Botão Principal:** 🔊
- Clique para abrir menu
- Animação de entrada suave

**Menu de Controle:**
- Slider de volume (0-100%)
- Botão "Testar Som" (reproduz som de sucesso)

**Eventos Automáticos:**
- Cliques em botões = som "click"
- Hover em elementos = som "hover"
- Transições = sons variados
- Completar aula = som "success"

## Interações Disponíveis

### Clicar em Elementos

```
Botão Play/Pause do Player
→ Reproduz/pausa o áudio

Botão de Velocidade
→ Abre menu com 5 opções (0.75x - 2x)

Botão de Loop
→ Ativa/desativa repetição

Botão de Download
→ Baixa o arquivo de áudio

Módulo Card (qualquer área)
→ Expande/recolhe a lista de aulas

Botão "Iniciar" (em uma aula)
→ Simula início da aula (alerta com nome)

Círculo Vazio (status da aula)
→ Marca aula como concluída
→ Anima checkmark verde
→ Atualiza barras de progresso
```

### Hover Effects

```
Cards em geral
→ Elevar, mudar cor de borda, sombra maior

Botões
→ Escurece, eleva ligeiramente, glow aumenta

Links
→ Muda cor, sublinha aparece
```

### Transições de Abas

```
Clicar em uma aba diferente
→ Conteúdo anterior desaparece (fade out)
→ Novo conteúdo aparece (fade in)
→ Indicador visual muda
→ Som de transição toca
```

## Animações Implementadas

### Animações de Entrada
- **fadeInUp**: Fade + movimento para cima (cards)
- **slideDown**: Deslizamento suave (aulas)
- **scaleIn**: Escala com fade (elementos importantes)

### Animações de Progresso
- **animateProgressBar**: Barra progride suavemente com easing
- **animateCounter**: Números incrementam animados
- **pulse**: Destaque pulsante (notificações)

### Efeitos de Interação
- **bounce**: Pulo ao expandir módulo
- **shake**: Tremor em erro (feedback negativo)
- **rotate**: Rotação do ícone de expand

### Animações Contínuas
- **visualizerBounce**: Barras do visualizador de áudio
- **float**: Partículas flutuando
- **glow**: Brilho em elementos destaque

## Sons de Interação

```javascript
SoundEffects.playSound('click')         // Clique padrão
SoundEffects.playSound('hover')         // Hover em elemento
SoundEffects.playSound('success')       // Ação bem-sucedida
SoundEffects.playSound('error')         // Erro
SoundEffects.playSound('page-transition') // Mudança de página
SoundEffects.playSound('tab-switch')    // Mudança de aba
SoundEffects.playSound('module-expand') // Expandir módulo
SoundEffects.playSound('lesson-complete') // Aula concluída
SoundEffects.playSound('lesson-start')  // Aula iniciada
SoundEffects.playSound('notification')  // Notificação
```

## Dados do Curso

O curso possui estrutura pré-carregada com:

### 10 Módulos:
1. Introdução ao TJPE (3 aulas, 45 min)
2. Processo Civil Básico (3 aulas, 60 min)
3. Legislação Aplicável (3 aulas, 55 min)
4. Tecnologia e Sistemas (3 aulas, 50 min)
5. Ética e Conduta Profissional (3 aulas, 40 min)
6. Atendimento ao Público (3 aulas, 35 min)
7. Documentação e Arquivo (3 aulas, 50 min)
8. Processo Criminal (3 aulas, 65 min)
9. Família e Sucessões (3 aulas, 55 min)
10. Prática Jurídica Avançada (3 aulas, 50 min)

**Total:** 30 aulas, 9 horas

### Cada Aula Tem:
- ID único
- Título descritivo
- Duração em minutos
- Status (completo/incompleto)

## Responsividade

### Em Desktop (>1200px)
- Layout completo com todos os elementos
- Cards em grid
- Todos os controles visíveis
- Animações em velocidade normal

### Em Tablet (768px - 1200px)
- Layout ajustado
- Alguns elementos em stack
- Espaçamento reduzido
- Controles ainda visíveis

### Em Mobile (<768px)
- Stack vertical completo
- Botões maiores para toque
- Menu colapsável
- Volume slider oculto
- Visualizador simplificado

## Acessibilidade

### Teclas de Navegação
```
Tab: Navegar entre elementos
Enter/Space: Ativar botão
Escape: Fechar menu aberto
```

### Suporte a Leitores de Tela
- Labels descritivos em inputs
- ARIA labels em botões
- Estrutura semântica HTML

### Preferências de Redução de Movimento
- Detecta automaticamente
- Desativa animações se ativado
- Mantém funcionalidade
- Navegação normal

## Personalização

### Alterar Cores

Edite `index-v2.html` na seção `:root`:

```css
:root {
    --primary: #6366f1;        /* Azul padrão */
    --primary-dark: #4f46e5;
    --primary-light: #818cf8;

    --secondary: #10b981;      /* Verde padrão */
    /* ... */
}
```

### Alterar Conteúdo

Edite os textos diretamente no HTML:

```html
<h1>Seu Novo Título</h1>
<p class="subtitle">Seu novo subtítulo</p>
```

### Alterar Módulos

Modifique o objeto `courseData` no arquivo:

```javascript
const courseData = {
    modules: [
        {
            id: 1,
            number: 1,
            title: "Seu Módulo",
            description: "Sua descrição",
            duration: 45,
            lessons: [
                // suas aulas
            ]
        }
    ]
};
```

## Integração com Backend

Para conectar com um servidor:

### 1. Carregar Dados do Servidor
```javascript
async function loadCourseData() {
    const response = await fetch('/api/course-data');
    const data = await response.json();
    courseData.modules = data.modules;
    renderModules();
}

loadCourseData();
```

### 2. Salvar Progresso
```javascript
async function saveProgress() {
    await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            completedLessons: completedLessons,
            completedModules: completedModules
        })
    });
}
```

### 3. Carregar Áudio Dinâmico
```javascript
const player = new AudioPlayer(container, {
    title: userData.moduleName,
    url: `/api/audio/${userData.moduleId}`
});
```

## Solução de Problemas

### Áudio Não Reproduz
1. Verifique permissões CORS
2. Teste caminho do arquivo
3. Verifique formato (MP3/WAV/OGG)
4. Teste em navegador diferentes

### Animações Não Funcionam
1. Verifique `prefers-reduced-motion`
2. Teste em navegador atualizado
3. Verifique console para erros
4. Desabilite extensões de bloqueio

### Sons Não Tocam
1. Verifique volume do sistema
2. Teste controle de som flutuante
3. Verifique permissões de áudio
4. Teste com diferentes navegadores

### Progresso Não Atualiza
1. Abra console (F12)
2. Clique em círculo vazio de aula
3. Verifique logs de erro
4. Limpe cache e recarregue

## Performance

### Otimizações Aplicadas
- CSS Grid para layout eficiente
- GPU-accelerated transforms
- Síntese de áudio via Web Audio API
- Event delegation para reduzir listeners
- RequestAnimationFrame sincronizado

### Métricas Esperadas
- FCP: <1s
- LCP: <2.5s
- CLS: <0.1
- TTI: <3s

## Compatibilidade de Navegadores

✓ Chrome 90+
✓ Firefox 88+
✓ Safari 14+
✓ Edge 90+
✓ Opera 76+
✓ Mobile Safari (iOS 14+)
✓ Chrome Mobile (Android 8+)

## Support & Feedback

Para suporte técnico ou feedback:
1. Abra o console (F12)
2. Verifique logs de erro
3. Documente o comportamento esperado
4. Forneça steps para reproduzir

## Próximas Melhorias

- [ ] Integração com LMS externo
- [ ] Dark mode toggle
- [ ] Linguagem múltipla
- [ ] Certificado digital PDF
- [ ] Quiz interativo
- [ ] Discussão em fórum
- [ ] Rastreamento detalhado
- [ ] Modo offline

---

**Versão**: 2.0
**Data**: 15 de Novembro de 2025
**Status**: Pronto para Produção
