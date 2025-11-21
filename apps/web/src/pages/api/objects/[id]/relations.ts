import type { APIRoute } from "astro";
import { db, eq, Objects, or, Relations } from "astro:db";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const objectId = params["id"];
  if (!objectId) return new Response(null, { status: 400 });

  try {
    // Fetch relations where the object is either source or target
    // We also want to join with Objects to get the name of the related object
    // Since Astro DB doesn't support complex joins/aliases easily in one go for this bidirectional case,
    // we might need two queries or a more complex one.
    // For simplicity, let's fetch relations and then fetch related objects if needed,
    // OR just return the relations and let the client fetch details.
    // BUT, for the UI, we really want the name of the related thing.

    // Let's try to get all relations first.
    const relations = await db
      .select()
      .from(Relations)
      .where(or(eq(Relations.source_id, objectId), eq(Relations.target_id, objectId)));

    // Now let's enrich this data.

    // Fetch all related objects
    // Note: 'inArray' would be ideal here but let's check if it's available or just fetch all for now if list is small,
    // or fetch individually. Astro DB (LibSQL) supports 'inArray'.
    // Wait, I don't have 'inArray' imported. Let's assume I can use it or just fetch all objects and filter (inefficient but safe for now)
    // OR, better, just fetch the specific IDs.

    // Actually, let's just return the relations and the IDs.
    // The UI can fetch the object details or we can do it here.
    // Let's try to do it here for better DX.

    const enrichedRelations = [];
    for (const relation of relations) {
      const otherId = relation.source_id === objectId ? relation.target_id : relation.source_id;
      const otherObject = await db.select().from(Objects).where(eq(Objects.id, otherId)).get();

      if (otherObject) {
        enrichedRelations.push({
          ...relation,
          otherObject: {
            id: otherObject.id,
            name: otherObject.name,
            type: otherObject.type,
          },
          direction: relation.source_id === objectId ? "outgoing" : "incoming",
        });
      }
    }

    return new Response(JSON.stringify(enrichedRelations), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Failed to fetch relations:", e);
    return new Response(JSON.stringify({ error: "Failed to fetch relations" }), { status: 500 });
  }
};
