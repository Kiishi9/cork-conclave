"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { app_routes } from "@/lib/constants";
import { getPublicEvents } from "@/lib/public-events";
import PastEventsPreview from "./PastEventsPreview";

export default function PastEventsSection() {
  const { data, isPending } = useQuery({
    queryKey: ["public-events", { page: 1, per_page: 3, sort_by: "event_date", sort_order: "desc" }],
    queryFn: () => getPublicEvents({ page: 1, per_page: 3, sort_by: "event_date", sort_order: "desc" }),
  });

  if (isPending) return null;

  if (!data || data.data.length === 0) return null;

  return (
    <section id="past-events" className="bg-cork-plum-light/30 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div>
            <h2 className="mb-4 font-serif text-3xl font-medium tracking-tight text-cork-cream md:text-4xl">
              Past Conclaves
            </h2>
            <p className="text-sm font-light text-cork-blush">A look back at evenings well spent.</p>
          </div>
          <Link
            href={app_routes.past_conclaves}
            className="inline-flex items-center gap-2 border-b border-transparent pb-1 text-sm font-medium text-cork-cream transition-colors hover:border-cork-coral hover:text-cork-coral"
          >
            View Past Conclaves
            <ArrowRight className="size-4" strokeWidth={1.5} />
          </Link>
        </div>

        <PastEventsPreview />
      </div>
    </section>
  );
}

