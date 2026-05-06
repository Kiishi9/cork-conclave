import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery",
  description: "View the ambiance and design details of The Cork Conclave gatherings and tastings.",
  alternates: {
    canonical: `${site.url}/gallery`,
  },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
