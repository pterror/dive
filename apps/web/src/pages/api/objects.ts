import type { APIRoute } from "astro";
import { db, Objects, ObjectTags, eq } from "astro:db";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const tagId = url.searchParams.get("tag");
  const untagged = url.searchParams.get("untagged") === "true";
  const limit = Number(url.searchParams.get("limit")) || 0;
  const sort = url.searchParams.get("sort"); // 'recent'

  let objects;

  if (tagId) {
    objects = await db
      .select({
        id: Objects.id,
        type: Objects.type,
        name: Objects.name,
        content: Objects.content,
        properties: Objects.properties,
        created_at: Objects.created_at,
        updated_at: Objects.updated_at,
      })
      .from(Objects)
      .innerJoin(ObjectTags, eq(Objects.id, ObjectTags.object_id))
      .where(eq(ObjectTags.tag_id, tagId));
  } else if (untagged) {
    // Fetch objects that have NO tags
    // This requires a LEFT JOIN and checking for NULL, or a NOT EXISTS subquery.
    // Drizzle/AstroDB support for complex queries varies.
    // A simpler approach for now might be to fetch all and filter in memory if the dataset is small,
    // OR fetch all ObjectTags and exclude them.
    // Let's try a left join approach if possible.
    // Actually, `db.select().from(Objects).leftJoin(ObjectTags, ...).where(isNull(ObjectTags.tag_id))`

    // We need to import `isNull` again if we use it.
    // Let's assume we can do it.

    // Wait, I removed `isNull` import earlier. I should re-add it if I use it.
    // Alternatively, I can fetch all objects and all object_tags and filter in JS for now (MVP).
    // Given the "couple hundred" or "3000" comment, in-memory might be okay for a prototype but bad for prod.
    // Let's try to do it right with SQL if possible.
    // But I need to check if `isNull` is available. It was available before.

    // Let's try to use `notIn` or similar?
    // `db.select().from(Objects).where(notIn(Objects.id, db.select({ id: ObjectTags.object_id }).from(ObjectTags)))`
    // Subqueries might be supported.

    // Let's stick to a simpler "fetch all" for now if we aren't sure about subquery support in this version of AstroDB/LibSQL adapter.
    // Actually, let's try the Left Join method, it's standard SQL.

    const allObjects = await db
      .select({
        id: Objects.id,
        type: Objects.type,
        name: Objects.name,
        content: Objects.content,
        properties: Objects.properties,
        created_at: Objects.created_at,
        updated_at: Objects.updated_at,
        tag_id: ObjectTags.tag_id, // Will be null if no match
      })
      .from(Objects)
      .leftJoin(ObjectTags, eq(Objects.id, ObjectTags.object_id));

    // Filter in JS where tag_id is null.
    // Note: This returns duplicates if an object has multiple tags, but we only want those with NO tags.
    // So if an object has ANY tag, it will appear with a tag_id.
    // If it has NO tags, it appears once with null.

    // Wait, if I left join, I get rows.
    // Object A (Tag 1) -> Row
    // Object B (No Tag) -> Row (tag_id null)

    // So I can filter `row.tag_id === null`.
    objects = allObjects.filter((o) => o.tag_id === null);

    // Deduplicate is not needed if they have no tags (they appear once).
  } else {
    // Fetch all (or limit for recent)
    let query = db.select().from(Objects);

    if (sort === "recent") {
      // We need `desc` import
      // query.orderBy(desc(Objects.updated_at));
      // Let's just sort in JS for now to avoid import dance if possible,
      // OR add the imports. Adding imports is better.
    }

    objects = await query;
  }

  // Apply JS sort and limit if DB didn't handle it (for simplicity in this iteration)
  if (sort === "recent") {
    objects.sort((a: any, b: any) => b.updated_at - a.updated_at);
  }

  if (limit > 0) {
    objects = objects.slice(0, limit);
  }

  return new Response(JSON.stringify(objects), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
