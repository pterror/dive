import type { APIRoute } from 'astro';
import { db, Objects, eq } from 'astro:db';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID required' }), { status: 400 });
  }

  const object = await db.select().from(Objects).where(eq(Objects.id, id)).get();
  
  if (!object) {
    return new Response(JSON.stringify({ error: 'Object not found' }), { status: 404 });
  }
  
  return new Response(JSON.stringify(object), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const PUT: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID required' }), { status: 400 });
  }

  try {
    const body = await request.json();
    // Update content, properties, and updated_at
    await db.update(Objects)
      .set({ 
        content: body.content,
        properties: body.properties,
        updated_at: Math.floor(Date.now() / 1000)
      })
      .where(eq(Objects.id, id));
      
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Update failed:', e);
    return new Response(JSON.stringify({ error: 'Update failed' }), { status: 500 });
  }
}
