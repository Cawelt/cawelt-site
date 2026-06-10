import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Services from "@/components/sections/Services";
import FeaturedWork from "@/components/sections/FeaturedWork";
import ProcessSection from "@/components/sections/ProcessSection";
import CTA from "@/components/sections/CTA";
import Manifesto from "@/components/sections/Manifesto";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Manifesto />
      <Services />
      <FeaturedWork />
      <ProcessSection />
      <CTA />
    </>
  );
}
