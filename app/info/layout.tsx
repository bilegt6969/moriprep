import { ReactNode } from "react";
import { Footer } from "../components/Footer";

export default function InfoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
