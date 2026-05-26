/* eslint-disable @next/next/no-img-element */

import { redirect } from "next/navigation";
import { getActiveEvent, getActiveEventQuestions } from "@/lib/event";
import { formatDateTime } from "@/lib/helpers";
import RegistrationPanel from "./RegistrationPanel";

function formatNairaFromKoboString(amountInKobo: string): string {
  const kobo = Number.parseInt(amountInKobo, 10);
  if (!Number.isFinite(kobo)) return amountInKobo;
  const naira = kobo / 100;
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(naira);
}

export default async function Page() {
  const event = await getActiveEvent();
  if (!event) {
    redirect("/");
  }

  const questions = await getActiveEventQuestions();
  const bannerUrl = (event.image_url ?? "").trim();
  const dateTime = formatDateTime(event.event_date);
  const price = formatNairaFromKoboString(event.amount_in_kobo);

  return (
    <div className="relative z-10 grow px-4 pt-8 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl flex flex-col gap-16 lg:gap-24">
        <article className="w-full flex flex-col gap-12 lg:gap-20">
          <div className="group relative w-full aspect-square md:aspect-[21/9] overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-white/10">
            <img
              src={
                bannerUrl.includes("?")
                  ? `${bannerUrl}&q=80&w=2000&auto=format`
                  : `${bannerUrl}?q=80&w=2000&auto=format`
              }
              alt={event.name}
              className="h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

            <div className="absolute bottom-8 left-6 right-6 md:bottom-14 md:left-12 md:right-12 max-w-3xl flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-white text-xs font-semibold tracking-widest uppercase backdrop-blur-md">
                  Upcoming event
                </span>
                <span className="text-cork-coral text-sm font-medium tracking-widest uppercase">{dateTime}</span>
              </div>
              <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-none">
                {event.name}
              </h1>
             
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
            <div className="flex flex-col gap-8 lg:col-span-7">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: "var(--text)" }}>
                  About the evening
                </h2>
                <div className="prose prose-invert prose-lg mt-6 max-w-none leading-relaxed">
                  <p className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>
                    {event.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="card lg:sticky lg:top-8">
                <RegistrationPanel amountInKobo={event.amount_in_kobo} questions={questions} />
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
