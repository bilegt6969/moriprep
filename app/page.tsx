import Navbar from "components/Heading/Navbar";
import CTA from "./components/CTA";
import { DSATShowcase } from "./components/DSATShowcase";
import DetailsSection from "./components/DetailsSection";
import { Explore } from "./components/Explore";
import { Faq } from "./components/Faq";
import FeaturesSection from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import SecurityFeatureSection from "./components/Security";
import { SendReceiveSwap } from "./components/SendReceiveSwap";
import LatestFromFamily from "./components/Testimonials";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar
        siteName="Mori Prep"
        categories={[
          { label: "Practice", href: "/practice" },
          { label: "Lessons", href: "/resources" },
          { label: "History", href: "/history" },
          { label: "Leaderboard", href: "/leaderboard" },
        ]}
        showBanner={false}
      />
      <Hero />
      <Explore />
      <SendReceiveSwap />
      <FeaturesSection />
      <DSATShowcase />
      <SecurityFeatureSection />
      {/* <Onboarding /> */}
      <DetailsSection />
      <LatestFromFamily />
      <Faq />
      <CTA />
      <Footer />
    </main>
  );
}
