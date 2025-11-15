/**
 * SoundEffects - Sistema de Efeitos Sonoros
 * Sons de interação, cliques, transições e feedback auditivo
 */

const SoundEffects = (() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let isMuted = false;
    let masterVolume = 0.3;

    // Definições de sons sintetizados
    const sounds = {
        'click': {
            type: 'sine',
            frequency: 800,
            duration: 0.1,
            envelope: { attack: 0.01, decay: 0.05 }
        },
        'hover': {
            type: 'sine',
            frequency: 600,
            duration: 0.08,
            envelope: { attack: 0.01, decay: 0.04 }
        },
        'success': {
            type: 'sequence',
            frequencies: [800, 1000, 1200],
            duration: 0.15,
            envelope: { attack: 0.01, decay: 0.08 }
        },
        'error': {
            type: 'sine',
            frequency: 300,
            duration: 0.2,
            envelope: { attack: 0.02, decay: 0.15 }
        },
        'page-transition': {
            type: 'sweep',
            startFreq: 400,
            endFreq: 600,
            duration: 0.3,
            envelope: { attack: 0.05, decay: 0.2 }
        },
        'tab-switch': {
            type: 'sine',
            frequency: 700,
            duration: 0.12,
            envelope: { attack: 0.01, decay: 0.06 }
        },
        'module-expand': {
            type: 'sweep',
            startFreq: 500,
            endFreq: 800,
            duration: 0.25,
            envelope: { attack: 0.03, decay: 0.15 }
        },
        'lesson-complete': {
            type: 'sequence',
            frequencies: [600, 800, 1000, 1200],
            duration: 0.12,
            envelope: { attack: 0.01, decay: 0.08 }
        },
        'lesson-start': {
            type: 'sweep',
            startFreq: 300,
            endFreq: 600,
            duration: 0.4,
            envelope: { attack: 0.05, decay: 0.3 }
        },
        'notification': {
            type: 'pulse',
            frequency: 900,
            duration: 0.3,
            envelope: { attack: 0.02, decay: 0.2 }
        }
    };

    /**
     * Reproduz um som
     * @param {string} soundName - Nome do som
     * @param {number} volume - Volume (0-1)
     */
    function playSound(soundName, volume = 1) {
        if (isMuted || !sounds[soundName]) return;

        try {
            const sound = sounds[soundName];
            const finalVolume = masterVolume * volume;

            switch (sound.type) {
                case 'sine':
                    playSineWave(sound, finalVolume);
                    break;
                case 'sequence':
                    playSequence(sound, finalVolume);
                    break;
                case 'sweep':
                    playSweep(sound, finalVolume);
                    break;
                case 'pulse':
                    playPulse(sound, finalVolume);
                    break;
            }
        } catch (error) {
            console.error('Erro ao reproduzir som:', error);
        }
    }

    /**
     * Toca uma onda senoidal
     */
    function playSineWave(config, volume) {
        const now = audioContext.currentTime;
        const envelope = config.envelope;

        // Oscilador
        const oscillator = audioContext.createOscillator();
        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(config.frequency, now);

        // Ganho com envelope
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + envelope.attack);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + envelope.attack + envelope.decay);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(now);
        oscillator.stop(now + envelope.attack + envelope.decay);
    }

    /**
     * Toca uma sequência de frequências
     */
    function playSequence(config, volume) {
        const now = audioContext.currentTime;
        const envelope = config.envelope;
        const stepDuration = config.duration / config.frequencies.length;

        config.frequencies.forEach((frequency, index) => {
            const stepStart = now + (index * stepDuration);

            const oscillator = audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, stepStart);

            const gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(0, stepStart);
            gainNode.gain.linearRampToValueAtTime(volume, stepStart + envelope.attack);
            gainNode.gain.exponentialRampToValueAtTime(0.01, stepStart + stepDuration);

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start(stepStart);
            oscillator.stop(stepStart + stepDuration);
        });
    }

    /**
     * Toca um varredura de frequência (sweep)
     */
    function playSweep(config, volume) {
        const now = audioContext.currentTime;
        const envelope = config.envelope;

        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(config.startFreq, now);
        oscillator.frequency.exponentialRampToValueAtTime(config.endFreq, now + config.duration);

        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + envelope.attack);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + config.duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(now);
        oscillator.stop(now + config.duration);
    }

    /**
     * Toca um pulso (beep)
     */
    function playPulse(config, volume) {
        const now = audioContext.currentTime;
        const envelope = config.envelope;

        const oscillator = audioContext.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(config.frequency, now);

        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + envelope.attack);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + envelope.attack + envelope.decay);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(now);
        oscillator.stop(now + envelope.attack + envelope.decay);
    }

    /**
     * Define o volume mestre
     */
    function setMasterVolume(value) {
        masterVolume = Math.max(0, Math.min(1, value));
    }

    /**
     * Ativa/desativa mudo
     */
    function toggleMute() {
        isMuted = !isMuted;
        return isMuted;
    }

    /**
     * Define mudo
     */
    function setMute(mute) {
        isMuted = mute;
    }

    /**
     * Retorna se está mutado
     */
    function getMute() {
        return isMuted;
    }

    /**
     * Toca uma sequência de sons
     */
    function playSequenceOfSounds(soundNames, interval = 100) {
        soundNames.forEach((name, index) => {
            setTimeout(() => {
                playSound(name);
            }, index * interval);
        });
    }

    /**
     * Registra som customizado
     */
    function registerSound(name, config) {
        sounds[name] = config;
    }

    // Auto-play sons em eventos do DOM
    document.addEventListener('click', (e) => {
        const target = e.target.closest('button, a, .clickable');
        if (target && !isMuted) {
            playSound('click', 0.8);
        }
    }, true);

    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('button, a, .hoverable');
        if (target && !isMuted) {
            playSound('hover', 0.6);
        }
    }, true);

    return {
        playSound,
        setMasterVolume,
        toggleMute,
        setMute,
        getMute,
        playSequenceOfSounds,
        registerSound,
        sounds
    };
})();

// Estilos para visualização de sons
const soundEffectsStyles = document.createElement('style');
soundEffectsStyles.textContent = `
    @keyframes soundPulse {
        0% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
        }
    }

    .sound-pulse {
        animation: soundPulse 0.5s ease-out;
    }

    /* Controles de áudio */
    .sound-control {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
    }

    .sound-toggle {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8));
        border: 2px solid rgba(255, 255, 255, 0.3);
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
    }

    .sound-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
    }

    .sound-toggle.muted {
        opacity: 0.6;
    }

    .sound-menu {
        position: absolute;
        bottom: 70px;
        right: 0;
        background: rgba(15, 23, 42, 0.95);
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 12px;
        padding: 1rem;
        min-width: 200px;
        backdrop-filter: blur(10px);
        display: none;
        z-index: 10000;
        box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
    }

    .sound-menu.visible {
        display: block;
        animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .sound-control-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sound-control-item:last-child {
        border-bottom: none;
    }

    .sound-control-item label {
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.875rem;
        cursor: pointer;
    }

    .sound-control-item input[type="range"] {
        width: 100px;
        height: 4px;
    }

    .sound-test-btn {
        width: 100%;
        padding: 0.5rem;
        margin-top: 0.75rem;
        background: rgba(99, 102, 241, 0.2);
        border: 1px solid rgba(99, 102, 241, 0.3);
        color: rgba(99, 102, 241, 0.8);
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.875rem;
        transition: all 0.2s;
    }

    .sound-test-btn:hover {
        background: rgba(99, 102, 241, 0.3);
        border-color: rgba(99, 102, 241, 0.5);
    }
`;

document.head.appendChild(soundEffectsStyles);

// Inicializar controles de som
document.addEventListener('DOMContentLoaded', () => {
    // Criar controle de som flutuante
    const soundControl = document.createElement('div');
    soundControl.className = 'sound-control';
    soundControl.innerHTML = `
        <button class="sound-toggle" title="Controles de Som">🔊</button>
        <div class="sound-menu">
            <div class="sound-control-item">
                <label>Volume</label>
                <input type="range" min="0" max="100" value="30" class="volume-slider">
            </div>
            <button class="sound-test-btn">Testar Som</button>
        </div>
    `;

    document.body.appendChild(soundControl);

    const toggle = soundControl.querySelector('.sound-toggle');
    const menu = soundControl.querySelector('.sound-menu');
    const volumeSlider = soundControl.querySelector('.volume-slider');
    const testBtn = soundControl.querySelector('.sound-test-btn');

    toggle.addEventListener('click', () => {
        menu.classList.toggle('visible');
        SoundEffects.playSound('click');
    });

    volumeSlider.addEventListener('input', (e) => {
        SoundEffects.setMasterVolume(e.target.value / 100);
    });

    testBtn.addEventListener('click', () => {
        SoundEffects.playSound('success');
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!soundControl.contains(e.target)) {
            menu.classList.remove('visible');
        }
    });
});
