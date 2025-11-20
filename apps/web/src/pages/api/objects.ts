import type { APIRoute } from 'astro';
import { db, Objects, ObjectTags, eq } from 'astro:db';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const tagId = url.searchParams.get('tag');
  
  let objects;
  
  if (tagId) {
    objects = await db.select({
      id: Objects.id,
      type: Objects.type,
      name: Objects.name,
      path: Objects.path,
      content: Objects.content,
      created_at: Objects.created_at,
      updated_at: Objects.updated_at
    })
    .from(Objects)
    .innerJoin(ObjectTags, eq(Objects.id, ObjectTags.object_id))
    .where(eq(ObjectTags.tag_id, tagId));
  } else {
    objects = await db.select().from(Objects);
  }
  
  return new Response(JSON.stringify(objects), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
