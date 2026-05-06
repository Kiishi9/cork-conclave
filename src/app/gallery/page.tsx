"use client";

import { site } from "@/lib/site";
import Image from "next/image";
import { useEffect, useState, type KeyboardEvent } from "react";
import { app_routes } from "@/lib/constants";

// All gallery images
const images = [
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

export default function Page() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!lightboxOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "ArrowLeft") goToPrev();
  };
  return (
    <>
      <section className="relative w-full overflow-hidden pt-32 pb-24">
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 lg:px-12">
          <div className="inline-flex items-center gap-3">
            <div className="h-px w-8 bg-cork-coral" />
            <span className="text-xs font-semibold tracking-widest text-cork-blush uppercase">Gallery</span>
          </div>
          <h2 className="mb-2 font-serif text-4xl font-medium tracking-tight text-cork-cream lg:text-5xl">
            Atmosphere, captured
          </h2>

          <p className="max-w-2xl text-lg leading-relaxed font-light text-cork-blush">
            A collection of mood, texture, and storytelling from our past events. Each moment captures the essence of
            community, wine, and celebration that defines The Cork Conclave.
          </p>
        </div>
      </section>

      <section className="bg-cork-plum-light/30 py-24 lg:px-24">
        <div className="columns-1 md:gap-4 sm:columns-2 xl:columns-3 2xl:columns-4 px-6 lg:px-24">
          {images.map(({ alt, url }, index) => (
            <div
              key={index}
              onClick={() => openLightbox(index)}
              className="gallery-item after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image
                alt={alt}
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                src={url}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
              <div className="gallery-item-overlay">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </div>
            </div>
          ))}
        </div>

        {lightboxOpen && (
          <div
            className="lightbox"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
          >
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close lightbox">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <button
              className="lightbox-nav lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              aria-label="Previous image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <Image
                src={images[currentIndex].url}
                alt={images[currentIndex].alt}
                width={1920}
                height={1080}
                style={{
                  objectFit: "contain",
                  width: "auto",
                  height: "auto",
                  maxWidth: "100%",
                  maxHeight: "90vh",
                }}
                quality={90}
                priority
              />
            </div>

            <button
              className="lightbox-nav lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>

            <div className="lightbox-counter">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        )}
      </section>

      <section className="relative py-24">
        <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-full w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-cork-coral opacity-[0.08] blur-[120px]" />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
          <h2 className="mb-6 font-serif text-4xl font-medium tracking-tight text-cork-cream lg:text-5xl">
            Join the Community
          </h2>
          <div className="mx-auto mb-10 max-w-2xl space-y-4 text-lg leading-relaxed font-light text-cork-blush">
            <p>Be part of the next moment</p>
            <p>
              Every gathering is a new story waiting to be told. Follow us on Instagram to stay updated on upcoming
              events and see more behind-the-scenes moments.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-cork-coral px-8 py-4 text-sm font-medium tracking-wide text-cork-white transition-all duration-300 hover:bg-cork-coral-hover"
            >
              Follow on Instagram
            </a>

            <a
              href={app_routes.contact}
              className="inline-flex items-center justify-center gap-2 border border-white/20 bg-transparent px-8 py-3.5 text-sm font-medium tracking-wide text-cork-cream transition-all duration-300 hover:bg-white/5"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
