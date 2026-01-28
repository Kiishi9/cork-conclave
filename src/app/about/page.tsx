import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how The Cork Conclave curates immersive tastings and collaborations across Cork City.",
  alternates: {
    canonical: `${site.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Our Story</p>
            <h1 className="hero-title">We Love Wine</h1>
            <p className="hero-subtitle">
One evening, two young women asked each other - why don’t westart a club to bring together all the people in Ibadan who love wine? And thus The Cork Conclave was born.  
Little did they know the ripple effects of that little decision. Since its debut in November 2024, the Cork Conclave has met monthly, uniting a very diverse group of people under a singular concept: Wine!
            </p>
          </div>
          <div className="hero-panel">
            <h2 className="section-title">Why we gather</h2>
            <p className="muted">
            We like to say that the point of Cork Conclave is an excuse to hangout with friends and drink wine. And while that is true, it is not the whole truth. The Cork Conclave has quickly become a staple of the Ibadan social community, the place to go relax and have fun after a long month of work or academics. We gather to remind ourselves that there is joy to be had in the little things, even if it is just a glass of wine. 
            </p>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="grid three">
            <div className="card">
              <h3>Intentional details</h3>
              <p className="muted">
                We obsess over ambiance, sound, and menu flow to make every
                evening feel transportive.
              </p>
            </div>
            <div className="card">
              <h3>Local collaborations</h3>
              <p className="muted">
                From Cork chefs to floral studios, we spotlight talent
                throughout the region.
              </p>
            </div>
            <div className="card">
              <h3>Community first</h3>
              <p className="muted">
                Our gatherings are curated yet welcoming, inviting both
                collectors and new enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
