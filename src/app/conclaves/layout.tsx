import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Past Conclaves",
  description:
    "More than wine — The Cork Conclave is a community built around shared moments, good conversations, and the joy of gathering in Ibadan.",
  openGraph: {
    title: `Past Conclaves | ${site.name}`,
    description:
      "More than wine — The Cork Conclave is a community built around shared moments, good conversations, and the joy of gathering in Ibadan.",
  },
  alternates: {
    canonical: `${site.url}/conclaves`,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
