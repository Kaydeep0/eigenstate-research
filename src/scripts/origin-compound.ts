import { ORIGIN_WAVES, logHeight } from '../lib/originPattern';

const ACCENT = '#3e6fef';
const MUTED = '#71717a';
const SIGNAL = '#2f5a63';

export function initOriginCompound(canvasId: string): void {
  const canvas = document.getElementById(canvasId);
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0;
  let height = 0;
  let t = reduced ? ORIGIN_WAVES.length - 0.001 : 0;
  let last = 0;
  const waveMs = 2400;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    width = rect.width;
    height = rect.height;
  };

  const waveIndex = () => Math.min(ORIGIN_WAVES.length - 1, Math.floor(t));
  const waveFrac = () => t - Math.floor(t);

  const drawPanel = (x0: number, w: number, compound: boolean, step: number, frac: number) => {
    const midY = height * 0.58;
    const colW = w / ORIGIN_WAVES.length;
    ctx.fillStyle = 'rgba(113, 113, 122, 0.45)';
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(compound ? 'COMPOUND  Power(N+1) = Power(N) × structure' : 'RESET  each rail starts even', x0 + w / 2, 22);

    ORIGIN_WAVES.forEach((wave, i) => {
      const cx = x0 + colW * (i + 0.5);
      const visible = compound ? i <= step : i === step;
      const grow = compound && i === step ? frac : 1;
      const reach = logHeight(wave.logE);
      const rBase = 6 + reach * 28;
      const r = visible ? rBase * (0.35 + 0.65 * (compound && i < step ? 1 : grow)) : 0;
      ctx.fillStyle = 'rgba(113, 113, 122, 0.7)';
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillText(wave.year, cx, height - 18);
      ctx.fillText(wave.name.split(' / ')[0], cx, height - 6);
      if (!visible || r < 0.5) return;
      const color = compound ? ACCENT : MUTED;
      if (compound && i < step) {
        ctx.strokeStyle = `${SIGNAL}66`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(cx, midY);
        ctx.lineTo(x0 + colW * (i + 1.5), midY - logHeight(ORIGIN_WAVES[i + 1].logE) * 20);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.2 + reach * 0.6;
      ctx.arc(cx, midY - r * 0.15, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
      if (compound && i <= step) {
        ctx.fillStyle = '#e5e7eb';
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.fillText(wave.eLabel, cx, midY - r - 10);
      }
    });
  };

  const draw = (now: number) => {
    if (!last) last = now;
    const dt = now - last;
    last = now;
    if (!reduced) {
      t += dt / waveMs;
      if (t >= ORIGIN_WAVES.length) t = 0;
    }
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('--bg2').trim() || '#0c0f14';
    ctx.fillRect(0, 0, width, height);
    const gutter = 16;
    const panelW = (width - gutter) / 2;
    const step = waveIndex();
    const frac = reduced ? 1 : waveFrac();
    drawPanel(0, panelW, false, step, frac);
    drawPanel(panelW + gutter, panelW, true, step, frac);
    ctx.strokeStyle = 'rgba(113, 113, 122, 0.35)';
    ctx.beginPath();
    ctx.moveTo(panelW + gutter / 2, 36);
    ctx.lineTo(panelW + gutter / 2, height - 28);
    ctx.stroke();
    ctx.fillStyle = SIGNAL;
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = 'left';
    const current = ORIGIN_WAVES[step];
    ctx.fillText(`Wave in view: ${current.year}  ${current.name}  ·  ${current.rail}`, 16, 40);
  };

  let raf = 0;
  const loop = (now: number) => {
    draw(now);
    if (!reduced) raf = requestAnimationFrame(loop);
  };

  resize();
  window.addEventListener('resize', () => {
    resize();
    if (reduced) draw(performance.now());
  });
  if (reduced) draw(performance.now());
  else raf = requestAnimationFrame(loop);

  canvas.addEventListener(
    'click',
    () => {
      const id = ORIGIN_WAVES[waveIndex()].fieldId;
      if (!id) return;
      window.location.href = `${import.meta.env.BASE_URL}field/?focus=${id}`;
    },
    { passive: true }
  );
}
