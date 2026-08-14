import CTA from "./components/CTA";
import { DSATShowcase } from "./components/DSATShowcase";
import { Explore } from "./components/Explore";
import { Faq } from "./components/Faq";
import FeaturesSection from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import Onboarding from "./components/Onboarding";
import SecurityFeatureSection from "./components/Security";
import { SendReceiveSwap } from "./components/SendReceiveSwap";
import LatestFromFamily from "./components/Testimonials";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Explore />
      <SendReceiveSwap />
      <FeaturesSection />
      <DSATShowcase />
      <SecurityFeatureSection />
      <Onboarding />
      <LatestFromFamily />
      <Faq />
      <CTA />
      <Footer />
    </main>
  );
}
