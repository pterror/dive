import type { SearchProvider, SearchResult, SearchFilters } from "./types";

class SearchRegistry {
  private providers: Map<string, SearchProvider> = new Map();

  register(provider: SearchProvider) {
    this.providers.set(provider.id, provider);
  }

  unregister(providerId: string) {
    this.providers.delete(providerId);
  }

  async search(
    query: string,
    filters?: SearchFilters,
  ): Promise<SearchResult[]> {
    const promises = Array.from(this.providers.values()).map((provider) =>
      provider
        .search(query, filters)
        .then((results) => {
          return results.map((result) => ({
            ...result,
            id: `${provider.id}:${result.id}`,
            provider_id: provider.id,
          }));
        })
        .catch((err) => {
          console.error(`Provider ${provider.id} failed:`, err);
          return [];
        }),
    );

    const results = await Promise.all(promises);
    return results.flat();
  }
}

export const searchRegistry = new SearchRegistry();
