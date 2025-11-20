import type { APIRoute } from 'astro';
import { db, Tags } from 'astro:db';
import { nanoid } from 'nanoid';

export const prerender = false;

export const GET: APIRoute = async () => {
  const tags = await db.select().from(Tags);
  return new Response(JSON.stringify(tags), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.name) {
      return new Response(JSON.stringify({ error: 'Name required' }), { status: 400 });
    }

    const id = nanoid();
    await db.insert(Tags).values({
      id,
      name: body.name,
      color: body.color || '#3b82f6' // Default blue
    });

    return new Response(JSON.stringify({ id, name: body.name, color: body.color }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Failed to create tag:', e);
    return new Response(JSON.stringify({ error: 'Failed to create tag' }), { status: 500 });
  }
}
