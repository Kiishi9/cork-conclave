import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Wines",
  description: "Explore every wine sampled at Cork Conclave and discover what our community thinks. A permanent archive of our shared tasting journey.",
  alternates: {
    canonical: `${site.url}/wines`,
  },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
