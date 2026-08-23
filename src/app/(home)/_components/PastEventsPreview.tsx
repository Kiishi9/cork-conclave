"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { app_routes } from "@/lib/constants";
import { getPublicEvents } from "@/lib/public-events";
import { EVENT_DISPLAY_TIMEZONE } from "@/lib/timezone";

function formatEventDate(value?: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: EVENT_DISPLAY_TIMEZONE,
  }).format(d);
}

export default function PastEventsPreview() {
  const { data, isPending } = useQuery({
    queryKey: ["public-events", { page: 1, per_page: 3, sort_by: "event_date", sort_order: "desc" }],
    queryFn: () => getPublicEvents({ page: 1, per_page: 3, sort_by: "event_date", sort_order: "desc" }),
  });

  if (isPending) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-88 animate-pulse border border-white/5 bg-cork-plum" />
        ))}
      </div>
    );
  }

  if (!data || data.data.length === 0) return null;

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {data.data.map((e) => (
        <PastEventCard
          key={e.id}
          href={`${app_routes.past_conclaves}/${e.slug}`}
          image={e.image_url || "/images/gallery/IMG_0844.jpg"}
          imageAlt={e.name}
          date={formatEventDate(e.event_date)}
          title={e.name}
          description={e.description}
        />
      ))}
    </div>
  );
}

function PastEventCard({
  href,
  image,
  imageAlt,
  date,
  title,
  description,
  className = "",
}: {
  href: string;
  image: string;
  imageAlt: string;
  date: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative flex h-full flex-col overflow-hidden border border-white/5 bg-cork-plum ${className}`}
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-cork-plum to-transparent" />
      </div>
      <div className="relative flex grow flex-col p-6">
        <span className="mb-2 block text-xs font-semibold tracking-widest text-cork-coral uppercase">{date}</span>
        <h3 className="mb-2 font-serif text-xl font-medium tracking-tight text-cork-cream">{title}</h3>
        <p className="line-clamp-2 text-sm font-light text-cork-blush">{description}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-4 text-xs font-medium text-cork-cream opacity-70 transition-all group-hover:text-cork-coral group-hover:opacity-100">
          View Event
          <ArrowUpRight className="size-4" strokeWidth={1.5} />
        </span>
      </div>
    </Link>
  );
}
