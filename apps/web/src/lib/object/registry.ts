import type { ObjectProvider, SearchFilters, SearchResult } from "./types";

class ObjectRegistry {
  private providers: Map<string, ObjectProvider> = new Map();

  register(provider: ObjectProvider) {
    this.providers.set(provider.id, provider);
  }

  unregister(providerId: string) {
    this.providers.delete(providerId);
  }

  async search(query: string, filters?: SearchFilters): Promise<SearchResult[]> {
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

  async get(fullId: string): Promise<SearchResult | null> {
    const match = fullId.match(/^([^:]+):(.+)$/);
    if (!match) return null;

    const providerId = match[1]!;
    const innerId = match[2]!;

    const provider = this.providers.get(providerId);
    if (!provider) return null;

    const result = await provider.get(innerId);
    if (result) {
      // Ensure ID is prefixed (though provider might return raw ID)
      // Actually, provider.get should probably return the object with its own ID logic?
      // But consistent with search, we should probably ensure prefixing here if we want consistency.
      // However, for `get`, the caller usually already knows the full ID.
      // Let's just ensure the returned object has the full ID.
      return {
        ...result,
        id: fullId,
        provider_id: providerId,
      };
    }
    return null;
  }

  async put(fullId: string, data: any): Promise<void> {
    const match = fullId.match(/^([^:]+):(.+)$/);
    if (!match) throw new Error("Invalid ID");

    const providerId = match[1]!;
    const innerId = match[2]!;

    const provider = this.providers.get(providerId);
    if (!provider) throw new Error("Provider not found");

    await provider.put(innerId, data);
  }
}

export const objectRegistry = new ObjectRegistry();
