import "server-only";
import type { ImageProps } from "./types";

const EVENT_DISPLAY_TIMEZONE = "Africa/Lagos";
const cache = new Map<string, string>();

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

export default async function getBase64ImageUrl(image: ImageProps): Promise<string> {
  let url = cache.get(image.url);
  if (url) {
    return url;
  }
  const response = await fetch(image.url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image for blur placeholder: ${image.url} (${response.status})`);
  }
  const buffer = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || "image/jpeg";
  url = `data:${contentType};base64,${Buffer.from(buffer).toString("base64")}`;
  cache.set(image.url, url);
  return url;
}
