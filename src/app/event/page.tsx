/* eslint-disable @next/next/no-img-element */

import { redirect } from "next/navigation";
import { getActiveEvent } from "@/lib/event";
import { formatDateTime } from "@/lib/helpers";
import RegistrationForm from "./RegistrationForm";

function formatNairaFromKoboString(amountInKobo: string): string {
  const kobo = Number.parseInt(amountInKobo, 10);
  if (!Number.isFinite(kobo)) return amountInKobo;
  const naira = kobo / 100;
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(naira);
}

function MetaRow({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <div
        className="shrink-0 mt-0.5 flex items-center justify-center rounded-full"
        style={{
          width: 40,
          height: 40,
          lineHeight: 0,
          color: "var(--text)",
          background: "rgba(208, 192, 226, 0.08)",
          border: "1px solid var(--border)",
        }}
      >
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
          {title}
        </div>
        <div className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default async function Page() {
  const event = await getActiveEvent();
  if (!event) {
    redirect("/");
  }

  const bannerUrl = (event.image_url ?? "").trim();
  const dateTime = formatDateTime(event.event_date);
  const price = formatNairaFromKoboString(event.amount_in_kobo);

  return (
    <div>
      <div className="relative z-10 grow px-4 pt-2 pb-10 sm:px-6 sm:pb-12 lg:px-8 lg:pt-4 lg:pb-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 lg:grid-cols-14 lg:gap-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <div className="group relative w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 md:aspect-16/10 lg:aspect-video">
              <img
                src={
                  bannerUrl.includes("?")
                    ? `${bannerUrl}&q=80&w=2000&auto=format`
                    : `${bannerUrl}?q=80&w=2000&auto=format`
                }
                alt={event.name}
                className="block h-auto w-full transition-transform duration-700 group-hover:scale-105 md:absolute md:inset-0 md:h-full md:w-full md:object-cover md:object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#2b1d2e] via-[#2b1d2e]/40 to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-orange-900/10 mix-blend-overlay" />
            </div>

            {/* Event Info */}
            <div className="flex flex-col gap-6 px-2 lg:px-0">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3" style={{ color: "var(--text)" }}>
                {event.name}
              </h1>

              <div className="space-y-5">
                <MetaRow
                  title="Date"
                  icon={
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      className="block shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M8 2v4M16 2v4" />
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M3 10h18" />
                    </svg>
                  }
                >
                  {dateTime}
                </MetaRow>

                <MetaRow
                  title="Ticket Fee"
                  icon={
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      className="block shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.59 13.41 11 3.83V2h-2v3L3.41 13.41a2 2 0 0 0 0 2.83l4.35 4.35a2 2 0 0 0 2.83 0L20.59 16.24a2 2 0 0 0 0-2.83Z" />
                      <path d="M7 7h.01" />
                    </svg>
                  }
                >
                  {price}
                </MetaRow>
              </div>

              <div className="prose prose-invert prose-lg mt-4 max-w-none space-y-6 text-lg leading-relaxed text-gray-300">
                <p className="text-base leading-relaxed mb-8" style={{ color: "var(--muted)" }}>
                  {event.description}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 relative"></div>
          <div className="lg:col-span-5 relative">
            <div className="sticky top-8 card">
              <div className="mb-8 flex flex-col gap-2">
                <p className="text-2xl font-semibold" style={{ color: "var(--text)" }}>
                  Register for this event
                </p>

                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                  Fill in your details to secure your spot.
                </p>
              </div>

              <RegistrationForm className="space-y-5" amountInKobo={event.amount_in_kobo} />

              <div className="mt-6 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex items-center justify-center gap-1.5 mb-2" style={{ color: "var(--muted)" }}>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span className="text-xs font-medium">Your information is secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
