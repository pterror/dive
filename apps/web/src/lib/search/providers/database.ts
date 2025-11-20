import { db, Objects, ObjectTags } from "astro:db";
import type { SearchProvider, SearchResult, SearchFilters } from "../types";

export class DatabaseProvider implements SearchProvider {
  id = "database";
  name = "Database";

  async search(
    query: string,
    filters?: SearchFilters,
  ): Promise<SearchResult[]> {
    // Basic implementation mirroring the original API logic
    // For MVP, fetching all and filtering in memory as per original logic

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

    let objects = allObjects;

    // Apply Tag Filters
    if (filters?.tags && filters.tags.length > 0) {
      const allObjectTags = await db.select().from(ObjectTags);
      const tagMap = new Map<string, Set<string>>();

      for (const ot of allObjectTags) {
        if (!tagMap.has(ot.object_id)) {
          tagMap.set(ot.object_id, new Set());
        }
        tagMap.get(ot.object_id)?.add(ot.tag_id);
      }

      objects = objects.filter((obj) => {
        const objTags = tagMap.get(obj.id);
        if (!objTags) return false;
        return filters.tags!.every((tag) => objTags.has(tag));
      });
    }

    // Apply Text Query
    if (query) {
      const lowerQuery = query.toLowerCase();
      objects = objects.filter((obj) =>
        obj.name.toLowerCase().includes(lowerQuery),
      );
    }

    return objects.map((obj) => ({
      ...obj,
      provider_id: this.id,
      icon: "database", // Placeholder icon name
    }));
  }
}
