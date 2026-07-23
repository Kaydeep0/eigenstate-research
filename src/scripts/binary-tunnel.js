// 3D binary corridor (tunnel/vacuum effect) driving the hero background canvas.
export class BinaryTunnel {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        // alpha: false for better performance
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.particles = [];
        this.particleCount = window.innerWidth < 768 ? 120 : 200;
        this.skipSorting = false;
        this.focalLength = 300;
        this.time = 0;

        // FPS throttling for performance
        this.lastFrameTime = 0;
        this.targetFPS = 30;
        this.frameInterval = 1000 / this.targetFPS;

        // Visibility tracking for pausing when off-screen
        this.isVisible = true;
        this.isPaused = false;

        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;

        // Throttled mouse tracking (50ms throttle)
        let mouseThrottle = false;
        window.addEventListener('mousemove', (e) => {
            if (mouseThrottle) return;
            mouseThrottle = true;
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.lastInteraction = Date.now();
            this.idleMode = false;
            setTimeout(() => (mouseThrottle = false), 50);
        });

        // Warp speed
        this.isWarping = false;
        this.warpMultiplier = 1;

        window.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
            this.isWarping = true;
            this.lastInteraction = Date.now();
            this.idleMode = false;
        });

        window.addEventListener('mouseup', () => {
            this.isWarping = false;
        });

        // Idle animation
        this.lastInteraction = Date.now();
        this.idleMode = false;
        this.spiralAngle = 0;

        // Scroll parallax
        this.scrollSpeed = 1;
        this.scrollSpread = 1;

        // Throttled scroll handler
        let scrollThrottle = false;
        window.addEventListener('scroll', () => {
            if (scrollThrottle) return;
            scrollThrottle = true;

            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const scrollProgress = Math.min(scrollY / windowHeight, 1);

            // Slow down and spread as user scrolls
            this.scrollSpeed = 1 - scrollProgress * 0.7; // Slows to 0.3x
            this.scrollSpread = 1 + scrollProgress * 0.5; // Spreads 1.5x

            // Pause animation when scrolled past hero section
            this.isVisible = scrollProgress < 1.5;

            // Reset idle timer on scroll
            this.lastInteraction = Date.now();
            this.idleMode = false;

            setTimeout(() => (scrollThrottle = false), 100);
        });

        // Pause when tab is hidden
        document.addEventListener('visibilitychange', () => {
            this.isPaused = document.hidden;
        });

        // Effects
        this.pulseTime = 0;
        this.patternOpacity = 0;
        this.patternPhase = 0;
        this.patternDelay = 0;
        this.patternVisible = false;
        this.patternFadeStart = 0;
        this.stillnessStartTime = null;

        // Floating equations - 3D sphere with depth layers
        this.equations = [
            { text: 'H = -Σp(x)log p(x)', angle: 0, dist: 0, delay: 0.3, formProgress: 0, atEdge: false, depth: 1.0 },
            { text: 'Whole > Σ Parts', angle: Math.PI * 0.2, dist: 0, delay: 0.5, formProgress: 0, atEdge: false, depth: 0.7 },
            { text: 'P(A|B) = P(B|A)P(A)/P(B)', angle: Math.PI * 0.4, dist: 0, delay: 0.7, formProgress: 0, atEdge: false, depth: 1.2 },
            { text: 'rs = 2GM/c²', angle: Math.PI * 0.6, dist: 0, delay: 0.9, formProgress: 0, atEdge: false, depth: 0.85 },
            { text: '∂S/∂t ≥ 0', angle: Math.PI * 0.8, dist: 0, delay: 1.1, formProgress: 0, atEdge: false, depth: 1.1 },
            { text: 'θ = θ - α∇L(θ)', angle: Math.PI * 1.0, dist: 0, delay: 1.3, formProgress: 0, atEdge: false, depth: 0.75 },
            { text: 'P(x) ∝ x^(-α)', angle: Math.PI * 1.2, dist: 0, delay: 1.5, formProgress: 0, atEdge: false, depth: 1.15 },
            { text: 'I(X;Y) = H(X) - H(X|Y)', angle: Math.PI * 1.4, dist: 0, delay: 1.7, formProgress: 0, atEdge: false, depth: 0.8 },
            { text: 'V ∝ n²', angle: Math.PI * 1.6, dist: 0, delay: 1.9, formProgress: 0, atEdge: false, depth: 1.05 },
            { text: 'S = k log W', angle: Math.PI * 1.8, dist: 0, delay: 2.1, formProgress: 0, atEdge: false, depth: 0.9 },
        ];
        this.equationTime = 0;

        // Click burst - limit to prevent performance issues
        this.bursts = [];
        window.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
            if (this.bursts.length < 50) {
                this.createBurst(e.clientX, e.clientY);
            }
            this.lastInteraction = Date.now();
            this.idleMode = false;
        });

        // Focal node
        this.focalZ = 500;
        this.focalRadius = 150;
        this.nodeGlow = 0;

        // DNA Helix
        this.helixParticles = [];
        this.maxHelixParticles = 60;
        this.helixSpawnRate = 0;

        this.init();

        // Respect prefers-reduced-motion: render one static frame instead of
        // running a continuous requestAnimationFrame loop.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.draw();
        } else {
            setTimeout(() => this.animate(), 100);
        }

        window.addEventListener('resize', () => this.handleResize());
    }

    init() {
        this.handleResize();
        this.createParticles();
    }

    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        // Shifted down from dead-center so the accretion disk ring clears
        // the fixed nav bar (~79px) instead of its top edge rendering
        // underneath it — see drawAccretionDisk()'s radius, sized to match.
        this.centerY = this.canvas.height / 2 + 40;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle(Math.random() * 2000));
        }
    }

    createParticle(z = 2000) {
        const isOrange = Math.random() < 0.05; // 5% chance orange
        return {
            x: (Math.random() - 0.5) * 2000,
            y: (Math.random() - 0.5) * 2000,
            z: z,
            char: Math.random() > 0.5 ? '1' : '0',
            speed: 1.5 + Math.random() * 4,
            baseSize: 14 + Math.random() * 10,
            isOrange: isOrange,
        };
    }

    createBurst(x, y) {
        if (this.bursts.length > 100) return;
        for (let i = 0; i < 20; i++) {
            const angle = ((Math.PI * 2) / 20) * i;
            this.bursts.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * (3 + Math.random() * 3),
                vy: Math.sin(angle) * (3 + Math.random() * 3),
                life: 1,
                char: Math.random() > 0.5 ? '1' : '0',
                size: 12 + Math.random() * 8,
            });
        }
    }

    updateBursts() {
        this.bursts.forEach((b) => {
            b.x += b.vx;
            b.y += b.vy;
            b.vx *= 0.96;
            b.vy *= 0.96;
            b.life -= 0.02;
        });
        this.bursts = this.bursts.filter((b) => b.life > 0);
    }

    drawBursts() {
        this.updateBursts();
        this.bursts.forEach((b) => {
            this.ctx.fillStyle = `rgba(62, 111, 239, ${b.life})`;
            this.ctx.font = `bold ${b.size}px "JetBrains Mono", monospace`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(b.char, b.x, b.y);
        });
    }

    drawEmergingPattern() {
        // Pattern emerges when equations stabilize (8+ at edge)
        const equationsAtEdge = this.equations.filter((eq) => eq.atEdge).length;

        if (equationsAtEdge < 8) return;

        if (!this.patternVisible) {
            this.patternVisible = true;
            this.patternFadeStart = this.patternDelay;
        }

        this.patternDelay += 0.016;

        const timeSinceVisible = this.patternDelay - this.patternFadeStart;
        const fadeProgress = Math.min(timeSinceVisible / 2, 1);

        this.patternPhase += 0.015;

        this.patternOpacity = (0.06 + Math.sin(this.patternPhase) * 0.03) * fadeProgress;

        const cx = this.centerX;
        const cy = this.centerY;

        this.ctx.save();
        this.ctx.strokeStyle = `rgba(62, 111, 239, ${this.patternOpacity})`;
        this.ctx.lineWidth = 1;

        for (let i = 0; i < 4; i++) {
            const baseRadius = 40 + i * 50;
            const radius = baseRadius + Math.sin(this.patternPhase + i * 0.5) * 8;
            const rotation = this.patternPhase * 0.3 + i * 0.2;

            this.ctx.beginPath();
            for (let a = 0; a < Math.PI * 2; a += 0.08) {
                const r = radius + Math.sin(a * 6 + rotation) * (8 + i * 4);
                const x = cx + Math.cos(a) * r;
                const y = cy + Math.sin(a) * r;
                if (a === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            this.ctx.closePath();
            this.ctx.stroke();
        }

        const hexRadius = 45 + Math.sin(this.patternPhase * 1.5) * 8;
        this.ctx.strokeStyle = `rgba(62, 111, 239, ${this.patternOpacity * 1.2})`;
        this.ctx.beginPath();
        for (let i = 0; i <= 6; i++) {
            const angle = (Math.PI / 3) * i + this.patternPhase * 0.15;
            const x = cx + Math.cos(angle) * hexRadius;
            const y = cy + Math.sin(angle) * hexRadius;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();

        for (let i = 0; i < 3; i++) {
            const angle = (Math.PI / 3) * i + this.patternPhase * 0.15;
            this.ctx.beginPath();
            this.ctx.moveTo(cx + Math.cos(angle) * hexRadius, cy + Math.sin(angle) * hexRadius);
            this.ctx.lineTo(cx + Math.cos(angle + Math.PI) * hexRadius, cy + Math.sin(angle + Math.PI) * hexRadius);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    drawFloatingEquations() {
        this.equationTime += 0.016;

        const baseEdgeDistX = this.canvas.width * 0.46;
        const baseEdgeDistY = this.canvas.height * 0.44;
        const invisibleZone = 0.15;

        this.equations.forEach((eq) => {
            if (this.equationTime < eq.delay) return;

            if (!eq.atEdge) {
                eq.dist += 0.02 * this.warpMultiplier;

                if (eq.dist >= 1) {
                    eq.dist = 1;
                    eq.atEdge = true;
                }
            } else {
                eq.angle += 0.001 * eq.depth;
            }

            const edgeDistX = baseEdgeDistX * eq.depth;
            const edgeDistY = baseEdgeDistY * eq.depth;

            const currentDistX = eq.dist * edgeDistX;
            const currentDistY = eq.dist * edgeDistY;
            let screenX = this.centerX + Math.cos(eq.angle) * currentDistX * this.scrollSpread;
            let screenY = this.centerY + Math.sin(eq.angle) * currentDistY * this.scrollSpread;

            if (this.stillnessStartTime) {
                const timeSinceStillness = this.equationTime - this.stillnessStartTime;
                const stillnessProgress = Math.min(timeSinceStillness / 8, 1);

                if (stillnessProgress > 0.7) {
                    const jitterStrength = 0.3;
                    screenX += (Math.random() - 0.5) * jitterStrength;
                    screenY += (Math.random() - 0.5) * jitterStrength;
                }
            }

            const isMobile = window.innerWidth < 768;
            const maxOpacity = isMobile ? 0.3 : 0.75;

            let opacity = 0;
            if (eq.dist > invisibleZone) {
                const depthFade = 0.5 + eq.depth * 0.5;
                opacity = Math.min(maxOpacity, ((eq.dist - invisibleZone) / 0.5) * depthFade);
            }

            if (opacity < 0.02) return;

            eq.formProgress = Math.min(1, (eq.dist - invisibleZone) / 0.35);

            let displayText = '';
            for (let i = 0; i < eq.text.length; i++) {
                if (Math.random() < eq.formProgress || eq.text[i] === ' ') {
                    displayText += eq.text[i];
                } else {
                    displayText += Math.random() > 0.5 ? '1' : '0';
                }
            }

            const baseSize = eq.atEdge ? 18 : 12 + eq.dist * 8;
            const size = baseSize * (0.7 + eq.depth * 0.4);

            this.ctx.save();
            this.ctx.fillStyle = `rgba(62, 111, 239, ${opacity})`;
            this.ctx.font = `bold ${size}px "JetBrains Mono", monospace`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            if (eq.atEdge) {
                this.ctx.shadowBlur = 25 * eq.depth;
                this.ctx.shadowColor = `rgba(62, 111, 239, ${opacity * 0.9})`;
            }

            this.ctx.fillText(displayText, screenX, screenY);
            this.ctx.restore();
        });
    }

    drawPulseWave() {
        let depthFactor = 1;
        if (this.stillnessStartTime) {
            const timeSinceStillness = this.equationTime - this.stillnessStartTime;
            const stillnessProgress = Math.min(timeSinceStillness / 4, 1);
            depthFactor = 1 - stillnessProgress * 0.7;
        }

        let pulseInterval = 1.5;
        if (this.stillnessStartTime) {
            const timeSinceStillness = this.equationTime - this.stillnessStartTime;
            const stillnessProgress = Math.min(timeSinceStillness / 4, 1);
            pulseInterval = 1.5 + stillnessProgress * 3;
        }

        const basePulseDuration = 0.8;
        const pulseDuration = basePulseDuration / depthFactor;

        this.pulseTime += 0.016;

        const pulseCycle = this.pulseTime % pulseInterval;

        if (pulseCycle < pulseDuration) {
            const progress = pulseCycle / pulseDuration;

            const maxRadius = Math.max(this.canvas.width, this.canvas.height) * depthFactor;
            const radius = progress * maxRadius;

            const baseAlpha = (1 - progress) * 0.15;
            const pulseOpacity = baseAlpha * depthFactor;

            this.ctx.strokeStyle = `rgba(91, 150, 160, ${pulseOpacity})`;
            this.ctx.lineWidth = (1.5 + (1 - progress) * 2.5) * depthFactor;
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }

    drawAccretionDisk() {
        const cx = this.centerX;
        const cy = this.centerY;

        let colorProgress = 0;
        if (this.stillnessStartTime) {
            const timeSinceStillness = this.equationTime - this.stillnessStartTime;
            colorProgress = Math.min(timeSinceStillness / 10, 1);
        }

        // Lerps from accent blue (idle) to signal teal-slate (once the
        // pattern has "resolved" / gone still) — same two brand hues used
        // everywhere else, rather than the tunnel's own arbitrary color ramp.
        const r = Math.round(62 + colorProgress * (91 - 62));
        const g = Math.round(111 + colorProgress * (150 - 111));
        const b = Math.round(239 + colorProgress * (160 - 239));

        const innerRadius = Math.min(this.canvas.width, this.canvas.height) * 0.29;
        const outerRadius = Math.min(this.canvas.width, this.canvas.height) * 0.43;

        const gradient = this.ctx.createRadialGradient(cx, cy, innerRadius, cx, cy, outerRadius);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.12)`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.25)`);
        gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, 0.12)`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
        this.ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2, true);
        this.ctx.fill();

        this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.15 + colorProgress * 0.05})`;
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, innerRadius + 5, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawSingularity() {
        if (!this.stillnessStartTime) return;

        const timeSinceStillness = this.equationTime - this.stillnessStartTime;
        const slowdownProgress = Math.min(timeSinceStillness / 2, 1);
        const stillnessFactor = 1 - slowdownProgress * 0.8;

        if (stillnessFactor > 0.5) return;

        const fogProgress = Math.min((0.5 - stillnessFactor) / 0.3, 1);

        const cx = this.centerX;
        const cy = this.centerY;

        const fogRadius = 60 - fogProgress * 55;
        const fogOpacity = 0.5 - fogProgress * 0.3;

        if (fogRadius > 5) {
            const gradient = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, fogRadius);
            gradient.addColorStop(0, `rgba(3, 7, 18, ${fogOpacity})`);
            gradient.addColorStop(0.5, `rgba(3, 7, 18, ${fogOpacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(3, 7, 18, 0)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, fogRadius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        if (fogProgress > 0.6) {
            const pointOpacity = (fogProgress - 0.6) / 0.4;
            const pointRadius = 3 + (1 - pointOpacity) * 2;

            this.ctx.fillStyle = `rgba(0, 0, 0, ${pointOpacity * 0.9})`;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, pointRadius, 0, Math.PI * 2);
            this.ctx.fill();

            const depthOpacity = pointOpacity * 0.3;

            const depthGlow = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, 8);
            depthGlow.addColorStop(0, `rgba(62, 111, 239, ${depthOpacity * 0.5})`);
            depthGlow.addColorStop(0.5, `rgba(44, 86, 201, ${depthOpacity * 0.2})`);
            depthGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

            this.ctx.fillStyle = depthGlow;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, 8, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawConnectionLines() {
        if (!this.equations.some((eq) => eq.atEdge)) return;

        const edgeDistX = this.canvas.width * 0.46;
        const edgeDistY = this.canvas.height * 0.44;

        this.ctx.strokeStyle = 'rgba(62, 111, 239, 0.08)';
        this.ctx.lineWidth = 1;

        const atEdge = this.equations.filter((eq) => eq.atEdge);

        for (let i = 0; i < atEdge.length; i++) {
            const eq1 = atEdge[i];
            const eq2 = atEdge[(i + 1) % atEdge.length];

            const x1 = this.centerX + Math.cos(eq1.angle) * edgeDistX * eq1.depth * this.scrollSpread;
            const y1 = this.centerY + Math.sin(eq1.angle) * edgeDistY * eq1.depth * this.scrollSpread;
            const x2 = this.centerX + Math.cos(eq2.angle) * edgeDistX * eq2.depth * this.scrollSpread;
            const y2 = this.centerY + Math.sin(eq2.angle) * edgeDistY * eq2.depth * this.scrollSpread;

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }

        for (let i = 0; i < atEdge.length; i++) {
            const eq1 = atEdge[i];
            const eq2 = atEdge[(i + 3) % atEdge.length];

            const x1 = this.centerX + Math.cos(eq1.angle) * edgeDistX * eq1.depth * this.scrollSpread;
            const y1 = this.centerY + Math.sin(eq1.angle) * edgeDistY * eq1.depth * this.scrollSpread;
            const x2 = this.centerX + Math.cos(eq2.angle) * edgeDistX * eq2.depth * this.scrollSpread;
            const y2 = this.centerY + Math.sin(eq2.angle) * edgeDistY * eq2.depth * this.scrollSpread;

            this.ctx.strokeStyle = 'rgba(62, 111, 239, 0.04)';
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }

    update() {
        if (this.isWarping) {
            this.warpMultiplier = Math.min(this.warpMultiplier + 0.1, 4);
        } else {
            this.warpMultiplier = Math.max(this.warpMultiplier - 0.05, 1);
        }

        let stillnessFactor = 1;
        if (this.patternVisible) {
            if (!this.stillnessStartTime) {
                this.stillnessStartTime = this.equationTime;
            }

            const timeSincePattern = this.equationTime - this.stillnessStartTime;
            const slowdownProgress = Math.min(timeSincePattern / 2, 1);

            stillnessFactor = 1 - slowdownProgress * 0.8;
        }

        this.particles.forEach((p) => {
            p.z -= p.speed * this.warpMultiplier * this.scrollSpeed * stillnessFactor;

            const scale = this.focalLength / Math.max(p.z, 1);
            const screenX = this.centerX + p.x * scale;
            const screenY = this.centerY + p.y * scale;

            const dx = screenX - this.centerX;
            const dy = screenY - this.centerY;
            const distFromCenter = Math.sqrt(dx * dx + dy * dy);

            if (this.stillnessStartTime) {
                const timeSinceStillness = this.equationTime - this.stillnessStartTime;
                const overallProgress = Math.min(timeSinceStillness / 8, 1);

                if (distFromCenter < 200) {
                    const depthFactor = 1 - distFromCenter / 200;

                    const speedMultiplier = 0.1 + depthFactor * 1.9 * overallProgress;
                    p.speed = p.speed * (depthFactor > 0.5 ? speedMultiplier : 1 - overallProgress * 0.9);

                    if (distFromCenter < 120 && distFromCenter > 10) {
                        const pullStrength = overallProgress * depthFactor * depthFactor * 0.2;
                        const angle = Math.atan2(dy, dx);
                        p.x -= Math.cos(angle) * pullStrength * distFromCenter * 0.05;
                        p.y -= Math.sin(angle) * pullStrength * distFromCenter * 0.05;
                    }
                }
            }

            if (stillnessFactor < 0.25) {
                p.x += (Math.random() - 0.5) * 0.3;
                p.y += (Math.random() - 0.5) * 0.3;
            }

            const eventHorizon = 50;
            const pullZone = Math.min(this.canvas.width, this.canvas.height) * 0.45;

            if (distFromCenter < pullZone && distFromCenter > eventHorizon) {
                const pullStrength = Math.pow(1 - distFromCenter / pullZone, 2) * 0.6;
                const angle = Math.atan2(dy, dx);

                p.x -= Math.cos(angle) * pullStrength * 1.5;
                p.y -= Math.sin(angle) * pullStrength * 1.5;
                p.x += Math.cos(angle + Math.PI / 2) * pullStrength * 2.5;
                p.y += Math.sin(angle + Math.PI / 2) * pullStrength * 2.5;
            }

            if (distFromCenter < eventHorizon && p.z < 600) {
                p.x = (Math.random() - 0.5) * 2000;
                p.y = (Math.random() - 0.5) * 2000;
                p.z = 1800 + Math.random() * 200;
                p.char = Math.random() > 0.5 ? '1' : '0';
                p.isOrange = Math.random() < 0.05;
            }

            if (p.z < 150 && distFromCenter > eventHorizon) {
                p.x = (Math.random() - 0.5) * 2000;
                p.y = (Math.random() - 0.5) * 2000;
                p.z = 1800 + Math.random() * 200;
                p.char = Math.random() > 0.5 ? '1' : '0';
                p.isOrange = Math.random() < 0.05;
            }

            if (this.patternVisible) {
                const roseRadius = 200;
                if (distFromCenter < roseRadius && p.z < 400) {
                    p.x = (Math.random() - 0.5) * 2000;
                    p.y = (Math.random() - 0.5) * 2000;
                    p.z = 1800 + Math.random() * 200;
                    p.char = Math.random() > 0.5 ? '1' : '0';
                    p.isOrange = Math.random() < 0.05;
                }
            }

            if (p.z < 600 && p.z > 1) {
                const scale2 = this.focalLength / Math.max(p.z, 1);
                const screenX2 = this.centerX + p.x * scale2;
                const screenY2 = this.centerY + p.y * scale2;

                const dx2 = screenX2 - this.mouseX;
                const dy2 = screenY2 - this.mouseY;
                const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                if (dist < 150 && dist > 0.1) {
                    const push = ((150 - dist) / 150) * 0.3;
                    p.x += (dx2 / dist) * push * (p.z / 100);
                    p.y += (dy2 / dist) * push * (p.z / 100);
                }
            }

            if (p.z < 1) {
                p.x = (Math.random() - 0.5) * 2000;
                p.y = (Math.random() - 0.5) * 2000;
                p.z = 1800 + Math.random() * 200;
                p.char = Math.random() > 0.5 ? '1' : '0';
                p.isOrange = Math.random() < 0.05;
            }
        });
    }

    drawEventHorizonMembrane() {
        const cx = this.centerX;
        const cy = this.centerY;

        const maxRadius = Math.min(this.canvas.width, this.canvas.height) * 0.28;

        const gradient = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
        gradient.addColorStop(0, 'rgba(3, 7, 18, 0.4)');
        gradient.addColorStop(0.5, 'rgba(3, 7, 18, 0.25)');
        gradient.addColorStop(0.85, 'rgba(3, 7, 18, 0.1)');
        gradient.addColorStop(1, 'rgba(3, 7, 18, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    draw() {
        const blurAlpha = this.isWarping ? 0.08 : 0.15;
        this.ctx.fillStyle = `rgba(3, 7, 18, ${blurAlpha})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const glowGradient = this.ctx.createRadialGradient(this.centerX, this.centerY, 0, this.centerX, this.centerY, 200);
        glowGradient.addColorStop(0, 'rgba(62, 111, 239, 0.08)');
        glowGradient.addColorStop(0.5, 'rgba(44, 86, 201, 0.03)');
        glowGradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = glowGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawEventHorizonMembrane();

        this.update();

        if (!this.skipSorting) {
            this.particles.sort((a, b) => b.z - a.z);
        }

        this.particles.forEach((p) => {
            if (p.z < 1) return;
            const scale = this.focalLength / p.z;
            const screenX = this.centerX + p.x * scale * this.scrollSpread;
            const screenY = this.centerY + p.y * scale * this.scrollSpread;

            if (screenX < -50 || screenX > this.canvas.width + 50 || screenY < -50 || screenY > this.canvas.height + 50)
                return;

            const distFromCenter = Math.sqrt(Math.pow(screenX - this.centerX, 2) + Math.pow(screenY - this.centerY, 2));

            const size = Math.max(4, p.baseSize * scale);

            let depthScale = 1;
            if (this.stillnessStartTime) {
                const timeSinceStillness = this.equationTime - this.stillnessStartTime;

                const collapseProgress = Math.min(timeSinceStillness / 2, 1);

                if (distFromCenter < 200) {
                    const proximityFactor = 1 - distFromCenter / 200;
                    depthScale = 1 - collapseProgress * proximityFactor * 0.5;
                }
            }

            const finalSize = size * depthScale;

            let alpha = Math.min(1, Math.max(0.1, (1 - p.z / 2000) * 1.2));

            if (this.stillnessStartTime && distFromCenter < 200 && distFromCenter > 100) {
                const timeSinceStillness = this.equationTime - this.stillnessStartTime;
                const clarityBoost = Math.min(timeSinceStillness / 8, 1) * 0.3;
                alpha = Math.min(1, alpha + clarityBoost);
            }

            let color;
            if (p.isOrange) {
                color = `rgba(91, 150, 160, ${alpha})`;
            } else {
                const nearness = 1 - p.z / 2000;
                const r = Math.floor(62 + 68 * nearness);
                const g = Math.floor(111 + 53 * nearness);
                const b = Math.floor(239 + 8 * nearness);
                color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }

            this.ctx.fillStyle = color;
            this.ctx.font = `bold ${finalSize}px "JetBrains Mono", monospace`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            if (p.z < 400) {
                this.ctx.shadowBlur = 15 * (1 - p.z / 400);
                this.ctx.shadowColor = '#82a4f7';
            } else {
                this.ctx.shadowBlur = 0;
            }

            this.ctx.fillText(p.char, screenX, screenY);
        });

        this.drawAccretionDisk();
        this.drawSingularity();
        this.drawEmergingPattern();
        this.drawConnectionLines();
        this.drawFloatingEquations();
        this.drawPulseWave();
        this.drawBursts();

        this.ctx.shadowBlur = 0;
    }

    animate(currentTime = 0) {
        if (!this.canvas.width || !this.canvas.height) {
            this.handleResize();
        }

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
        this.draw();

        requestAnimationFrame((t) => this.animate(t));
    }
}
