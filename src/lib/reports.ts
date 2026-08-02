/** Content-collection / URL slug for a report entry (filename stem). */
export function slugFor(id: string): string {
  return id.replace(/\.md$/, '');
}

/** Entity hub URL slug: BASE → base, CIRCLE_RESERVE_FUND → circle-reserve-fund. */
export function hubSlugForEntityCode(code: string): string {
  return (code || '').trim().toLowerCase().replace(/_/g, '-');
}

/** Inverse of hubSlugForEntityCode (lossy only for case; underscores restored). */
export function entityCodeFromHubSlug(slug: string): string {
  return (slug || '').trim().toUpperCase().replace(/-/g, '_');
}

/** Dated report slugs end with -YYYYMMDD (e.g. base-20260801). */
export function isDatedReportSlug(slug: string): boolean {
  return /-\d{8}$/.test(slug || '');
}
