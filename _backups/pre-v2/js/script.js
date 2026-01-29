// ============================================
// EIGENSTATE RESEARCH - MAIN SCRIPT
// ============================================

// ============================================
// BINARY TUNNEL (3D Perspective Effect)
// ============================================

class BinaryTunnel {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.warn('BinaryTunnel: Canvas not found:', canvasId);
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.characters = [];
        this.time = 0;
        this.isMobile = window.innerWidth < 768;
        this.vpX = 0;
        this.vpY = 0;
        
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.handleResize());
    }
    
    init() {
        this.handleResize();
        this.createCharacters();
    }
    
    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.isMobile = window.innerWidth < 768;
        this.vpX = this.width / 2;
        this.vpY = this.height * 0.45;
        this.createCharacters();
    }
    
    createCharacters() {
        this.characters = [];
        const count = this.isMobile ? 400 : 800;
        
        for (let i = 0; i < count; i++) {
            this.characters.push(this.createCharacter());
        }
    }
    
    createCharacter() {
        return {
            angle: Math.random() * Math.PI * 2,
            z: Math.random(),
            speed: 0.001 + Math.random() * 0.003,
            char: Math.random() > 0.5 ? '1' : '0',
            brightness: 0.4 + Math.random() * 0.6,
            size: 8 + Math.random() * 14
        };
    }
    
    draw() {
        // Fade effect for trails
        this.ctx.fillStyle = 'rgba(3, 7, 18, 0.08)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.time += 0.016;
        
        this.characters.forEach(char => {
            char.z += char.speed;
            
            if (char.z > 1) {
                char.z = 0;
                char.angle = Math.random() * Math.PI * 2;
                char.char = Math.random() > 0.5 ? '1' : '0';
            }
            
            const spread = char.z * Math.max(this.width, this.height) * 0.8;
            const x = this.vpX + Math.cos(char.angle) * spread;
            const y = this.vpY + Math.sin(char.angle) * spread;
            
            if (x < -50 || x > this.width + 50 || y < -50 || y > this.height + 50) return;
            
            const size = char.size * (0.1 + char.z * 1.2);
            const alpha = Math.min(1, char.z * char.z * char.brightness * 1.5);
            
            // Color based on depth
            let color;
            if (char.z < 0.3) {
                color = `rgba(30, 64, 175, ${alpha * 0.5})`;
            } else if (char.z < 0.6) {
                color = `rgba(14, 165, 233, ${alpha * 0.8})`;
            } else {
                const white = Math.floor(200 + 55 * char.z);
                color = `rgba(${white}, 255, 255, ${alpha})`;
            }
            
            this.ctx.font = `bold ${Math.max(6, size)}px "JetBrains Mono", monospace`;
            this.ctx.fillStyle = color;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            if (char.z > 0.7) {
                this.ctx.shadowBlur = 15 * char.z;
                this.ctx.shadowColor = '#00ffff';
            } else {
                this.ctx.shadowBlur = 0;
            }
            
            this.ctx.fillText(char.char, x, y);
        });
        
        this.ctx.shadowBlur = 0;
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// BINARY WAVE (Bottom Formation)
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
        this.canvas.height = window.innerHeight * 0.4;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.isMobile = window.innerWidth < 768;
        this.createParticles();
    }
    
    createParticles() {
        this.particles = [];
        const spacing = this.isMobile ? 16 : 12;
        const cols = Math.ceil(this.width / spacing);
        const rows = Math.ceil(this.height / spacing);
        
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                this.particles.push({
                    baseX: x * spacing,
                    baseY: y * spacing,
                    x: x * spacing,
                    y: y * spacing,
                    char: Math.random() > 0.5 ? '1' : '0'
                });
            }
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.time += 0.02;
        
        this.ctx.font = `bold 11px "JetBrains Mono", monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        this.particles.forEach(particle => {
            const wave1 = Math.sin(particle.baseX * 0.006 + this.time) * 45;
            const wave2 = Math.sin(particle.baseX * 0.003 - this.time * 0.7) * 28;
            const wave3 = Math.sin(particle.baseX * 0.01 + this.time * 1.4) * 15;
            
            const waveY = this.height * 0.5 + wave1 + wave2 + wave3;
            const distanceFromWave = Math.abs(particle.baseY - waveY);
            const maxDistance = 75;
            const proximityFactor = Math.max(0, 1 - distanceFromWave / maxDistance);
            
            if (proximityFactor > 0.05) {
                const displacement = Math.sin(particle.baseX * 0.008 + this.time) * 4;
                particle.y = particle.baseY + displacement;
                particle.x = particle.baseX + Math.sin(this.time + particle.baseY * 0.01) * 2;
                
                const brightness = 0.15 + proximityFactor * 0.85;
                const isInCrest = distanceFromWave < 12;
                
                if (isInCrest && proximityFactor > 0.85) {
                    this.ctx.fillStyle = `rgba(180, 255, 255, ${brightness})`;
                    this.ctx.shadowBlur = 10;
                    this.ctx.shadowColor = '#00ffff';
                } else if (proximityFactor > 0.6) {
                    this.ctx.fillStyle = `rgba(0, 220, 255, ${brightness * 0.9})`;
                    this.ctx.shadowBlur = 4;
                    this.ctx.shadowColor = '#00ffff';
                } else {
                    const g = Math.floor(140 + 80 * proximityFactor);
                    this.ctx.fillStyle = `rgba(14, ${g}, 233, ${brightness * 0.7})`;
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
// PARTICLE SYSTEM (Connecting Nodes)
// ============================================

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
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
        
        const particleCount = window.innerWidth < 768 ? 30 : 60;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                pulsePhase: Math.random() * Math.PI * 2
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
        
        this.ctx.fillStyle = 'rgba(3, 7, 18, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update particles
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
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
                    const opacity = (1 - distance / 150) * 0.3;
                    const isOrange = (i + j) % 4 === 0;
                    
                    this.ctx.strokeStyle = isOrange 
                        ? `rgba(255, 107, 53, ${opacity})`
                        : `rgba(0, 217, 255, ${opacity * 0.5})`;
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
            
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, radius * 4
            );
            gradient.addColorStop(0, 'rgba(0, 217, 255, 0.5)');
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, radius * 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = '#00d9ff';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
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
                    baseAngle: angle,
                    baseDistance: distance,
                    isAnchor: j === 0,
                    radius: j === 0 ? 4 : 2,
                    pulsePhase: Math.random() * Math.PI * 2
                };
                
                cluster.nodes.push(node);
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
        
        this.ctx.fillStyle = 'rgba(3, 7, 18, 0.02)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.clusters.forEach(cluster => {
            cluster.rotation += cluster.rotationSpeed;
            
            // Update node positions
            cluster.nodes.forEach(node => {
                const angle = node.baseAngle + cluster.rotation;
                node.x = cluster.center.x + Math.cos(angle) * node.baseDistance;
                node.y = cluster.center.y + Math.sin(angle) * node.baseDistance;
                node.pulsePhase += 0.03;
            });
            
            // Draw connections
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
                        this.ctx.lineWidth = 1;
                        
                        this.ctx.beginPath();
                        this.ctx.moveTo(node1.x, node1.y);
                        this.ctx.lineTo(node2.x, node2.y);
                        this.ctx.stroke();
                    }
                }
            }
            
            // Draw nodes
            cluster.nodes.forEach(node => {
                const pulse = 1 + Math.sin(node.pulsePhase) * 0.3;
                const radius = node.radius * pulse;
                
                const gradient = this.ctx.createRadialGradient(
                    node.x, node.y, 0,
                    node.x, node.y, radius * 4
                );
                
                if (node.isAnchor) {
                    gradient.addColorStop(0, 'rgba(0, 217, 255, 0.8)');
                    gradient.addColorStop(1, 'transparent');
                } else {
                    gradient.addColorStop(0, 'rgba(14, 165, 233, 0.6)');
                    gradient.addColorStop(1, 'transparent');
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
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// NETWORK FORMATION (Pattern Section)
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
        this.phaseSpeed = 0.008;
        
        this.init();
        this.animate();
        
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
    }
    
    createNodes() {
        this.centerNode = {
            size: 40,
            maxSize: 80,
            pulsePhase: 0
        };
        
        const nodeCount = window.innerWidth < 768 ? 25 : 40;
        this.nodes = [];
        
        for (let i = 0; i < nodeCount; i++) {
            const angle = (Math.PI * 2 / nodeCount) * i;
            const distance = 150 + Math.random() * 200;
            const x = this.centerX + Math.cos(angle) * distance;
            const y = this.centerY + Math.sin(angle) * distance;
            
            const finalDistance = 80 + Math.random() * 120;
            const finalAngle = angle + (Math.random() - 0.5) * 0.5;
            
            this.nodes.push({
                x: x,
                y: y,
                initialX: x,
                initialY: y,
                targetX: this.centerX + Math.cos(finalAngle) * finalDistance,
                targetY: this.centerY + Math.sin(finalAngle) * finalDistance,
                size: 8 + Math.random() * 8,
                initialSize: 8 + Math.random() * 8,
                finalSize: 2 + Math.random() * 3,
                color: i < nodeCount * 0.3 ? '#00d9ff' : '#94a3b8'
            });
        }
    }
    
    draw() {
        this.ctx.fillStyle = '#0a0e27';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.phaseProgress += this.phaseSpeed;
        if (this.phaseProgress >= 1) {
            this.phaseProgress = 0;
            this.phase = (this.phase + 1) % (this.maxPhase + 1);
        }
        
        const globalProgress = (this.phase + this.phaseProgress) / this.maxPhase;
        
        // Draw targeting grid
        this.ctx.strokeStyle = 'rgba(14, 165, 233, 0.2)';
        this.ctx.lineWidth = 1;
        
        for (let r = 60; r <= 120; r += 30) {
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, r, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        // Draw connections and nodes
        this.nodes.forEach(node => {
            const progress = Math.min(1, globalProgress * 1.5);
            node.x = node.initialX + (node.targetX - node.initialX) * progress;
            node.y = node.initialY + (node.targetY - node.initialY) * progress;
            const size = node.initialSize + (node.finalSize - node.initialSize) * progress;
            
            // Connection to center
            const distToCenter = Math.hypot(node.x - this.centerX, node.y - this.centerY);
            if (distToCenter < 250) {
                const alpha = (1 - distToCenter / 250) * globalProgress * 0.3;
                this.ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(node.x, node.y);
                this.ctx.lineTo(this.centerX, this.centerY);
                this.ctx.stroke();
            }
            
            // Node
            this.ctx.fillStyle = node.color;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, size / 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw center node (CIRCLE)
        this.centerNode.pulsePhase += 0.02;
        const centerSize = this.centerNode.size + (this.centerNode.maxSize - this.centerNode.size) * globalProgress;
        const pulse = Math.sin(this.centerNode.pulsePhase) * 5;
        
        // Glow
        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, (centerSize + pulse) * 1.5
        );
        gradient.addColorStop(0, 'rgba(255, 107, 53, 0.6)');
        gradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, (centerSize + pulse) * 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Core circle
        this.ctx.fillStyle = '#ff6b35';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#ff6b35';
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, (centerSize + pulse) / 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        // Label
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = `bold ${centerSize * 0.25}px 'Orbitron', sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('CORE', this.centerX, this.centerY);
        
        // Percentage
        const concentration = Math.floor(65 + globalProgress * 13);
        this.ctx.font = `${centerSize * 0.18}px 'JetBrains Mono', monospace`;
        this.ctx.fillText(`${concentration}%`, this.centerX, this.centerY + centerSize * 0.35);
        
        // Phase indicator
        const labels = ['Wave 0: Distributed', 'Waves 1-4: Clustering', 'Wave 5: Concentrated'];
        this.ctx.fillStyle = '#0ea5e9';
        this.ctx.font = 'bold 12px "JetBrains Mono", monospace';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(labels[this.phase], this.width - 20, this.height - 20);
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

class ScrollAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    if (entry.target.id === 'pattern' && !window.networkFormation) {
                        setTimeout(() => {
                            window.networkFormation = new NetworkFormation('network-canvas');
                        }, 300);
                    }
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('section').forEach(section => observer.observe(section));
    }
}

// ============================================
// NAVIGATION
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
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ============================================
// FORM HANDLING
// ============================================

function initForm() {
    const form = document.getElementById('accessForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const messageDiv = document.getElementById('formMessage');
        const submitBtn = form.querySelector('.btn-submit');
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'SUBMITTING...';
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        messageDiv.innerHTML = '<span style="color: #10b981;">REQUEST RECEIVED. STANDBY FOR CONTACT.</span>';
        messageDiv.style.opacity = '1';
        form.reset();
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>SUBMIT REQUEST</span>';
    });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Loading text animation
    const loadingText = document.getElementById('loadingText');
    if (loadingText) {
        const text = 'EIGENSTATE';
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                loadingText.textContent += text[i];
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);
    }
    
    // Initialize hero animations
    if (document.getElementById('binary-rain-canvas')) {
        window.binaryTunnel = new BinaryTunnel('binary-rain-canvas');
    }
    
    if (document.getElementById('binary-wave-canvas')) {
        window.binaryWave = new BinaryWave('binary-wave-canvas');
    }
    
    const clusterCanvas = document.getElementById('clusterNetworkCanvas');
    if (clusterCanvas) {
        window.clusterNetwork = new ClusterNetwork(clusterCanvas);
    }
    
    const particleCanvas = document.getElementById('particleCanvas');
    if (particleCanvas) {
        window.particleSystem = new ParticleSystem(particleCanvas);
    }
    
    // Initialize other components
    window.scrollAnimations = new ScrollAnimations();
    initNavigation();
    initForm();
});
