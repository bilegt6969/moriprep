import Footer from "components/Heading/Footer";
import Navbar from "components/Heading/Navbar";
import { EducationHero } from "components/home/education-hero";
import { MoriPrepSections } from "components/home/mori-prep-sections";

export default function HomePage() {
  return (
    <>
      <Navbar siteName="Mori Prep" categories={[]} />
      <EducationHero />
      <MoriPrepSections />
      <Footer siteName="Mori Prep" />
    </>
  );
}
