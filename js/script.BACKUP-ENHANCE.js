// ============================================
// 3D BINARY CORRIDOR (Tunnel/Vacuum Effect)
// ============================================

class BinaryTunnel {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 800;
        this.focalLength = 300;
        this.time = 0;
        
        // Focal node
        this.focalZ = 500;
        this.focalRadius = 150;
        this.nodeGlow = 0;
        
        // DNA Helix
        this.helixParticles = [];
        this.maxHelixParticles = 60;
        this.helixSpawnRate = 0;
        
        this.init();
        setTimeout(() => this.animate(), 100);
        
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
        this.centerY = this.canvas.height / 2;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle(Math.random() * 2000));
        }
    }
    
    createParticle(z = 2000) {
        return {
            x: (Math.random() - 0.5) * 2000,
            y: (Math.random() - 0.5) * 2000,
            z: z,
            char: Math.random() > 0.5 ? '1' : '0',
            speed: 2 + Math.random() * 3,
            baseSize: 14 + Math.random() * 10
        };
    }
    
    update() {
        this.particles.forEach(p => {
            p.z -= p.speed;
            
            if (p.z < 1) {
                p.x = (Math.random() - 0.5) * 2000;
                p.y = (Math.random() - 0.5) * 2000;
                p.z = 1800 + Math.random() * 200;
                p.char = Math.random() > 0.5 ? '1' : '0';
            }
        });
    }
    
    draw() {
        // Motion blur / trails
        this.ctx.fillStyle = 'rgba(3, 7, 18, 0.15)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.update();
        
        // Sort by z (far to near) for proper layering
        const sorted = [...this.particles].sort((a, b) => b.z - a.z);
        
        sorted.forEach(p => {
            // 3D projection
            const scale = this.focalLength / p.z;
            const screenX = this.centerX + p.x * scale;
            const screenY = this.centerY + p.y * scale;
            
            // Skip if off screen
            if (screenX < -50 || screenX > this.canvas.width + 50 ||
                screenY < -50 || screenY > this.canvas.height + 50) return;
            
            // Size based on depth (closer = bigger)
            const size = Math.max(4, p.baseSize * scale);
            
            // Alpha based on depth (closer = brighter)
            const alpha = Math.min(1, Math.max(0.1, (1 - p.z / 2000) * 1.2));
            
            // Color: dim blue far, bright cyan close
            const nearness = 1 - p.z / 2000;
            const r = Math.floor(150 * nearness);
            const g = Math.floor(200 + 55 * nearness);
            const b = 255;
            
            this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            this.ctx.font = `bold ${size}px "JetBrains Mono", monospace`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            // Glow for close particles
            if (p.z < 400) {
                this.ctx.shadowBlur = 15 * (1 - p.z / 400);
                this.ctx.shadowColor = '#00ffff';
            } else {
                this.ctx.shadowBlur = 0;
            }
            
            this.ctx.fillText(p.char, screenX, screenY);
        });
        
        // Draw focal node
        // this.drawFocalNode();
        
        // Draw DNA helix
        // this.drawHelix();
        
        this.ctx.shadowBlur = 0;
    }
    
    drawFocalNode() {
        const scale = this.focalLength / this.focalZ;
        const screenX = this.centerX;
        const screenY = this.centerY;
        const baseRadius = 30 * scale;
        
        // Outer glow
        const gradient = this.ctx.createRadialGradient(
            screenX, screenY, 0,
            screenX, screenY, baseRadius * 4
        );
        gradient.addColorStop(0, `rgba(0, 255, 255, ${0.3 + this.nodeGlow * 0.4})`);
        gradient.addColorStop(0.3, `rgba(0, 200, 255, ${0.15 + this.nodeGlow * 0.2})`);
        gradient.addColorStop(0.6, `rgba(255, 107, 53, ${0.05 + this.nodeGlow * 0.1})`);
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, baseRadius * 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Core node
        const coreGradient = this.ctx.createRadialGradient(
            screenX, screenY, 0,
            screenX, screenY, baseRadius
        );
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${0.8 + this.nodeGlow * 0.2})`);
        coreGradient.addColorStop(0.5, `rgba(0, 255, 255, ${0.5 + this.nodeGlow * 0.3})`);
        coreGradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = coreGradient;
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, baseRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Pulsing ring
        const pulseRadius = baseRadius * (1.5 + Math.sin(this.time * 3) * 0.3);
        this.ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 + this.nodeGlow * 0.4})`;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, pulseRadius, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    
    spawnHelixParticle() {
        if (this.helixParticles.length >= this.maxHelixParticles) return;
        
        const side = Math.random() > 0.5 ? 1 : -1;
        this.helixParticles.push({
            angle: Math.random() * Math.PI * 2,
            y: this.centerY,
            side: side,
            speed: 1.5 + Math.random(),
            char: Math.random() > 0.5 ? '1' : '0',
            size: 12 + Math.random() * 6,
            alpha: 1
        });
    }
    
    updateHelix() {
        // Spawn based on node glow intensity
        this.helixSpawnRate += this.nodeGlow * 0.15;
        if (this.helixSpawnRate > 1) {
            this.spawnHelixParticle();
            this.helixSpawnRate = 0;
        }
        
        const waveTop = this.canvas.height * 0.7;
        
        this.helixParticles.forEach(p => {
            // Move down
            p.y += p.speed;
            
            // Rotate in helix
            p.angle += 0.08;
            
            // Helix radius shrinks as approaching wave
            const progress = (p.y - this.centerY) / (waveTop - this.centerY);
            const radius = 50 * (1 - progress * 0.5);
            
            p.x = this.centerX + Math.cos(p.angle) * radius * p.side;
            
            // Fade when approaching wave
            if (p.y > waveTop - 50) {
                p.alpha = Math.max(0, (waveTop - p.y) / 50);
            }
        });
        
        // Remove dead particles
        this.helixParticles = this.helixParticles.filter(p => p.y < waveTop && p.alpha > 0);
    }
    
    drawHelix() {
        this.updateHelix();
        
        // Draw connections between nearby helix particles
        for (let i = 0; i < this.helixParticles.length; i++) {
            for (let j = i + 1; j < this.helixParticles.length; j++) {
                const p1 = this.helixParticles[i];
                const p2 = this.helixParticles[j];
                
                if (p1.side !== p2.side) {
                    const dy = Math.abs(p1.y - p2.y);
                    if (dy < 30) {
                        const alpha = (1 - dy / 30) * 0.4 * Math.min(p1.alpha, p2.alpha);
                        this.ctx.strokeStyle = `rgba(255, 107, 53, ${alpha})`;
                        this.ctx.lineWidth = 1.5;
                        this.ctx.beginPath();
                        this.ctx.moveTo(p1.x, p1.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.stroke();
                    }
                }
            }
        }
        
        // Draw helix particles
        this.helixParticles.forEach(p => {
            this.ctx.fillStyle = `rgba(0, 255, 255, ${p.alpha})`;
            this.ctx.font = `bold ${p.size}px "JetBrains Mono", monospace`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = '#00ffff';
            this.ctx.fillText(p.char, p.x, p.y);
        });
        
        this.ctx.shadowBlur = 0;
    }
    
    animate() {
        if (!this.canvas.width || !this.canvas.height) {
            this.handleResize();
        }
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// BINARY WAVE (Bottom Formation) - FIXED
// ============================================

class BinaryWave {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.time = 0;
        this.isMobile = window.innerWidth < 768;
        
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.handleResize());
    }
    
    init() {
        this.handleResize();
        this.createParticles();
    }
    
    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight * 0.35;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.isMobile = window.innerWidth < 768;
        this.createParticles();
    }
    
    createParticles() {
        this.particles = [];
        const spacing = this.isMobile ? 18 : 12;
        const cols = Math.ceil(this.width / spacing);
        const rows = Math.ceil(this.height / spacing);
        
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                this.particles.push({
                    baseX: x * spacing,
                    baseY: y * spacing,
                    x: x * spacing,
                    y: y * spacing,
                    char: Math.random() > 0.5 ? '1' : '0',
                    phase: Math.random() * Math.PI * 2
                });
            }
        }
    }
    
    draw() {
        // Clear completely
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.time += 0.02;
        
        this.ctx.font = `bold 12px "JetBrains Mono", monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        this.particles.forEach(particle => {
            // Multiple wave layers for complex motion
            const wave1 = Math.sin(particle.baseX * 0.006 + this.time) * 40;
            const wave2 = Math.sin(particle.baseX * 0.003 + this.time * 0.7) * 25;
            const wave3 = Math.sin(particle.baseX * 0.01 + this.time * 1.3) * 12;
            
            const waveY = this.height * 0.5 + wave1 + wave2 + wave3;
            
            // Distance from wave center
            const distanceFromWave = Math.abs(particle.baseY - waveY);
            const maxDistance = 70;
            const proximityFactor = Math.max(0, 1 - distanceFromWave / maxDistance);
            
            if (proximityFactor > 0.05) {
                // Apply subtle motion
                const displacement = Math.sin(particle.baseX * 0.01 + this.time) * 3;
                particle.y = particle.baseY + displacement;
                
                // Brightness based on proximity
                const brightness = 0.1 + proximityFactor * 0.9;
                
                // Color - wave crest is bright cyan
                const isInCrest = distanceFromWave < 12;
                
                if (isInCrest && proximityFactor > 0.8) {
                    // Bright crest
                    this.ctx.fillStyle = `rgba(0, 255, 255, ${brightness})`;
                    this.ctx.shadowBlur = 10;
                    this.ctx.shadowColor = '#00ffff';
                } else {
                    // Body of wave - gradient from cyan to blue
                    const g = Math.floor(160 + 95 * proximityFactor);
                    this.ctx.fillStyle = `rgba(14, ${g}, 255, ${brightness * 0.8})`;
                    this.ctx.shadowBlur = 0;
                }
                
                this.ctx.fillText(particle.char, particle.x, particle.y);
            }
        });
        
        this.ctx.shadowBlur = 0;
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// DATA FLOW ECOSYSTEM
// ============================================

class DataFlow {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 150;
        this.time = 0;
        this.clusterPoints = [];
        this.init();
    }
    
    init() {
        // Create cluster points where data concentrates
        // These will form the "DNA strand" regions
        this.clusterPoints = [
            { x: 0.15, y: 0.3, strength: 1 },   // left side
            { x: 0.85, y: 0.35, strength: 1 },  // right side
            { x: 0.2, y: 0.55, strength: 0.8 }, // lower left
            { x: 0.8, y: 0.5, strength: 0.8 }   // lower right
        ];
    }
    
    spawnParticle() {
        if (this.particles.length >= this.maxParticles) return;
        
        // Spawn from edges (caught from the tunnel)
        const edge = Math.random();
        let x, y;
        
        if (edge < 0.3) {
            x = Math.random() * this.canvas.width;
            y = -10;
        } else if (edge < 0.5) {
            x = -10;
            y = Math.random() * this.canvas.height * 0.4;
        } else if (edge < 0.7) {
            x = this.canvas.width + 10;
            y = Math.random() * this.canvas.height * 0.4;
        } else {
            // Some from center (escaping tunnel)
            const angle = Math.random() * Math.PI * 2;
            const dist = 50 + Math.random() * 100;
            x = this.canvas.width / 2 + Math.cos(angle) * dist;
            y = this.canvas.height * 0.4 + Math.sin(angle) * dist;
        }
        
        this.particles.push({
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            char: Math.random() > 0.5 ? '1' : '0',
            size: 8 + Math.random() * 6,
            alpha: 0.8,
            state: 'free', // free → clustering → strand → flowing
            clusterId: null,
            strandPhase: Math.random() * Math.PI * 2,
            life: 0
        });
    }
    
    update() {
        this.time += 0.016;
        
        // Spawn new particles
        if (Math.random() < 0.15) this.spawnParticle();
        
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        this.particles.forEach(p => {
            p.life += 0.016;
            
            // Find nearest cluster point
            let nearestCluster = null;
            let nearestDist = Infinity;
            
            this.clusterPoints.forEach((cp, i) => {
                const cx = cp.x * w;
                const cy = cp.y * h;
                const dist = Math.hypot(p.x - cx, p.y - cy);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestCluster = { ...cp, index: i, cx, cy };
                }
            });
            
            // State machine
            if (p.state === 'free') {
                // Drift toward nearest cluster
                if (nearestCluster && nearestDist < 250) {
                    const pull = 0.02 * nearestCluster.strength;
                    p.vx += (nearestCluster.cx - p.x) * pull * 0.01;
                    p.vy += (nearestCluster.cy - p.y) * pull * 0.01;
                    
                    if (nearestDist < 80) {
                        p.state = 'clustering';
                        p.clusterId = nearestCluster.index;
                    }
                }
                
                // Gentle downward drift
                p.vy += 0.01;
                
            } else if (p.state === 'clustering') {
                // Orbit around cluster point (DNA-like motion)
                if (nearestCluster) {
                    p.strandPhase += 0.03;
                    const orbitRadius = 30 + Math.sin(p.life * 2) * 15;
                    const targetX = nearestCluster.cx + Math.cos(p.strandPhase) * orbitRadius;
                    const targetY = nearestCluster.cy + Math.sin(p.strandPhase * 0.5) * 50 + p.life * 8;
                    
                    p.vx += (targetX - p.x) * 0.05;
                    p.vy += (targetY - p.y) * 0.05;
                    
                    // Transition to flowing after clustering
                    if (p.life > 3 || p.y > h * 0.6) {
                        p.state = 'flowing';
                    }
                }
                
            } else if (p.state === 'flowing') {
                // Flow down to wave
                p.vy += 0.05;
                p.vx *= 0.98;
                
                // Fade as approaching wave
                if (p.y > h * 0.65) {
                    p.alpha = Math.max(0, 1 - (p.y - h * 0.65) / (h * 0.25));
                }
            }
            
            // Apply velocity with damping
            p.vx *= 0.95;
            p.vy *= 0.95;
            p.x += p.vx;
            p.y += p.vy;
        });
        
        // Remove dead particles
        this.particles = this.particles.filter(p => 
            p.alpha > 0.02 && p.y < h + 20
        );
    }
    
    draw() {
        this.update();
        
        // Draw connections between nearby clustering particles
        const clustering = this.particles.filter(p => p.state === 'clustering');
        
        clustering.forEach((p1, i) => {
            clustering.slice(i + 1).forEach(p2 => {
                if (p1.clusterId === p2.clusterId) {
                    const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                    if (dist < 60) {
                        const alpha = (1 - dist / 60) * 0.3 * Math.min(p1.alpha, p2.alpha);
                        const isOrange = (i % 3 === 0);
                        
                        this.ctx.strokeStyle = isOrange
                            ? `rgba(255, 107, 53, ${alpha})`
                            : `rgba(0, 217, 255, ${alpha * 0.6})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.beginPath();
                        this.ctx.moveTo(p1.x, p1.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.stroke();
                    }
                }
            });
        });
        
        // Draw particles (characters only, no glow orbs)
        this.particles.forEach(p => {
            // Character only
            this.ctx.fillStyle = `rgba(0, 217, 255, ${p.alpha})`;
            this.ctx.font = `bold ${p.size}px "JetBrains Mono", monospace`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(p.char, p.x, p.y);
        });
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// PARTICLE SYSTEM (Connecting Nodes)
// ============================================

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        this.time = 0;
        
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        const particleCount = window.innerWidth < 768 ? 25 : 50;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 2 + 1,
                pulsePhase: Math.random() * Math.PI * 2,
            });
        }
        
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    animate() {
        this.time += 0.016;
        
        // Clear with fade
        this.ctx.fillStyle = 'rgba(3, 7, 18, 0.06)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update particles
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Mouse repulsion
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx -= (dx / distance) * force * 0.02;
                particle.vy -= (dy / distance) * force * 0.02;
            }
            
            // Damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });
        
        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.25;
                    const isOrange = (i + j) % 4 === 0;
                    
                    this.ctx.strokeStyle = isOrange 
                        ? `rgba(255, 107, 53, ${opacity})`
                        : `rgba(0, 217, 255, ${opacity * 0.4})`;
                    this.ctx.lineWidth = isOrange ? 1.5 : 1;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw particles
        this.particles.forEach(particle => {
            particle.pulsePhase += 0.05;
            const pulse = 1 + Math.sin(particle.pulsePhase) * 0.3;
            const radius = particle.radius * pulse;
            
            // Glow
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, radius * 4
            );
            gradient.addColorStop(0, 'rgba(0, 217, 255, 0.5)');
            gradient.addColorStop(0.5, 'rgba(0, 217, 255, 0.15)');
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, radius * 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Core
            this.ctx.fillStyle = '#00d9ff';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// ============================================
// CLUSTER NETWORK
// ============================================

class ClusterNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.clusters = [];
        this.nodes = [];
        this.time = 0;
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        const clusterCount = window.innerWidth < 768 ? 3 : 5;
        for (let i = 0; i < clusterCount; i++) {
            const cluster = {
                center: {
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height
                },
                nodes: [],
                radius: 60 + Math.random() * 80,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: 0.002 + Math.random() * 0.003
            };
            
            const nodeCount = 5 + Math.floor(Math.random() * 3);
            for (let j = 0; j < nodeCount; j++) {
                const angle = (Math.PI * 2 / nodeCount) * j;
                const distance = cluster.radius * (0.3 + Math.random() * 0.7);
                
                const node = {
                    x: cluster.center.x + Math.cos(angle) * distance,
                    y: cluster.center.y + Math.sin(angle) * distance,
                    baseAngle: angle,
                    baseDistance: distance,
                    cluster: cluster,
                    isAnchor: j === 0,
                    radius: j === 0 ? 4 : 2,
                    pulsePhase: Math.random() * Math.PI * 2
                };
                
                cluster.nodes.push(node);
                this.nodes.push(node);
            }
            
            this.clusters.push(cluster);
        }
        
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    animate() {
        this.time += 0.016;
        
        this.ctx.fillStyle = 'rgba(3, 7, 18, 0.03)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.clusters.forEach(cluster => {
            cluster.rotation += cluster.rotationSpeed;
            
            cluster.nodes.forEach((node, index) => {
                if (!node.isAnchor) {
                    const angle = node.baseAngle + cluster.rotation;
                    node.x = cluster.center.x + Math.cos(angle) * node.baseDistance;
                    node.y = cluster.center.y + Math.sin(angle) * node.baseDistance;
                }
                node.pulsePhase += 0.05;
            });
        });
        
        // Draw connections
        this.ctx.lineWidth = 1;
        this.clusters.forEach(cluster => {
            for (let i = 0; i < cluster.nodes.length; i++) {
                for (let j = i + 1; j < cluster.nodes.length; j++) {
                    const node1 = cluster.nodes[i];
                    const node2 = cluster.nodes[j];
                    const dx = node1.x - node2.x;
                    const dy = node1.y - node2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < cluster.radius * 1.5) {
                        const opacity = (1 - distance / (cluster.radius * 1.5)) * 0.4;
                        const isOrange = Math.random() > 0.7;
                        
                        this.ctx.strokeStyle = isOrange 
                            ? `rgba(255, 107, 53, ${opacity})`
                            : `rgba(30, 64, 175, ${opacity})`;
                        
                        this.ctx.beginPath();
                        this.ctx.moveTo(node1.x, node1.y);
                        this.ctx.lineTo(node2.x, node2.y);
                        this.ctx.stroke();
                    }
                }
            }
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            const pulse = 1 + Math.sin(node.pulsePhase) * 0.3;
            const radius = node.radius * pulse;
            
            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, radius * 4
            );
            
            if (node.isAnchor) {
                gradient.addColorStop(0, 'rgba(0, 217, 255, 0.9)');
                gradient.addColorStop(0.5, 'rgba(0, 217, 255, 0.4)');
                gradient.addColorStop(1, 'rgba(0, 217, 255, 0)');
            } else {
                gradient.addColorStop(0, 'rgba(14, 165, 233, 0.8)');
                gradient.addColorStop(0.5, 'rgba(14, 165, 233, 0.3)');
                gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');
            }
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius * 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = node.isAnchor ? '#00d9ff' : '#0ea5e9';
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// NETWORK FORMATION VISUALIZATION
// ============================================

class NetworkFormation {
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
        
        this.init();
        this.animate();
        
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
            pulsePhase: 0
        };
        
        const nodeCount = window.innerWidth < 768 ? 25 : 40;
        const waves = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];
        
        this.nodes = [];
        for (let i = 0; i < nodeCount; i++) {
            const angle = (Math.PI * 2 / nodeCount) * i;
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
                orbitRadius: 20 + Math.random() * 40
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
        
        this.nodes.forEach(node => {
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
        
        this.nodes.forEach((node, i) => {
            const distToCenter = Math.hypot(node.x - this.centerX, node.y - this.centerY);
            const connectionStrength = 1 - (distToCenter / 300);
            
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
        const alphaHex255 = Math.floor(alpha * 255).toString(16).padStart(2, '0');
        this.ctx.fillStyle = `${color}${alphaHex255}`;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = color;
        this.ctx.beginPath();
        this.roundRect(x - size/2, y - size/2, size, size, size * 0.2);
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
        this.roundRect(centerX - size/2, centerY - size/2, size, size, size * 0.15);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 1.5;
        const numLines = 12;
        for (let i = 0; i < numLines; i++) {
            const angle = (Math.PI * 2 / numLines) * i;
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
                color: Math.random() > 0.7 ? '#ff6b35' : '#00d9ff'
            });
        }
        
        this.absorbedParticles = this.absorbedParticles.filter(particle => {
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
        const labels = ['Wave 0: Distributed', 'Waves 1-3: Clustering', 'Wave 5: Concentrated'];
        const currentLabel = labels[this.phase];
        
        const boxWidth = 260;
        const boxHeight = 40;
        const boxX = this.width - boxWidth - 20;
        const boxY = this.height - boxHeight - 20;
        
        this.ctx.fillStyle = 'rgba(10, 14, 39, 0.9)';
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        
        this.ctx.strokeStyle = 'rgba(14, 165, 233, 0.6)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        this.ctx.fillStyle = '#0ea5e9';
        this.ctx.font = 'bold 14px "JetBrains Mono", monospace';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(currentLabel, boxX + 15, boxY + boxHeight/2);
        
        const progressWidth = (boxWidth - 20) * this.phaseProgress;
        this.ctx.fillStyle = '#ff6b35';
        this.ctx.fillRect(boxX + 10, boxY + boxHeight - 5, progressWidth, 3);
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
        const mouseX = (e.clientX - rect.left);
        const mouseY = (e.clientY - rect.top);
        const distToCenter = Math.hypot(mouseX - this.centerX, mouseY - this.centerY);
        this.canvas.style.cursor = distToCenter < 50 ? 'pointer' : 'default';
    }
    
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left);
        const mouseY = (e.clientY - rect.top);
        const distToCenter = Math.hypot(mouseX - this.centerX, mouseY - this.centerY);
        
        if (distToCenter < 50) {
            this.centerNode.pulsePhase = 0;
            this.nodes.forEach(node => {
                const angle = Math.atan2(node.y - this.centerY, node.x - this.centerX);
                node.x += Math.cos(angle) * 30;
                node.y += Math.sin(angle) * 30;
            });
        }
    }
    
    animate() {
        this.updatePhase();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        this.init();
    }
    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
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
        
        document.querySelectorAll('[data-animate]').forEach(el => this.observer.observe(el));
        document.querySelectorAll('section').forEach(section => this.observer.observe(section));
        document.querySelectorAll('.comparison-column, .comparison-arrow').forEach(el => this.observer.observe(el));
    }
    
    animateCounters(card) {
        const counters = card.querySelectorAll('[data-target]');
        counters.forEach(counter => {
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

// ============================================
// NAVIGATION & FORM
// ============================================

function initNavigation() {
    const nav = document.getElementById('mainNav');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > window.innerHeight) {
            nav.classList.remove('nav-hidden');
        } else {
            nav.classList.add('nav-hidden');
        }
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
}

function initForm() {
    const form = document.getElementById('accessForm');
    if (!form) return;
    
    const submitBtn = form.querySelector('.btn-submit');
    const messageDiv = document.getElementById('formMessage');
    
    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
        input.addEventListener('blur', () => {
            if (!input.value) input.parentElement.classList.remove('focused');
        });
        input.addEventListener('change', () => {
            if (input.value) {
                input.classList.add('has-value');
                input.parentElement.classList.add('focused');
            }
        });
    });
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        let isValid = true;
        form.querySelectorAll('[required]').forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#dc2626';
            } else {
                input.style.borderColor = '';
            }
        });
        
        if (!isValid) {
            messageDiv.innerHTML = '<span style="color: var(--accent-red);">Please fill in all required fields.</span>';
            messageDiv.style.opacity = '1';
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        messageDiv.innerHTML = '<span style="color: #10b981;">REQUEST RECEIVED. STANDBY FOR CONTACT.</span>';
        messageDiv.className = 'form-message success';
        messageDiv.style.opacity = '1';
        form.reset();
        
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    });
}

function initMiniCharts() {
    document.querySelectorAll('.mini-chart').forEach(canvas => {
        const ctx = canvas.getContext('2d');
        const type = canvas.getAttribute('data-type');
        
        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            draw();
        };
        
        const draw = () => {
            const width = canvas.width / window.devicePixelRatio;
            const height = canvas.height / window.devicePixelRatio;
            ctx.clearRect(0, 0, width, height);
            
            if (type === 'trend-up') {
                ctx.strokeStyle = '#10b981';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, height);
                ctx.lineTo(width * 0.3, height * 0.6);
                ctx.lineTo(width * 0.6, height * 0.4);
                ctx.lineTo(width, height * 0.2);
                ctx.stroke();
            }
        };
        
        resize();
        window.addEventListener('resize', resize);
    });
}

function initNetworkCanvas() {
    document.querySelectorAll('.network-canvas').forEach(canvas => {
        const ctx = canvas.getContext('2d');
        const nodes = [];
        
        for (let i = 0; i < 8; i++) {
            nodes.push({
                x: Math.random() * (canvas.offsetWidth || 200),
                y: Math.random() * (canvas.offsetHeight || 80),
                radius: 3,
                pulse: Math.random() * Math.PI * 2
            });
        }
        
        const draw = () => {
            const width = canvas.offsetWidth || 200;
            const height = canvas.offsetHeight || 80;
            ctx.clearRect(0, 0, width, height);
            
            ctx.strokeStyle = 'rgba(14, 165, 233, 0.3)';
            ctx.lineWidth = 1;
            
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
                    if (dist < 80) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            nodes.forEach(node => {
                node.pulse += 0.02;
                const radius = node.radius + Math.sin(node.pulse);
                ctx.fillStyle = 'rgba(14, 165, 233, 0.8)';
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                ctx.fill();
            });
            
            requestAnimationFrame(draw);
        };
        
        draw();
    });
}

// ============================================
// CUSTOM CURSOR
// ============================================

class CustomCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);
        
        this.trails = [];
        for (let i = 0; i < 5; i++) {
            const trail = document.createElement('div');
            trail.className = 'custom-cursor-trail';
            document.body.appendChild(trail);
            this.trails.push(trail);
        }
        
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
            
            this.trails.forEach((trail, i) => {
                setTimeout(() => {
                    trail.style.left = e.clientX + 'px';
                    trail.style.top = e.clientY + 'px';
                    trail.style.opacity = (5 - i) / 5 * 0.5;
                }, i * 15);
            });
            
            const target = e.target;
            this.cursor.style.transform = (target.tagName === 'A' || target.tagName === 'BUTTON') 
                ? 'scale(2)' : 'scale(1)';
        });
        
        if (window.innerWidth < 768) {
            this.cursor.style.display = 'none';
            this.trails.forEach(t => t.style.display = 'none');
        }
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const loadingText = document.getElementById('loadingText');
    if (loadingText) {
        const text = 'INITIALIZING...';
        loadingText.textContent = '';
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                loadingText.textContent += text[i];
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 40);
    }
    
    // Initialize 3D Binary Tunnel (main background effect)
    if (document.getElementById('binary-rain-canvas')) {
        window.binaryTunnel = new BinaryTunnel('binary-rain-canvas');
    }
    
    // Initialize Binary Wave at bottom
    // if (document.getElementById('binary-wave-canvas')) {
    //     window.binaryWave = new BinaryWave('binary-wave-canvas');
    // }
    
    // Initialize Cluster Network
    // const clusterNetworkCanvas = document.getElementById('clusterNetworkCanvas');
    // if (clusterNetworkCanvas) {
    //     window.clusterNetwork = new ClusterNetwork(clusterNetworkCanvas);
    // }
    
    // Initialize Particle System
    // const particleCanvas = document.getElementById('particleCanvas');
    // if (particleCanvas) {
    //     window.particleSystem = new ParticleSystem(particleCanvas);
    // }
    
    // Initialize Data Flow ecosystem
    // const dataFlowCanvas = document.getElementById('particleCanvas');
    // if (dataFlowCanvas) {
    //     window.dataFlow = new DataFlow(dataFlowCanvas);
    //     window.dataFlow.animate();
    // }
    
    // Initialize custom cursor after loading
    setTimeout(() => {
        if (window.innerWidth >= 768) {
            window.customCursor = new CustomCursor();
        }
    }, 2000);
    
    // Initialize other components
    window.scrollAnimations = new ScrollAnimations();
    initMiniCharts();
    initNetworkCanvas();
    initNavigation();
    initForm();
    
    window.addEventListener('beforeunload', () => {
        if (window.particleSystem) window.particleSystem.destroy();
    });
});
