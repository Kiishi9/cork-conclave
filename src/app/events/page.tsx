import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Explore the upcoming Cork Conclave gathering in Cork City.",
  alternates: {
    canonical: `${site.url}/events`,
  },
};

// Single upcoming event
const upcomingEvent = {
  title: "The Cellar Sessions: Winter Edition",
  date: "Saturday, February 21, 2025",
  time: "4:00 PM",
  location: `Pasta Xpress, 10 osuntokun Avenue Bodija, ${site.contact.city}`,
  description:
    "A candlelit tasting experience with local sommeliers, seasonal pairings, and curated storytelling. Join us for an intimate evening celebrating cork culture and community.",
  details: [
    "Limited to 24 guests for an intimate experience",
    "Curated wine selection from regional vintages",
    "Artisan food pairings by local chefs",
    "Expert-led tasting with sommelier insights",
    "Meet fellow cork enthusiasts and collectors",
  ],
  ticketLink: "https://www.eventbrite.com/e/cork-conclave-tickets", // Update with actual ticket link
};

export default function EventsPage() {
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: upcomingEvent.title,
    description: upcomingEvent.description,
    startDate: upcomingEvent.date,
    location: {
      "@type": "Place",
      name: upcomingEvent.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: site.contact.city,
        addressCountry: site.contact.country,
      },
    },
    organizer: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Upcoming Event</p>
            <h1 className="hero-title">{upcomingEvent.title}</h1>
            <p className="hero-subtitle">{upcomingEvent.description}</p>
            <div className="cta-row">
              <a
                className="button"
                href={upcomingEvent.ticketLink}
                target="_blank"
                rel="noreferrer"
              >
                Save Your Spot
              </a>
              <a
                className="button outline"
                href={site.socials.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Follow Updates
              </a>
            </div>
          </div>
          <div className="hero-panel">
            <h2 className="section-title">Event Details</h2>
            <ul>
              <li><strong>Date:</strong> {upcomingEvent.date}</li>
              <li><strong>Time:</strong> {upcomingEvent.time}</li>
              <li><strong>Location:</strong> {upcomingEvent.location}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="eyebrow">What to expect</p>
              <h2 className="section-title">An evening designed for connection</h2>
            </div>
          </div>
          <div className="grid two">
            <div className="card">
              <h3>The Experience</h3>
              <ul>
                {upcomingEvent.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3>Join the Gathering</h3>
              <p className="muted">
                Each Cork Conclave event is designed to feel intimate, immersive, and
                effortlessly refined. Spaces are limited to maintain the personal atmosphere.
              </p>
              <p className="muted">
                Secure your spot early, and become part of our community of collectors,
                newcomers, and the curious.
              </p>
              <a
                className="button"
                href={upcomingEvent.ticketLink}
                target="_blank"
                rel="noreferrer"
              >
                Get Tickets
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
