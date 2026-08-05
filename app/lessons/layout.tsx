import Footer from "components/Heading/Footer";
import AppNavbar from "components/Heading/app-navbar";

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNavbar
        siteName="Mori Prep"
        categories={[
          { label: "Home", href: "/home" },
          { label: "Practice", href: "/practice" },
          { label: "Lessons", href: "/lessons" },
          { label: "Analytics", href: "/analytics" },
        ]}
      />
      {children}
      <Footer siteName="Mori Prep" />
    </>
  );
}
