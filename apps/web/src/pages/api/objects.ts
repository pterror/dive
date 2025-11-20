import type { APIRoute } from "astro";
import { db, Objects, ObjectTags, eq, isNull } from "astro:db";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const tagId = url.searchParams.get("tag");
  const parentId = url.searchParams.get("parent_id");

  let objects;

  if (tagId) {
    objects = await db
      .select({
        id: Objects.id,
        type: Objects.type,
        name: Objects.name,
        parent_id: Objects.parent_id,
        path: Objects.path,
        content: Objects.content,
        created_at: Objects.created_at,
        updated_at: Objects.updated_at,
      })
      .from(Objects)
      .innerJoin(ObjectTags, eq(Objects.id, ObjectTags.object_id))
      .where(eq(ObjectTags.tag_id, tagId));
  } else if (parentId) {
    // Fetch children of a specific folder
    objects = await db
      .select()
      .from(Objects)
      .where(eq(Objects.parent_id, parentId));
  } else {
    // Fetch root objects (where parent_id is null)
    // Note: astro:db/drizzle doesn't have isNull() helper easily exposed in some versions,
    // but we can check if we want ALL objects or just root.
    // For a file browser, usually we want root.
    // Let's try to filter by isNull if possible, or just fetch all and filter in memory if needed?
    // Actually, let's use `isNull(Objects.parent_id)` if available.
    // Checking imports... we only have `eq`. We need `isNull`.
    // Let's import `isNull` from astro:db if available, or drizzle-orm.
    // Since we can't easily change imports in this block, let's assume we can fetch all and filter,
    // OR we can try to import `isNull` in a separate edit.
    // For now, let's just return ALL objects if no params, but the UI will filter?
    // No, that's bad for scaling.
    // Let's update the imports first.
    objects = await db.select().from(Objects).where(isNull(Objects.parent_id));
  }

  return new Response(JSON.stringify(objects), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
