import type { SearchProvider, SearchResult, SearchFilters } from "../types";

export class MockEphemeralProvider implements SearchProvider {
  id = "mock-ephemeral";
  name = "Mock Ephemeral";

  async search(
    query: string,
    _filters?: SearchFilters,
  ): Promise<SearchResult[]> {
    if (!query) return [];

    // Simulate some results based on query
    const results: SearchResult[] = [
      {
        id: `mock-1-${query}`,
        type: "file",
        name: `Mock File: ${query}.txt`,
        content: "This is a fake file content residing in memory.",
        created_at: Date.now(),
        updated_at: Date.now(),
        provider_id: this.id,
        icon: "file",
      },
      {
        id: `mock-2-${query}`,
        type: "web-result",
        name: `Search Result for ${query}`,
        content: "http://example.com/search?q=" + query,
        created_at: Date.now(),
        updated_at: Date.now(),
        provider_id: this.id,
        icon: "globe",
      },
    ];

    return results;
  }
}
