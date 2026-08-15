export type FieldGraphNode = {
  id: string;
  display: string;
  phi_s: number | null;
  kappa: number | null;
  display_kind: string;
  display_role: string;
  public_default: boolean;
  demoted: boolean;
  m1_obs: number;
  degree: number;
  x: number;
  y: number;
};

export type FieldGraphEdge = {
  source: string;
  target: string;
  conn_type: string;
  vector: string;
  weight: number;
};

export type FieldGraphData = {
  schema: string;
  generated_at: string;
  nodes: FieldGraphNode[];
  edges: FieldGraphEdge[];
  counts: { nodes: number; edges: number; public_nodes: number };
  field?: { kappa?: number | null; protocol_truth?: number | null };
  vectors?: string[];
};

type Pt = { x: number; y: number; side: 'left' | 'right' | 'hub' | 'map' };

const ROLE_CLASS: Record<string, string> = {
  actor: 'role-actor',
  rail: 'role-rail',
  rule_framework: 'role-rule',
  other: 'role-other',
};

const VIEW_W = 1200;
const VIEW_H = 760;
const VIEW_PAD = 36;

export function shortLabel(raw: string): string {
  const cut = String(raw || '')
    .split('[')[0]
    .split('(')[0]
    .trim();
  if (cut.length <= 28) return cut || raw;
  return `${cut.slice(0, 26)}…`;
}

export function nodeRadius(phi: number | null | undefined, maxPhi: number): number {
  if (phi == null || !Number.isFinite(phi) || phi <= 0) return 5;
  const span = Math.log1p(Math.max(maxPhi, 1));
  return 5 + 18 * (Math.log1p(phi) / span);
}

export function nodeClass(role: string): string {
  return ROLE_CLASS[role] || ROLE_CLASS.other;
}

export type LatestReport = { slug: string; date: string; id: string };

export type FieldGraphOpts = {
  latestByEntity?: Record<string, LatestReport>;
};

function bakedPx(n: FieldGraphNode): Pt {
  return {
    x: VIEW_PAD + n.x * (VIEW_W - 2 * VIEW_PAD),
    y: VIEW_PAD + n.y * (VIEW_H - 2 * VIEW_PAD),
    side: 'map',
  };
}

export function rebuildStage(svg: SVGSVGElement, data: FieldGraphData): void {
  const stage = svg.querySelector('#graphStage');
  if (!stage) return;
  const pos = new Map(data.nodes.map((n) => [n.id, n] as const));
  const maxPhi = Math.max(
    ...data.nodes.map((n) => (n.phi_s != null && n.phi_s > 0 ? n.phi_s : 0)),
    1
  );
  const top = new Set(
    [...data.nodes]
      .filter((n) => !n.demoted && n.phi_s != null)
      .sort((a, b) => (b.phi_s || 0) - (a.phi_s || 0))
      .slice(0, 14)
      .map((n) => n.id)
  );
  const ns = 'http://www.w3.org/2000/svg';
  stage.replaceChildren();
  for (const e of data.edges) {
    const a = pos.get(e.source);
    const b = pos.get(e.target);
    if (!a || !b) continue;
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('class', 'g-edge');
    line.dataset.source = e.source;
    line.dataset.target = e.target;
    line.dataset.vector = e.vector || 'Information';
    line.setAttribute('x1', String(VIEW_PAD + a.x * (VIEW_W - 2 * VIEW_PAD)));
    line.setAttribute('y1', String(VIEW_PAD + a.y * (VIEW_H - 2 * VIEW_PAD)));
    line.setAttribute('x2', String(VIEW_PAD + b.x * (VIEW_W - 2 * VIEW_PAD)));
    line.setAttribute('y2', String(VIEW_PAD + b.y * (VIEW_H - 2 * VIEW_PAD)));
    stage.appendChild(line);
  }
  for (const n of data.nodes) {
    const cx = VIEW_PAD + n.x * (VIEW_W - 2 * VIEW_PAD);
    const cy = VIEW_PAD + n.y * (VIEW_H - 2 * VIEW_PAD);
    const r = nodeRadius(n.phi_s, maxPhi);
    const g = document.createElementNS(ns, 'g');
    g.setAttribute('class', `g-node ${nodeClass(n.display_role)}`);
    g.dataset.id = n.id;
    g.dataset.demoted = n.demoted ? 'true' : 'false';
    g.dataset.isolated = n.degree === 0 ? 'true' : 'false';
    g.setAttribute('transform', `translate(${cx} ${cy})`);
    const title = document.createElementNS(ns, 'title');
    title.textContent = `${n.display} · Φ_S ${n.phi_s == null ? 'n/a' : n.phi_s.toFixed(3)} · ${n.degree} edges`;
    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('r', String(r));
    const text = document.createElementNS(ns, 'text');
    text.setAttribute('class', top.has(n.id) ? 'g-label g-label-top' : 'g-label');
    text.setAttribute('x', String(r + 4));
    text.setAttribute('y', '3');
    text.textContent = shortLabel(n.display);
    g.append(title, circle, text);
    stage.appendChild(g);
  }
}

export function initFieldGraph(
  svg: SVGSVGElement,
  data: FieldGraphData,
  base: string,
  opts: FieldGraphOpts = {}
): void {
  const stage = svg.querySelector<SVGGElement>('#graphStage');
  const search = document.querySelector<HTMLInputElement>('#fieldSearch');
  const hopToggle = document.querySelector<HTMLInputElement>('#fieldHop');
  const dimToggle = document.querySelector<HTMLInputElement>('#fieldDims');
  const isolatedToggle = document.querySelector<HTMLInputElement>('#fieldIsolated');
  const vectorBox = document.querySelectorAll<HTMLInputElement>('input[name="fieldVector"]');
  const latestByEntity = opts.latestByEntity || {};
  const fed = 'https://geniusflow-federation.vercel.app';
  const panel = document.querySelector<HTMLElement>('#fieldPanel');
  if (!stage) return;

  const params = new URLSearchParams(window.location.search);
  let focus = (params.get('focus') || '').trim().toUpperCase();

  const nodeById = new Map(data.nodes.map((n) => [n.id, n]));
  const neighbors = new Map<string, Set<string>>();
  const inboundOf = new Map<string, Set<string>>();
  const outboundOf = new Map<string, Set<string>>();
  for (const e of data.edges) {
    if (!neighbors.has(e.source)) neighbors.set(e.source, new Set());
    if (!neighbors.has(e.target)) neighbors.set(e.target, new Set());
    neighbors.get(e.source)!.add(e.target);
    neighbors.get(e.target)!.add(e.source);
    if (!outboundOf.has(e.source)) outboundOf.set(e.source, new Set());
    if (!inboundOf.has(e.target)) inboundOf.set(e.target, new Set());
    outboundOf.get(e.source)!.add(e.target);
    inboundOf.get(e.target)!.add(e.source);
  }

  let view = { x: 0, y: 0, k: 1 };
  const applyView = () => {
    stage.setAttribute('transform', `translate(${view.x} ${view.y}) scale(${view.k})`);
  };

  if (focus && hopToggle) hopToggle.checked = true;

  const selectedVectors = () => {
    const on = [...vectorBox].filter((el) => el.checked).map((el) => el.value);
    return new Set(on.length ? on : ['Information', 'Capital', 'Infrastructure']);
  };

  function visibleIds(): Set<string> {
    const q = (search?.value || '').trim().toUpperCase();
    const showDim = Boolean(dimToggle?.checked);
    const showIso = Boolean(isolatedToggle?.checked);
    const out = new Set<string>();
    for (const n of data.nodes) {
      if (n.demoted && !showDim) continue;
      if (n.degree === 0 && !showIso && n.id !== focus) continue;
      if (q && !n.id.includes(q) && !n.display.toUpperCase().includes(q)) continue;
      out.add(n.id);
    }
    if (focus && hopToggle?.checked) {
      const keep = new Set<string>([focus, ...(neighbors.get(focus) || [])]);
      for (const id of [...out]) {
        if (!keep.has(id)) out.delete(id);
      }
      if (nodeById.has(focus)) out.add(focus);
    }
    return out;
  }

  function column(ids: string[], x: number, side: Pt['side']): Map<string, Pt> {
    const placed = new Map<string, Pt>();
    const n = ids.length;
    if (!n) return placed;
    const top = 90;
    const bot = VIEW_H - 90;
    const span = n === 1 ? 0 : (bot - top) / (n - 1);
    ids.forEach((id, i) => {
      const y = n === 1 ? VIEW_H / 2 : top + i * span;
      placed.set(id, { x, y, side });
    });
    return placed;
  }

  function layoutHop(vis: Set<string>, hubId: string): Map<string, Pt> {
    const inSet = inboundOf.get(hubId) || new Set();
    const outSet = outboundOf.get(hubId) || new Set();
    const both: string[] = [];
    const left: string[] = [];
    const right: string[] = [];
    for (const id of vis) {
      if (id === hubId) continue;
      const inn = inSet.has(id);
      const out = outSet.has(id);
      if (inn && out) both.push(id);
      else if (inn) left.push(id);
      else right.push(id);
    }
    const byPhi = (a: string, b: string) =>
      (nodeById.get(b)?.phi_s || 0) - (nodeById.get(a)?.phi_s || 0);
    left.sort(byPhi);
    right.sort(byPhi);
    both.sort(byPhi);
    // Split "both" so columns stay balanced.
    both.forEach((id, i) => (i % 2 === 0 ? left.push(id) : right.push(id)));
    left.sort(byPhi);
    right.sort(byPhi);
    const pos = new Map<string, Pt>();
    pos.set(hubId, { x: VIEW_W / 2, y: VIEW_H / 2, side: 'hub' });
    column(left, 210, 'left').forEach((pt, id) => pos.set(id, pt));
    column(right, VIEW_W - 210, 'right').forEach((pt, id) => pos.set(id, pt));
    return pos;
  }

  function unpackMap(vis: Set<string>): Map<string, Pt> {
    const ids = [...vis];
    const pos = new Map<string, Pt>();
    for (const id of ids) {
      const n = nodeById.get(id);
      if (n) pos.set(id, bakedPx(n));
    }
    const links: Array<[string, string]> = [];
    for (const e of data.edges) {
      if (vis.has(e.source) && vis.has(e.target) && e.source !== e.target) {
        links.push([e.source, e.target]);
      }
    }
    const k = Math.max(28, 520 / Math.sqrt(Math.max(ids.length, 1)));
    const steps = Math.min(55, 18 + Math.floor(ids.length / 8));
    for (let step = 0; step < steps; step++) {
      const temp = 14 * (1 - step / steps);
      const disp = new Map<string, { x: number; y: number }>();
      for (const id of ids) disp.set(id, { x: 0, y: 0 });
      for (let i = 0; i < ids.length; i++) {
        const a = ids[i];
        const pa = pos.get(a)!;
        for (let j = i + 1; j < ids.length; j++) {
          const b = ids[j];
          const pb = pos.get(b)!;
          let dx = pa.x - pb.x;
          let dy = pa.y - pb.y;
          let dist = Math.hypot(dx, dy);
          if (dist < 1) {
            dx = 0.7;
            dy = 0.7;
            dist = 1;
          }
          const force = (k * k) / dist;
          const ux = dx / dist;
          const uy = dy / dist;
          const da = disp.get(a)!;
          const db = disp.get(b)!;
          da.x += ux * force;
          da.y += uy * force;
          db.x -= ux * force;
          db.y -= uy * force;
        }
      }
      for (const [s, t] of links) {
        const pa = pos.get(s);
        const pb = pos.get(t);
        if (!pa || !pb) continue;
        const dx = pa.x - pb.x;
        const dy = pa.y - pb.y;
        const dist = Math.hypot(dx, dy) || 1;
        const force = Math.min((dist * dist) / k, k * 6);
        const ux = dx / dist;
        const uy = dy / dist;
        disp.get(s)!.x -= ux * force;
        disp.get(s)!.y -= uy * force;
        disp.get(t)!.x += ux * force;
        disp.get(t)!.y += uy * force;
      }
      for (const id of ids) {
        const d = disp.get(id)!;
        const mag = Math.hypot(d.x, d.y) || 1;
        const scale = Math.min(mag, temp) / mag;
        const p = pos.get(id)!;
        p.x += d.x * scale;
        p.y += d.y * scale;
      }
    }
    return pos;
  }

  function fitTo(pos: Map<string, Pt>) {
    const pts = [...pos.values()];
    if (!pts.length) {
      view = { x: 0, y: 0, k: 1 };
      applyView();
      return;
    }
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const p of pts) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }
    const bw = Math.max(maxX - minX, 80);
    const bh = Math.max(maxY - minY, 80);
    const pad = 48;
    const k = Math.min((VIEW_W - pad * 2) / bw, (VIEW_H - pad * 2) / bh, 3.2) * 0.92;
    view.k = k;
    view.x = pad + (VIEW_W - pad * 2 - bw * k) / 2 - minX * k;
    view.y = pad + (VIEW_H - pad * 2 - bh * k) / 2 - minY * k;
    applyView();
  }

  function applyPositions(pos: Map<string, Pt>, vis: Set<string>) {
    svg.querySelectorAll<SVGGElement>('.g-node').forEach((el) => {
      const id = el.dataset.id || '';
      const p = pos.get(id);
      if (!p || !vis.has(id)) return;
      el.setAttribute('transform', `translate(${p.x} ${p.y})`);
      const label = el.querySelector('text');
      const circle = el.querySelector('circle');
      const r = circle ? Number(circle.getAttribute('r') || 6) : 6;
      if (label) {
        if (p.side === 'left') {
          label.setAttribute('text-anchor', 'end');
          label.setAttribute('x', String(-(r + 10)));
          label.setAttribute('y', '4');
        } else if (p.side === 'right') {
          label.setAttribute('text-anchor', 'start');
          label.setAttribute('x', String(r + 10));
          label.setAttribute('y', '4');
        } else if (p.side === 'hub') {
          label.setAttribute('text-anchor', 'middle');
          label.setAttribute('x', '0');
          label.setAttribute('y', String(-(r + 14)));
        } else {
          label.setAttribute('text-anchor', 'start');
          label.setAttribute('x', String(r + 6));
          label.setAttribute('y', '4');
        }
      }
    });
    svg.querySelectorAll<SVGLineElement>('.g-edge').forEach((el) => {
      const s = pos.get(el.dataset.source || '');
      const t = pos.get(el.dataset.target || '');
      if (!s || !t) return;
      el.setAttribute('x1', String(s.x));
      el.setAttribute('y1', String(s.y));
      el.setAttribute('x2', String(t.x));
      el.setAttribute('y2', String(t.y));
    });
  }

  function renderPanel(id: string | null) {
    if (!panel) return;
    if (!id || !nodeById.has(id)) {
      panel.innerHTML =
        '<p class="panel-empty">Click a node. Circle is the current Φ_S peak.</p>';
      return;
    }
    const n = nodeById.get(id)!;
    const nbrs = [...(neighbors.get(id) || [])]
      .map((x) => nodeById.get(x))
      .filter((x): x is FieldGraphNode => Boolean(x))
      .sort((a, b) => (b.phi_s || 0) - (a.phi_s || 0));
    const phi = n.phi_s == null ? 'n/a' : n.phi_s.toFixed(4);
    const kap = n.kappa == null ? 'n/a' : n.kappa.toFixed(4);
    const dossier = `${base}dossier/${n.id}/`;
    const hub = `${base}reports/${n.id.toLowerCase().replace(/_/g, '-')}/`;
    const report = latestByEntity[n.id];
    const feed = `${fed}/api/report_feed?entity=${encodeURIComponent(n.id)}`;
    const liveDos = `${fed}/api/dossier?entity=${encodeURIComponent(n.id)}`;
    const reportLink = report
      ? `<p><a href="${base}reports/${report.slug}/">Latest report · ${report.date}</a></p>`
      : `<p class="panel-empty">No dated report on this node yet. Live card still updates.</p>`;
    const hops = nbrs
      .slice(0, 14)
      .map(
        (x) =>
          `<li><button type="button" data-jump="${x.id}">${shortLabel(x.display)}</button> <span>Φ_S ${x.phi_s == null ? 'n/a' : x.phi_s.toFixed(3)}</span></li>`
      )
      .join('');
    panel.innerHTML = `
      <p class="panel-kicker">${n.display_role} · ${n.display_kind.replace(/_/g, ' ')}</p>
      <h2>${shortLabel(n.display)}</h2>
      <p class="panel-code">${n.id}</p>
      <p class="panel-legend">Inbound left · outbound right</p>
      <dl>
        <div><dt>Φ_S</dt><dd>${phi}</dd></div>
        <div><dt>κ</dt><dd>${kap}</dd></div>
        <div><dt>Degree</dt><dd>${n.degree}</dd></div>
        <div><dt>M1 obs</dt><dd>${n.m1_obs}</dd></div>
      </dl>
      <div class="panel-links">
        <p><a href="${dossier}">Live dossier</a></p>
        ${reportLink}
        <p><a href="${hub}">Report history</a></p>
        <p><a href="${liveDos}">Vercel dossier</a></p>
        <p><a href="${feed}">Vercel feed</a></p>
      </div>
      ${hops ? `<p class="panel-kicker">Neighbors</p><ul class="panel-hops">${hops}</ul>` : ''}
    `;
    panel.querySelectorAll<HTMLButtonElement>('[data-jump]').forEach((btn) => {
      btn.addEventListener('click', () => setFocus(btn.dataset.jump || ''));
    });
  }

  function paint() {
    const vis = visibleIds();
    const vec = selectedVectors();
    const hop = Boolean(focus && hopToggle?.checked);
    const nbr = neighbors.get(focus) || new Set();
    svg.classList.toggle('is-hop', hop);

    const pos = hop && focus ? layoutHop(vis, focus) : unpackMap(vis);
    applyPositions(pos, vis);
    if (hop) {
      view = { x: 0, y: 0, k: 1 };
      applyView();
    } else {
      fitTo(pos);
    }

    svg.querySelectorAll<SVGElement>('.g-edge').forEach((el) => {
      const s = el.dataset.source || '';
      const t = el.dataset.target || '';
      const v = el.dataset.vector || '';
      const incident = !hop || s === focus || t === focus;
      const on = vis.has(s) && vis.has(t) && vec.has(v) && incident;
      el.classList.toggle('is-hidden', !on);
      el.classList.toggle('is-focus-edge', Boolean(focus && (s === focus || t === focus)));
    });
    svg.querySelectorAll<SVGElement>('.g-node').forEach((el) => {
      const id = el.dataset.id || '';
      const on = vis.has(id);
      el.classList.toggle('is-hidden', !on);
      el.classList.toggle('is-focus', id === focus);
      el.classList.toggle('is-neighbor', hop && nbr.has(id));
      el.classList.toggle('is-dim', Boolean(focus) && !hop && id !== focus && !nbr.has(id));
      const label = el.querySelector('.g-label');
      if (label) {
        if (hop && on) label.classList.add('is-on');
        else label.classList.remove('is-on');
      }
    });
    renderPanel(focus || null);
  }

  function setFocus(id: string) {
    focus = (id || '').toUpperCase();
    const url = new URL(window.location.href);
    if (focus) url.searchParams.set('focus', focus);
    else url.searchParams.delete('focus');
    window.history.replaceState({}, '', url);
    if (focus && hopToggle && !hopToggle.checked) hopToggle.checked = true;
    paint();
  }

  svg.querySelectorAll<SVGElement>('.g-node').forEach((el) => {
    el.addEventListener('click', (ev) => {
      ev.stopPropagation();
      setFocus(el.dataset.id || '');
    });
  });
  svg.addEventListener('click', () => {
    if (hopToggle?.checked) return;
    setFocus('');
  });

  search?.addEventListener('input', paint);
  hopToggle?.addEventListener('change', paint);
  dimToggle?.addEventListener('change', paint);
  isolatedToggle?.addEventListener('change', paint);
  vectorBox.forEach((el) => el.addEventListener('change', paint));

  let dragging = false;
  let last = { x: 0, y: 0 };
  svg.addEventListener('pointerdown', (ev) => {
    if ((ev.target as Element).closest('.g-node')) return;
    dragging = true;
    last = { x: ev.clientX, y: ev.clientY };
    svg.setPointerCapture(ev.pointerId);
  });
  svg.addEventListener('pointermove', (ev) => {
    if (!dragging) return;
    view.x += ev.clientX - last.x;
    view.y += ev.clientY - last.y;
    last = { x: ev.clientX, y: ev.clientY };
    applyView();
  });
  svg.addEventListener('pointerup', () => {
    dragging = false;
  });
  svg.addEventListener(
    'wheel',
    (ev) => {
      ev.preventDefault();
      const factor = ev.deltaY < 0 ? 1.08 : 0.92;
      const next = Math.min(6, Math.max(0.25, view.k * factor));
      const rect = svg.getBoundingClientRect();
      const sx = VIEW_W / Math.max(rect.width, 1);
      const sy = VIEW_H / Math.max(rect.height, 1);
      const cx = (ev.clientX - rect.left) * sx;
      const cy = (ev.clientY - rect.top) * sy;
      view.x = cx - (cx - view.x) * (next / view.k);
      view.y = cy - (cy - view.y) * (next / view.k);
      view.k = next;
      applyView();
    },
    { passive: false }
  );

  if (focus && !nodeById.has(focus)) focus = '';
  paint();
}
