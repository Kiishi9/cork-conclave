import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "More than wine — The Cork Conclave is a community built around shared moments, good conversations, and the joy of gathering in Ibadan.",
  openGraph: {
    title: `About | ${site.name}`,
    description:
      "More than wine — The Cork Conclave is a community built around shared moments, good conversations, and the joy of gathering in Ibadan.",
  },
  alternates: {
    canonical: `${site.url}/about`,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
