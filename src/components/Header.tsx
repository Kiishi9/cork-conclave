import Link from "next/link";
import { site } from "@/lib/site";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="header">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="container header-inner">
        <Link className="logo" href="/">
          The Cork Conclave
        </Link>
        <nav className="nav" aria-label="Primary">
          {navLinks.map((link) => (
            <Link className="nav-link" key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <a
          className="button outline mobile-only"
          href={site.socials.instagram}
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </a>
      </div>
    </header>
  );
}
