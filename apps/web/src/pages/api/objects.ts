import type { APIRoute } from "astro";
import { searchRegistry } from "../../lib/search/registry";
import { DatabaseProvider } from "../../lib/search/providers/database";
import { FileSystemProvider } from "../../lib/search/providers/filesystem";

export const prerender = false;

// Register providers (Idempotent-ish, or done at startup.
// Since this is a serverless function context potentially, we register here to be safe)
// In a real app, might want a singleton init.
searchRegistry.register(new DatabaseProvider());
searchRegistry.register(new FileSystemProvider());

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const filtersParam = url.searchParams.get("filters");
  const limit = Number(url.searchParams.get("limit")) || 0;
  const sort = url.searchParams.get("sort"); // 'recent'
  const queryParam = url.searchParams.get("q") || "";
  const untagged = url.searchParams.get("untagged") === "true";

  let filters: any = {};
  if (untagged) {
    filters.untagged = true;
  }
  if (filtersParam) {
    try {
      const parsedFilters: readonly any[] = JSON.parse(filtersParam);
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
  let results = await searchRegistry.search(queryParam, filters);

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
