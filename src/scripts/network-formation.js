// Sticky network-formation visualization for the "Pattern" section.
export class NetworkFormation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.centerNode = null;
        this.absorbedParticles = [];
        this.phase = 0;
        this.maxPhase = 2;
        this.phaseProgress = 0;
        this.flashIntensity = 0;
        this.isMobile = window.innerWidth < 768;
        this.phaseSpeed = this.isMobile ? 0.004 : 0.003;

        // Performance optimizations
        this.isVisible = true;
        this.isPaused = false;
        this.lastFrameTime = 0;
        this.targetFPS = 24;
        this.frameInterval = 1000 / this.targetFPS;

        this.init();

        // Respect prefers-reduced-motion: render one static frame instead of
        // running a continuous requestAnimationFrame loop.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.draw();
        } else {
            this.animate();
        }

        // IntersectionObserver to pause when off-screen
        this.observer = new IntersectionObserver(
            (entries) => {
                this.isVisible = entries[0].isIntersecting;
            },
            { threshold: 0.1 }
        );
        this.observer.observe(this.canvas);

        // Pause when tab is hidden
        document.addEventListener('visibilitychange', () => {
            this.isPaused = document.hidden;
        });

        this.canvas.addEventListener('mousemove', (e) => this.handleHover(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        window.addEventListener('resize', () => this.handleResize());
    }

    init() {
        this.handleResize();
        this.createNodes();
    }

    handleResize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        this.width = rect.width;
        this.height = rect.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;

        if (this.nodes.length === 0) {
            this.createNodes();
        }
    }

    createNodes() {
        this.centerNode = {
            x: this.centerX,
            y: this.centerY,
            targetX: this.centerX,
            targetY: this.centerY,
            size: 40,
            maxSize: 80,
            color: '#ff6b35',
            label: 'CORE',
            type: 'center',
            connections: [],
            pulsePhase: 0,
        };

        const nodeCount = window.innerWidth < 768 ? 25 : 40;
        const waves = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];

        this.nodes = [];
        for (let i = 0; i < nodeCount; i++) {
            const angle = ((Math.PI * 2) / nodeCount) * i;
            const distance = 150 + Math.random() * 200;
            const x = this.centerX + Math.cos(angle) * distance;
            const y = this.centerY + Math.sin(angle) * distance;

            const finalDistance = 80 + Math.random() * 120;
            const finalAngle = angle + (Math.random() - 0.5) * 0.5;
            const targetX = this.centerX + Math.cos(finalAngle) * finalDistance;
            const targetY = this.centerY + Math.sin(finalAngle) * finalDistance;

            this.nodes.push({
                x: x,
                y: y,
                initialX: x,
                initialY: y,
                targetX: targetX,
                targetY: targetY,
                size: 8 + Math.random() * 8,
                initialSize: 8 + Math.random() * 8,
                finalSize: 2 + Math.random() * 3,
                color: i < nodeCount * 0.3 ? '#00d9ff' : '#94a3b8',
                alpha: 0.8,
                label: waves[Math.floor(Math.random() * waves.length)] + '_' + i.toString(16).toUpperCase(),
                type: 'peripheral',
                orbitSpeed: (Math.random() - 0.5) * 0.0005,
                orbitRadius: 20 + Math.random() * 40,
            });
        }
    }

    updatePhase() {
        this.phaseProgress += this.phaseSpeed;

        if (this.phaseProgress >= 1) {
            this.phaseProgress = 0;
            this.phase = (this.phase + 1) % (this.maxPhase + 1);
            this.flashIntensity = 1;

            if (this.phase === 0) {
                this.phaseSpeed = 0.001;
                setTimeout(() => {
                    this.phaseSpeed = this.isMobile ? 0.004 : 0.003;
                }, 1500);
            }
        }

        if (this.flashIntensity > 0) {
            this.flashIntensity -= 0.05;
        }
    }

    interpolate(start, end, progress) {
        return start + (end - start) * this.easeInOutCubic(progress);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    draw() {
        this.ctx.fillStyle = '#0a0e27';
        this.ctx.fillRect(0, 0, this.width, this.height);

        const globalProgress = (this.phase + this.phaseProgress) / this.maxPhase;
        const centerSize = this.interpolate(this.centerNode.size, this.centerNode.maxSize * 1.2, globalProgress);

        if (this.flashIntensity > 0) {
            this.ctx.fillStyle = `rgba(14, 165, 233, ${this.flashIntensity * 0.1})`;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        this.drawTargetingGrid();
        this.drawConnections(globalProgress);
        this.createAbsorptionParticles();

        this.nodes.forEach((node) => {
            const currentX = this.interpolate(node.initialX, node.targetX, globalProgress);
            const currentY = this.interpolate(node.initialY, node.targetY, globalProgress);
            const orbitOffset = Math.sin(Date.now() * node.orbitSpeed) * node.orbitRadius * (1 - globalProgress);
            node.x = currentX + orbitOffset;
            node.y = currentY;

            const currentSize = this.interpolate(node.initialSize, node.finalSize, globalProgress);
            const currentAlpha = this.interpolate(0.8, 0.3, globalProgress);

            this.drawNode(node.x, node.y, currentSize, node.color, currentAlpha, node.label);
        });

        this.centerNode.pulsePhase += 0.02;
        const pulseSizeIncrease = Math.sin(this.centerNode.pulsePhase) * 5;
        this.drawCenterNode(centerSize + pulseSizeIncrease, globalProgress);
        this.drawPhaseIndicator();
    }

    drawConnections(globalProgress) {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;

        this.nodes.forEach((node) => {
            const distToCenter = Math.hypot(node.x - this.centerX, node.y - this.centerY);
            const connectionStrength = 1 - distToCenter / 300;

            if (connectionStrength > 0.3) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(14, 165, 233, ${connectionStrength * globalProgress * 0.3})`;
                this.ctx.lineWidth = 1 + connectionStrength * 2;
                this.ctx.moveTo(node.x, node.y);
                this.ctx.lineTo(this.centerX, this.centerY);
                this.ctx.stroke();
            }
        });
    }

    drawNode(x, y, size, color, alpha, label) {
        const alphaHex255 = Math.floor(alpha * 255)
            .toString(16)
            .padStart(2, '0');
        this.ctx.fillStyle = `${color}${alphaHex255}`;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = color;
        this.ctx.beginPath();
        this.roundRect(x - size / 2, y - size / 2, size, size, size * 0.2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        if (size > 6) {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
            this.ctx.font = `${size * 0.35}px 'JetBrains Mono', monospace`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(label.substring(0, 3), x, y);
        }
    }

    drawCenterNode(size, globalProgress) {
        const centerX = this.centerX;
        const centerY = this.centerY;

        for (let i = 0; i < 3; i++) {
            const ringProgress = (this.centerNode.pulsePhase + i * 0.3) % 1;
            const ringRadius = size + ringProgress * 50;
            const ringAlpha = (1 - ringProgress) * 0.25;

            this.ctx.strokeStyle = `rgba(255, 107, 53, ${ringAlpha})`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size * 1.5);
        gradient.addColorStop(0, 'rgba(255, 107, 53, 0.6)');
        gradient.addColorStop(0.5, 'rgba(255, 107, 53, 0.2)');
        gradient.addColorStop(1, 'transparent');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, size * 1.5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#ff6b35';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#ff6b35';
        this.ctx.beginPath();
        this.roundRect(centerX - size / 2, centerY - size / 2, size, size, size * 0.15);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 1.5;
        const numLines = 12;
        for (let i = 0; i < numLines; i++) {
            const angle = ((Math.PI * 2) / numLines) * i;
            const startRadius = size * 0.6;
            const endRadius = size + 40 + Math.sin(Date.now() * 0.001 + i) * 10;

            this.ctx.beginPath();
            this.ctx.moveTo(centerX + Math.cos(angle) * startRadius, centerY + Math.sin(angle) * startRadius);
            this.ctx.lineTo(centerX + Math.cos(angle) * endRadius, centerY + Math.sin(angle) * endRadius);
            this.ctx.stroke();
        }

        const labelPulse = 0.9 + Math.sin(this.centerNode.pulsePhase * 2) * 0.1;
        this.ctx.fillStyle = `rgba(255, 255, 255, ${labelPulse})`;
        this.ctx.font = `${size * 0.25}px 'Orbitron', sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = '#ffffff';
        this.ctx.fillText('CORE', centerX, centerY);
        this.ctx.shadowBlur = 0;

        const concentration = Math.floor(65 + globalProgress * 13);
        this.ctx.font = `${size * 0.18}px 'JetBrains Mono', monospace`;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillText(`${concentration}%`, centerX, centerY + size * 0.65);
    }

    createAbsorptionParticles() {
        const spawnRate = this.phase === 1 ? 0.15 : 0.05;

        if (Math.random() < spawnRate && this.nodes.length > 0) {
            const sourceNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];

            this.absorbedParticles.push({
                x: sourceNode.x,
                y: sourceNode.y,
                targetX: this.centerX,
                targetY: this.centerY,
                progress: 0,
                speed: 0.01 + Math.random() * 0.02,
                size: 2 + Math.random() * 3,
                color: Math.random() > 0.7 ? '#ff6b35' : '#00d9ff',
            });
        }

        this.absorbedParticles = this.absorbedParticles.filter((particle) => {
            particle.progress += particle.speed;
            particle.x = particle.x + (particle.targetX - particle.x) * particle.speed * 2;
            particle.y = particle.y + (particle.targetY - particle.y) * particle.speed * 2;

            this.ctx.fillStyle = particle.color;
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;

            return particle.progress < 1;
        });
    }

    drawTargetingGrid() {
        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);

        this.ctx.strokeStyle = 'rgba(14, 165, 233, 0.2)';
        this.ctx.lineWidth = 1;

        this.ctx.beginPath();
        this.ctx.moveTo(-100, 0);
        this.ctx.lineTo(-20, 0);
        this.ctx.moveTo(20, 0);
        this.ctx.lineTo(100, 0);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(0, -100);
        this.ctx.lineTo(0, -20);
        this.ctx.moveTo(0, 20);
        this.ctx.lineTo(0, 100);
        this.ctx.stroke();

        for (let r = 60; r <= 120; r += 30) {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, r, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    drawPhaseIndicator() {
        const labels = ['Waves 1-5: Consolidated', 'Wave 6: Clustering', 'Wave 6: Accelerating'];
        const currentLabel = labels[this.phase];

        const boxWidth = 200;
        const boxHeight = 32;
        const boxX = this.width - boxWidth - 15;
        const boxY = 15;

        this.ctx.fillStyle = 'rgba(3, 7, 18, 0.9)';
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        this.ctx.strokeStyle = 'rgba(0, 217, 255, 0.4)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        this.ctx.fillStyle = '#00d9ff';
        this.ctx.font = 'bold 10px "Orbitron", sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(currentLabel, boxX + 12, boxY + boxHeight / 2 - 2);

        const progressWidth = (boxWidth - 24) * this.phaseProgress;
        this.ctx.fillStyle = '#ff6b35';
        this.ctx.fillRect(boxX + 12, boxY + boxHeight - 8, progressWidth, 3);
    }

    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }

    handleHover(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const distToCenter = Math.hypot(mouseX - this.centerX, mouseY - this.centerY);
        this.canvas.style.cursor = distToCenter < 50 ? 'pointer' : 'default';
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const distToCenter = Math.hypot(mouseX - this.centerX, mouseY - this.centerY);

        if (distToCenter < 50) {
            this.centerNode.pulsePhase = 0;
            this.nodes.forEach((node) => {
                const angle = Math.atan2(node.y - this.centerY, node.x - this.centerX);
                node.x += Math.cos(angle) * 30;
                node.y += Math.sin(angle) * 30;
            });
        }
    }

    animate(currentTime = 0) {
        if (this.isPaused || !this.isVisible) {
            requestAnimationFrame((t) => this.animate(t));
            return;
        }

        const elapsed = currentTime - this.lastFrameTime;
        if (elapsed < this.frameInterval) {
            requestAnimationFrame((t) => this.animate(t));
            return;
        }

        this.lastFrameTime = currentTime - (elapsed % this.frameInterval);
        this.updatePhase();
        this.draw();

        requestAnimationFrame((t) => this.animate(t));
    }
}
