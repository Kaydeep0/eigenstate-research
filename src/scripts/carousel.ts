interface CarouselOptions {
  trackSelector: string;
  prevSelector: string;
  nextSelector: string;
  dotsSelector: string;
}

// Native scroll-snap carousel — no library, touch/keyboard scrolling works
// for free since the track is a real scrollable element. JS only adds the
// arrow buttons + dot indicators and keeps them in sync with scroll position.
export function initCarousel({ trackSelector, prevSelector, nextSelector, dotsSelector }: CarouselOptions): void {
  const track = document.querySelector<HTMLElement>(trackSelector);
  if (!track) return;

  const slides = Array.from(track.children) as HTMLElement[];
  if (slides.length === 0) return;

  const prevBtn = document.querySelector<HTMLButtonElement>(prevSelector);
  const nextBtn = document.querySelector<HTMLButtonElement>(nextSelector);
  const dotsContainer = document.querySelector<HTMLElement>(dotsSelector);
  const dots = dotsContainer ? (Array.from(dotsContainer.children) as HTMLButtonElement[]) : [];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function currentIndex(): number {
    const trackLeft = track!.getBoundingClientRect().left;
    let closest = 0;
    let closestDist = Infinity;
    slides.forEach((slide, i) => {
      const dist = Math.abs(slide.getBoundingClientRect().left - trackLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    return closest;
  }

  function updateControls(): void {
    const index = currentIndex();
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === slides.length - 1;
  }

  function goTo(index: number): void {
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    slides[clamped].scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }

  prevBtn?.addEventListener('click', () => goTo(currentIndex() - 1));
  nextBtn?.addEventListener('click', () => goTo(currentIndex() + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  let ticking = false;
  track.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateControls();
      ticking = false;
    });
  });

  updateControls();
}
