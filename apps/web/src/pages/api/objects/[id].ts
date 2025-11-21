import type { APIRoute } from "astro";
import { objectRegistry } from "../../../lib/object/registry";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const fullId = params["id"];
  if (!fullId) {
    return new Response(JSON.stringify({ error: "ID required" }), {
      status: 400,
    });
  }

  try {
    const object = await objectRegistry.get(fullId);

    if (!object) {
      return new Response(JSON.stringify({ error: "Object not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(object), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("API Error", e);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  const fullId = params["id"];
  if (!fullId) {
    return new Response(JSON.stringify({ error: "ID required" }), {
      status: 400,
    });
  }

  try {
    const body = await request.json();
    await objectRegistry.put(fullId, body);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Update failed:", e);
    return new Response(JSON.stringify({ error: "Update failed" }), {
      status: 500,
    });
  }
};
