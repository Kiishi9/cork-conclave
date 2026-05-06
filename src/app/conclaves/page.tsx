"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar, MapPin, Search, Wine } from "lucide-react";
import { getPublicEvents, lagosYearRangeRfc3339 } from "@/lib/public-events";

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

function formatEventDate(value?: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeZone: "Africa/Lagos",
  }).format(d);
}

export default function Page() {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState<"all" | number>("all");
  const [page, setPage] = useState(1);
  const perPage = 9;

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    const start = 2024;
    const out: number[] = [];
    for (let y = current; y >= start; y -= 1) out.push(y);
    return out;
  }, []);

  const debouncedQuery = useDebouncedValue(query, 350);

  const dateRange = useMemo(() => {
    if (year === "all") return null;
    return lagosYearRangeRfc3339(year);
  }, [year]);

  const { data, isPending } = useQuery({
    queryKey: ["public-events", { page, perPage, q: debouncedQuery.trim(), year }],
    queryFn: () =>
      getPublicEvents({
        page,
        per_page: perPage,
        q: debouncedQuery.trim() || undefined,
        date_from: dateRange?.date_from,
        date_to: dateRange?.date_to,
        sort_by: "event_date",
        sort_order: "desc",
      }),
  });

  const events = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.total_pages ?? 1;

  return (
    <section className="relative w-full overflow-hidden pb-24 pt-20 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10">
        <div className="flex flex-col items-center text-center mb-16 pt-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-cork-coral" />
            <span className="text-xs uppercase tracking-widest text-cork-blush font-semibold">Archive</span>
            <div className="w-8 h-px bg-cork-coral" />
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-[5rem] leading-[1.1] tracking-tight font-medium text-cork-cream mb-6">
            Past Pours
          </h1>
          <p className="text-xl font-light leading-relaxed text-cork-blush max-w-2xl">
            A look back at the gatherings, stories, and shared bottles that shaped our community.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 p-6 rounded-2xl bg-cork-plum-light/30 border border-white/5">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cork-blush size-5" aria-hidden />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              type="text"
              placeholder="Search past conclaves..."
              className="w-full bg-cork-plum/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-cork-cream placeholder:text-cork-blush/50 focus:outline-none focus:border-cork-coral/50 transition-colors"
            />
          </div>

          <div className="flex w-full md:w-auto gap-4">
            <div className="relative w-full md:w-48">
              <select
                value={year === "all" ? "all" : String(year)}
                onChange={(e) => {
                  setYear(e.target.value === "all" ? "all" : Number(e.target.value));
                  setPage(1);
                }}
                className="w-full bg-cork-plum/50 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-cork-cream focus:outline-none focus:border-cork-coral/50 appearance-none cursor-pointer transition-colors"
              >
                <option value="all">All Years</option>
                {years.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
              <ArrowRight
                className="absolute right-4 top-1/2 -translate-y-1/2 text-cork-blush pointer-events-none size-4 rotate-90"
                aria-hidden
              />
            </div>
          </div>
        </div>

        {isPending ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: perPage }).map((_, i) => (
              <div key={i} className="h-112 animate-pulse rounded-4xl bg-cork-plum-light/20 border border-white/5" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((e) => (
                <article
                  key={e.id}
                  className="group flex flex-col rounded-4xl bg-cork-plum-light/20 border border-white/5 overflow-hidden hover:border-cork-coral/30 hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-cork-coral/10"
                >
                  <div className="relative aspect-4/3 overflow-hidden">
                    <div className="absolute inset-0 bg-cork-plum/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
                    <img
                      src={e.image_url || ""}
                      alt={e.name}
                      className="w-full h-full object-cover object-center cork-fade-in group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-8 flex flex-col grow">
                    <div className="mb-3 flex flex-col gap-2 text-xs font-medium tracking-wide uppercase">
                      <span className="flex items-center gap-1.5 text-cork-coral">
                        <Calendar className="size-4" aria-hidden />
                        {formatEventDate(e.event_date)}
                      </span>
                      <span className="flex items-center gap-1.5 text-cork-blush">
                        <MapPin className="size-4" aria-hidden />
                        {e.venue_name}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl text-cork-cream mb-3 group-hover:text-cork-coral transition-colors">
                      {e.name}
                    </h3>
                    <p className="line-clamp-5 text-cork-blush font-light text-sm leading-relaxed mb-8 grow">
                      {e.description}
                    </p>

                    <Link
                      href={`/conclaves/${e.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-cork-cream hover:text-cork-coral transition-colors mt-auto group/btn"
                    >
                      View Event
                      <ArrowRight className="text-lg group-hover/btn:translate-x-1 transition-transform" aria-hidden />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-14 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-6 py-2.5 rounded-full bg-cork-plum/50 border border-white/10 text-cork-cream text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:border-cork-coral/40"
              >
                Prev
              </button>
              <span className="text-sm text-cork-blush">
                Page <span className="text-cork-cream font-medium">{page}</span> of{" "}
                <span className="text-cork-cream font-medium">{totalPages}</span>
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-6 py-2.5 rounded-full bg-cork-plum/50 border border-white/10 text-cork-cream text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:border-cork-coral/40"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-cork-plum-light/50 flex items-center justify-center mb-6 border border-white/5">
              <Wine className="text-4xl text-cork-blush/50 size-10" aria-hidden />
            </div>
            <h3 className="font-serif text-2xl text-cork-cream mb-2">No past conclaves found</h3>
            <p className="text-cork-blush font-light text-sm max-w-sm mb-6">Try another keyword or year.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setYear("all");
                setPage(1);
              }}
              className="px-6 py-2.5 rounded-full bg-cork-coral hover:bg-cork-coral-hover text-white text-sm font-medium transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
