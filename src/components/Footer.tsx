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
          <div className="footer-links">
            <Link className="nav-link" href="/about">
              About
            </Link>
            <Link className="nav-link" href="/gallery">
              Gallery
            </Link>
            <Link className="nav-link" href="/contact">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
