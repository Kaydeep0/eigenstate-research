import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { slugFor } from '../../lib/reports';

export const prerender = true;

export const GET: APIRoute = async () => {
  const reports = await getCollection('reports');
  const body = {
    updated: new Date().toISOString(),
    reports: reports
      .map((r) => ({ slug: slugFor(r.id), ...r.data }))
      .sort((a, b) => b.date_iso.localeCompare(a.date_iso)),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
