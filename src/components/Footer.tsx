import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer mt-5 pt-5">
      <div className="container footer-grid">
        <div>
          <p className="logo">{site.name}</p>
          <p className="muted">
           A community of people in Ibadan who love wine and who love life. 

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
