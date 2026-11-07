"use client";

import { auth } from "@/lib/firebase";
import Navbar from "components/Heading/Navbar";
import type { Auth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Script from "next/script";
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
  const router = useRouter();

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth as Auth, (user) => {
      // Don't redirect from landing page - let user choose where to go
      // if (user) {
      //   router.push("/overview");
      // }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <>
      <Script
        id="home-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Mori Prep",
            url: "https://moriprep.xyz",
            logo: "https://moriprep.xyz/logo.png",
            description: "Mori Prep is a free, non-profit learning platform helping students prepare for the Digital SAT and develop the skills to create, innovate, and solve problems.",
            founders: [
              {
                "@type": "Person",
                name: "Bilegt Amartuvshin",
                image: "https://moriprep.xyz/people/bilegt-amartuvshin.jpg",
                jobTitle: "Co-Founder",
                description: "Co-founder of Mori Prep, building free education for Mongolia",
              },
              {
                "@type": "Person",
                name: "Gundsambuu Ganzil",
                image: "https://moriprep.xyz/people/Gundsambuu.png",
                jobTitle: "Co-Founder",
                description: "Co-founder of Mori Prep, building free education for Mongolia",
              },
            ],
            sameAs: ["https://moriprep.xyz"],
          }),
        }}
      />
      <Navbar
        siteName="Mori Prep"
        categories={[
          { label: "Practice", href: "/question-rush" },
          { label: "Lessons", href: "/resources" },
          { label: "History", href: "/history" },
          { label: "Leaderboard", href: "/leaderboard" },
        ]}
        showBanner={false}
      />
      <main className="min-h-screen">
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
    </>
  );
}
