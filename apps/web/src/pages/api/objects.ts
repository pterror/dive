import type { APIRoute } from "astro";
import { db, Objects, ObjectTags, eq } from "astro:db";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const filtersParam = url.searchParams.get("filters");
  const untagged = url.searchParams.get("untagged") === "true";
  const limit = Number(url.searchParams.get("limit")) || 0;
  const sort = url.searchParams.get("sort"); // 'recent'
  const queryParam = url.searchParams.get("q");

  let objects;

  if (filtersParam) {
    const filters = JSON.parse(filtersParam);

    // Start with base query
    let query = db
      .select({
        id: Objects.id,
        type: Objects.type,
        name: Objects.name,
        content: Objects.content,
        properties: Objects.properties,
        created_at: Objects.created_at,
        updated_at: Objects.updated_at,
      })
      .from(Objects);

    // Apply filters
    // Note: Drizzle/AstroDB query building with dynamic ANDs can be tricky.
    // For MVP, let's fetch all and filter in memory if complex, OR chain where clauses.
    // Chaining .where() in Drizzle usually adds AND.

    // However, for Tags, we need joins.
    // If we have multiple tags, we need to ensure the object has ALL of them.
    // This is "Relational Division" or multiple exists checks.

    // Simple approach: Fetch all objects that match ANY of the tags, then filter in JS to ensure they match ALL.
    // OR: Just handle single tag for now and expand? User asked for multiple.

    // Let's try the JS filtering approach for robustness in this iteration.
    // Fetch all objects, then filter.

    const allObjects = await db
      .select({
        id: Objects.id,
        type: Objects.type,
        name: Objects.name,
        content: Objects.content,
        properties: Objects.properties,
        created_at: Objects.created_at,
        updated_at: Objects.updated_at,
      })
      .from(Objects);

    // Fetch all tags for these objects to allow filtering
    const allObjectTags = await db.select().from(ObjectTags);
    const tagMap = new Map<string, Set<string>>(); // object_id -> Set<tag_id>

    for (const ot of allObjectTags) {
      if (!tagMap.has(ot.object_id)) {
        tagMap.set(ot.object_id, new Set());
      }
      tagMap.get(ot.object_id)?.add(ot.tag_id);
    }

    objects = allObjects.filter((obj) => {
      // Check all filters
      for (const filter of filters) {
        if (filter.type === "tag") {
          const objTags = tagMap.get(obj.id);
          if (!objTags || !objTags.has(filter.value)) {
            return false;
          }
        }
        // Add other filter types here (date, type, etc.)
      }

      // Check text query if present
      if (queryParam) {
        if (!obj.name.toLowerCase().includes(queryParam.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
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
        tag_id: ObjectTags.tag_id,
      })
      .from(Objects)
      .leftJoin(ObjectTags, eq(Objects.id, ObjectTags.object_id));

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

    if (queryParam) {
      objects = objects.filter((o: any) =>
        o.name.toLowerCase().includes(queryParam.toLowerCase()),
      );
    }
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
