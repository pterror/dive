import type { APIRoute } from 'astro';
import { db, ObjectTags, Tags, eq, and } from 'astro:db';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const objectId = params.id;
  if (!objectId) return new Response(null, { status: 400 });

  // Join ObjectTags with Tags to get tag details
  const tags = await db.select({
    id: Tags.id,
    name: Tags.name,
    color: Tags.color
  })
  .from(ObjectTags)
  .innerJoin(Tags, eq(ObjectTags.tag_id, Tags.id))
  .where(eq(ObjectTags.object_id, objectId));

  return new Response(JSON.stringify(tags), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export const POST: APIRoute = async ({ params, request }) => {
  const objectId = params.id;
  if (!objectId) return new Response(null, { status: 400 });

  try {
    const body = await request.json();
    const tagId = body.tagId;
    
    if (!tagId) return new Response(JSON.stringify({ error: 'Tag ID required' }), { status: 400 });

    await db.insert(ObjectTags).values({
      object_id: objectId,
      tag_id: tagId
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Failed to add tag:', e);
    return new Response(JSON.stringify({ error: 'Failed to add tag' }), { status: 500 });
  }
}

export const DELETE: APIRoute = async ({ params, request }) => {
  const objectId = params.id;
  if (!objectId) return new Response(null, { status: 400 });

  try {
    const body = await request.json();
    const tagId = body.tagId;
    
    if (!tagId) return new Response(JSON.stringify({ error: 'Tag ID required' }), { status: 400 });

    await db.delete(ObjectTags).where(
      and(
        eq(ObjectTags.object_id, objectId),
        eq(ObjectTags.tag_id, tagId)
      )
    );

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Failed to remove tag:', e);
    return new Response(JSON.stringify({ error: 'Failed to remove tag' }), { status: 500 });
  }
}
