import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how The Cork Conclave curates immersive tastings and collaborations across Cork City.",
  alternates: {
    canonical: `${site.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Our Story</p>
            <h1 className="hero-title">Crafted in Cork</h1>
            <p className="hero-subtitle">
              The Cork Conclave is a boutique collective celebrating cork,
              culture, and community. We curate gatherings that blend
              thoughtful tasting, design, and storytelling.
            </p>
          </div>
          <div className="hero-panel">
            <h2 className="section-title">Why we gather</h2>
            <p className="muted">
              We believe every cork holds a story. Our events honor the
              hands, places, and people behind each pour, creating space for
              connection and slow living.
            </p>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="grid three">
            <div className="card">
              <h3>Intentional details</h3>
              <p className="muted">
                We obsess over ambiance, sound, and menu flow to make every
                evening feel transportive.
              </p>
            </div>
            <div className="card">
              <h3>Local collaborations</h3>
              <p className="muted">
                From Cork chefs to floral studios, we spotlight talent
                throughout the region.
              </p>
            </div>
            <div className="card">
              <h3>Community first</h3>
              <p className="muted">
                Our gatherings are curated yet welcoming, inviting both
                collectors and new enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
