// Small decorative canvases used in a couple of card layouts on the homepage.
export function initMiniCharts(): void {
  document.querySelectorAll<HTMLCanvasElement>('.mini-chart').forEach((canvas) => {
    const ctx = canvas.getContext('2d')!;
    const type = canvas.getAttribute('data-type');

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

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      draw();
    };

    resize();
    window.addEventListener('resize', resize);
  });
}

// Tiny animated node-graph decoration (distinct from the Pattern-section
// NetworkFormation despite the similar element class name).
export function initNetworkCanvas(): void {
  document.querySelectorAll<HTMLCanvasElement>('.network-canvas').forEach((canvas) => {
    const ctx = canvas.getContext('2d')!;
    const nodes: { x: number; y: number; radius: number; pulse: number }[] = [];

    for (let i = 0; i < 8; i++) {
      nodes.push({
        x: Math.random() * (canvas.offsetWidth || 200),
        y: Math.random() * (canvas.offsetHeight || 80),
        radius: 3,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      const width = canvas.offsetWidth || 200;
      const height = canvas.offsetHeight || 80;
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(69, 116, 124, 0.3)';
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

      nodes.forEach((node) => {
        node.pulse += 0.02;
        const radius = node.radius + Math.sin(node.pulse);
        ctx.fillStyle = 'rgba(69, 116, 124, 0.8)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    draw();
  });
}
