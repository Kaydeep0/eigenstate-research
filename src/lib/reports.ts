export function slugFor(id: string): string {
  return id.replace(/\.md$/, '');
}
