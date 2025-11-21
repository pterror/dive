import type { APIRoute } from "astro";
import { promises as fs } from "fs";
import path from "path";
import { DatabaseProvider } from "../../lib/object/providers/database";
import { FileSystemProvider } from "../../lib/object/providers/filesystem";
import { objectRegistry } from "../../lib/object/registry";
import { STORAGE_DIR } from "../../lib/storage";
import type { SearchFilters } from "../../lib/object/types";

export const prerender = false;

// Register providers (Idempotent-ish, or done at startup.
// Since this is a serverless function context potentially, we register here to be safe)
// In a real app, might want a singleton init.
objectRegistry.register(new DatabaseProvider());
objectRegistry.register(new FileSystemProvider(STORAGE_DIR));

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const filtersParam = url.searchParams.get("filters");
  const limit = Number(url.searchParams.get("limit")) || 0;
  const sort = url.searchParams.get("sort"); // 'recent'
  const queryParam = url.searchParams.get("q") || "";
  const untagged = url.searchParams.get("untagged") === "true";

  const filters: SearchFilters = {};
  if (untagged) {
    filters.untagged = true;
  }
  if (filtersParam) {
    try {
      const parsedFilters: readonly { type: string; value: string }[] =
        JSON.parse(filtersParam);
      // Convert UI filter format to internal SearchFilters
      // Assuming UI sends array of { type: 'tag', value: '...' }
      const tags = parsedFilters
        .filter((f) => f.type === "tag")
        .map((f) => f.value);

      if (tags.length > 0) {
        filters.tags = tags;
      }
    } catch (e) {
      console.error("Failed to parse filters", e);
    }
  }

  // Perform Search
  let results = await objectRegistry.search(queryParam, filters);

  // Post-processing (Sort & Limit)
  // Note: Ideally providers handle sort/limit, but for MVP aggregation:
  if (sort === "recent") {
    results.sort((a, b) => (b.updated_at || 0) - (a.updated_at || 0));
  }

  if (limit > 0) {
    results = results.slice(0, limit);
  }

  return new Response(JSON.stringify(results), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const action = formData.get("action") as string;
    const storageDir = STORAGE_DIR;

    // Ensure storage directory exists
    try {
      await fs.access(storageDir);
    } catch {
      await fs.mkdir(storageDir, { recursive: true });
    }

    if (action === "create") {
      const name = (formData.get("name") as string) || "Untitled.md";
      const content = (formData.get("content") as string) || "";
      const filePath = path.join(storageDir, name);

      // Avoid overwriting? For now, let's just append a timestamp if exists or simple overwrite
      // Simple overwrite for MVP
      await fs.writeFile(filePath, content, "utf-8");

      return new Response(JSON.stringify({ success: true, path: filePath }), {
        status: 200,
      });
    } else if (action === "upload") {
      const file = formData.get("file") as File;
      if (!file) {
        return new Response("No file provided", { status: 400 });
      }

      const filePath = path.join(storageDir, file.name);

      // Check if file exists
      try {
        await fs.access(filePath);
        // If we get here, file exists
        return new Response(JSON.stringify({ error: "File already exists" }), {
          status: 409,
        });
      } catch {
        // File does not exist, proceed
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await fs.writeFile(filePath, buffer);

      return new Response(JSON.stringify({ success: true, path: filePath }), {
        status: 200,
      });
    } else if (action === "import") {
      const url = formData.get("url") as string;
      if (!url) {
        return new Response("No URL provided", { status: 400 });
      }

      try {
        const fetchRes = await fetch(url);
        if (!fetchRes.ok) throw new Error("Failed to fetch URL");

        const text = await fetchRes.text();
        // Try to derive a filename
        let filename = url.split("/").pop() || "imported.html";
        if (!filename.includes(".")) filename += ".html";

        // If it's a raw markdown file or similar, might want to respect that
        const contentType = fetchRes.headers.get("content-type");
        if (contentType?.includes("text/html") && !filename.endsWith(".html")) {
          filename += ".html";
        }

        const filePath = path.join(storageDir, filename);
        await fs.writeFile(filePath, text, "utf-8");

        return new Response(JSON.stringify({ success: true, path: filePath }), {
          status: 200,
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: String(e) }), {
          status: 500,
        });
      }
    }

    return new Response("Invalid action", { status: 400 });
  } catch (e) {
    console.error("API Error:", e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
};
