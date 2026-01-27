import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <p className="logo">{site.name}</p>
          <p className="muted">
            A gathering space for cork enthusiasts, collectors, and curious
            creatives across Cork City.
          </p>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <div className="grid">
            <Link className="nav-link" href="/about">
              About
            </Link>
            <Link className="nav-link" href="/events">
              Events
            </Link>
            <Link className="nav-link" href="/gallery">
              Gallery
            </Link>
            <Link className="nav-link" href="/contact">
              Contact
            </Link>
          </div>
        </div>
        <div>
          <p className="eyebrow">Connect</p>
          <div className="grid">
            <a className="nav-link" href={`mailto:${site.contact.email}`}>
              Email
            </a>
            <a
              className="nav-link"
              href={site.socials.instagram}
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              className="nav-link"
              href={site.socials.tiktok}
              target="_blank"
              rel="noreferrer"
            >
              TikTok
            </a>
            <p className="muted">
              {site.contact.city}, {site.contact.country}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
