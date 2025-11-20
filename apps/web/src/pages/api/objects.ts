import type { APIRoute } from 'astro';
import { db, Objects } from 'astro:db';

export const GET: APIRoute = async ({ request }) => {
  // const url = new URL(request.url); // Unused
  // const parentPath = url.searchParams.get('path') || '/'; // Unused for now
  
  const objects = await db.select().from(Objects);
  
  return new Response(JSON.stringify(objects), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
