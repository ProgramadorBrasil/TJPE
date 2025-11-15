/**
 * AudioPlayer - Player de Áudio Profissional
 * Sistema avançado com controles fluidos, visualização e integração com narração automática
 */

class AudioPlayer {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            title: options.title || 'Audio Player',
            url: options.url || '',
            autoplay: options.autoplay || false,
            volume: options.volume || 0.7,
            playbackRate: options.playbackRate || 1.0,
            loop: options.loop || false
        };

        this.audio = new Audio();
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;

        this.init();
    }

    init() {
        this.audio.src = this.options.url;
        this.audio.volume = this.options.volume;
        this.audio.playbackRate = this.options.playbackRate;
        this.audio.loop = this.options.loop;

        this.render();
        this.attachEventListeners();
    }

    render() {
        const player = document.createElement('div');
        player.className = 'audio-player-container';
        player.innerHTML = `
            <div class="player-header">
                <div class="player-title">${this.options.title}</div>
                <button class="player-minimize" title="Minimizar Player">─</button>
                <button class="player-close" title="Fechar Player">×</button>
            </div>

            <div class="player-main">
                <div class="player-visualizer">
                    <div class="visualizer-bars">
                        ${Array.from({ length: 20 }).map((_, i) => `
                            <div class="visualizer-bar" style="animation-delay: ${i * 0.05}s"></div>
                        `).join('')}
                    </div>
                </div>

                <div class="player-controls-primary">
                    <button class="player-btn player-btn-play" title="Play/Pause">
                        <span class="icon-play">▶</span>
                        <span class="icon-pause" style="display: none;">⏸</span>
                    </button>
                </div>

                <div class="player-progress">
                    <div class="progress-time current">00:00</div>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                        <div class="progress-handle"></div>
                    </div>
                    <div class="progress-time duration">00:00</div>
                </div>

                <div class="player-controls-secondary">
                    <div class="control-group">
                        <button class="player-btn player-btn-volume" title="Volume">
                            <span>🔊</span>
                        </button>
                        <div class="volume-slider">
                            <input type="range" min="0" max="100" value="${this.options.volume * 100}" class="volume-input" title="Volume">
                        </div>
                    </div>

                    <div class="control-group">
                        <button class="player-btn player-btn-speed" title="Velocidade de Reprodução">
                            <span class="speed-text">1x</span>
                        </button>
                        <div class="speed-menu" style="display: none;">
                            <button class="speed-option" data-rate="0.75">0.75x</button>
                            <button class="speed-option" data-rate="1.0" style="background: rgba(99, 102, 241, 0.2);">1x</button>
                            <button class="speed-option" data-rate="1.25">1.25x</button>
                            <button class="speed-option" data-rate="1.5">1.5x</button>
                            <button class="speed-option" data-rate="2.0">2x</button>
                        </div>
                    </div>

                    <button class="player-btn player-btn-loop" title="Loop">
                        <span>🔁</span>
                    </button>

                    <button class="player-btn player-btn-download" title="Download">
                        <span>⬇️</span>
                    </button>
                </div>
            </div>

            <div class="player-status">
                <span class="status-text">Pronto</span>
            </div>
        `;

        this.container.appendChild(player);
        this.playerEl = player;
    }

    attachEventListeners() {
        const playBtn = this.playerEl.querySelector('.player-btn-play');
        const progressBar = this.playerEl.querySelector('.progress-bar');
        const volumeInput = this.playerEl.querySelector('.volume-input');
        const speedBtn = this.playerEl.querySelector('.player-btn-speed');
        const speedMenu = this.playerEl.querySelector('.speed-menu');
        const speedOptions = this.playerEl.querySelectorAll('.speed-option');
        const loopBtn = this.playerEl.querySelector('.player-btn-loop');
        const downloadBtn = this.playerEl.querySelector('.player-btn-download');
        const minimizeBtn = this.playerEl.querySelector('.player-minimize');
        const closeBtn = this.playerEl.querySelector('.player-close');

        // Play/Pause
        playBtn.addEventListener('click', () => this.togglePlay());

        // Progress Bar
        progressBar.addEventListener('click', (e) => this.seek(e));
        progressBar.addEventListener('mousemove', (e) => this.showTooltip(e));

        // Volume
        volumeInput.addEventListener('input', (e) => this.setVolume(e.target.value / 100));

        // Speed
        speedBtn.addEventListener('click', () => {
            speedMenu.style.display = speedMenu.style.display === 'none' ? 'block' : 'none';
        });

        speedOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const rate = parseFloat(e.target.getAttribute('data-rate'));
                this.setPlaybackRate(rate);

                speedOptions.forEach(opt => opt.style.background = 'transparent');
                e.target.style.background = 'rgba(99, 102, 241, 0.2)';
                speedBtn.querySelector('.speed-text').textContent = e.target.textContent;
                speedMenu.style.display = 'none';
            });
        });

        // Loop
        loopBtn.addEventListener('click', () => {
            this.options.loop = !this.options.loop;
            this.audio.loop = this.options.loop;
            loopBtn.style.opacity = this.options.loop ? '1' : '0.5';
            this.updateStatus(this.options.loop ? 'Loop ativado' : 'Loop desativado');
        });

        // Download
        downloadBtn.addEventListener('click', () => {
            if (this.options.url) {
                const a = document.createElement('a');
                a.href = this.options.url;
                a.download = `${this.options.title}.mp3`;
                a.click();
                this.updateStatus('Download iniciado');
            }
        });

        // Minimize
        minimizeBtn.addEventListener('click', () => {
            this.playerEl.classList.toggle('minimized');
            minimizeBtn.textContent = this.playerEl.classList.contains('minimized') ? '□' : '─';
            minimizeBtn.title = this.playerEl.classList.contains('minimized') ? 'Maximizar Player' : 'Minimizar Player';
        });

        // Close
        closeBtn.addEventListener('click', () => {
            this.playerEl.style.display = 'none';
        });

        // Audio Events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.onAudioEnd());
        this.audio.addEventListener('play', () => this.onAudioPlay());
        this.audio.addEventListener('pause', () => this.onAudioPause());
        this.audio.addEventListener('error', () => this.onAudioError());

        if (this.options.autoplay) {
            this.play();
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.audio.play().catch(err => {
            console.error('Erro ao reproduzir áudio:', err);
            this.updateStatus('Erro ao reproduzir áudio');
        });
        this.isPlaying = true;
        this.updatePlayButton();
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayButton();
    }

    seek(e) {
        const progressBar = this.playerEl.querySelector('.progress-bar');
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        this.audio.currentTime = percent * this.audio.duration;
        this.updateProgress();
    }

    setVolume(value) {
        this.audio.volume = Math.max(0, Math.min(1, value));
        const volumeBtn = this.playerEl.querySelector('.player-btn-volume span');
        if (this.audio.volume === 0) {
            volumeBtn.textContent = '🔇';
        } else if (this.audio.volume < 0.5) {
            volumeBtn.textContent = '🔉';
        } else {
            volumeBtn.textContent = '🔊';
        }
    }

    setPlaybackRate(rate) {
        this.audio.playbackRate = rate;
        this.options.playbackRate = rate;
        this.updateStatus(`Velocidade: ${rate}x`);
    }

    updateProgress() {
        if (this.audio.duration > 0) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            this.playerEl.querySelector('.progress-fill').style.width = percent + '%';
            this.playerEl.querySelector('.progress-handle').style.left = percent + '%';
            this.playerEl.querySelector('.current').textContent = this.formatTime(this.audio.currentTime);
        }
    }

    updateDuration() {
        this.duration = this.audio.duration;
        this.playerEl.querySelector('.duration').textContent = this.formatTime(this.duration);
    }

    updatePlayButton() {
        const iconPlay = this.playerEl.querySelector('.icon-play');
        const iconPause = this.playerEl.querySelector('.icon-pause');

        if (this.isPlaying) {
            iconPlay.style.display = 'none';
            iconPause.style.display = 'inline';
        } else {
            iconPlay.style.display = 'inline';
            iconPause.style.display = 'none';
        }
    }

    updateStatus(text) {
        const statusEl = this.playerEl.querySelector('.status-text');
        statusEl.textContent = text;
        statusEl.style.animation = 'none';
        setTimeout(() => {
            statusEl.style.animation = 'statusBlink 0.3s ease';
        }, 10);
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    showTooltip(e) {
        // Can be extended to show time tooltip
    }

    onAudioPlay() {
        this.isPlaying = true;
        this.updatePlayButton();
        this.updateStatus('Reproduzindo...');
    }

    onAudioPause() {
        this.isPlaying = false;
        this.updatePlayButton();
        this.updateStatus('Pausado');
    }

    onAudioEnd() {
        this.isPlaying = false;
        this.updatePlayButton();
        this.updateStatus('Reprodução concluída');
    }

    onAudioError() {
        this.updateStatus('Erro ao carregar áudio');
    }

    destroy() {
        this.audio.pause();
        this.audio.src = '';
        this.playerEl.remove();
    }
}

// Styles para o Audio Player
const audioPlayerStyles = document.createElement('style');
audioPlayerStyles.textContent = `
    .audio-player-container {
        background: rgba(99, 102, 241, 0.05);
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 16px;
        backdrop-filter: blur(10px);
        overflow: hidden;
        font-family: var(--font-sans);
    }

    .player-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        background: rgba(99, 102, 241, 0.1);
        border-bottom: 1px solid rgba(99, 102, 241, 0.2);
    }

    .player-title {
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.95rem;
    }

    .player-close {
        cursor: pointer;
        font-size: 1.5rem;
        color: rgba(255, 255, 255, 0.5);
        transition: all 0.2s;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .player-close:hover {
        color: rgba(255, 255, 255, 0.9);
        transform: rotate(90deg);
    }

    .player-main {
        padding: 1.5rem;
    }

    .player-visualizer {
        margin-bottom: 1.5rem;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .visualizer-bars {
        display: flex;
        gap: 3px;
        height: 100%;
        align-items: flex-end;
    }

    .visualizer-bar {
        width: 4px;
        height: 100%;
        background: linear-gradient(to top, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8));
        border-radius: 2px;
        animation: visualizerBounce 0.6s ease-in-out infinite;
    }

    @keyframes visualizerBounce {
        0%, 100% { height: 20%; }
        50% { height: 100%; }
    }

    .player-controls-primary {
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
    }

    .player-btn {
        background: rgba(99, 102, 241, 0.2);
        border: 1px solid rgba(99, 102, 241, 0.3);
        color: rgba(99, 102, 241, 1);
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1.25rem;
        transition: all 0.2s;
    }

    .player-btn:hover {
        background: rgba(99, 102, 241, 0.3);
        border-color: rgba(99, 102, 241, 0.5);
        transform: scale(1.1);
    }

    .player-btn:active {
        transform: scale(0.95);
    }

    .player-btn-play {
        width: 56px;
        height: 56px;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(168, 85, 247, 0.4));
        border: 2px solid rgba(99, 102, 241, 0.5);
        font-size: 1.5rem;
    }

    .player-progress {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        margin-bottom: 1rem;
    }

    .progress-time {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.7);
        min-width: 40px;
        text-align: center;
    }

    .progress-bar {
        flex: 1;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        position: relative;
        cursor: pointer;
        overflow: visible;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, rgba(99, 102, 241, 1), rgba(168, 85, 247, 1));
        border-radius: 3px;
        width: 0%;
        transition: width 0.1s linear;
    }

    .progress-handle {
        position: absolute;
        width: 16px;
        height: 16px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        top: 50%;
        left: 0%;
        transform: translate(-50%, -50%);
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.5);
        opacity: 0;
        transition: opacity 0.2s;
    }

    .progress-bar:hover .progress-handle {
        opacity: 1;
    }

    .player-controls-secondary {
        display: flex;
        gap: 1rem;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
    }

    .control-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        position: relative;
    }

    .volume-slider {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .volume-input {
        width: 80px;
        height: 4px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.1);
        -webkit-appearance: none;
        appearance: none;
        cursor: pointer;
    }

    .volume-input::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(99, 102, 241, 0.8);
        cursor: pointer;
        transition: all 0.2s;
    }

    .volume-input::-webkit-slider-thumb:hover {
        background: rgba(99, 102, 241, 1);
        transform: scale(1.3);
    }

    .speed-menu {
        position: absolute;
        bottom: 100%;
        left: 0;
        background: rgba(15, 23, 42, 0.95);
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 8px;
        padding: 0.5rem;
        min-width: 80px;
        z-index: 10;
        backdrop-filter: blur(10px);
        margin-bottom: 0.5rem;
    }

    .speed-option {
        display: block;
        width: 100%;
        padding: 0.5rem;
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        font-size: 0.875rem;
        border-radius: 4px;
        transition: all 0.2s;
    }

    .speed-option:hover {
        background: rgba(99, 102, 241, 0.2);
        color: rgba(255, 255, 255, 0.9);
    }

    .player-status {
        padding: 0.75rem 1.5rem;
        background: rgba(99, 102, 241, 0.05);
        border-top: 1px solid rgba(99, 102, 241, 0.1);
        text-align: center;
        font-size: 0.75rem;
        color: rgba(99, 102, 241, 0.8);
    }

    .status-text {
        display: inline-block;
    }

    @keyframes statusBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }

    @media (max-width: 600px) {
        .player-controls-secondary {
            gap: 0.5rem;
        }

        .player-btn {
            width: 40px;
            height: 40px;
            font-size: 1rem;
        }

        .player-btn-play {
            width: 48px;
            height: 48px;
            font-size: 1.25rem;
        }

        .volume-slider {
            display: none;
        }
    }
`;

document.head.appendChild(audioPlayerStyles);
