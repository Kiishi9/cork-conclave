import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover curated cork tastings, salons, and artisan gatherings in Cork City.",
  alternates: {
    canonical: site.url,
  },
};

export default function Home() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    publisher: {
      "@type": "Organization",
      name: site.name,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/events`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">{site.contact.city}, {site.contact.country}</p>
            <h1 className="hero-title">The Cork Conclave</h1>
            <p className="hero-subtitle">
              A curated collective celebrating cork culture through tastings,
              salons, and artisan gatherings. Join intimate evenings designed
              to spark connection and discovery.
            </p>
            <div className="cta-row">
              <a
                className="button"
                href={site.socials.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Follow on Instagram
              </a>
              <Link className="button outline" href="/events">
                View upcoming events
              </Link>
            </div>
          </div>
          <div className="hero-panel">
            <span className="badge">Next Gathering</span>
            <h2 className="section-title">
              The Cellar Sessions: Winter Edition
            </h2>
            <p className="muted">
              A candlelit tasting experience with local sommeliers, seasonal
              pairings, and curated storytelling.
            </p>
            <ul>
              <li>Friday, 7:30 PM</li>
              <li>The Warehouse Loft, {site.contact.city}</li>
              <li>Limited to 24 guests</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="eyebrow">What we curate</p>
              <h2 className="section-title">Moments worth savoring</h2>
            </div>
            <Link className="button outline" href="/about">
              Our story
            </Link>
          </div>
          <div className="grid three">
            <div className="card">
              <h3>Immersive tastings</h3>
              <p className="muted">
                Guided evenings spotlighting regional vintages, local makers,
                and the stories behind every bottle.
              </p>
            </div>
            <div className="card">
              <h3>Artisan collaborations</h3>
              <p className="muted">
                Partnerships with Cork creatives to craft thoughtful menus,
                music, and design-led experiences.
              </p>
            </div>
            <div className="card">
              <h3>Community gatherings</h3>
              <p className="muted">
                Intimate salons and conversations to bring collectors,
                newcomers, and the curious together.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="eyebrow">Upcoming</p>
              <h2 className="section-title">Next gathering</h2>
            </div>
            <Link className="button outline" href="/events">
              View event details
            </Link>
          </div>
          <div className="card">
            <span className="badge">February 14</span>
            <h3>The Cellar Sessions: Winter Edition</h3>
            <p className="muted">
              A candlelit tasting experience with local sommeliers, seasonal
              pairings, and curated storytelling. Limited to 24 guests.
            </p>
            <Link className="button" href="/events">
              Save Your Spot
            </Link>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="eyebrow">Gallery</p>
              <h2 className="section-title">A glimpse of the mood</h2>
            </div>
            <Link className="button outline" href="/gallery">
              Explore the gallery
            </Link>
          </div>
          <div className="grid three">
            <div className="gallery-tile" />
            <div className="gallery-tile" />
            <div className="gallery-tile" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card contact-card">
            <div>
              <p className="eyebrow">Become part of the community</p>
              <h2 className="section-title">Join us at an event</h2>
              <p className="muted">
                The Cork Conclave community is built on shared experiences.
                Attend one of our gatherings to connect with fellow enthusiasts,
                and become part of our inner circle.
              </p>
            </div>
            <div className="cta-row">
              <Link className="button" href="/events">
                View upcoming event
              </Link>
              <a
                className="button outline"
                href={site.socials.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Follow on Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
