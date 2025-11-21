import { promises as fs } from "fs";
import path from "path";
import { db, Objects, eq } from "astro:db";
import type { ObjectProvider, SearchResult, SearchFilters } from "../types";

export class FileSystemProvider implements ObjectProvider {
  id = "filesystem";
  name = "File System";
  private rootDir: string;

  constructor(rootDir: string = process.cwd()) {
    this.rootDir = rootDir;
  }

  async search(
    query: string,
    _filters?: SearchFilters,
  ): Promise<SearchResult[]> {
    if (!query || query.length < 2) return []; // Avoid searching for single chars

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    try {
      try {
        await fs.access(this.rootDir);
      } catch {
        return [];
      }

      await this.walk(this.rootDir, async (filePath) => {
        const name = path.basename(filePath);
        if (name.toLowerCase().includes(lowerQuery)) {
          const stats = await fs.stat(filePath);
          results.push({
            id: filePath,
            type: "file",
            name: name,
            content: filePath, // Using path as content for now
            created_at: stats.birthtimeMs,
            updated_at: stats.mtimeMs,
            provider_id: this.id,
            icon: "file",
            properties: {
              size: stats.size,
              path: filePath,
            },
          });
        }
      });
    } catch (error) {
      console.error("FS Search Error:", error);
    }

    return results;
  }

  private async walk(dir: string, callback: (path: string) => Promise<void>) {
    const files = await fs.readdir(dir, { withFileTypes: true });
    for (const file of files) {
      const res = path.resolve(dir, file.name);

      // Skip node_modules and .git
      if (file.isDirectory()) {
        if (
          file.name === "node_modules" ||
          file.name === ".git" ||
          file.name === ".gemini"
        )
          continue;
        await this.walk(res, callback);
      } else {
        await callback(res);
      }
    }
  }
  async get(id: string): Promise<SearchResult | null> {
    const filePath = id;
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const stats = await fs.stat(filePath);
      const name = path.basename(filePath);

      // Fetch metadata from DB
      // The ID in DB is the full ID: filesystem:filePath
      // But wait, this provider's ID is "filesystem".
      // The registry passes "innerId" to get().
      // So innerId is filePath.
      // The DB ID should be `filesystem:${filePath}`.
      const dbId = `filesystem:${filePath}`;
      const dbObj = await db
        .select()
        .from(Objects)
        .where(eq(Objects.id, dbId))
        .get();

      return {
        id: filePath, // Registry will prefix this
        type: "file",
        name: name,
        content: content,
        created_at: stats.birthtimeMs,
        updated_at: stats.mtimeMs,
        provider_id: this.id,
        icon: "file",
        properties: {
          size: stats.size,
          path: filePath,
          ...(dbObj?.properties as Record<string, any>),
        },
        // Merge other DB fields if needed, but FS is source of truth for content
      };
    } catch {
      return null;
    }
  }

  async put(id: string, data: any): Promise<void> {
    const filePath = id;
    await fs.writeFile(filePath, data.content, "utf-8");

    // Upsert metadata to DB
    const dbId = `filesystem:${filePath}`;
    const now = Math.floor(Date.now() / 1000);

    const existing = await db
      .select()
      .from(Objects)
      .where(eq(Objects.id, dbId))
      .get();

    if (existing) {
      await db
        .update(Objects)
        .set({
          updated_at: now,
          properties: data.properties,
        })
        .where(eq(Objects.id, dbId));
    } else {
      await db.insert(Objects).values({
        id: dbId,
        type: "file",
        name: path.basename(filePath),
        created_at: now,
        updated_at: now,
        properties: data.properties,
      });
    }
  }
}
