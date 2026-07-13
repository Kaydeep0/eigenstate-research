import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

export const GET: APIRoute = async () => {
  const predictions = await getCollection('predictions');
  const body = predictions.map((p) => p.data).sort((a, b) => b.logged_at.localeCompare(a.logged_at));
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
