// Smooth-scrolls same-page anchor links and reveals the nav once JS has hydrated.
export function initNavigation(): void {
  const nav = document.getElementById('mainNav');
  if (nav) nav.classList.remove('nav-hidden');

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href')!);
      if (target) {
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });
}

// Shared mobile hamburger-menu toggle, used by both the homepage's own nav
// and the shared Nav.astro component (each page renders exactly one nav).
export function initMobileNavToggle(toggleId: string, linksId: string): void {
  const toggle = document.getElementById(toggleId);
  const links = document.getElementById(linksId);
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}
