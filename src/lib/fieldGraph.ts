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

const ROLE_CLASS: Record<string, string> = {
  actor: 'role-actor',
  rail: 'role-rail',
  rule_framework: 'role-rule',
  other: 'role-other',
};

export function nodeRadius(phi: number | null | undefined, maxPhi: number): number {
  if (phi == null || !Number.isFinite(phi) || phi <= 0) return 4.5;
  const span = Math.log1p(Math.max(maxPhi, 1));
  return 4.5 + 16 * (Math.log1p(phi) / span);
}

export function nodeClass(role: string): string {
  return ROLE_CLASS[role] || ROLE_CLASS.other;
}

export function initFieldGraph(
  svg: SVGSVGElement,
  data: FieldGraphData,
  base: string
): void {
  const stage = svg.querySelector<SVGGElement>('#graphStage');
  const search = document.querySelector<HTMLInputElement>('#fieldSearch');
  const hopToggle = document.querySelector<HTMLInputElement>('#fieldHop');
  const dimToggle = document.querySelector<HTMLInputElement>('#fieldDims');
  const isolatedToggle = document.querySelector<HTMLInputElement>('#fieldIsolated');
  const vectorBox = document.querySelectorAll<HTMLInputElement>('input[name="fieldVector"]');
  const panel = document.querySelector<HTMLElement>('#fieldPanel');
  if (!stage) return;

  const params = new URLSearchParams(window.location.search);
  let focus = (params.get('focus') || '').trim().toUpperCase();

  const nodeById = new Map(data.nodes.map((n) => [n.id, n]));
  const neighbors = new Map<string, Set<string>>();
  for (const e of data.edges) {
    if (!neighbors.has(e.source)) neighbors.set(e.source, new Set());
    if (!neighbors.has(e.target)) neighbors.set(e.target, new Set());
    neighbors.get(e.source)!.add(e.target);
    neighbors.get(e.target)!.add(e.source);
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
    const hops = nbrs
      .slice(0, 12)
      .map(
        (x) =>
          `<li><button type="button" data-jump="${x.id}">${x.display}</button> <span>Φ_S ${x.phi_s == null ? 'n/a' : x.phi_s.toFixed(3)}</span></li>`
      )
      .join('');
    panel.innerHTML = `
      <p class="panel-kicker">${n.display_role} · ${n.display_kind.replace(/_/g, ' ')}</p>
      <h2>${n.display}</h2>
      <p class="panel-code">${n.id}</p>
      <dl>
        <div><dt>Φ_S</dt><dd>${phi}</dd></div>
        <div><dt>κ</dt><dd>${kap}</dd></div>
        <div><dt>Degree</dt><dd>${n.degree}</dd></div>
        <div><dt>M1 obs</dt><dd>${n.m1_obs}</dd></div>
      </dl>
      <p><a href="${dossier}">Open dossier</a></p>
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
    svg.querySelectorAll<SVGElement>('.g-edge').forEach((el) => {
      const s = el.dataset.source || '';
      const t = el.dataset.target || '';
      const v = el.dataset.vector || '';
      const on = vis.has(s) && vis.has(t) && vec.has(v);
      el.classList.toggle('is-hidden', !on);
      el.classList.toggle('is-focus-edge', Boolean(focus && (s === focus || t === focus)));
    });
    svg.querySelectorAll<SVGElement>('.g-node').forEach((el) => {
      const id = el.dataset.id || '';
      const on = vis.has(id);
      el.classList.toggle('is-hidden', !on);
      el.classList.toggle('is-focus', id === focus);
      el.classList.toggle('is-neighbor', hop && nbr.has(id));
      el.classList.toggle('is-dim', Boolean(focus) && id !== focus && !nbr.has(id));
      const label = el.querySelector('.g-label');
      if (label) {
        if (id === focus || (hop && nbr.has(id))) label.classList.add('is-on');
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
    paint();
  }

  svg.querySelectorAll<SVGElement>('.g-node').forEach((el) => {
    el.addEventListener('click', (ev) => {
      ev.stopPropagation();
      setFocus(el.dataset.id || '');
    });
  });
  svg.addEventListener('click', () => setFocus(''));

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
      const next = Math.min(6, Math.max(0.35, view.k * factor));
      const rect = svg.getBoundingClientRect();
      const cx = ev.clientX - rect.left;
      const cy = ev.clientY - rect.top;
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
