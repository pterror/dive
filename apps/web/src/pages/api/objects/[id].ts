import type { APIRoute } from "astro";
import { db, Objects, eq } from "astro:db";
import { promises as fs } from "fs";
import path from "path";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const fullId = params.id;
  if (!fullId) {
    return new Response(JSON.stringify({ error: "ID required" }), {
      status: 400,
    });
  }

  // Parse ID: provider:innerId
  // Note: innerId might contain colons (e.g. windows paths or nested IDs), so we only split on first colon
  const firstColon = fullId.indexOf(":");
  if (firstColon === -1) {
    return new Response(JSON.stringify({ error: "Invalid ID format" }), {
      status: 400,
    });
  }

  const providerId = fullId.substring(0, firstColon);
  const innerId = fullId.substring(firstColon + 1);

  // Helper to fetch from DB
  const fetchFromDb = async (dbId: string) => {
    return await db.select().from(Objects).where(eq(Objects.id, dbId)).get();
  };

  try {
    if (providerId === "filesystem") {
      const filePath = innerId;
      // 1. Read Content from FS
      let content;
      let stats;
      try {
        content = await fs.readFile(filePath, "utf-8");
        stats = await fs.stat(filePath);
      } catch {
        return new Response(JSON.stringify({ error: "File not found" }), {
          status: 404,
        });
      }

      // 2. Try to fetch metadata from DB (using the full ID as key: filesystem:path)
      // Wait, if we store it in DB, what ID do we use?
      // The plan says "store 'external' objects in the Objects table using their full prefixed ID".
      // So if the object comes from filesystem provider, its ID in DB should be `filesystem:path`.
      // But wait, the ID passed to this API is `filesystem:/path` (because Registry prefixed it).
      // So `innerId` is `/path`.
      // If we store it in DB as `filesystem:/path`, then `dbId` should be `fullId`?
      // No, `fullId` is `filesystem:/path`.
      // So yes, we look up `fullId` in DB.

      const dbObj = await fetchFromDb(fullId);

      const name = path.basename(filePath);
      const object = {
        id: fullId,
        type: "file",
        name: name,
        created_at: stats.birthtimeMs,
        updated_at: stats.mtimeMs,
        // Merge DB properties if exist
        ...dbObj,
        // Ensure content/path are from FS (source of truth for content)
        content: content,
        path: filePath,
      };

      return new Response(JSON.stringify(object), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (providerId === "database") {
      // innerId is the DB ID.
      // It could be a UUID (native) or `filesystem:/path` (external).
      const dbObj = await fetchFromDb(innerId);

      if (!dbObj) {
        return new Response(JSON.stringify({ error: "Object not found" }), {
          status: 404,
        });
      }

      // Check if it's an external object (e.g. ID starts with filesystem:)
      if (dbObj.id.startsWith("filesystem:")) {
        // It's an external object stored in DB. Fetch content from FS.
        const fsPath = dbObj.id.replace("filesystem:", "");
        try {
          const content = await fs.readFile(fsPath, "utf-8");
          return new Response(JSON.stringify({ ...dbObj, content }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch {
          // File might be missing, return DB obj but maybe warn?
          return new Response(
            JSON.stringify({ ...dbObj, content: null, error: "File missing" }),
            {
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      }

      return new Response(JSON.stringify(dbObj), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown provider" }), {
      status: 400,
    });
  } catch (e) {
    console.error("API Error", e);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  const fullId = params.id;
  if (!fullId) {
    return new Response(JSON.stringify({ error: "ID required" }), {
      status: 400,
    });
  }

  const firstColon = fullId.indexOf(":");
  if (firstColon === -1) {
    return new Response(JSON.stringify({ error: "Invalid ID format" }), {
      status: 400,
    });
  }

  const providerId = fullId.substring(0, firstColon);
  const innerId = fullId.substring(firstColon + 1);

  try {
    const body = await request.json();

    if (providerId === "filesystem") {
      const filePath = innerId;

      // 1. Write to FS
      try {
        await fs.writeFile(filePath, body.content, "utf-8");
      } catch {
        return new Response(JSON.stringify({ error: "File write failed" }), {
          status: 500,
        });
      }

      // 2. Upsert to DB to store metadata/tags
      // ID in DB is `fullId` (filesystem:path)
      const now = Math.floor(Date.now() / 1000);

      // Check if exists
      const existing = await db
        .select()
        .from(Objects)
        .where(eq(Objects.id, fullId))
        .get();

      if (existing) {
        await db
          .update(Objects)
          .set({
            updated_at: now,
            properties: body.properties,
          })
          .where(eq(Objects.id, fullId));
      } else {
        await db.insert(Objects).values({
          id: fullId,
          type: "file", // TODO: Detect type
          name: path.basename(filePath),
          created_at: now,
          updated_at: now,
          properties: body.properties,
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (providerId === "database") {
      // innerId is DB ID.
      // Check if external
      if (innerId.startsWith("filesystem:")) {
        const filePath = innerId.replace("filesystem:", "");
        // Write FS
        await fs.writeFile(filePath, body.content, "utf-8");
      }

      // Update DB
      await db
        .update(Objects)
        .set({
          content: innerId.startsWith("filesystem:") ? null : body.content, // Don't store content in DB for external
          properties: body.properties,
          updated_at: Math.floor(Date.now() / 1000),
        })
        .where(eq(Objects.id, innerId));

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown provider" }), {
      status: 400,
    });
  } catch (e) {
    console.error("Update failed:", e);
    return new Response(JSON.stringify({ error: "Update failed" }), {
      status: 500,
    });
  }
};
