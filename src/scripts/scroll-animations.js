import { NetworkFormation } from './network-formation.js';

// Reveals sections/cards as they scroll into view, and lazily spins up the
// Pattern-section network visualization the first time it becomes visible.
export class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px',
        };
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.observer.unobserve(entry.target);

                    if (entry.target.id === 'pattern') {
                        const networkCanvas = document.getElementById('network-canvas');
                        if (networkCanvas && !window.networkFormation) {
                            setTimeout(() => {
                                window.networkFormation = new NetworkFormation('network-canvas');
                            }, 500);
                        }

                        const patternText = entry.target.querySelector('.pattern-text');
                        const patternVisual = entry.target.querySelector('.pattern-visual');
                        if (patternText) patternText.classList.add('visible');
                        if (patternVisual) patternVisual.classList.add('visible');
                    }

                    const title = entry.target.querySelector('.section-title');
                    if (title && !title.classList.contains('visible')) {
                        title.classList.add('visible');
                    }

                    if (entry.target.classList.contains('intel-card')) {
                        this.animateCounters(entry.target);
                        this.animateProgress(entry.target);
                    }

                    if (entry.target.classList.contains('comparison-column')) {
                        const arrow = document.querySelector('.comparison-arrow');
                        if (arrow) setTimeout(() => arrow.classList.add('visible'), 200);
                    }
                }
            });
        }, this.observerOptions);

        document.querySelectorAll('[data-animate]').forEach((el) => this.observer.observe(el));
        document.querySelectorAll('section').forEach((section) => this.observer.observe(section));
        document.querySelectorAll('.comparison-column, .comparison-arrow').forEach((el) => this.observer.observe(el));
    }

    animateCounters(card) {
        const counters = card.querySelectorAll('[data-target]');
        counters.forEach((counter) => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = current.toFixed(1);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toFixed(1);
                }
            };
            updateCounter();
        });
    }

    animateProgress(card) {
        const progressBar = card.querySelector('.progress-bar');
        if (progressBar) {
            const progress = progressBar.getAttribute('data-progress');
            const fill = progressBar.querySelector('.progress-fill');
            if (fill) {
                setTimeout(() => {
                    fill.style.setProperty('--progress-width', progress + '%');
                    fill.classList.add('animate');
                }, 300);
            }
        }
    }
}
