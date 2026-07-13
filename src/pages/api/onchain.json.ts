import type { APIRoute } from 'astro';
import commits from '../../data/helix_commits.json';

export const prerender = true;

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(commits, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
