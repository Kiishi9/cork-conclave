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

// Gallery organized by event
const eventGalleries = [
  {
    eventName: "Pour Perspective",
    date: "November 2024",
    photos: [
      { url: "/gallery/cellar-sessions-1.jpg", alt: "Candlelit table setting" },
      { url: "/gallery/cellar-sessions-2.jpg", alt: "Wine tasting in progress" },
      { url: "/gallery/cellar-sessions-3.jpg", alt: "Guests enjoying the evening" },
      { url: "/gallery/cellar-sessions-4.jpg", alt: "Sommelier presenting wines" },
    ],
  },
  {
    eventName: "Clink & Chill",
    date: "December 2024",
    photos: [
      { url: "/gallery/harvest-hues-1.jpg", alt: "Floral table arrangements" },
      { url: "/gallery/harvest-hues-2.jpg", alt: "Seasonal menu pairing" },
      { url: "/gallery/harvest-hues-3.jpg", alt: "Evening atmosphere" },
    ],
  },
  {
    eventName: "Uncorked: A Love Affair",
    date: "February 2025",
    photos: [
      { url: "/gallery/collectors-salon-1.jpg", alt: "Intimate conversation setting" },
      { url: "/gallery/collectors-salon-2.jpg", alt: "Vintage wine display" },
      { url: "/gallery/collectors-salon-3.jpg", alt: "Guests mingling" },
      { url: "/gallery/collectors-salon-4.jpg", alt: "Tasting notes setup" },
      { url: "/gallery/collectors-salon-5.jpg", alt: "Evening ambiance" },
    ],
  },
  {
    eventName: "Escandalo",
    date: "March 2025",
    photos: [
      { url: "/gallery/cellar-sessions-1.jpg", alt: "Candlelit table setting" },
      { url: "/gallery/cellar-sessions-2.jpg", alt: "Wine tasting in progress" },
      { url: "/gallery/cellar-sessions-3.jpg", alt: "Guests enjoying the evening" },
      { url: "/gallery/cellar-sessions-4.jpg", alt: "Sommelier presenting wines" },
    ],
  },
  {
    eventName: "4-1-9",
    date: "April 2025",
    photos: [
      { url: "/gallery/cellar-sessions-1.jpg", alt: "Candlelit table setting" },
      { url: "/gallery/cellar-sessions-2.jpg", alt: "Wine tasting in progress" },
      { url: "/gallery/cellar-sessions-3.jpg", alt: "Guests enjoying the evening" },
      { url: "/gallery/cellar-sessions-4.jpg", alt: "Sommelier presenting wines" },
    ],
  },
  {
    eventName: "Sips Don't Lie",
    date: "May 2025",
    photos: [
      { url: "/gallery/cellar-sessions-1.jpg", alt: "Candlelit table setting" },
      { url: "/gallery/cellar-sessions-2.jpg", alt: "Wine tasting in progress" },
      { url: "/gallery/cellar-sessions-3.jpg", alt: "Guests enjoying the evening" },
      { url: "/gallery/cellar-sessions-4.jpg", alt: "Sommelier presenting wines" },
    ],
  },
  {
    eventName: "Scarlet Accord",
    date: "June 2025",
    photos: [
      { url: "/gallery/cellar-sessions-1.jpg", alt: "Candlelit table setting" },
      { url: "/gallery/cellar-sessions-2.jpg", alt: "Wine tasting in progress" },
      { url: "/gallery/cellar-sessions-3.jpg", alt: "Guests enjoying the evening" },
      { url: "/gallery/cellar-sessions-4.jpg", alt: "Sommelier presenting wines" },
    ],
  },
  {
    eventName: "Grape Outdoor",
    date: "July 2025",
    photos: [
      { url: "/gallery/cellar-sessions-1.jpg", alt: "Candlelit table setting" },
      { url: "/gallery/cellar-sessions-2.jpg", alt: "Wine tasting in progress" },
      { url: "/gallery/cellar-sessions-3.jpg", alt: "Guests enjoying the evening" },
      { url: "/gallery/cellar-sessions-4.jpg", alt: "Sommelier presenting wines" },
    ],
  },
  {
    eventName: "Lollapalooza",
    date: "August 2025",
    photos: [
      { url: "/gallery/cellar-sessions-1.jpg", alt: "Candlelit table setting" },
      { url: "/gallery/cellar-sessions-2.jpg", alt: "Wine tasting in progress" },
      { url: "/gallery/cellar-sessions-3.jpg", alt: "Guests enjoying the evening" },
      { url: "/gallery/cellar-sessions-4.jpg", alt: "Sommelier presenting wines" },
    ],
  },
  {
    eventName: "Trivia Night",
    date: "September 2025",
    photos: [
      { url: "/gallery/cellar-sessions-1.jpg", alt: "Candlelit table setting" },
      { url: "/gallery/cellar-sessions-2.jpg", alt: "Wine tasting in progress" },
      { url: "/gallery/cellar-sessions-3.jpg", alt: "Guests enjoying the evening" },
      { url: "/gallery/cellar-sessions-4.jpg", alt: "Sommelier presenting wines" },
    ],
  },
    {
    eventName: "Amebo Lounge",
    date: "October 2025",
    photos: [
      { url: "/gallery/cellar-sessions-1.jpg", alt: "Candlelit table setting" },
      { url: "/gallery/cellar-sessions-2.jpg", alt: "Wine tasting in progress" },
      { url: "/gallery/cellar-sessions-3.jpg", alt: "Guests enjoying the evening" },
      { url: "/gallery/cellar-sessions-4.jpg", alt: "Sommelier presenting wines" },
    ],
  },
    {
    eventName: "From Palette to Palate",
    date: "November 2025",
    photos: [
      { url: "/gallery/cellar-sessions-1.jpg", alt: "Candlelit table setting" },
      { url: "/gallery/cellar-sessions-2.jpg", alt: "Wine tasting in progress" },
      { url: "/gallery/cellar-sessions-3.jpg", alt: "Guests enjoying the evening" },
      { url: "/gallery/cellar-sessions-4.jpg", alt: "Sommelier presenting wines" },
    ],
  },
    {
    eventName: "The Grape Reset",
    date: "January 2026",
    photos: [
      { url: "/gallery/cellar-sessions-1.jpg", alt: "Candlelit table setting" },
      { url: "/gallery/cellar-sessions-2.jpg", alt: "Wine tasting in progress" },
      { url: "/gallery/cellar-sessions-3.jpg", alt: "Guests enjoying the evening" },
      { url: "/gallery/cellar-sessions-4.jpg", alt: "Sommelier presenting wines" },
    ],
  },
  
];

export default function GalleryPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div>
            <p className="eyebrow">Gallery</p>
            <h1 className="hero-title">Atmosphere, captured</h1>
            <p className="hero-subtitle">
              A collection of mood, texture, and storytelling from our past events. Visit Instagram
              for the full visual diary.
            </p>
          </div>
        </div>
      </section>

      {eventGalleries.map((event) => (
        <section className="section tight" key={event.eventName}>
          <div className="container">
            <div className="section-header">
              <div>
                <p className="eyebrow">{event.date}</p>
                <h2 className="section-title">{event.eventName}</h2>
              </div>
            </div>
            <div className="grid three">
              {event.photos.map((photo, index) => (
                <div
                  className="gallery-tile"
                  key={`${event.eventName}-${index}`}
                  style={{
                    backgroundImage: `url(${photo.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  role="img"
                  aria-label={photo.alt}
                />
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
