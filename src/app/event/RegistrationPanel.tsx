"use client";

import { useMemo, useState, type CSSProperties } from "react";
import toast from "react-hot-toast";
import PhoneInput, { isValidPhoneNumber, type Value as PhoneValue } from "react-phone-number-input";
import { ChevronDown, ChevronUp, Minus, Plus, Trash2 } from "lucide-react";

import type { EventQuestion } from "@/lib/event";

type Props = {
  amountInKobo?: string | null;
  questions: EventQuestion[];
};

type ApiErrorPayload = {
  message?: string;
};

type AttendeeDraft = {
  id: string;
  name: string;
  email: string;
  phone?: PhoneValue;
  responses: Record<
    string,
    | { kind: "text"; value: string }
    | { kind: "yes_no"; value: "yes" | "no" | "" }
    | { kind: "single_choice"; value: string }
    | { kind: "multiple_choice"; value: string[] }
  >;
  isOpen: boolean;
};

function isFreeEventAmount(amountInKobo: string | null | undefined): boolean {
  if (amountInKobo == null) return true;
  const t = String(amountInKobo).trim();
  if (t === "") return true;
  const k = Number.parseInt(t, 10);
  return Number.isFinite(k) && k === 0;
}

function isValidEmail(email: string) {
  // Intentionally simple; backend remains source of truth.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function looksLikeTechnicalError(message: string): boolean {
  const m = message.toLowerCase();
  if (m.length > 240) return true;
  return (
    m.includes("sqlstate") ||
    m.includes("violates") ||
    m.includes("foreign key") ||
    m.includes("pq:") ||
    m.includes("rpc error") ||
    m.includes("panic:") ||
    m.includes("failed to create") ||
    m.includes("insert or update")
  );
}

/** Never surface raw server / DB strings to attendees. */
function userFacingRegistrationError(status: number, rawMessage: string): string {
  const raw = rawMessage.trim();

  if (status >= 500) {
    return "Something went wrong. Please try again.";
  }
  if (status === 404) {
    return "There is no event open for registration right now.";
  }
  if (status === 429) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  if (status === 400) {
    if (!raw || looksLikeTechnicalError(raw)) {
      return "Something went wrong. Please check your details and try again.";
    }
    const lower = raw.toLowerCase();
    if (lower.includes("already registered")) {
      return "One of the attendees is already registered for this event.";
    }
    return raw;
  }

  if (raw && !looksLikeTechnicalError(raw)) {
    return raw;
  }
  return "Something went wrong. Please try again.";
}

function formatNairaFromKobo(amountInKobo: string | null | undefined): string {
  const t = String(amountInKobo ?? "").trim();
  const kobo = Number.parseInt(t || "0", 10);
  const safe = Number.isFinite(kobo) ? kobo : 0;
  const naira = safe / 100;
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(naira);
}

function isChoiceQuestionType(type: EventQuestion["type"]): boolean {
  return type === "single_choice" || type === "multiple_choice";
}

function newAttendeeDraft(): AttendeeDraft {
  return {
    id: crypto.randomUUID(),
    name: "",
    email: "",
    responses: {},
    isOpen: true,
  };
}

export default function RegistrationPanel({ amountInKobo, questions }: Props) {
  const baseUrl = useMemo(() => process.env.NEXT_PUBLIC_API_URL?.trim() ?? "", []);
  const isFree = useMemo(() => isFreeEventAmount(amountInKobo), [amountInKobo]);
  const unitPriceLabel = useMemo(() => formatNairaFromKobo(amountInKobo), [amountInKobo]);

  const [attendees, setAttendees] = useState<AttendeeDraft[]>([newAttendeeDraft()]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ticketCount = attendees.length;
  const totalLabel = useMemo(() => {
    const kobo = Number.parseInt(String(amountInKobo ?? "0"), 10);
    const safe = Number.isFinite(kobo) ? kobo : 0;
    return formatNairaFromKobo(String(safe * ticketCount));
  }, [amountInKobo, ticketCount]);

  const phoneShellStyle: CSSProperties = {
    color: "var(--text)",
    background: "rgba(208, 192, 226, 0.06)",
    border: "1px solid var(--border)",
    ["--PhoneInput-color--focus" as keyof CSSProperties]: "var(--text)",
    ["--PhoneInputCountryFlag-borderColor" as keyof CSSProperties]: "var(--border)",
    ["--PhoneInputCountryFlag-borderColor--focus" as keyof CSSProperties]: "var(--text)",
    ["--PhoneInputCountrySelectArrow-color" as keyof CSSProperties]: "var(--muted)",
    ["--PhoneInputCountrySelectArrow-color--focus" as keyof CSSProperties]: "var(--text)",
  };

  const sortedQuestions = useMemo(
    () => [...questions].sort((a, b) => a.sort_order - b.sort_order),
    [questions],
  );

  const setTicketCount = (nextCount: number) => {
    const clamped = Math.max(1, Math.min(10, nextCount));
    setAttendees((prev) => {
      if (prev.length === clamped) return prev;
      if (prev.length < clamped) {
        const more = Array.from({ length: clamped - prev.length }, () => newAttendeeDraft());
        if (prev.length > 0) more[more.length - 1].isOpen = true;
        return [...prev.map((p) => ({ ...p, isOpen: false })), ...more];
      }
      return prev.slice(0, clamped);
    });
  };

  const updateAttendee = (id: string, patch: Partial<AttendeeDraft>) => {
    setAttendees((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const toggleOpen = (id: string) => {
    setAttendees((prev) => prev.map((a) => (a.id === id ? { ...a, isOpen: !a.isOpen } : a)));
  };

  const removeAttendee = (id: string) => {
    setAttendees((prev) => (prev.length <= 1 ? prev : prev.filter((a) => a.id !== id)));
  };

  const setResponse = (attendeeId: string, question: EventQuestion, value: AttendeeDraft["responses"][string]) => {
    setAttendees((prev) =>
      prev.map((a) =>
        a.id === attendeeId
          ? {
              ...a,
              responses: {
                ...a.responses,
                [question.id]: value,
              },
            }
          : a,
      ),
    );
  };

  const validateClient = (): string | null => {
    if (!baseUrl) return "Something went wrong. Please try again.";

    const seen = new Set<string>();
    for (let i = 0; i < attendees.length; i++) {
      const a = attendees[i];
      const label = i === 0 ? "Primary attendee" : `Attendee ${i + 1}`;
      if (!a.name.trim()) return `${label}: please enter a full name.`;
      if (!a.email.trim() || !isValidEmail(a.email.trim())) return `${label}: please enter a valid email address.`;
      const emailKey = a.email.trim().toLowerCase();
      if (seen.has(emailKey)) return "Each attendee must have a unique email address.";
      seen.add(emailKey);
      const phone = String(a.phone ?? "").trim();
      if (!phone) return `${label}: please enter a phone number.`;
      if (!isValidPhoneNumber(phone)) return `${label}: please enter a valid phone number.`;

      for (const q of sortedQuestions) {
        const resp = a.responses[q.id];
        if (!resp) {
          if (q.is_required) return `${label}: please answer required question “${q.question}”.`;
          continue;
        }

        if (q.type === "text") {
          if (resp.kind !== "text" || !resp.value.trim()) return `${label}: please answer “${q.question}”.`;
        }
        if (q.type === "yes_no") {
          if (resp.kind !== "yes_no" || (resp.value !== "yes" && resp.value !== "no")) {
            return `${label}: please answer “${q.question}” with Yes or No.`;
          }
        }
        if (q.type === "single_choice") {
          if (resp.kind !== "single_choice" || !resp.value.trim()) return `${label}: please answer “${q.question}”.`;
        }
        if (q.type === "multiple_choice") {
          if (resp.kind !== "multiple_choice" || resp.value.length < 1) return `${label}: please answer “${q.question}”.`;
        }
      }
    }

    return null;
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    const validation = validateClient();
    if (validation) {
      toast.error(validation);
      return;
    }

    let holdSubmittingUntilNavigation = false;
    const endpoint = `${baseUrl.replace(/\/$/, "")}/public/event/register`;

    const toastId = toast.loading(isFree ? "Registering…" : "Creating checkout…");
    setIsSubmitting(true);

    try {
      const payload = {
        tickets: attendees.map((a) => ({
          name: a.name.trim(),
          email: a.email.trim().toLowerCase(),
          phone_number: String(a.phone ?? "").trim(),
          responses: sortedQuestions.length
            ? sortedQuestions
                .map((q) => {
                  const resp = a.responses[q.id];
                  if (!resp) return null;

                  if (q.type === "text") {
                    if (resp.kind !== "text") return null;
                    return { question_id: q.id, answer_text: resp.value.trim() };
                  }
                  if (q.type === "yes_no") {
                    if (resp.kind !== "yes_no") return null;
                    return { question_id: q.id, answer_text: resp.value };
                  }
                  if (q.type === "single_choice") {
                    if (resp.kind !== "single_choice") return null;
                    return { question_id: q.id, answer_options: [resp.value] };
                  }
                  if (q.type === "multiple_choice") {
                    if (resp.kind !== "multiple_choice") return null;
                    return { question_id: q.id, answer_options: resp.value };
                  }
                  return null;
                })
                .filter(Boolean)
            : undefined,
        })),
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let rawMessage = "";
        try {
          const json = (await res.json()) as ApiErrorPayload;
          if (typeof json?.message === "string") rawMessage = json.message;
        } catch {
          // ignore
        }
        toast.error(userFacingRegistrationError(res.status, rawMessage), { id: toastId });
        return;
      }

      const json = (await res.json()) as { checkout_url?: string };
      const checkoutUrl = (json.checkout_url ?? "").trim();

      if (isFree) {
        holdSubmittingUntilNavigation = true;
        toast.success("You're registered!", { id: toastId, duration: 6000 });
        setTimeout(() => window.location.assign("/"), 2500);
        return;
      }

      if (!checkoutUrl) {
        toast.error("Something went wrong. Please try again.", { id: toastId });
        return;
      }

      toast.success("Redirecting to checkout…", { id: toastId });
      window.location.assign(checkoutUrl);
    } catch {
      toast.error("Network error. Please try again.", { id: toastId });
    } finally {
      if (!holdSubmittingUntilNavigation) setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text)" }}>
          Register
        </h3>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Select tickets and fill in attendee details.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-xl border px-4 py-4" style={{ borderColor: "var(--border)" }}>
        <div className="flex flex-col">
          <span className="font-medium" style={{ color: "var(--text)" }}>
            Number of Tickets
          </span>
          <span className="text-sm font-medium text-cork-coral mt-0.5">{unitPriceLabel} each</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border p-1" style={{ borderColor: "var(--border)" }}>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-white/5"
            onClick={() => setTicketCount(ticketCount - 1)}
            disabled={isSubmitting || ticketCount <= 1}
            aria-label="Decrease ticket count"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-5 text-center font-semibold" style={{ color: "var(--text)" }}>
            {ticketCount}
          </span>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-white/5"
            onClick={() => setTicketCount(ticketCount + 1)}
            disabled={isSubmitting || ticketCount >= 10}
            aria-label="Increase ticket count"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {attendees.map((a, index) => {
          const title = index === 0 ? "Primary Attendee" : `Attendee ${index + 1}`;
          return (
            <div key={a.id} className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border)" }}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-white/5"
                onClick={() => toggleOpen(a.id)}
              >
                <span className="font-medium" style={{ color: "var(--text)" }}>
                  {title}
                </span>
                <span className="flex items-center gap-3">
                  {index > 0 ? (
                    <span
                      className="inline-flex rounded-md p-1 transition-colors hover:bg-white/10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeAttendee(a.id);
                      }}
                      role="button"
                      aria-label={`Remove ${title}`}
                      title="Remove attendee"
                    >
                      <Trash2 className="h-4 w-4 text-cork-coral" />
                    </span>
                  ) : null}
                  {a.isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              </button>

              {a.isOpen ? (
                <div className="flex flex-col gap-5 px-4 pb-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "var(--muted)" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg px-4 py-3 text-sm"
                      style={{
                        color: "var(--text)",
                        background: "rgba(208, 192, 226, 0.06)",
                        border: "1px solid var(--border)",
                        outline: "none",
                      }}
                      value={a.name}
                      onChange={(e) => updateAttendee(a.id, { name: e.target.value })}
                      disabled={isSubmitting}
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "var(--muted)" }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-lg px-4 py-3 text-sm"
                      style={{
                        color: "var(--text)",
                        background: "rgba(208, 192, 226, 0.06)",
                        border: "1px solid var(--border)",
                        outline: "none",
                      }}
                      value={a.email}
                      onChange={(e) => updateAttendee(a.id, { email: e.target.value })}
                      disabled={isSubmitting}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "var(--muted)" }}>
                      Phone Number
                    </label>
                    <div className="w-full rounded-lg px-4 py-3 text-sm" style={phoneShellStyle}>
                      <PhoneInput
                        international
                        defaultCountry="NG"
                        placeholder="Enter phone number"
                        value={a.phone}
                        onChange={(v) => updateAttendee(a.id, { phone: v })}
                        disabled={isSubmitting}
                        autoComplete="tel"
                        numberInputProps={{
                          required: true,
                          className:
                            "w-full bg-transparent text-sm outline-none border-0 p-0 focus:ring-0 focus:outline-none placeholder:text-[color:var(--muted)]",
                        }}
                      />
                    </div>
                  </div>

                  {sortedQuestions.length > 0 ? (
                    <div className="pt-4 mt-1 border-t" style={{ borderColor: "var(--border)" }}>
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-1">
                          <h4 className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "var(--muted)" }}>
                            Event Questions
                          </h4>
                        </div>

                        {sortedQuestions.map((q) => {
                          const resp = a.responses[q.id];
                          return (
                            <div key={q.id} className="flex flex-col gap-2">
                              <label className="text-[13px] font-medium" style={{ color: "var(--text)" }}>
                                {q.question}{" "}
                                {q.is_required ? <span className="text-cork-coral" aria-hidden="true">*</span> : null}
                              </label>

                              {q.type === "text" ? (
                                <textarea
                                  rows={2}
                                  className="w-full rounded-lg px-4 py-3 text-sm resize-none"
                                  style={{
                                    color: "var(--text)",
                                    background: "rgba(208, 192, 226, 0.06)",
                                    border: "1px solid var(--border)",
                                    outline: "none",
                                  }}
                                  value={resp?.kind === "text" ? resp.value : ""}
                                  onChange={(e) => setResponse(a.id, q, { kind: "text", value: e.target.value })}
                                  disabled={isSubmitting}
                                />
                              ) : null}

                              {q.type === "yes_no" ? (
                                <div className="flex items-center gap-6 mt-1">
                                  {(["yes", "no"] as const).map((v) => (
                                    <label key={v} className="flex items-center gap-2.5 cursor-pointer">
                                      <input
                                        type="radio"
                                        name={`${a.id}_${q.id}`}
                                        value={v}
                                        checked={resp?.kind === "yes_no" ? resp.value === v : false}
                                        onChange={() => setResponse(a.id, q, { kind: "yes_no", value: v })}
                                        disabled={isSubmitting}
                                      />
                                      <span className="text-sm" style={{ color: "var(--muted)" }}>
                                        {v === "yes" ? "Yes" : "No"}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              ) : null}

                              {isChoiceQuestionType(q.type) ? (
                                <div className="flex flex-col gap-3 mt-1">
                                  {q.options
                                    .slice()
                                    .sort((a, b) => a.sort_order - b.sort_order)
                                    .map((opt) => {
                                      if (q.type === "single_choice") {
                                        return (
                                          <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer">
                                            <input
                                              type="radio"
                                              name={`${a.id}_${q.id}`}
                                              value={opt.value}
                                              checked={resp?.kind === "single_choice" ? resp.value === opt.value : false}
                                              onChange={() => setResponse(a.id, q, { kind: "single_choice", value: opt.value })}
                                              disabled={isSubmitting}
                                            />
                                            <span className="text-sm" style={{ color: "var(--muted)" }}>
                                              {opt.label}
                                            </span>
                                          </label>
                                        );
                                      }

                                      const selected = resp?.kind === "multiple_choice" ? resp.value : [];
                                      const isSelected = selected.includes(opt.value);
                                      return (
                                        <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            name={`${a.id}_${q.id}_${opt.id}`}
                                            value={opt.value}
                                            checked={isSelected}
                                            onChange={() => {
                                              const next = isSelected
                                                ? selected.filter((v) => v !== opt.value)
                                                : [...selected, opt.value];
                                              setResponse(a.id, q, { kind: "multiple_choice", value: next });
                                            }}
                                            disabled={isSubmitting}
                                          />
                                          <span className="text-sm" style={{ color: "var(--muted)" }}>
                                            {opt.label}
                                          </span>
                                        </label>
                                      );
                                    })}
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between text-sm font-medium" style={{ color: "var(--muted)" }}>
          <span>
            {ticketCount} {ticketCount === 1 ? "Ticket" : "Tickets"}
          </span>
          <span>{totalLabel}</span>
        </div>
        <div className="flex items-center justify-between text-xs" style={{ color: "var(--muted)" }}>
          <span>Price per ticket</span>
          <span>{unitPriceLabel}</span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold pt-1" style={{ color: "var(--text)" }}>
          <span>Total</span>
          <span className="text-cork-coral">{totalLabel}</span>
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 bg-cork-coral px-8 py-3.5 text-sm font-medium tracking-wide text-cork-white transition-all duration-300 hover:bg-cork-coral-hover w-full"
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
      >
        {isSubmitting ? (isFree ? "Registering…" : "Redirecting…") : isFree ? "Register" : "Continue to Payment"}
      </button>

      <div className="pt-2">
        <p className="text-center text-xs font-medium" style={{ color: "var(--muted)" }}>
          Your information is secure.
        </p>
      </div>
    </form>
  );
}

