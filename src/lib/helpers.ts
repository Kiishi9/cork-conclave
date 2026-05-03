/** West Africa Time — event times are shown in Nigeria regardless of visitor device TZ. */
const EVENT_DISPLAY_TIMEZONE = "Africa/Lagos";

export function formatDateTime(value?: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: EVENT_DISPLAY_TIMEZONE,
  }).format(d);
}
