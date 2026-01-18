import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Explore the upcoming Cork Conclave gatherings, tastings, and salons in Cork City.",
  alternates: {
    canonical: `${site.url}/events`,
  },
};

const events = [
  {
    month: "February",
    title: "Harvest & Hues Supper",
    description:
      "A seasonal chef's table with rare pours and a moody floral installation.",
  },
  {
    month: "March",
    title: "The Collector's Salon",
    description:
      "Private tasting with archivist notes, artisan pairings, and conversation.",
  },
  {
    month: "April",
    title: "Cork & Canvas",
    description:
      "An evening of live illustration, soundscapes, and a curated tasting flight.",
  },
  {
    month: "May",
    title: "Golden Hour Terrace",
    description:
      "Sunset gathering with coastal pours, light bites, and a live quartet.",
  },
];

export default function EventsPage() {
  const eventsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: event.title,
      description: event.description,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
      />
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Events</p>
            <h1 className="hero-title">A calendar of curated experiences</h1>
            <p className="hero-subtitle">
              Each gathering is designed to feel intimate, immersive, and
              effortlessly refined. Invitations open in small waves.
            </p>
          </div>
          <div className="hero-panel">
            <h2 className="section-title">Member preview</h2>
            <p className="muted">
              RSVP access and private tastings are shared first with our inner
              circle. Follow along or reach out for early invitations.
            </p>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="grid two">
            {events.map((event) => (
              <div className="card" key={event.title}>
                <span className="badge">{event.month}</span>
                <h3>{event.title}</h3>
                <p className="muted">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
