"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import toast from "react-hot-toast";
import PhoneInput, { isValidPhoneNumber, type Value as PhoneValue } from "react-phone-number-input";
import { ArrowRight } from "lucide-react";

import type { EventQuestion } from "@/lib/event";
import { app_routes } from "@/lib/constants";

type InviteUser = {
  id: string;
  name: string;
  email: string;
  phone_number: string;
};

type InvitePayload = {
  token: string;
  event: { id: string; name: string; amount_in_kobo?: string };
  user: InviteUser;
  questions: EventQuestion[];
};

type ResponseValue =
  | { kind: "text"; value: string }
  | { kind: "yes_no"; value: "yes" | "no" | "" }
  | { kind: "single_choice"; value: string }
  | { kind: "multiple_choice"; value: string[] };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function InviteRegistrationPanel({ token }: { token: string }) {
  const baseUrl = useMemo(() => process.env.NEXT_PUBLIC_API_URL?.trim() ?? "", []);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [invite, setInvite] = useState<InvitePayload | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<PhoneValue | undefined>();
  const [responses, setResponses] = useState<Record<string, ResponseValue>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!baseUrl || !token) {
        setLoadError("This invite link is invalid.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `${baseUrl.replace(/\/$/, "")}/public/event/invite/${encodeURIComponent(token)}`,
          { headers: { Accept: "application/json" } },
        );
        if (!res.ok) {
          setLoadError(res.status === 404 ? "This invite is no longer valid." : "Could not load invite.");
          setLoading(false);
          return;
        }
        const data = (await res.json()) as InvitePayload;
        if (cancelled) return;
        setInvite(data);
        setName(data.user.name ?? "");
        setEmail(data.user.email ?? "");
        setPhone((data.user.phone_number || undefined) as PhoneValue | undefined);
        setLoading(false);
      } catch {
        if (!cancelled) {
          setLoadError("Could not load invite.");
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [baseUrl, token]);

  const sortedQuestions = useMemo(
    () => [...(invite?.questions ?? [])].sort((a, b) => a.sort_order - b.sort_order),
    [invite?.questions],
  );

  const inputClassName = "w-full rounded-lg px-4 py-3 text-sm";
  const inputStyle: CSSProperties = {
    color: "var(--text)",
    background: "rgba(208, 192, 226, 0.06)",
    border: "1px solid var(--border)",
    outline: "none",
  };
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting || !invite) return;

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!email.trim() || !isValidEmail(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    const phoneValue = String(phone ?? "").trim();
    if (!phoneValue || !isValidPhoneNumber(phoneValue)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    for (const q of sortedQuestions) {
      const resp = responses[q.id];
      if (!resp) {
        if (q.is_required) {
          toast.error(`Please answer “${q.question}”.`);
          return;
        }
        continue;
      }
      if (q.type === "text" && (resp.kind !== "text" || !resp.value.trim())) {
        toast.error(`Please answer “${q.question}”.`);
        return;
      }
      if (q.type === "yes_no" && (resp.kind !== "yes_no" || (resp.value !== "yes" && resp.value !== "no"))) {
        toast.error(`Please answer “${q.question}”.`);
        return;
      }
      if (q.type === "single_choice" && (resp.kind !== "single_choice" || !resp.value.trim())) {
        toast.error(`Please answer “${q.question}”.`);
        return;
      }
      if (q.type === "multiple_choice" && (resp.kind !== "multiple_choice" || resp.value.length < 1)) {
        toast.error(`Please answer “${q.question}”.`);
        return;
      }
    }

    let holdSubmittingUntilNavigation = false;
    const toastId = toast.loading("Completing registration…");
    setIsSubmitting(true);
    try {
      const payloadResponses = sortedQuestions
        .map((q) => {
          const resp = responses[q.id];
          if (!resp) return null;
          if (q.type === "text" && resp.kind === "text") {
            return { question_id: q.id, answer_text: resp.value.trim() };
          }
          if (q.type === "yes_no" && resp.kind === "yes_no") {
            return { question_id: q.id, answer_text: resp.value };
          }
          if (q.type === "single_choice" && resp.kind === "single_choice") {
            return { question_id: q.id, answer_options: [resp.value] };
          }
          if (q.type === "multiple_choice" && resp.kind === "multiple_choice") {
            return { question_id: q.id, answer_options: resp.value };
          }
          return null;
        })
        .filter(Boolean);

      const res = await fetch(
        `${baseUrl.replace(/\/$/, "")}/public/event/invite/${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone_number: phoneValue,
            responses: payloadResponses.length ? payloadResponses : undefined,
          }),
        },
      );

      if (!res.ok) {
        let message = "Could not complete registration.";
        try {
          const body = (await res.json()) as { message?: string };
          if (body.message) message = body.message;
        } catch {
          /* ignore */
        }
        toast.error(message, { id: toastId });
        return;
      }

      holdSubmittingUntilNavigation = true;
      toast.success("You're registered — check your email for your ticket.", { id: toastId, duration: 6000 });
      setTimeout(() => window.location.assign(app_routes.home), 2500);
    } catch {
      toast.error("Could not complete registration.", { id: toastId });
    } finally {
      if (!holdSubmittingUntilNavigation) setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Loading your invitation…
      </p>
    );
  }

  if (loadError || !invite) {
    return <p className="text-sm text-[#ff8a8e]">{loadError ?? "Invite not found."}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text)" }}>
          Complete your invitation
        </h3>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          You’ve been invited to {invite.event.name}. No payment is required — confirm your details
          {sortedQuestions.length > 0 ? " and answer the questions below" : ""}.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "var(--muted)" }}>
            Full name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClassName}
            style={inputStyle}
            disabled={isSubmitting}
            autoComplete="name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "var(--muted)" }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClassName}
            style={inputStyle}
            disabled={isSubmitting}
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "var(--muted)" }}>
            Phone
          </label>
          <div className="rounded-lg px-4 py-3" style={phoneShellStyle}>
            <PhoneInput
              international
              defaultCountry="NG"
              value={phone}
              onChange={setPhone}
              className="PhoneInput w-full"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {sortedQuestions.map((q) => {
          const resp = responses[q.id];
          return (
            <div key={q.id} className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "var(--muted)" }}>
                {q.question}
                {q.is_required ? " *" : ""}
              </label>

              {q.type === "text" ? (
                <input
                  className={inputClassName}
                  style={inputStyle}
                  disabled={isSubmitting}
                  value={resp?.kind === "text" ? resp.value : ""}
                  onChange={(e) =>
                    setResponses((prev) => ({ ...prev, [q.id]: { kind: "text", value: e.target.value } }))
                  }
                />
              ) : null}

              {q.type === "yes_no" ? (
                <div className="flex gap-2">
                  {(["yes", "no"] as const).map((opt) => {
                    const selected = resp?.kind === "yes_no" && resp.value === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={isSubmitting}
                        className="rounded-lg border px-3 py-2 text-sm capitalize transition-colors"
                        style={{
                          borderColor: selected ? "var(--text)" : "var(--border)",
                          color: "var(--text)",
                          background: selected ? "rgba(255,255,255,0.08)" : "transparent",
                        }}
                        onClick={() =>
                          setResponses((prev) => ({ ...prev, [q.id]: { kind: "yes_no", value: opt } }))
                        }
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {q.type === "single_choice" ? (
                <div className="flex flex-col gap-2">
                  {q.options.map((opt) => {
                    const selected = resp?.kind === "single_choice" && resp.value === opt.value;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isSubmitting}
                        className="rounded-lg border px-3 py-2 text-left text-sm transition-colors"
                        style={{
                          borderColor: selected ? "var(--text)" : "var(--border)",
                          color: "var(--text)",
                          background: selected ? "rgba(255,255,255,0.08)" : "transparent",
                        }}
                        onClick={() =>
                          setResponses((prev) => ({
                            ...prev,
                            [q.id]: { kind: "single_choice", value: opt.value },
                          }))
                        }
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {q.type === "multiple_choice" ? (
                <div className="flex flex-col gap-2">
                  {q.options.map((opt) => {
                    const current = resp?.kind === "multiple_choice" ? resp.value : [];
                    const checked = current.includes(opt.value);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isSubmitting}
                        className="rounded-lg border px-3 py-2 text-left text-sm transition-colors"
                        style={{
                          borderColor: checked ? "var(--text)" : "var(--border)",
                          color: "var(--text)",
                          background: checked ? "rgba(255,255,255,0.08)" : "transparent",
                        }}
                        onClick={() => {
                          const next = checked
                            ? current.filter((v) => v !== opt.value)
                            : [...current, opt.value];
                          setResponses((prev) => ({
                            ...prev,
                            [q.id]: { kind: "multiple_choice", value: next },
                          }));
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#fd4a4a] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? "Submitting…" : "Complete registration"}
        <ArrowRight className="size-4" />
      </button>
    </form>
  );
}
