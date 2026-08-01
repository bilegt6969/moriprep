import Footer from "components/Heading/Footer";
import { ReactNode } from "react";

const siteName = "Mori Prep";

export default function InfoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Footer siteName={siteName} />
    </>
  );
}
