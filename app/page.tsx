"use client";

import { EducationHero } from "@/components/home/education-hero";
import Footer from "components/Heading/Footer";
import Navbar from "components/Heading/Navbar";
import { MoriPrepSections } from "components/home/mori-prep-sections";

export default function HomePage() {
  return (
    <>
      <Navbar siteName="Mori Prep" categories={[]} showBanner={true} />
      <div className="pt-0">
        <EducationHero />
        <MoriPrepSections />
      </div>
      <Footer siteName="Mori Prep" />
    </>
  );
}
