"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Banknote, CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, Wine, X } from "lucide-react";

type PublicEventGalleryItem = {
  url: string;
  caption?: string | null;
  alt?: string | null;
};

type PublicCompletedEventDetails = {
  id: string;
  name: string;
  slug: string;
  description: string;
  event_date: string;
  venue_name: string;
  venue_address: string;
  amount_in_kobo: string;
  image_url?: string | null;
  dress_code?: string | null;
};

type GetPublicCompletedEventBySlugResponse = {
  event: PublicCompletedEventDetails;
  gallery: PublicEventGalleryItem[];
  gallery_count: number;
};

function getPublicApiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? "").trim().replace(/\/$/, "");
}

function clampIndex(idx: number, len: number) {
  if (len <= 0) return 0;
  return ((idx % len) + len) % len;
}

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id?: string | string[] }>();
  const id = Array.isArray(params?.id) ? params?.id?.[0] : params?.id;

  const [data, setData] = useState<GetPublicCompletedEventBySlugResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function run() {
      setLoading(true);
      setError(null);
      setNotFound(false);

      if (!id) {
        if (!mounted) return;
        setNotFound(true);
        setLoading(false);
        return;
      }

      const baseUrl = getPublicApiBaseUrl();
      if (!baseUrl) {
        if (!mounted) return;
        setError("Missing NEXT_PUBLIC_API_URL");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${baseUrl}/public/event/${encodeURIComponent(id)}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          if (!mounted) return;
          if (res.status === 404) {
            setNotFound(true);
          } else {
            setError(`HTTP ${res.status}`);
          }
          setLoading(false);
          return;
        }

        const json = (await res.json()) as GetPublicCompletedEventBySlugResponse;
        if (!mounted) return;
        setData(json);
        setLoading(false);
      } catch (e) {
        if (!mounted) return;
        const msg = e instanceof Error ? e.message : "Network error";
        setError(msg);
        setLoading(false);
      }
    }

    void run();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [id]);

  useEffect(() => {
    if (!notFound) return;
    router.replace("/conclaves");
  }, [notFound, router]);

  const galleryUrls = useMemo(() => data?.gallery?.map((g) => g.url).filter(Boolean) ?? [], [data?.gallery]);

  const openLightbox = (idx: number) => {
    setActiveIndex(idx);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goPrev = () => setActiveIndex((i) => clampIndex(i - 1, galleryUrls.length));
  const goNext = () => setActiveIndex((i) => clampIndex(i + 1, galleryUrls.length));

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, galleryUrls.length]);

  const event = data?.event ?? null;
  const eventDate = useMemo(() => (event?.event_date ? new Date(event.event_date) : null), [event]);

  const monthLabel = useMemo(() => {
    if (!eventDate || Number.isNaN(eventDate.getTime())) return "";
    return eventDate.toLocaleString(undefined, { month: "long", year: "numeric" });
  }, [eventDate]);

  const dateLabel = useMemo(() => {
    if (!eventDate || Number.isNaN(eventDate.getTime())) return "";
    return eventDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }, [eventDate]);

  const timeLabel = useMemo(() => {
    if (!eventDate || Number.isNaN(eventDate.getTime())) return "—";
    return eventDate.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }, [eventDate]);

  const amountLabel = useMemo(() => {
    const raw = (event?.amount_in_kobo ?? "").trim();
    const kobo = Number.parseInt(raw || "0", 10);
    if (!Number.isFinite(kobo) || kobo < 0) return "—";
    if (kobo === 0) return "Free";
    const naira = kobo / 100;
    try {
      return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(naira);
    } catch {
      return `₦${naira.toFixed(2)}`;
    }
  }, [event]);

  const aboutParagraphs = useMemo(() => {
    const d = (event?.description ?? "").trim();
    if (!d) return [];
    return d
      .split(/\n{2,}/g)
      .map((p) => p.trim())
      .filter(Boolean);
  }, [event?.description]);

  const heroImageUrl = (event?.image_url ?? "").trim() || "";

  return (
    <div className="relative z-10 grow py-8 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full flex flex-col gap-16 lg:gap-24 pb-12">
        <article className="w-full flex flex-col gap-12 lg:gap-20 max-w-7xl mx-auto">
          {loading ? (
            <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 text-cork-blush">Loading…</div>
          ) : error || !event ? (
            <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 text-cork-blush">
              {error ?? "Event not found"}
            </div>
          ) : (
            <div className="relative w-full aspect-square md:aspect-21/9 rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-white/10 group">
              <img
                src={heroImageUrl}
                alt={event.name}
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105 cork-fade-in"
              />
              <div className="absolute inset-0 bg-linear-to-t from-cork-plum via-cork-plum/50 to-transparent" />

              <div className="absolute bottom-8 left-6 right-6 md:bottom-16 md:left-12 md:right-12 max-w-3xl flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold text-white tracking-widest uppercase">
                    Past Conclave
                  </span>
                  <span className="text-cork-coral text-sm font-medium tracking-widest uppercase">{monthLabel}</span>
                </div>
                <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-none">
                  {event.name}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-cork-blush text-sm md:text-base font-medium mt-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-cork-blush/70" aria-hidden />
                    {dateLabel}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-cork-blush/70" aria-hidden />
                    {event.venue_name}
                  </div>
                </div>
              </div>
            </div>
          )}

          {event ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
                <div className="lg:col-span-8 flex flex-col gap-8">
                  <div>
                    <h3 className="font-serif text-2xl md:text-3xl font-semibold text-white tracking-tight mb-6">
                      About The Evening
                    </h3>
                    <div className="max-w-none text-cork-blush leading-relaxed space-y-6 text-base md:text-lg">
                      {aboutParagraphs.length ? (
                        aboutParagraphs.map((p) => <p key={p}>{p}</p>)
                      ) : (
                        <p className="text-cork-blush/70">—</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4">
                  <div className="bg-cork-plum-light/40 border border-white/10 rounded-4xl p-8 backdrop-blur-md flex flex-col gap-8 shadow-xl">
                    <h4 className="font-serif text-xl font-semibold text-white tracking-tight">Key Details</h4>

                    <div className="flex flex-col gap-6">
                      {dateLabel ? (
                        <div className="flex items-start gap-4">
                          <div className="bg-white/5 p-3 rounded-xl">
                            <CalendarDays className="w-5 h-5 text-cork-coral" aria-hidden />
                          </div>
                          <div className="flex flex-col pt-0.5">
                            <span className="text-xs text-cork-blush/70 uppercase tracking-widest mb-1">Date</span>
                            <span className="text-white font-medium">{dateLabel}</span>
                          </div>
                        </div>
                      ) : null}

                      {timeLabel && timeLabel !== "—" ? (
                        <div className="flex items-start gap-4">
                          <div className="bg-white/5 p-3 rounded-xl">
                            <Clock className="w-5 h-5 text-cork-coral" aria-hidden />
                          </div>
                          <div className="flex flex-col pt-0.5">
                            <span className="text-xs text-cork-blush/70 uppercase tracking-widest mb-1">Time</span>
                            <span className="text-white font-medium">{timeLabel}</span>
                          </div>
                        </div>
                      ) : null}

                      {(event?.venue_name ?? "").trim() ? (
                        <div className="flex items-start gap-4">
                          <div className="bg-white/5 p-3 rounded-xl">
                            <MapPin className="w-5 h-5 text-cork-coral" aria-hidden />
                          </div>
                          <div className="flex flex-col pt-0.5">
                            <span className="text-xs text-cork-blush/70 uppercase tracking-widest mb-1">
                              Venue
                            </span>
                            <span className="text-white font-medium wrap-break-word">
                              {(event?.venue_name ?? "").trim()}
                            </span>
                          </div>
                        </div>
                      ) : null}

                      {amountLabel && amountLabel !== "—" ? (
                        <div className="flex items-start gap-4">
                          <div className="bg-white/5 p-3 rounded-xl">
                            <Banknote className="w-5 h-5 text-cork-coral" aria-hidden />
                          </div>
                          <div className="flex flex-col pt-0.5">
                            <span className="text-xs text-cork-blush/70 uppercase tracking-widest mb-1">Amount</span>
                            <span className="text-white font-medium">{amountLabel}</span>
                          </div>
                        </div>
                      ) : null}

                      {(event?.dress_code ?? "").trim() ? (
                        <div className="flex items-start gap-4">
                          <div className="bg-white/5 p-3 rounded-xl">
                            <Wine className="w-5 h-5 text-cork-coral" aria-hidden />
                          </div>
                          <div className="flex flex-col pt-0.5">
                            <span className="text-xs text-cork-blush/70 uppercase tracking-widest mb-1">Dress code</span>
                            <span className="text-white font-medium">{(event?.dress_code ?? "").trim()}</span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col gap-8 pt-8">
                <div className="flex items-end justify-between">
                  <h3 className="font-serif text-3xl font-semibold text-white tracking-tight">Event Gallery</h3>
                  <span className="text-cork-blush/70 text-sm font-medium tracking-wide uppercase">
                    {data?.gallery_count ?? galleryUrls.length} Photos
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {galleryUrls.slice(0, 4).map((src, idx) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => openLightbox(idx)}
                      className="relative aspect-4/5 rounded-2xl overflow-hidden cursor-zoom-in group shadow-lg"
                    >
                      <img
                        src={src}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        alt={`Gallery photo ${idx + 1}`}
                      />
                      {idx === 3 && (data?.gallery_count ?? galleryUrls.length) > 4 ? (
                        <div className="absolute inset-0 bg-cork-plum/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white font-medium tracking-wide">
                            View All +{(data?.gallery_count ?? galleryUrls.length) - 4}
                          </span>
                        </div>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </article>

        <div className="w-full max-w-7xl mx-auto h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {lightboxOpen ? (
        <div className="fixed inset-0 z-100 bg-black/95 flex flex-col items-center justify-center backdrop-blur-xl">
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-3 transition-colors bg-white/5 hover:bg-white/10 rounded-full"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6" aria-hidden />
          </button>

          <button
            type="button"
            onClick={goPrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 transition-colors bg-white/5 hover:bg-white/10 rounded-full"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" aria-hidden />
          </button>

          <button
            type="button"
            onClick={goNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 transition-colors bg-white/5 hover:bg-white/10 rounded-full"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" aria-hidden />
          </button>

          <div className="w-full max-w-5xl px-4 md:px-24 flex items-center justify-center">
            <img
              src={galleryUrls[activeIndex]}
              alt="Gallery Image"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          <div className="absolute bottom-8 left-0 right-0 text-center text-white/60 text-xs tracking-widest uppercase font-medium">
            {activeIndex + 1} / {galleryUrls.length}
          </div>
        </div>
      ) : null}
    </div>
  );
}
