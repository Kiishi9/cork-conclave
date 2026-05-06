import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Connect with The Cork Conclave for private tastings, partnerships, and curated gatherings.",
  alternates: {
    canonical: `${site.url}/contact`,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
