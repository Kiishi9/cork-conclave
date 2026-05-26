import "server-only";

import { cache } from "react";
import { isRegistrationCtaClosed } from "./registration-cta.server";
import { getPublicApiBaseUrl, safeFetchJson } from "./api-client";

export type ActiveEvent = {
  id: string;
  slug: string;
  name: string;
  description: string;
  event_date: string;
  created_by: string;
  amount_in_kobo: string;
  image_url?: string | null;
  registration_opens_at?: string | null;
  registration_closes_at?: string | null;
  is_registration_cta_closed?: boolean;
};

export type EventQuestionOption = {
  id: string;
  question_id: string;
  label: string;
  value: string;
  sort_order: number;
};

export type EventQuestion = {
  id: string;
  event_id: string;
  question: string;
  type: "yes_no" | "text" | "single_choice" | "multiple_choice";
  is_required: boolean;
  sort_order: number;
  options: EventQuestionOption[];
};

export type ActiveEventResponse = {
  event?: ActiveEvent;
  questions?: EventQuestion[];
};

export const getActiveEvent = cache(async function getActiveEvent(): Promise<ActiveEvent | null> {
  const baseUrl = getPublicApiBaseUrl();
  if (!baseUrl) return null;

  const result = await safeFetchJson<ActiveEventResponse>(`${baseUrl}/public/event`, { timeoutMs: 10_000 });
  if (!result.ok) {
    if (result.status === 404) return null;
    return null;
  }

  const event = result.data.event;
  if (!event?.id || !event.slug) return null;

  return { ...event, is_registration_cta_closed: isRegistrationCtaClosed(event, Date.now()) };
});

export const getActiveEventQuestions = cache(async function getActiveEventQuestions(): Promise<EventQuestion[]> {
  const baseUrl = getPublicApiBaseUrl();
  if (!baseUrl) return [];

  const result = await safeFetchJson<ActiveEventResponse>(`${baseUrl}/public/event`, { timeoutMs: 10_000 });
  if (!result.ok) return [];
  return Array.isArray(result.data.questions) ? result.data.questions : [];
});
