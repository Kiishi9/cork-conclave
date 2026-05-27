import { getActiveEvent } from "@/lib/event";
import NoEvent from "./NoEvent";
import { Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import { formatDateTime } from "@/lib/helpers";
import { app_routes } from "@/lib/constants";

function formatNairaFromKoboString(amountInKobo: string): string {
  const kobo = Number.parseInt(amountInKobo, 10);
  if (!Number.isFinite(kobo)) return amountInKobo;
  const naira = kobo / 100;
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(naira);
}

export default async function Event() {
  const event = await getActiveEvent();
  if (!event) return <NoEvent />;

  const ctaClosed = event.is_registration_cta_closed ?? false;
  const bannerUrl = (event.image_url ?? "").trim();
  const eventName = event.name?.trim() || "Next Conclave";
  const eventDescription = event.description?.trim() || "";
  const eventDateTime = formatDateTime(event.event_date);
  const price = formatNairaFromKoboString(event.amount_in_kobo);

  return (
    <div className="lg:col-span-5 flex justify-center lg:justify-end">
      <div className="relative w-full max-w-95 lg:max-w-100 mx-auto lg:mr-8 mt-4 lg:mt-0 flex flex-col group">
        <div className="relative w-full aspect-3/4 rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 transform -rotate-3 translate-x-1 translate-y-2 transition-all duration-700 ease-out group-hover:rotate-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-[1.02] z-10 bg-[#0a0507]">
          <div className="absolute inset-0 bg-linear-to-tr from-black/30 via-transparent to-white/10 z-10 pointer-events-none" />

          <div className="absolute top-5 left-5 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-[#e85d50] animate-pulse" />
            <span className="text-xs font-semibold text-white/90 tracking-widest uppercase">Next Conclave</span>
          </div>

          {bannerUrl ? (
            <Image
              src={bannerUrl}
              alt={eventName}
              fill
              sizes="(min-width: 1024px) 400px, 92vw"
              className="object-contain object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-[#2a0f1d] via-[#11070e] to-[#0a0507]" />
          )}
        </div>

        <div className="relative z-20 w-[92%] mx-auto sm:w-[108%] sm:ml-[-4%] sm:mr-auto -mt-20 sm:-mt-10 bg-[#1f1117]/40 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col gap-4 transform transition-all duration-700 ease-out group-hover:-translate-y-2">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-white/95 mb-1.5 leading-snug">
              {eventName}
            </h3>

            {eventDescription ? (
              <p className="text-[13px] text-white/60 line-clamp-2 leading-relaxed font-light">{eventDescription}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-2 text-white/60">
            <Calendar className="w-3.5 h-3.5 text-[#e85d50]/80" strokeWidth={1.5} />
            <span className="text-[13px] font-light tracking-wide text-white/70">{eventDateTime}</span>
          </div>

          <div className="pt-5 border-t border-white/5 flex items-center justify-between mt-1 gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] text-white/50 mb-0.5 font-medium uppercase tracking-[0.2em]">
                Guest Pass
              </span>
              <span className="text-lg font-medium tracking-tight text-white/90 flex items-baseline">
                {price}
                <span className="text-[10px] text-white/40 font-normal ml-1">/ guest</span>
              </span>
            </div>

            {ctaClosed ? null : (
              <a
                href={app_routes.event}
                className="bg-[#e85d50] hover:bg-[#d64c3f] transition-all duration-300 text-white px-5 py-2.5 rounded-lg text-[13px] font-medium flex items-center gap-2 shadow-lg shadow-[#e85d50]/20 hover:shadow-xl hover:shadow-[#e85d50]/30 hover:-translate-y-0.5 shrink-0"
              >
                RSVP
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}