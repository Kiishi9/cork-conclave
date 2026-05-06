import Image from "next/image";
import Link from "next/link";
import { Camera, Mail, MapPin, Video, Wine } from "lucide-react";
import { site } from "@/lib/site";

function ContactCard({
  href,
  icon,
  title,
  value,
  external,
}: {
  href?: string;
  icon: React.ReactNode;
  title: string;
  value: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <div className="flex size-14 items-center justify-center rounded-full border border-white/5 bg-cork-plum text-cork-coral shadow-lg transition-transform group-hover:scale-110">
        {icon}
      </div>
      <div>
        <h3 className="mb-1 font-medium tracking-wide text-cork-cream">{title}</h3>
        <p className="text-sm font-light text-cork-blush">{value}</p>
      </div>
    </>
  );

  const cls =
    "group flex items-center gap-6 rounded-2xl border border-white/5 bg-cork-plum-light/30 p-5 transition-all duration-300 hover:border-white/10 hover:bg-cork-plum-light/60";

  if (!href) return <div className={cls}>{inner}</div>;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {inner}
      </a>
    );
  }

  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

function DirectEmailCard({ email }: { email: string }) {
  return (
    <a
      href={`mailto:${email}`}
      className="group relative flex flex-col items-start gap-6 overflow-hidden rounded-2xl border border-cork-coral/30 bg-cork-plum-light/50 p-8 shadow-lg transition-all duration-300 hover:border-cork-coral/60 hover:bg-cork-plum-light/80"
    >
      <div className="absolute inset-0 bg-linear-to-br from-cork-coral/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 flex items-center gap-6">
        <div className="flex size-16 items-center justify-center rounded-full border border-cork-coral/20 bg-cork-plum text-cork-coral shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-cork-coral group-hover:text-cork-cream">
          <Mail className="size-8" strokeWidth={1.5} aria-hidden />
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold font-serif tracking-widest text-cork-cream uppercase opacity-80">
            Direct Email
          </h3>
          <p className="mb-2 text-xl font-medium text-cork-coral transition-colors duration-300 group-hover:text-cork-cream sm:text-2xl">
            {email}
          </p>
          <p className="text-sm font-light text-cork-blush">For inquiries, collaborations, and support</p>
        </div>
      </div>
    </a>
  );
}

export default function Page() {
  const email = site.contact.email;
  const location = `${site.contact.city}, ${site.contact.country}`;

  return (
    <section className="relative w-full overflow-hidden pt-32 pb-32">
      <div className="relative z-10 mx-auto grid max-w-7xl items-start gap-16 px-6 lg:grid-cols-2 lg:px-12">
        <div className="flex flex-col gap-10">
          <div>
            <div className="mb-6 inline-flex items-center gap-3">
              <div className="h-px w-8 bg-cork-coral" />
              <span className="text-xs font-semibold tracking-widest text-cork-blush uppercase">Contact Us</span>
            </div>

            <h1 className="mb-6 font-serif text-5xl leading-[1.1] font-medium tracking-tight text-cork-cream sm:text-6xl lg:text-[5rem]">
              Get in Touch
            </h1>
            <p className="max-w-md text-xl leading-relaxed font-light text-cork-blush">
              Questions, collaborations, or just want to say hi? Reach out directly or connect with us on social.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <DirectEmailCard email={email} />
            <ContactCard
              href={site.socials.instagram}
              external
              title="Instagram"
              value="@thecorkconclave"
              icon={<Camera className="size-6" strokeWidth={1.5} aria-hidden />}
            />
            <ContactCard
              href={site.socials.tiktok}
              external
              title="TikTok"
              value="@thecorkconclave"
              icon={<Video className="size-6" strokeWidth={1.5} aria-hidden />}
            />
            <ContactCard
              title="Location"
              value={location}
              icon={<MapPin className="size-6" strokeWidth={1.5} aria-hidden />}
            />
          </div>

          <p className="border-l-2 border-cork-coral/30 py-1 pl-4 text-sm text-cork-blush italic">
            &quot;Follow our community and stay updated on upcoming conclaves.&quot;
          </p>
        </div>

        <div className="relative flex h-full flex-col justify-center lg:mt-8">
          <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-linear-to-br from-cork-coral/20 to-transparent opacity-40 blur-2xl" />

          <div className="group relative aspect-4/5 w-full overflow-hidden rounded-4xl border border-white/10 shadow-2xl lg:aspect-3/4">
            <div className="absolute inset-0 z-10 bg-linear-to-t from-cork-plum via-cork-plum/40 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-70" />
            <Image
              src="/images/gallery/IMG_0837.jpg"
              alt="Wine pouring"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center scale-105 transition-transform duration-1000 ease-out group-hover:scale-100"
              priority
            />

            <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-4 p-10 transition-transform duration-700 ease-out group-hover:translate-y-0 md:p-12">
              <div className="mb-6 flex size-14 items-center justify-center rounded-full border border-cork-coral/30 bg-cork-coral/20 backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
                <Wine className="size-8 text-cork-coral" strokeWidth={1.25} aria-hidden />
              </div>
              <h3 className="mb-3 font-serif text-3xl text-cork-cream">A lifestyle community</h3>
              <p className="max-w-sm text-base leading-relaxed font-light text-cork-blush">
                For those who appreciate good wine, great company, and meaningful connections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
