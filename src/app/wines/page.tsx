"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Loader2, Search, Star, Wine, X } from "lucide-react";
import {
  getPublicWineDetail,
  getPublicWines,
  getPublicWinesStats,
  type PublicWineListItem,
} from "@/lib/public-wines";
import { cloudinaryDisplayUrl } from "@/lib/public-ticket";
import { EVENT_DISPLAY_TIMEZONE } from "@/lib/timezone";

type SortOption = "average_rating" | "review_count" | "year";

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

function wineTypeBadgeClass(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("white")) return "text-emerald-300 bg-emerald-400/10 border-emerald-400/20";
  if (t.includes("sparkling") || t.includes("champagne"))
    return "text-amber-300 bg-amber-400/10 border-amber-400/20";
  if (t.includes("rosé") || t.includes("rose")) return "text-rose-300 bg-rose-400/10 border-rose-400/20";
  return "text-cork-coral bg-cork-coral/10 border-cork-coral/20";
}

function starFill(rating: number, index: number): "full" | "half" | "empty" {
  const threshold = index + 1;
  if (rating >= threshold) return "full";
  if (rating >= threshold - 0.5) return "half";
  return "empty";
}

function StarRow({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const iconClass = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-0.5 text-cork-coral">
      {Array.from({ length: 5 }, (_, i) => {
        const fill = starFill(rating, i);
        if (fill === "full") {
          return <Star key={i} className={`${iconClass} fill-cork-coral text-cork-coral`} strokeWidth={1.5} aria-hidden />;
        }
        if (fill === "half") {
          return (
            <span key={i} className={`relative inline-flex ${iconClass}`}>
              <Star className={`${iconClass} text-cork-blush/30`} strokeWidth={1.5} aria-hidden />
              <span className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
                <Star className={`${iconClass} fill-cork-coral text-cork-coral`} strokeWidth={1.5} aria-hidden />
              </span>
            </span>
          );
        }
        return <Star key={i} className={`${iconClass} text-cork-blush/30`} strokeWidth={1.5} aria-hidden />;
      })}
    </div>
  );
}

function starLabel(stars: number): string {
  if (stars <= 0) return "☆☆☆☆☆";
  return "★".repeat(stars) + "☆".repeat(Math.max(0, 5 - stars));
}

function formatLastSampled(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    year: "2-digit",
    timeZone: EVENT_DISPLAY_TIMEZONE,
  }).format(d);
}

function formatReviewDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: EVENT_DISPLAY_TIMEZONE,
  }).format(d);
}

function formatHistoryDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    year: "numeric",
    timeZone: EVENT_DISPLAY_TIMEZONE,
  }).format(d);
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function locationLine(wine: Pick<PublicWineListItem, "producer" | "region" | "country">): string {
  const place = [wine.region, wine.country].filter(Boolean).join(", ");
  return place ? `${wine.producer} • ${place}` : wine.producer;
}

export default function Page() {
  const [query, setQuery] = useState("");
  const [wineType, setWineType] = useState("all");
  const [country, setCountry] = useState("all");
  const [grape, setGrape] = useState("all");
  const [sort, setSort] = useState<SortOption>("average_rating");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const perPage = 12;

  const debouncedQuery = useDebouncedValue(query, 350);

  const { data: stats, isPending: statsPending } = useQuery({
    queryKey: ["public-wines-stats"],
    queryFn: getPublicWinesStats,
  });

  const {
    data: listData,
    isPending: listPending,
    isFetching: listFetching,
  } = useQuery({
    queryKey: [
      "public-wines",
      {
        page,
        perPage,
        q: debouncedQuery.trim(),
        wineType,
        country,
        grape,
        sort,
      },
    ],
    queryFn: () =>
      getPublicWines({
        page,
        per_page: perPage,
        q: debouncedQuery.trim() || undefined,
        wine_type: wineType === "all" ? undefined : wineType,
        country: country === "all" ? undefined : country,
        grape: grape === "all" ? undefined : grape,
        sort_by: sort,
        sort_order: "desc",
      }),
  });

  const {
    data: detail,
    isPending: detailPending,
    isFetching: detailFetching,
  } = useQuery({
    queryKey: ["public-wine-detail", selectedId],
    queryFn: () => getPublicWineDetail(selectedId!),
    enabled: Boolean(selectedId),
  });

  const wines = listData?.data ?? [];
  const meta = listData?.meta;
  const totalPages = meta?.total_pages ?? 1;
  const drawerOpen = selectedId !== null;
  const searchPending = query.trim() !== debouncedQuery.trim();
  const listSearching = searchPending || listFetching;
  const filtersActive =
    query.trim() !== "" ||
    wineType !== "all" ||
    country !== "all" ||
    grape !== "all" ||
    sort !== "average_rating" ||
    page !== 1;

  function openDrawer(id: string) {
    setSelectedId(id);
  }

  function closeDrawer() {
    setSelectedId(null);
  }

  function clearFilters() {
    setQuery("");
    setWineType("all");
    setCountry("all");
    setGrape("all");
    setSort("average_rating");
    setPage(1);
  }

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  return (
    <>
      <section className="relative w-full min-h-screen overflow-hidden pt-20 pb-24">
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16 flex flex-col items-center pt-12 text-center">
            <div className="mb-6 inline-flex items-center gap-3">
              <div className="h-px w-8 bg-cork-coral" />
              <span className="text-xs font-semibold tracking-widest text-cork-blush uppercase">
                Community
              </span>
              <div className="h-px w-8 bg-cork-coral" />
            </div>
            <h1 className="mb-6 font-serif text-5xl leading-[1.1] font-medium tracking-tight text-cork-cream sm:text-6xl lg:text-[5rem]">
              Wine Leaderboard
            </h1>
            <p className="max-w-2xl text-xl leading-relaxed font-light text-cork-blush">
              Explore every wine sampled at Cork Conclave and discover what our community thinks. A
              permanent archive of our shared tasting journey.
            </p>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            <div className="flex flex-col items-center rounded-2xl border border-white/5 bg-cork-plum-light/30 p-6 sm:items-start">
              <span className="mb-2 text-xs font-medium tracking-widest text-cork-blush uppercase">
                Wines Sampled
              </span>
              <span className="font-serif text-3xl font-medium tracking-tight text-cork-cream sm:text-4xl">
                {statsPending ? "—" : (stats?.wines_sampled ?? 0)}
              </span>
            </div>
            <div className="flex flex-col items-center rounded-2xl border border-white/5 bg-cork-plum-light/30 p-6 sm:items-start">
              <span className="mb-2 text-xs font-medium tracking-widest text-cork-blush uppercase">
                Reviews Submitted
              </span>
              <span className="font-serif text-3xl font-medium tracking-tight text-cork-cream sm:text-4xl">
                {statsPending
                  ? "—"
                  : (stats?.reviews_submitted ?? 0).toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col items-center rounded-2xl border border-white/5 bg-cork-plum-light/30 p-6 sm:items-start">
              <span className="mb-2 text-xs font-medium tracking-widest text-cork-blush uppercase">
                Avg. Community Rating
              </span>
              <div className="flex items-center gap-2">
                <span className="font-serif text-3xl font-medium tracking-tight text-cork-cream sm:text-4xl">
                  {statsPending ? "—" : (stats?.average_rating ?? 0).toFixed(1)}
                </span>
                <Star className="h-5 w-5 fill-cork-coral text-cork-coral" strokeWidth={1.5} aria-hidden />
              </div>
            </div>
          </div>

          <div className="mb-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/5 bg-cork-plum-light/30 p-4 md:flex-row md:p-6">
            <div className="relative w-full md:max-w-md md:grow">
              <Search
                className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-cork-blush"
                aria-hidden
              />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by wine, producer, or country..."
                className="w-full rounded-xl border border-white/10 bg-cork-plum/50 py-3 pr-11 pl-12 text-sm text-cork-cream transition-colors placeholder:text-cork-blush/50 focus:border-cork-coral/50 focus:outline-none"
                aria-busy={listSearching}
              />
              {listSearching ? (
                <Loader2
                  className="absolute top-1/2 right-4 size-4 -translate-y-1/2 animate-spin text-cork-coral"
                  aria-label="Searching"
                />
              ) : null}
            </div>

            <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
              <div className="relative">
                <select
                  value={wineType}
                  onChange={(e) => {
                    setWineType(e.target.value);
                    setPage(1);
                  }}
                  className="cursor-pointer appearance-none rounded-xl border border-white/10 bg-cork-plum/50 py-2.5 pr-9 pl-4 text-xs font-medium text-cork-cream transition-colors focus:border-cork-coral/50 focus:outline-none"
                >
                  <option value="all">Wine Type</option>
                  {(stats?.wine_types ?? []).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-cork-blush"
                  aria-hidden
                />
              </div>

              <div className="relative">
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setPage(1);
                  }}
                  className="cursor-pointer appearance-none rounded-xl border border-white/10 bg-cork-plum/50 py-2.5 pr-9 pl-4 text-xs font-medium text-cork-cream transition-colors focus:border-cork-coral/50 focus:outline-none"
                >
                  <option value="all">Country</option>
                  {(stats?.countries ?? []).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-cork-blush"
                  aria-hidden
                />
              </div>

              <div className="relative hidden lg:block">
                <select
                  value={grape}
                  onChange={(e) => {
                    setGrape(e.target.value);
                    setPage(1);
                  }}
                  className="cursor-pointer appearance-none rounded-xl border border-white/10 bg-cork-plum/50 py-2.5 pr-9 pl-4 text-xs font-medium text-cork-cream transition-colors focus:border-cork-coral/50 focus:outline-none"
                >
                  <option value="all">Grape</option>
                  {(stats?.grapes ?? []).map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-cork-blush"
                  aria-hidden
                />
              </div>

              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value as SortOption);
                    setPage(1);
                  }}
                  className="cursor-pointer appearance-none rounded-xl border border-transparent bg-white/5 py-2.5 pr-9 pl-4 text-xs font-medium text-cork-cream transition-colors hover:bg-white/10 focus:border-cork-coral/50 focus:outline-none"
                >
                  <option value="average_rating">Highest Rated</option>
                  <option value="review_count">Most Reviewed</option>
                  <option value="year">Newest Vintage</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-cork-blush"
                  aria-hidden
                />
              </div>

              <button
                type="button"
                onClick={clearFilters}
                disabled={!filtersActive}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-cork-cream transition-colors hover:border-cork-coral/40 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {listPending ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: perPage }).map((_, i) => (
                <div
                  key={i}
                  className="h-112 animate-pulse rounded-3xl border border-white/5 bg-cork-plum-light/20"
                />
              ))}
            </div>
          ) : wines.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-cork-blush">
                <Search className="size-6" aria-hidden />
              </div>
              <h3 className="mb-2 font-serif text-lg font-medium tracking-tight text-cork-cream">
                No wines found
              </h3>
              <p className="max-w-sm text-sm font-light text-cork-blush">
                Try adjusting your filters or search terms to find what you&apos;re looking for.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-full bg-cork-coral px-5 py-2.5 text-sm font-medium text-cork-white transition-colors hover:bg-cork-coral-hover"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div
                className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 transition-opacity duration-200 ${
                  listSearching ? "opacity-60" : "opacity-100"
                }`}
              >
                {wines.map((wine) => (
                  <button
                    key={wine.id}
                    type="button"
                    onClick={() => openDrawer(wine.id)}
                    className="group relative flex h-full cursor-pointer flex-col rounded-3xl border border-white/10 bg-cork-plum-light/40 p-5 text-left shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cork-coral/30 hover:shadow-lg hover:shadow-cork-coral/10"
                  >
                    <div
                      className={`absolute top-4 left-4 z-10 rounded-full px-2.5 py-1 text-xs font-medium tracking-tight shadow-sm ${
                        wine.rank <= 2
                          ? "bg-cork-coral text-cork-white"
                          : "border border-white/10 bg-white/10 text-cork-cream"
                      }`}
                    >
                      #{wine.rank}
                    </div>

                    <div className="relative mb-5 flex h-64 w-full items-center justify-center overflow-hidden rounded-2xl bg-cork-plum/50 p-6">
                      {wine.image_url ? (
                        <img
                          src={cloudinaryDisplayUrl(wine.image_url)}
                          alt={wine.name}
                          className="h-[90%] object-contain transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <Wine className="h-12 w-12 text-cork-blush/40" strokeWidth={1.5} />
                      )}
                    </div>

                    <div className="flex grow flex-col">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span
                          className={`rounded-md border px-2 py-1 text-xs font-medium tracking-tight ${wineTypeBadgeClass(wine.wine_type)}`}
                        >
                          {wine.wine_type}
                        </span>
                        <span className="text-xs text-cork-blush/60">{wine.year ?? "—"}</span>
                      </div>
                      <h3 className="mb-1 font-serif text-lg leading-tight font-medium tracking-tight text-cork-cream">
                        {wine.name}
                      </h3>
                      <p className="mb-3 text-sm font-light text-cork-blush">{locationLine(wine)}</p>

                      <div className="mt-auto border-t border-white/10 pt-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Star
                              className="h-4 w-4 fill-cork-coral text-cork-coral"
                              strokeWidth={1.5}
                              aria-hidden
                            />
                            <span className="text-sm font-medium text-cork-cream">
                              {wine.average_rating.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-xs text-cork-blush/60">
                            {wine.review_count} Reviews
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-cork-blush/60">
                          <span className="flex items-center gap-1">
                            <Wine className="size-3.5" strokeWidth={1.5} aria-hidden />
                            {wine.event_count} Events
                          </span>
                          <span>Last: {formatLastSampled(wine.last_sampled_at)}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {totalPages > 1 ? (
                <div className="mt-14 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded-full border border-white/10 bg-cork-plum/50 px-6 py-2.5 text-sm font-medium text-cork-cream transition-colors hover:border-cork-coral/40 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="text-sm text-cork-blush">
                    Page <span className="font-medium text-cork-cream">{page}</span> of{" "}
                    <span className="font-medium text-cork-cream">{totalPages}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="rounded-full border border-white/10 bg-cork-plum/50 px-6 py-2.5 text-sm font-medium text-cork-cream transition-colors hover:border-cork-coral/40 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>

      <div
        role="presentation"
        className={`fixed inset-0 z-40 bg-cork-plum/60 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawer}
      />

      <aside
        className={`fixed inset-x-0 bottom-0 z-50 flex h-[92vh] flex-col rounded-t-3xl border border-white/10 bg-cork-plum shadow-2xl transition-transform duration-500 ease-in-out md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-135 md:rounded-none md:border-t-0 md:border-l ${
          drawerOpen
            ? "translate-y-0 md:translate-x-0"
            : "translate-y-full md:translate-y-0 md:translate-x-full"
        }`}
        aria-hidden={!drawerOpen}
      >
        <div className="flex w-full justify-center pt-3 pb-1 md:hidden" onClick={closeDrawer}>
          <div className="h-1.5 w-12 rounded-full bg-white/20" />
        </div>

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-cork-plum/90 px-6 py-4 backdrop-blur-md">
          <span className="text-xs font-medium tracking-widest text-cork-blush uppercase">
            Wine Profile
          </span>
          <button
            type="button"
            onClick={closeDrawer}
            className="-mr-2 flex items-center justify-center rounded-full bg-white/5 p-2 text-cork-blush transition-colors hover:bg-white/10 hover:text-cork-cream"
            aria-label="Close wine profile"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="grow overflow-y-auto pb-10">
          {detailPending || detailFetching ? (
            <div className="flex h-64 items-center justify-center text-sm text-cork-blush">
              Loading wine profile…
            </div>
          ) : !detail ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 px-6 text-center">
              <p className="text-sm text-cork-blush">Couldn’t load this wine.</p>
              <button
                type="button"
                onClick={closeDrawer}
                className="text-sm font-medium text-cork-coral hover:underline"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="relative flex h-80 w-full items-center justify-center overflow-hidden border-b border-white/10 bg-cork-plum-light/40 py-6">
                {detail.image_url ? (
                  <img
                    src={cloudinaryDisplayUrl(detail.image_url)}
                    alt={detail.name}
                    className="h-full object-contain drop-shadow-2xl"
                  />
                ) : (
                  <Wine className="h-20 w-20 text-cork-blush/40" strokeWidth={1.5} />
                )}
                <div className="absolute top-4 left-6 rounded-full border border-white/10 bg-cork-plum/80 px-3 py-1.5 text-xs font-medium tracking-tight text-cork-cream shadow-sm backdrop-blur-sm">
                  Rank #{detail.rank}
                </div>
              </div>

              <div className="px-6 py-8">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-md border px-2 py-1 text-xs font-medium tracking-tight ${wineTypeBadgeClass(detail.wine_type)}`}
                  >
                    {detail.wine_type}
                  </span>
                  {detail.grape_variety ? (
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium tracking-tight text-cork-blush">
                      {detail.grape_variety}
                    </span>
                  ) : null}
                </div>

                <h2 className="mb-1 font-serif text-3xl font-medium tracking-tight text-cork-cream">
                  {detail.name}
                  {detail.year ? ` ${detail.year}` : ""}
                </h2>
                <p className="mb-6 text-base font-light text-cork-blush">{locationLine(detail)}</p>

                <div className="mb-8 flex items-center gap-6 rounded-2xl border border-white/10 bg-cork-plum-light/30 p-5">
                  <div className="flex flex-col">
                    <span className="mb-1 text-xs text-cork-blush/60">Community Rating</span>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl leading-none font-medium tracking-tight text-cork-cream">
                        {detail.average_rating.toFixed(1)}
                      </span>
                      <div className="pb-0.5">
                        <StarRow rating={detail.average_rating} size="md" />
                      </div>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-white/10" />
                  <div className="flex flex-col">
                    <span className="mb-1 text-xs text-cork-blush/60">Total Reviews</span>
                    <span className="text-lg font-medium tracking-tight text-cork-cream">
                      {detail.review_count}
                    </span>
                  </div>
                  <div className="hidden h-10 w-px bg-white/10 sm:block" />
                  <div className="hidden flex-col sm:flex">
                    <span className="mb-1 text-xs text-cork-blush/60">Times Sampled</span>
                    <span className="text-lg font-medium tracking-tight text-cork-cream">
                      {detail.event_count}
                    </span>
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="mb-4 text-sm font-medium tracking-widest text-cork-blush uppercase">
                    Rating Breakdown
                  </h3>
                  <div className="space-y-2">
                    {detail.rating_breakdown.map((row) => (
                      <div key={row.stars} className="flex items-center gap-3">
                        <div
                          className={`w-16 text-right text-xs ${row.stars === 5 ? "text-cork-coral" : "text-cork-blush/60"}`}
                        >
                          {starLabel(row.stars)}
                        </div>
                        <div className="h-1.5 grow overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-cork-coral"
                            style={{ width: `${row.percent}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-xs text-cork-blush/60">
                          {row.percent}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="mb-8 border-white/10" />

                <div className="mb-10">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-sm font-medium tracking-widest text-cork-blush uppercase">
                      Recent Reviews
                    </h3>
                  </div>

                  {detail.reviews.length === 0 ? (
                    <p className="text-sm text-cork-blush/60">No reviews yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {detail.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="rounded-2xl border border-white/10 bg-cork-plum-light/30 p-5"
                        >
                          <div className="mb-3 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-medium text-cork-cream">
                                {initials(review.user_name)}
                              </div>
                              <div>
                                <div className="text-sm font-medium tracking-tight text-cork-cream">
                                  {review.user_name}
                                </div>
                                <div className="text-xs text-cork-blush/60">
                                  {formatReviewDate(review.created_at)}
                                </div>
                              </div>
                            </div>
                            <StarRow rating={review.rating} />
                          </div>
                          {review.comment ? (
                            <p className="text-sm leading-relaxed font-light text-cork-blush italic">
                              &ldquo;{review.comment}&rdquo;
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {detail.sampling_history.length > 0 ? (
                  <>
                    <hr className="mb-8 border-white/10" />
                    <div className="mb-10">
                      <h3 className="mb-5 text-sm font-medium tracking-widest text-cork-blush uppercase">
                        Sampling History
                      </h3>
                      <div className="relative ml-3 space-y-6 border-l border-white/10">
                        {detail.sampling_history.map((event, index) => (
                          <div key={event.event_id} className="relative pl-6">
                            <div
                              className={`absolute top-1.5 -left-1.5 h-3 w-3 rounded-full ring-4 ring-cork-plum ${
                                index === 0 ? "bg-cork-coral" : "bg-white/30"
                              }`}
                            />
                            <div
                              className={`rounded-xl border border-white/10 p-4 ${
                                index === 0 ? "bg-cork-coral/5" : "bg-cork-plum-light/20"
                              }`}
                            >
                              <div className="mb-1 flex items-start justify-between gap-2">
                                <h4 className="text-sm font-medium tracking-tight text-cork-cream">
                                  {event.event_name}
                                </h4>
                                <span className="shrink-0 text-xs font-medium text-cork-blush/60">
                                  {formatHistoryDate(event.event_date)}
                                </span>
                              </div>
                              <div className="mt-3 flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1 text-cork-cream">
                                  <Star
                                    className="size-3.5 fill-cork-coral text-cork-coral"
                                    strokeWidth={1.5}
                                    aria-hidden
                                  />
                                  <span className="font-medium">
                                    {event.average_rating.toFixed(1)} Avg
                                  </span>
                                </div>
                                <span className="text-cork-blush/60">
                                  {event.review_count} Reviews
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}

                {detail.similar.length > 0 ? (
                  <>
                    <hr className="mb-8 border-white/10" />
                    <div>
                      <h3 className="mb-5 text-sm font-medium tracking-widest text-cork-blush uppercase">
                        You May Also Like
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {detail.similar.map((sim) => (
                          <button
                            key={sim.id}
                            type="button"
                            onClick={() => openDrawer(sim.id)}
                            className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-cork-plum-light/20 p-3 text-left transition-colors hover:border-cork-coral/30"
                          >
                            <div className="flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-cork-plum/50">
                              {sim.image_url ? (
                                <img
                                  src={cloudinaryDisplayUrl(sim.image_url)}
                                  alt={sim.name}
                                  className="h-full object-contain transition-transform group-hover:scale-110"
                                />
                              ) : (
                                <Wine className="size-5 text-cork-blush/40" strokeWidth={1.5} />
                              )}
                            </div>
                            <div className="overflow-hidden">
                              <h4 className="truncate text-xs font-medium tracking-tight text-cork-cream">
                                {sim.name}
                              </h4>
                              <div className="mt-1 flex items-center gap-1 text-xs text-cork-blush/60">
                                <Star
                                  className="size-2.5 fill-cork-coral text-cork-coral"
                                  strokeWidth={1.5}
                                  aria-hidden
                                />
                                <span>{sim.average_rating.toFixed(1)}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
