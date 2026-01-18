import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "View the ambiance and design details of The Cork Conclave gatherings and tastings.",
  alternates: {
    canonical: `${site.url}/gallery`,
  },
};

export default function GalleryPage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Gallery</p>
            <h1 className="hero-title">Atmosphere, captured</h1>
            <p className="hero-subtitle">
              A collection of mood, texture, and storytelling. Visit Instagram
              for the full visual diary.
            </p>
          </div>
          <div className="hero-panel">
            <h2 className="section-title">Signature details</h2>
            <p className="muted">
              From artisan tablescapes to candlelit pours, every gathering is
              designed as a sensory experience.
            </p>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="grid three">
            {Array.from({ length: 9 }).map((_, index) => (
              <div className="gallery-tile" key={`tile-${index}`} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
