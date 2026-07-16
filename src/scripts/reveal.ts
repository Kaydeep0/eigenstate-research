interface RevealOptions {
  selector: string;
  staggerMs?: number;
}

// Generic scroll-reveal for card/tile grids (report cards, prediction cards,
// stat tiles) — distinct from the homepage's bespoke ScrollAnimations, which
// is coupled to homepage-only sections (#pattern, .intel-card, etc).
//
// Progressive enhancement by construction: the pre-reveal (opacity:0) state
// is only ever added by this script, never by static CSS, so content stays
// fully visible if JS fails to load/run at all. If prefers-reduced-motion is
// set, items are marked visible immediately with no transition.
export function initReveal({ selector, staggerMs = 60 }: RevealOptions): void {
  const items = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (items.length === 0) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((el) => el.classList.add('reveal-visible'));
    return;
  }

  items.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const index = items.indexOf(el);
        // Cap the stagger group at 8 items (tool guidance: beyond that the
        // tail of a long list feels laggy rather than orchestrated).
        const delay = Math.min(index, 8) * staggerMs;
        el.style.transitionDelay = `${delay}ms`;
        el.classList.add('reveal-visible');
        observer.unobserve(el);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}
