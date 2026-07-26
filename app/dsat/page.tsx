import Footer from "components/Heading/Footer";
import Navbar from "components/Heading/Navbar";
import { DSATHero } from "components/dsat/dsat-hero";
import { DSATPracticeCards } from "components/dsat/dsat-practice-cards";
import { DSATStats } from "components/dsat/dsat-stats";

export default function DSATPage() {
  return (
    <>
      <Navbar siteName="Byte" categories={[]} />
      <DSATHero />
      <DSATPracticeCards />
      <DSATStats />
      <Footer siteName="Byte" />
    </>
  );
}
