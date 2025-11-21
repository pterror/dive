import {
  db,
  Objects,
  ObjectTags,
  like,
  and,
  inArray,
  notInArray,
  sql,
} from "astro:db";
import type { SearchProvider, SearchResult, SearchFilters } from "../types";

export class DatabaseProvider implements SearchProvider {
  id = "database";
  name = "Database";

  async search(
    query: string,
    filters?: SearchFilters,
  ): Promise<SearchResult[]> {
    const conditions = [];

    // Text Query (Multi-word)
    if (query) {
      const words = query.trim().split(/\s+/);
      for (const word of words) {
        conditions.push(like(Objects.name, `%${word}%`));
      }
    }

    // Tag Filters
    if (filters?.tags && filters.tags.length > 0) {
      const tagCount = filters.tags.length;
      // Safe interpolation for tags (assuming strings)
      // We map tags to quoted strings for the IN clause.
      const tagsString = filters.tags
        .map((t) => `'${t.replace(/'/g, "''")}'`)
        .join(", ");

      // Subquery to find objects that have ALL the specified tags
      const subquery = sql`(
        SELECT ${ObjectTags.object_id} 
        FROM ${ObjectTags} 
        WHERE ${ObjectTags.tag_id} IN (${sql.raw(tagsString)}) 
        GROUP BY ${ObjectTags.object_id} 
        HAVING COUNT(DISTINCT ${ObjectTags.tag_id}) = ${tagCount}
      )`;

      conditions.push(inArray(Objects.id, subquery));
    }

    // Untagged Filter
    if (filters?.untagged) {
      // Find objects that are NOT in the ObjectTags table
      const taggedSubquery = db
        .select({ id: ObjectTags.object_id })
        .from(ObjectTags);
      conditions.push(notInArray(Objects.id, taggedSubquery));
    }

    let queryBuilder = db
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

    if (conditions.length > 0) {
      // @ts-ignore - Drizzle types can be finicky with spread args
      queryBuilder = queryBuilder.where(and(...conditions));
    }

    const objects = await queryBuilder;

    return objects.map((obj) => ({
      ...obj,
      properties: obj.properties as Record<string, any>,
      id: `${this.id}:${obj.id}`,
      provider_id: this.id,
      icon: "database",
    }));
  }
}
