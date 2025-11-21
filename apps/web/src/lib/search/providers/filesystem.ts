import { promises as fs } from "fs";
import path from "path";
import type { SearchProvider, SearchResult, SearchFilters } from "../types";

export class FileSystemProvider implements SearchProvider {
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
            id: `${this.id}:${filePath}`,
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

    return results.slice(0, 50); // Limit results
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
}
