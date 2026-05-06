import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wine } from "lucide-react";

export default function Page() {
  return (
    <>
      <section className="bg-cork-plum-light/30 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-12">
          <div className="flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-3">
              <div className="h-px w-8 bg-cork-coral" />
              <span className="text-xs font-semibold tracking-widest text-cork-blush uppercase">Our Story</span>
            </div>

            <div className="space-y-6 text-lg leading-relaxed font-light text-cork-blush">
              <h1 className="max-w-4xl font-serif text-5xl leading-[1.1] font-medium tracking-tight text-cork-cream sm:text-6xl lg:text-[5rem]">
                We Love Wine
              </h1>

              <p className="max-w-2xl text-lg leading-relaxed font-light text-cork-blush">
                One evening, two young women asked each other - why don&apos;t we start a club to bring together all the
                people in Ibadan who love wine? And thus The Cork Conclave was born.
              </p>

              <p className="max-w-2xl text-lg leading-relaxed font-light text-cork-blush">
                Little did they know the ripple effects of that little decision. Since its debut in November 2024, the
                Cork Conclave has met monthly, uniting a very diverse group of people under a singular concept: Wine!
              </p>
            </div>
          </div>

          <div className="group relative h-125 overflow-hidden rounded-2xl border border-white/10">
            <iframe
              src="https://www.youtube.com/embed/-a1OnlDesRY?si=mWcJywS0sgDQh5Y_"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute inset-0 bg-linear-to-t from-cork-plum to-transparent opacity-60" />
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden pt-32 pb-24">
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 lg:px-12">
          <h2 className="mb-2 font-serif text-4xl font-medium tracking-tight text-cork-cream lg:text-5xl">
            Why we gather
          </h2>

          <p className="max-w-2xl text-lg leading-relaxed font-light text-cork-blush">
            We like to say that the point of Cork Conclave is an excuse to hangout with friends and drink wine. And
            while that is true, it is not the whole truth. The Cork Conclave has quickly become a staple of the Ibadan
            social community, the place to go relax and have fun after a long month of work or academics. We gather to
            remind ourselves that there is joy to be had in the little things, even if it is just a glass of wine.
          </p>
        </div>
      </section>

      <section className="bg-cork-plum-light/30 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-4xl font-medium tracking-tight text-cork-cream lg:text-5xl">
              Meet the curators
            </h2>
            <div className="mx-auto mt-6 h-px w-12 bg-cork-coral" />
          </div>

          <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
            <CuratorCard
              name="Kiishi"
              image="/images/kiishi.jpeg"
              alt="Kiishi - Cork Conclave Co-founder"
              bio="When Kiishi is not drinking wine and making her women happy, she is building products that change the world."
            />
            <CuratorCard
              className="md:mt-16"
              name="Joe"
              image="/images/Joe.jpeg"
              alt="Joe - Cork Conclave Co-founder"
              bio="Joe likes wine just as much as she likes a million other weird things, and she writes just to keep the money flowing in."
            />
          </div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-cork-plum/50 p-10 text-center backdrop-blur-md md:p-16">
            <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-cork-coral opacity-[0.05] blur-[100px]" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <h2 className="mb-8 font-serif text-4xl font-medium tracking-tight text-cork-cream lg:text-5xl">
                Where we meet
              </h2>
              <div className="mb-10 space-y-6 text-lg leading-relaxed font-light text-cork-blush">
                <p className="font-serif text-xl font-medium text-cork-cream italic">
                  &quot;We don’t belong to one place — and that’s the point.&quot;
                </p>
                <p>
                  At The Cork Conclave, we are nomads. We believe that there is so much out there to be experienced and
                  we go searching for it. We meet in homes just as much as we meet in restaurants, art galleries, parks,
                  theatres and a host of other public spaces. Would you like to host us? Shoot us an email at
                  <a href="mailto:thecorkconclave@gmail.com" className="pl-1 text-cork-coral-hover">
                    thecorkconclave@gmail.com
                  </a>
                </p>
              </div>
              <Link
                href="mailto:thecorkconclave@gmail.com"
                className="inline-flex items-center justify-center gap-2 border border-white/20 bg-transparent px-8 py-3.5 text-sm font-medium tracking-wide text-cork-cream transition-all duration-300 hover:bg-white/5"
              >
                Host a Conclave
                <ArrowRight className="size-5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cork-plum-light/30 py-24">
        <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-full w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-cork-coral opacity-[0.08] blur-[120px]" />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
          <Wine className="mb-6 size-10 text-cork-coral" strokeWidth={1.25} />
          <h2 className="mb-6 font-serif text-4xl font-medium tracking-tight text-cork-cream lg:text-5xl">
            Come as you are
          </h2>
          <div className="mx-auto mb-10 max-w-2xl space-y-4 text-lg leading-relaxed font-light text-cork-blush">
            <p>You don’t need to be a wine expert. You don’t need to know anyone. Just show up.</p>
            <p>This is a space for curiosity, for connection, and for people who simply want to enjoy the moment.</p>
          </div>
          <Link
            href="/event"
            className="inline-flex items-center justify-center gap-2 bg-cork-coral px-8 py-4 text-sm font-medium tracking-wide text-cork-white transition-all duration-300 hover:bg-cork-coral-hover"
          >
            Join the next Conclave
            <ArrowRight className="size-5" strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </>
  );
}

function CuratorCard({
  name,
  image,
  bio,
  className = "",
  alt,
}: {
  name: string;
  image: string;
  bio: string;
  className?: string;
  alt: string;
}) {
  return (
    <article className={`group flex flex-col gap-6 ${className}`}>
      <div className="relative h-100 overflow-hidden rounded-xl border border-white/5 md:h-125">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="cork-fade-in object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-cork-plum/20 transition-colors duration-500 group-hover:bg-transparent" />
      </div>
      <div>
        <h3 className="mb-3 font-serif text-2xl font-medium tracking-tight text-cork-cream">{name}</h3>
        <p className="leading-relaxed font-light text-cork-blush">{bio}</p>
      </div>
    </article>
  );
}
