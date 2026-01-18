import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Connect with The Cork Conclave for private tastings, partnerships, and curated gatherings.",
  alternates: {
    canonical: `${site.url}/contact`,
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Contact</p>
            <h1 className="hero-title">Let&apos;s plan your next gathering</h1>
            <p className="hero-subtitle">
              Reach out for private tastings, partnerships, or intimate event
              collaborations in Cork and beyond.
            </p>
          </div>
          <div className="hero-panel">
            <h2 className="section-title">Availability</h2>
            <p className="muted">
              We host a limited number of gatherings each month to maintain a
              refined, personal feel. Inquire early for bespoke experiences.
            </p>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="card contact-card">
            <div>
              <h2 className="section-title">Contact details</h2>
              <p className="muted">
                Email is the fastest way to connect. We respond within two
                business days.
              </p>
            </div>
            <div className="grid">
              <a className="button" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
              <a
                className="button outline"
                href={site.socials.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
              <p className="muted">
                {site.contact.city}, {site.contact.country}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
