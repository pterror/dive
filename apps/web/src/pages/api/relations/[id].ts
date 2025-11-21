import type { APIRoute } from "astro";
import { db, Relations, eq } from "astro:db";

export const prerender = false;

export const DELETE: APIRoute = async ({ params }) => {
  const id = params["id"];
  if (!id) return new Response(null, { status: 400 });

  try {
    await db.delete(Relations).where(eq(Relations.id, id));
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Failed to delete relation:", e);
    return new Response(
      JSON.stringify({ error: "Failed to delete relation" }),
      { status: 500 },
    );
  }
};
