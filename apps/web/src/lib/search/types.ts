export interface SearchResult {
  id: string;
  type: string;
  name: string;
  content?: unknown;
  properties?: Record<string, unknown>;
  created_at?: number;
  updated_at?: number;
  // Metadata for the UI to know where this came from
  provider_id: string;
  icon?: string;
}

export interface SearchFilters {
  type?: string;
  tags?: string[];
  untagged?: boolean;
  // Add more as needed
}

export interface SearchProvider {
  id: string;
  name: string;
  search(query: string, filters?: SearchFilters): Promise<SearchResult[]>;
}
