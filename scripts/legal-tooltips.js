/**
 * LEGAL TOOLTIPS SYSTEM
 * Automatically detects legal article references and shows detailed tooltips on hover
 * Supports: CPC, CTN, Lei 9.514/97, CF, CC, Lei 6.015/73
 * Author: Renato Gracie
 * Date: 15/11/2025
 */

class LegalTooltipSystem {
    constructor(articlesDatabase) {
        this.articles = articlesDatabase || {};
        this.currentTooltip = null;
        this.tooltipTimeout = null;
        this.init();
    }

    init() {
        console.log('Inicializando sistema de tooltips legais...');
        console.log('Artigos carregados:', Object.keys(this.articles).length);

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.processContent());
        } else {
            this.processContent();
        }

        // Listen for keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentTooltip) {
                this.hideTooltip();
            }
        });
    }

    /**
     * Process content and detect legal references
     */
    processContent() {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) {
            console.warn('mainContent not found');
            return;
        }

        this.detectAndWrapReferences(mainContent);
        console.log('Referências legais processadas');
    }

    /**
     * Detect and wrap legal article references
     */
    detectAndWrapReferences(container) {
        // Patterns for different legal references
        const patterns = [
            {
                regex: /(?:CPC|Código de Processo Civil)[,\s-]*(?:art\.?|artigo|Arts?\.?)\s*(\d+)/gi,
                prefix: 'CPC'
            },
            {
                regex: /(?:CTN|Código Tributário Nacional)[,\s-]*(?:art\.?|artigo|Arts?\.?)\s*(\d+)/gi,
                prefix: 'CTN'
            },
            {
                regex: /Lei\s*9\.514\/97[,\s-]*(?:art\.?|artigo|Arts?\.?)\s*(\d+)/gi,
                prefix: 'Lei-9514'
            },
            {
                regex: /(?:CF|Constituição Federal)[,\s-]*(?:art\.?|artigo|Arts?\.?)\s*5º[,\s-]*(?:inc\.?|inciso)?\s*(XXII|XXIII)/gi,
                prefix: 'CF-5'
            },
            {
                regex: /(?:CF|Constituição Federal)[,\s-]*(?:art\.?|artigo|Arts?\.?)\s*(\d+)/gi,
                prefix: 'CF'
            },
            {
                regex: /(?:CC|Código Civil)[,\s-]*(?:art\.?|artigo|Arts?\.?)\s*(\d+)/gi,
                prefix: 'CC'
            },
            {
                regex: /Lei\s*6\.015\/73[,\s-]*(?:art\.?|artigo|Arts?\.?)\s*(\d+)/gi,
                prefix: 'Lei-6015'
            }
        ];

        // Process text nodes
        this.processTextNodes(container, patterns);
    }

    /**
     * Process text nodes and wrap matches
     */
    processTextNodes(node, patterns) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            let hasMatches = false;
            let newHTML = text;

            patterns.forEach(pattern => {
                const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
                let match;

                while ((match = regex.exec(text)) !== null) {
                    hasMatches = true;
                    const articleNum = match[1];
                    const articleKey = `${pattern.prefix}-${articleNum}`;
                    const fullMatch = match[0];

                    // Check if article exists in database
                    if (this.articles[articleKey]) {
                        const replacement = `<span class="legal-ref" data-article="${articleKey}">${fullMatch}</span>`;
                        newHTML = newHTML.replace(fullMatch, replacement);
                    }
                }
            });

            if (hasMatches) {
                const wrapper = document.createElement('span');
                wrapper.innerHTML = newHTML;
                node.replaceWith(wrapper);

                // Attach event listeners to new refs
                wrapper.querySelectorAll('.legal-ref').forEach(ref => {
                    this.attachTooltipEvents(ref);
                });
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Don't process script, style, or already processed elements
            if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE' && !node.classList.contains('legal-ref')) {
                Array.from(node.childNodes).forEach(child => {
                    this.processTextNodes(child, patterns);
                });
            }
        }
    }

    /**
     * Attach tooltip events to a reference element
     */
    attachTooltipEvents(refElement) {
        const articleKey = refElement.getAttribute('data-article');

        // Mouse events
        refElement.addEventListener('mouseenter', (e) => {
            this.showTooltip(articleKey, refElement);
        });

        refElement.addEventListener('mouseleave', (e) => {
            this.tooltipTimeout = setTimeout(() => {
                this.hideTooltip();
            }, 300);
        });

        // Touch events for mobile
        refElement.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.currentTooltip && this.currentTooltip.getAttribute('data-article') === articleKey) {
                this.hideTooltip();
            } else {
                this.showTooltip(articleKey, refElement);
            }
        });

        // Keyboard accessibility
        refElement.setAttribute('tabindex', '0');
        refElement.setAttribute('role', 'button');
        refElement.setAttribute('aria-label', `Ver detalhes: ${articleKey.replace('-', ' artigo ')}`);

        refElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.showTooltip(articleKey, refElement);
            }
        });
    }

    /**
     * Show tooltip for an article
     */
    showTooltip(articleKey, refElement) {
        const article = this.articles[articleKey];
        if (!article) {
            console.warn('Article not found:', articleKey);
            return;
        }

        // Hide existing tooltip
        this.hideTooltip();

        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'legal-tooltip';
        tooltip.setAttribute('data-article', articleKey);
        tooltip.setAttribute('role', 'tooltip');

        // Build tooltip content
        tooltip.innerHTML = `
            <div class="legal-tooltip-header">
                <div class="legal-tooltip-title">
                    ${article.codigo} - Art. ${article.artigo}
                </div>
                <button class="legal-tooltip-close" aria-label="Fechar" onclick="event.stopPropagation();">
                    ×
                </button>
            </div>
            <div class="legal-tooltip-body">
                ${article.livro ? `<div class="legal-tooltip-section">
                    <div class="legal-tooltip-label">📚 Livro</div>
                    <div class="legal-tooltip-text">${article.livro}</div>
                </div>` : ''}

                <div class="legal-tooltip-section">
                    <div class="legal-tooltip-label">📝 Título</div>
                    <div class="legal-tooltip-text"><strong>${article.titulo}</strong></div>
                </div>

                <div class="legal-tooltip-section">
                    <div class="legal-tooltip-label">📜 Texto Legal</div>
                    <div class="legal-tooltip-text">${article.texto}</div>
                </div>

                <div class="legal-tooltip-section">
                    <div class="legal-tooltip-label">💡 Aplicação Prática</div>
                    <div class="legal-tooltip-text">${article.aplicacao}</div>
                </div>

                ${article.jurisprudencia ? `<div class="legal-tooltip-section">
                    <div class="legal-tooltip-label">⚖️ Jurisprudência</div>
                    <div class="legal-tooltip-text">${article.jurisprudencia}</div>
                </div>` : ''}

                ${article.observacoes ? `<div class="legal-tooltip-section">
                    <div class="legal-tooltip-label">⚠️ Observações</div>
                    <div class="legal-tooltip-text">${article.observacoes}</div>
                </div>` : ''}

                <div class="legal-tooltip-section" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.2);">
                    <div class="legal-tooltip-text" style="font-size: 11px; opacity: 0.8;">
                        📖 ${article.referencia}
                    </div>
                </div>
            </div>
        `;

        // Add to body
        document.body.appendChild(tooltip);

        // Position tooltip
        this.positionTooltip(tooltip, refElement);

        // Add close button event
        tooltip.querySelector('.legal-tooltip-close').addEventListener('click', () => {
            this.hideTooltip();
        });

        // Prevent hiding when hovering tooltip
        tooltip.addEventListener('mouseenter', () => {
            if (this.tooltipTimeout) {
                clearTimeout(this.tooltipTimeout);
            }
        });

        tooltip.addEventListener('mouseleave', () => {
            this.tooltipTimeout = setTimeout(() => {
                this.hideTooltip();
            }, 300);
        });

        // Show with animation
        setTimeout(() => {
            tooltip.classList.add('active');
        }, 10);

        this.currentTooltip = tooltip;
    }

    /**
     * Position tooltip near reference element
     */
    positionTooltip(tooltip, refElement) {
        const refRect = refElement.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let left = refRect.left + (refRect.width / 2) - (tooltipRect.width / 2);
        let top = refRect.bottom + 10;

        // Adjust horizontal position if overflowing
        if (left < 10) {
            left = 10;
        } else if (left + tooltipRect.width > viewportWidth - 10) {
            left = viewportWidth - tooltipRect.width - 10;
        }

        // Adjust vertical position if overflowing bottom
        if (top + tooltipRect.height > viewportHeight - 10) {
            top = refRect.top - tooltipRect.height - 10;
        }

        // Ensure tooltip stays in viewport
        if (top < 10) {
            top = 10;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top + window.scrollY}px`;
    }

    /**
     * Hide current tooltip
     */
    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.classList.remove('active');
            setTimeout(() => {
                if (this.currentTooltip && this.currentTooltip.parentNode) {
                    this.currentTooltip.remove();
                }
                this.currentTooltip = null;
            }, 300);
        }

        if (this.tooltipTimeout) {
            clearTimeout(this.tooltipTimeout);
            this.tooltipTimeout = null;
        }
    }

    /**
     * Refresh tooltips (call after dynamic content load)
     */
    refresh() {
        console.log('Refreshing legal tooltips...');
        this.processContent();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LegalTooltipSystem;
}
