import Image from "next/image";
import { ArrowRight, Camera, MailOpen, Sparkles, Users, Wine } from "lucide-react";
import { site } from "@/lib/site";
import { Suspense } from "react";
import EventSkeleton from "./_components/EventSkeleton";
import Event from "./_components/Event";
import PastEventsSection from "./_components/PastEventsSection";
import { app_routes } from "@/lib/constants";

export default function Page() {
  return (
    <>
      <section className="relative flex min-h-[90vh] w-full items-center overflow-hidden pt-12 pb-24 lg:pt-0 lg:pb-0">
        <div className="pointer-events-none absolute top-0 right-0 h-full w-1/3 opacity-20 mix-blend-overlay">
          <Image
            src="/images/gallery/IMG_0844.jpg"
            alt=""
            fill
            className="cork-fade-in object-cover"
            sizes="33vw"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-l from-transparent to-cork-plum" />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-12 lg:gap-8 lg:px-12">
          <div className="flex flex-col items-start gap-8 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-cork-blush backdrop-blur-sm">
              <span className="size-1.5 animate-pulse rounded-full bg-cork-coral" />
              Ibadan&apos;s Premier Wine Community
            </div>

            <h1 className="font-serif text-5xl leading-[1.1] font-medium tracking-tight text-cork-cream sm:text-6xl lg:text-7xl xl:text-[5rem]">
              The Cork <br />
              <em className="font-light text-cork-blush not-italic">Conclave</em>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed font-light text-cork-blush md:text-xl">
              A community of young people who use wine as an excuse to build a community. Join us monthly at fun
              evenings curated for connection, enjoyment, and relaxation.
            </p>

            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
              <a
                href="#join"
                className="inline-flex items-center justify-center gap-2 bg-cork-coral px-8 py-3.5 text-sm font-medium tracking-wide text-cork-white transition-all duration-300 hover:bg-cork-coral-hover"
              >
                Join the Next Conclave
                <ArrowRight className="size-5" strokeWidth={1.5} />
              </a>
              <a
                href="#past-events"
                className="inline-flex items-center justify-center gap-2 border border-white/20 bg-transparent px-8 py-3.5 text-sm font-medium tracking-wide text-cork-cream transition-all duration-300 hover:bg-white/5"
              >
                Explore Past Conclaves
              </a>
            </div>
          </div>

          <Suspense fallback={<EventSkeleton />}>
            <Event />
          </Suspense>
        </div>
      </section>

      <section id="curate" className="bg-cork-plum-light/30 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-serif text-3xl font-medium tracking-tight text-cork-cream md:text-4xl">
              Moments worth savoring
            </h2>
            <div className="mx-auto h-px w-12 bg-cork-coral" />
          </div>

          <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
            {[
              {
                icon: Wine,
                title: "Wine and laughter",
                body: "Evenings filled with good wine to help you shrug off the stress and relax. Over here, we’re all about the good life.",
              },
              {
                icon: Users,
                title: "Community",
                body: "We are not a wine club. We are a community of people who love wine, and love life. We come together every month to bask in our shared interests.",
              },
              {
                icon: Sparkles,
                title: "A culture of sharing",
                body: "At The Cork Conclave, everyone shows up with a bottle, to give the others a glimpse into who you are. And along with that, we share stories and joy.",
              },
            ].map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className={`flex flex-col items-center gap-4 p-6 text-center transition-transform duration-500 hover:-translate-y-1 ${i === 1 ? "delay-100" : ""} ${i === 2 ? "delay-200" : ""}`}
              >
                <div className="mb-2 flex size-16 items-center justify-center rounded-full border border-white/5 bg-cork-plum text-cork-coral">
                  <Icon className="size-8" strokeWidth={1.25} />
                </div>
                <h3 className="text-xl font-medium tracking-tight text-cork-cream">{title}</h3>
                <p className="text-sm leading-relaxed font-light text-cork-blush">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col items-start gap-8">
            <div className="inline-flex items-center gap-3">
              <div className="w-8 h-px bg-[#c84b5c]"></div>
              <span className="text-xs uppercase tracking-widest text-[#d6c0bc] font-semibold">Our Story</span>
            </div>

            <h2 className="font-serif text-4xl lg:text-5xl tracking-tight font-medium text-[#fbf8f1] leading-tight">
              More than wine
            </h2>

            <p className="text-lg md:text-xl font-serif italic text-[#d6c0bc] leading-relaxed">
              &quot;The Cork Conclave is not a wine club. It’s a community built around shared moments, good
              conversations, and the simple joy of gathering.&quot;
            </p>

            <div className="space-y-6 text-[#d6c0bc] text-base font-light leading-relaxed">
              <p>
                We started with a simple question — why don’t we bring together people in Ibadan who love wine and good
                company? What followed was something much bigger than we imagined.
              </p>
              <p>
                Since then, The Cork Conclave has grown into a monthly ritual. A gathering of different people,
                different stories, and one shared intention — to connect.
              </p>
            </div>

            <a
              href={app_routes.about}
              className="inline-flex items-center gap-2 text-sm text-[#fbf8f1] hover:text-[#c84b5c] transition-colors font-medium border-b border-[#c84b5c] hover:border-transparent pb-1 mt-2"
            >
              Read our story
              <ArrowRight className="size-4" />
            </a>
          </div>

          <div className="relative w-full lg:ml-auto lg:max-w-lg">
            <div className="absolute -inset-1 bg-linear-to-br from-[#c84b5c]/20 to-transparent rounded-2xl blur-xl opacity-50 pointer-events-none"></div>

            <div className="relative backdrop-blur-xl border border-white/10 rounded-xl p-10 lg:p-12 shadow-2xl flex flex-col gap-8 bg-[#3d1b28]/80">
              <h3 className="font-serif text-3xl font-medium tracking-tight text-[#fbf8f1] border-b border-white/5 pb-6">
                Why we gather
              </h3>
              <div className="space-y-6 text-[#d6c0bc] text-base font-light leading-relaxed">
                <p>
                  We gather to slow down. To step away from the noise of everyday life and enjoy the little things —
                  laughter, stories, music, and a good glass of wine.
                </p>
                <p>
                  The Cork Conclave has become a space where strangers become familiar, and familiar faces become
                  friends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PastEventsSection />

      <section id="gallery" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-serif text-3xl font-medium tracking-tight text-cork-cream md:text-4xl">
              A glimpse of the mood
            </h2>
            <p className="text-sm font-light text-cork-blush">Captured moments from our community.</p>
          </div>

          <div className="grid auto-rows-[200px] grid-cols-2 gap-4 md:auto-rows-[250px] md:grid-cols-4 md:gap-6">
            <div className="relative col-span-2 row-span-2 overflow-hidden rounded-xl group">
              <Image
                src="/images/gallery/DSC02330.jpg"
                alt="Gallery"
                fill
                className="cork-fade-in object-cover brightness-90 transition-transform duration-700 group-hover:scale-105 group-hover:brightness-100"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            <div className="relative col-span-1 row-span-1 hidden overflow-hidden rounded-xl group md:block">
              <Image
                src="/images/gallery/IMG_0826.jpg"
                alt="Gallery"
                fill
                className="object-cover brightness-90 transition-transform duration-700 group-hover:scale-105 group-hover:brightness-100"
                sizes="25vw"
              />
            </div>
            <div className="relative col-span-1 row-span-1 hidden overflow-hidden rounded-xl group md:block">
              <Image
                src="/images/gallery/20251115_191738.jpg"
                alt="Gallery"
                fill
                className="object-cover brightness-90 transition-transform duration-700 group-hover:scale-105 group-hover:brightness-100"
                sizes="25vw"
              />
            </div>
            <div className="relative col-span-2 row-span-1 overflow-hidden rounded-xl group md:col-span-2">
              <Image
                src="/images/gallery/DSC02446.jpg"
                alt="Gallery"
                fill
                className="object-cover brightness-90 transition-transform duration-700 group-hover:scale-105 group-hover:brightness-100"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href={app_routes.gallery}
              className="inline-flex items-center justify-center gap-2 border border-white/20 bg-transparent px-8 py-3 text-sm font-medium tracking-wide text-cork-cream transition-all duration-300 hover:bg-white/5"
            >
              Explore Full Gallery
            </a>
          </div>
        </div>
      </section>

      <section id="join" className="relative overflow-hidden py-32">
        <div className="absolute inset-0 z-0 bg-cork-plum-light" />
        <div className="absolute top-1/2 left-1/2 z-0 h-full w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-cork-coral opacity-[0.08] blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <MailOpen className="mx-auto mb-6 size-10 text-cork-coral" strokeWidth={1.25} />
          <h2 className="mb-6 font-serif text-4xl font-medium tracking-tight text-cork-cream lg:text-5xl">
            Become part of the community
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed font-light text-cork-blush md:text-lg">
            The Cork Conclave community is built on shared experiences. Attend one of our gatherings, meet fellow
            corkheads, and become part of the inner circle. Stay updated through our visual diary.
          </p>
          <a
            href={site.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-cork-coral px-8 py-4 text-sm font-medium tracking-wide text-cork-white transition-all duration-300 hover:bg-cork-coral-hover"
          >
            <Camera className="size-5" strokeWidth={1.5} />
            Follow on Instagram
          </a>
        </div>
      </section>
    </>
  );
}
