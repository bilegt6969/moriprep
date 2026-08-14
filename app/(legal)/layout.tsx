import { ReactNode } from "react";
import { Footer } from "../components/Footer";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
