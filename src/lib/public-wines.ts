import { getPublicApiBaseUrl, safeFetchJson } from "./api-client";

export type ListMeta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
};

export type PublicWineListItem = {
  id: string;
  rank: number;
  name: string;
  producer: string;
  color: string;
  wine_type: string;
  year?: number | null;
  country?: string | null;
  region?: string | null;
  grape_variety?: string | null;
  image_url?: string | null;
  average_rating: number;
  review_count: number;
  event_count: number;
  last_sampled_at?: string | null;
};

export type PublicWinesListResponse = {
  data: PublicWineListItem[];
  meta: ListMeta;
};

export type PublicWinesStatsResponse = {
  wines_sampled: number;
  reviews_submitted: number;
  average_rating: number;
  wine_types: string[];
  countries: string[];
  grapes: string[];
};

export type PublicWineRatingBreakdownItem = {
  stars: number;
  count: number;
  percent: number;
};

export type PublicWineReviewItem = {
  id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment?: string | null;
  created_at: string;
};

export type PublicWineSamplingHistoryItem = {
  event_id: string;
  event_name: string;
  event_date: string;
  average_rating: number;
  review_count: number;
};

export type PublicWineSimilarItem = {
  id: string;
  name: string;
  image_url?: string | null;
  average_rating: number;
};

export type PublicWineDetailResponse = PublicWineListItem & {
  rating_breakdown: PublicWineRatingBreakdownItem[];
  reviews: PublicWineReviewItem[];
  sampling_history: PublicWineSamplingHistoryItem[];
  similar: PublicWineSimilarItem[];
};

export type GetPublicWinesParams = {
  page?: number;
  per_page?: number;
  q?: string;
  wine_type?: string;
  country?: string;
  grape?: string;
  sort_by?: "average_rating" | "review_count" | "year";
  sort_order?: "asc" | "desc";
};

function emptyListResponse(page: number, perPage: number): PublicWinesListResponse {
  return {
    data: [],
    meta: {
      total: 0,
      page,
      per_page: perPage,
      total_pages: 0,
    },
  };
}

function emptyStats(): PublicWinesStatsResponse {
  return {
    wines_sampled: 0,
    reviews_submitted: 0,
    average_rating: 0,
    wine_types: [],
    countries: [],
    grapes: [],
  };
}

export async function getPublicWinesStats(): Promise<PublicWinesStatsResponse> {
  const baseUrl = getPublicApiBaseUrl();
  if (!baseUrl) return emptyStats();

  const result = await safeFetchJson<PublicWinesStatsResponse>(`${baseUrl}/public/wines/stats`, {
    timeoutMs: 10_000,
  });
  if (!result.ok || !result.data) return emptyStats();
  return result.data;
}

export async function getPublicWines(params: GetPublicWinesParams): Promise<PublicWinesListResponse> {
  const page = params.page ?? 1;
  const perPage = params.per_page ?? 12;

  const baseUrl = getPublicApiBaseUrl();
  if (!baseUrl) return emptyListResponse(page, perPage);

  const u = new URL(`${baseUrl}/public/wines`);
  u.searchParams.set("page", String(page));
  u.searchParams.set("per_page", String(perPage));

  const q = (params.q ?? "").trim();
  if (q) u.searchParams.set("q", q);
  if (params.wine_type) u.searchParams.set("wine_type", params.wine_type);
  if (params.country) u.searchParams.set("country", params.country);
  if (params.grape) u.searchParams.set("grape", params.grape);
  if (params.sort_by) u.searchParams.set("sort_by", params.sort_by);
  if (params.sort_order) u.searchParams.set("sort_order", params.sort_order);

  const result = await safeFetchJson<PublicWinesListResponse>(u.toString(), { timeoutMs: 10_000 });
  if (!result.ok || !result.data || !Array.isArray(result.data.data) || !result.data.meta) {
    return emptyListResponse(page, perPage);
  }
  return result.data;
}

export async function getPublicWineDetail(wineId: string): Promise<PublicWineDetailResponse | null> {
  const id = wineId.trim();
  if (!id) return null;

  const baseUrl = getPublicApiBaseUrl();
  if (!baseUrl) return null;

  const result = await safeFetchJson<PublicWineDetailResponse>(
    `${baseUrl}/public/wines/${encodeURIComponent(id)}`,
    { timeoutMs: 10_000 },
  );
  if (!result.ok || !result.data) return null;
  return result.data;
}
