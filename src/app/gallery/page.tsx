import type { Metadata } from "next";
import { site } from "@/lib/site";
import EventCarousel from "@/components/EventCarousel";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "View the ambiance and design details of The Cork Conclave gatherings and tastings.",
  alternates: {
    canonical: `${site.url}/gallery`,
  },
};

// All gallery images
const galleryImages = [
  "07aa2e58-7629-4b4f-8204-05fdac4d6d61.jpg",
  "1000724136.jpg",
  "1000724138.jpg",
  "1000724141.jpg",
  "1000832125.jpg",
  "20250621_171728.jpg",
  "20250621_175623.jpg",
  "20250719_181939.jpg",
  "20250719_190722.jpg",
  "20250816_175628.jpg",
  "20251115_175804.jpg",
  "20251115_175836.jpg",
  "20251115_191738.jpg",
  "6af87611-c294-47d6-92ca-5c7821cd377a.jpg",
  "DSC02319.jpg",
  "DSC02320.jpg",
  "DSC02322.jpg",
  "DSC02327.jpg",
  "DSC02330.jpg",
  "DSC02334.jpg",
  "DSC02336.jpg",
  "DSC02340.jpg",
  "DSC02405.jpg",
  "DSC02446.jpg",
  "DSC02450.jpg",
  "DSC02455.jpg",
  "IMG_0826.jpg",
  "IMG_0837.jpg",
  "IMG_0844.jpg",
  "IMG_0850.jpg",
  "IMG_0868.jpg",
  "IMG_0900.jpg",
  "IMG_1329.JPG",
  "IMG_1345.JPG",
  "IMG_1346.JPG",
  "IMG_1361.JPG",
  "IMG_1388.JPG",
  "IMG_1882.JPG",
  "IMG_1886.JPG",
  "IMG_1888.JPG",
  "IMG_1896.JPG",
  "IMG_1900.JPG",
  "IMG_1913.JPG",
  "IMG-20241216-WA0299.jpg",
  "PXL_20251115_182442755.MP.jpg",
].map((filename) => ({
  url: `/images/gallery/${filename}`,
  alt: `Cork Conclave event moment - ${filename.replace(/\.(jpg|JPG)/, "")}`,
}));

export default function GalleryPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="gallery-hero-content">
            <p className="eyebrow">Gallery</p>
            <h1 className="hero-title">Atmosphere, captured</h1>
            <p className="hero-subtitle">
              A collection of mood, texture, and storytelling from our past events.
              Each moment captures the essence of community, wine, and celebration that defines The Cork Conclave.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <EventCarousel
            images={galleryImages}
            autoplay={true}
            autoplayInterval={5000}
          />
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="card contact-card">
            <div>
              <p className="eyebrow">Join the Community</p>
              <h2 className="section-title">Be part of the next moment</h2>
              <p className="muted">
                Every gathering is a new story waiting to be told. Follow us on Instagram to stay updated on upcoming events and see more behind-the-scenes moments.
              </p>
            </div>
            <div className="cta-row">
              <a
                className="button"
                href={site.socials.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Follow on Instagram
              </a>
              <a
                className="button outline"
                href="/contact"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
