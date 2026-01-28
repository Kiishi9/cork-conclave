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
            <p className="eyebrow">Join Us</p>
            <h1 className="hero-title">We would love to be friends.</h1>
            <p className="hero-subtitle">
             Reach out to us with your invitations and collaborations, or just register to attend one of our events. We’d love to hear from you. 
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
                Check out what we’re up to on Instagram
              </a>
                <a
                className="button outline"
                href={site.socials.tiktok}
                target="_blank"
                rel="noreferrer"
              >
                We sometimes post fun videos on Tiktok
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
