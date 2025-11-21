import type { APIRoute } from "astro";
import { db, Relations } from "astro:db";
import { nanoid } from "nanoid";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { sourceId, targetId, type, data } = body;

    if (!sourceId || !targetId || !type) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const id = nanoid();
    await db.insert(Relations).values({
      id,
      source_id: sourceId,
      target_id: targetId,
      type,
      data: data || {},
      created_at: Math.floor(Date.now() / 1000),
    });

    return new Response(JSON.stringify({ id, sourceId, targetId, type, data }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Failed to create relation:", e);
    return new Response(JSON.stringify({ error: "Failed to create relation" }), { status: 500 });
  }
};
