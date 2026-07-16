interface SortOption {
  /** dataset key (camelCase, matching the data-* attribute) to sort by */
  field: string;
  direction: 'asc' | 'desc';
  type?: 'string' | 'number';
}

interface FilterListOptions {
  containerSelector: string;
  itemSelector: string;
  searchInputSelector?: string;
  /** dataset keys (camelCase) to match the search query against */
  searchFields?: string[];
  sortSelectSelector?: string;
  /** keyed by the <option value="..."> */
  sortOptions?: Record<string, SortOption>;
  filterSelectSelector?: string;
  /** dataset key (camelCase) the filter dropdown matches against */
  filterField?: string;
  emptyStateSelector?: string;
}

// Generic client-side search/sort/filter for an already-server-rendered list
// or table (Reports grid, Track Record claim history). Operates on the
// existing DOM nodes via show/hide + reorder — never re-renders from JSON —
// so the full server-rendered content is exactly what's there with JS
// disabled; this only makes it interactive on top.
export function initFilterList(options: FilterListOptions): void {
  const maybeContainer = document.querySelector(options.containerSelector);
  if (!maybeContainer) return;
  const container = maybeContainer;

  const items = Array.from(container.querySelectorAll<HTMLElement>(options.itemSelector));
  if (items.length === 0) return;

  const searchInput = options.searchInputSelector
    ? document.querySelector<HTMLInputElement>(options.searchInputSelector)
    : null;
  const sortSelect = options.sortSelectSelector
    ? document.querySelector<HTMLSelectElement>(options.sortSelectSelector)
    : null;
  const filterSelect = options.filterSelectSelector
    ? document.querySelector<HTMLSelectElement>(options.filterSelectSelector)
    : null;
  const emptyState = options.emptyStateSelector
    ? document.querySelector<HTMLElement>(options.emptyStateSelector)
    : null;

  function apply(): void {
    const query = (searchInput?.value ?? '').trim().toLowerCase();
    const filterValue = filterSelect?.value ?? '';

    let visibleCount = 0;
    items.forEach((el) => {
      const searchable = (options.searchFields ?? [])
        .map((f) => (el.dataset[f] ?? '').toLowerCase())
        .join(' ');
      const matchesSearch = query === '' || searchable.includes(query);
      const matchesFilter =
        !options.filterField || filterValue === '' || el.dataset[options.filterField] === filterValue;
      const visible = matchesSearch && matchesFilter;
      el.style.display = visible ? '' : 'none';
      if (visible) visibleCount += 1;
    });

    if (emptyState) emptyState.style.display = visibleCount === 0 ? '' : 'none';

    const sortOpt = sortSelect && options.sortOptions ? options.sortOptions[sortSelect.value] : null;
    if (sortOpt) {
      const sorted = [...items].sort((a, b) => {
        const av = a.dataset[sortOpt.field] ?? '';
        const bv = b.dataset[sortOpt.field] ?? '';
        const cmp = sortOpt.type === 'number' ? parseFloat(av) - parseFloat(bv) : av.localeCompare(bv);
        return sortOpt.direction === 'asc' ? cmp : -cmp;
      });
      sorted.forEach((el) => container.appendChild(el));
    }
  }

  searchInput?.addEventListener('input', apply);
  sortSelect?.addEventListener('change', apply);
  filterSelect?.addEventListener('change', apply);
}
