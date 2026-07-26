"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";
import { app_routes } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-cork-plum pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="flex flex-col items-start md:col-span-5">
            <Link
              href={app_routes.home}
              className="mb-4 text-xl font-medium tracking-[0.15em] text-cork-cream uppercase"
            >
              The Cork Conclave
            </Link>
            <p className="max-w-sm text-sm leading-relaxed font-light text-cork-blush">
              A lifestyle community in Ibadan for those who appreciate good wine, great company, and meaningful
              connections.
            </p>
          </div>

          <div className="flex flex-col gap-12 sm:flex-row sm:gap-24 md:col-span-4 md:col-start-7">
            <div className="flex flex-col gap-4">
              <span className="mb-2 text-xs font-semibold tracking-widest text-cork-cream uppercase">Navigation</span>
              <Link
                href={app_routes.home}
                className="text-sm font-light text-cork-blush transition-colors hover:text-cork-coral"
              >
                Home
              </Link>

              <Link
                href={app_routes.about}
                className="text-sm font-light text-cork-blush transition-colors hover:text-cork-coral"
              >
                About
              </Link>

              <Link
                href={app_routes.past_conclaves}
                className="text-sm font-light text-cork-blush transition-colors hover:text-cork-coral"
              >
                Past Conclaves
              </Link>

              <Link
                href={app_routes.gallery}
                className="text-sm font-light text-cork-blush transition-colors hover:text-cork-coral"
              >
                Gallery
              </Link>

              <Link
                href={app_routes.wines}
                className="text-sm font-light text-cork-blush transition-colors hover:text-cork-coral"
              >
                Wines
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              <span className="mb-2 text-xs font-semibold tracking-widest text-cork-cream uppercase">Connect</span>
              <Link
                href={app_routes.contact}
                className="text-sm font-light text-cork-blush transition-colors hover:text-cork-coral"
              >
                Contact
              </Link>
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-light text-cork-blush transition-colors hover:text-cork-coral"
              >
                Instagram
                <ArrowUpRight className="size-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p className="text-xs font-light text-cork-blush/60">
            © {new Date().getFullYear()} The Cork Conclave. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs font-light text-cork-blush/60 transition-colors hover:text-cork-cream">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs font-light text-cork-blush/60 transition-colors hover:text-cork-cream">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
