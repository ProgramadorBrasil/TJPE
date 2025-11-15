/**
 * Animations - Sistema de Micro-Animações Inteligentes
 * Transições suaves, efeitos de entrada/saída e interações visuais
 */

const Animations = (() => {
    const config = {
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        enableAnimations: true
    };

    /**
     * Anima entrada de página
     */
    function animatePageEntry() {
        const elements = document.querySelectorAll('.card, .stat-card, .module-card, .objective-card');

        elements.forEach((el, index) => {
            el.style.animation = 'none';
            el.offsetHeight; // Trigger reflow
            el.style.animation = `fadeInUp 0.5s ease-out ${index * 0.05}s forwards`;
        });
    }

    /**
     * Anima um elemento com fade-in
     */
    function fadeIn(element, duration = 300) {
        if (config.prefersReducedMotion) {
            element.style.opacity = '1';
            return;
        }

        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-out`;

        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    }

    /**
     * Anima um elemento com fade-out
     */
    function fadeOut(element, duration = 300) {
        if (config.prefersReducedMotion) {
            element.style.opacity = '0';
            return;
        }

        element.style.transition = `opacity ${duration}ms ease-out`;
        element.style.opacity = '0';

        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    /**
     * Anima crescimento de um elemento
     */
    function scaleIn(element, duration = 300) {
        if (config.prefersReducedMotion) {
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
            return;
        }

        element.style.transform = 'scale(0.9)';
        element.style.opacity = '0';
        element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;

        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        }, 10);
    }

    /**
     * Anima deslizamento para baixo
     */
    function slideDown(element, duration = 300) {
        if (config.prefersReducedMotion) {
            element.style.maxHeight = element.scrollHeight + 'px';
            element.style.opacity = '1';
            return;
        }

        element.style.maxHeight = '0';
        element.style.opacity = '0';
        element.style.overflow = 'hidden';
        element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;

        setTimeout(() => {
            element.style.maxHeight = element.scrollHeight + 'px';
            element.style.opacity = '1';
        }, 10);
    }

    /**
     * Anima deslizamento para cima
     */
    function slideUp(element, duration = 300) {
        if (config.prefersReducedMotion) {
            element.style.maxHeight = '0';
            element.style.opacity = '0';
            return;
        }

        element.style.overflow = 'hidden';
        element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        element.style.maxHeight = '0';
        element.style.opacity = '0';
    }

    /**
     * Anima pulso (destaque)
     */
    function pulse(element, duration = 600) {
        if (config.prefersReducedMotion) return;

        const keyframes = `
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;

        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);

        element.style.animation = `pulse ${duration}ms ease-in-out`;

        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }

    /**
     * Anima progresso da barra
     */
    function animateProgressBar(barElement, targetPercent, duration = 1000) {
        if (config.prefersReducedMotion) {
            barElement.style.width = targetPercent + '%';
            return;
        }

        const startPercent = parseFloat(barElement.style.width) || 0;
        const startTime = Date.now();

        function updateProgress() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (cubic-bezier)
            const easeProgress = progress < 0.5
                ? 2 * progress * progress
                : -1 + (4 - 2 * progress) * progress;

            const currentPercent = startPercent + (targetPercent - startPercent) * easeProgress;
            barElement.style.width = currentPercent + '%';

            if (progress < 1) {
                requestAnimationFrame(updateProgress);
            }
        }

        requestAnimationFrame(updateProgress);
    }

    /**
     * Anima mudança de cor
     */
    function colorTransition(element, targetColor, duration = 300) {
        if (config.prefersReducedMotion) {
            element.style.color = targetColor;
            return;
        }

        const startTime = Date.now();
        const startColor = window.getComputedStyle(element).color;

        function updateColor() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Simples interpolação linear
            element.style.opacity = (1 - progress * 0.5).toString();

            if (progress >= 1) {
                element.style.color = targetColor;
                element.style.opacity = '1';
            } else {
                requestAnimationFrame(updateColor);
            }
        }

        updateColor();
    }

    /**
     * Anima rotação
     */
    function rotate(element, degrees = 360, duration = 600) {
        if (config.prefersReducedMotion) {
            element.style.transform = `rotate(${degrees}deg)`;
            return;
        }

        element.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        element.style.transform = `rotate(${degrees}deg)`;
    }

    /**
     * Anima bounce (pulo)
     */
    function bounce(element, distance = 10, duration = 300) {
        if (config.prefersReducedMotion) {
            return;
        }

        const keyframes = `
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-${distance}px); }
            }
        `;

        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);

        element.style.animation = `bounce ${duration}ms ease-in-out`;

        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }

    /**
     * Anima shake (tremor)
     */
    function shake(element, intensity = 5, duration = 300) {
        if (config.prefersReducedMotion) {
            return;
        }

        const keyframes = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(${intensity}px); }
                75% { transform: translateX(-${intensity}px); }
            }
        `;

        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);

        element.style.animation = `shake ${duration}ms ease-in-out`;

        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }

    /**
     * Anima número incrementando
     */
    function animateCounter(element, targetNumber, duration = 1000) {
        const startNumber = parseInt(element.textContent) || 0;
        const startTime = Date.now();

        function updateCounter() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing cubic-bezier
            const easeProgress = progress < 0.5
                ? 2 * progress * progress
                : -1 + (4 - 2 * progress) * progress;

            const currentNumber = Math.floor(startNumber + (targetNumber - startNumber) * easeProgress);
            element.textContent = currentNumber;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        updateCounter();
    }

    /**
     * Cria partículas flutuantes
     */
    function createFloatingParticles(container, count = 5) {
        if (config.prefersReducedMotion) return;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.6), rgba(168, 85, 247, 0.6));
                border-radius: 50%;
                pointer-events: none;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${3 + Math.random() * 2}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(particle);
        }
    }

    /**
     * Anima tipografia com efeito de digitação
     */
    function typeWriter(element, text, duration = 100) {
        element.textContent = '';
        let index = 0;

        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, duration);
            }
        }

        type();
    }

    /**
     * Limpa todas as animações de um elemento
     */
    function clearAnimations(element) {
        element.style.animation = '';
        element.style.transition = '';
        element.style.transform = '';
        element.style.opacity = '';
    }

    /**
     * Verifica se animações estão habilitadas
     */
    function areAnimationsEnabled() {
        return config.enableAnimations && !config.prefersReducedMotion;
    }

    /**
     * Define se animações estão habilitadas
     */
    function setAnimationsEnabled(enabled) {
        config.enableAnimations = enabled;
    }

    return {
        animatePageEntry,
        fadeIn,
        fadeOut,
        scaleIn,
        slideDown,
        slideUp,
        pulse,
        animateProgressBar,
        colorTransition,
        rotate,
        bounce,
        shake,
        animateCounter,
        createFloatingParticles,
        typeWriter,
        clearAnimations,
        areAnimationsEnabled,
        setAnimationsEnabled
    };
})();

// Injetar estilos de animações
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    /* Animações Base */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }

    @keyframes float {
        0%, 100% {
            transform: translateY(0px) translateX(0px);
        }
        25% {
            transform: translateY(-10px) translateX(-5px);
        }
        50% {
            transform: translateY(-20px) translateX(5px);
        }
        75% {
            transform: translateY(-10px) translateX(-5px);
        }
    }

    @keyframes glow {
        0%, 100% {
            box-shadow: 0 0 0 rgba(99, 102, 241, 0.4);
        }
        50% {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.8);
        }
    }

    @keyframes shimmer {
        0% {
            background-position: -1000px 0;
        }
        100% {
            background-position: 1000px 0;
        }
    }

    @keyframes wobble {
        0%, 100% { transform: translateX(0); }
        15% { transform: translateX(-5px) rotate(-5deg); }
        30% { transform: translateX(5px) rotate(3deg); }
        45% { transform: translateX(-5px) rotate(-3deg); }
        60% { transform: translateX(3px) rotate(2deg); }
        75% { transform: translateX(-2px) rotate(-1deg); }
    }

    @keyframes heartbeat {
        0%, 100% { transform: scale(1); }
        14% { transform: scale(1.1); }
        28% { transform: scale(1); }
        42% { transform: scale(1.1); }
        70% { transform: scale(1); }
    }

    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideInFromLeft {
        from {
            opacity: 0;
            transform: translateX(-100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    /* Hover Effects */
    .interactive {
        transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .interactive:hover {
        transform: translateY(-2px);
    }

    /* Smooth Transitions */
    button, a, .clickable {
        transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Loading Animation */
    .loading {
        animation: fadeInUp 500ms ease-out;
    }

    /* Stagger Children */
    .stagger-children > * {
        opacity: 0;
        animation: fadeInUp 500ms ease-out forwards;
    }

    .stagger-children > *:nth-child(1) { animation-delay: 0ms; }
    .stagger-children > *:nth-child(2) { animation-delay: 50ms; }
    .stagger-children > *:nth-child(3) { animation-delay: 100ms; }
    .stagger-children > *:nth-child(4) { animation-delay: 150ms; }
    .stagger-children > *:nth-child(5) { animation-delay: 200ms; }
    .stagger-children > *:nth-child(n+6) { animation-delay: 250ms; }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;

document.head.appendChild(animationStyles);

// Aplicar animações ao carregar página
document.addEventListener('DOMContentLoaded', () => {
    Animations.animatePageEntry();
});
