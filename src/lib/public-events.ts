import { getPublicApiBaseUrl, safeFetchJson } from "./api-client";

export type ListMeta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
};

export type PublicEvent = {
  id: string;
  slug: string;
  name: string;
  description: string;
  event_date: string;
  venue_name: string;
  venue_address: string;
  created_at: string;
  image_url?: string | null;
};

export type EventsListResponse = {
  data: PublicEvent[];
  meta: ListMeta;
};

export type GetPublicEventsParams = {
  page?: number;
  per_page?: number;
  q?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: "created_at" | "event_date" | "name";
  sort_order?: "asc" | "desc";
};

function emptyEventsListResponse(page: number, perPage: number): EventsListResponse {
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

export function lagosYearRangeRfc3339(year: number): { date_from: string; date_to: string } {
  // Africa/Lagos is UTC+01:00 (no DST). We send explicit offset to avoid local/UTC ambiguity.
  const y = String(year);
  return {
    date_from: `${y}-01-01T00:00:00+01:00`,
    date_to: `${y}-12-31T23:59:59+01:00`,
  };
}

export async function getPublicEvents(params: GetPublicEventsParams): Promise<EventsListResponse> {
  const page = params.page ?? 1;
  const perPage = params.per_page ?? 10;

  const baseUrl = getPublicApiBaseUrl();
  if (!baseUrl) {
    return emptyEventsListResponse(page, perPage);
  }

  const u = new URL(`${baseUrl}/public/events`);

  u.searchParams.set("page", String(page));
  u.searchParams.set("per_page", String(perPage));

  const q = (params.q ?? "").trim();
  if (q) u.searchParams.set("q", q);

  if (params.date_from) u.searchParams.set("date_from", params.date_from);
  if (params.date_to) u.searchParams.set("date_to", params.date_to);

  if (params.sort_by) u.searchParams.set("sort_by", params.sort_by);
  if (params.sort_order) u.searchParams.set("sort_order", params.sort_order);

  const result = await safeFetchJson<EventsListResponse>(u.toString(), { timeoutMs: 10_000 });
  if (!result.ok) {
    return emptyEventsListResponse(page, perPage);
  }

  if (!result.data || !Array.isArray(result.data.data) || !result.data.meta) {
    return emptyEventsListResponse(page, perPage);
  }

  return result.data;
}
