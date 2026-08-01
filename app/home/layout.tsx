import AppNavbar from "components/Heading/app-navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNavbar
        siteName="Bytecode"
        categories={[
          { label: "Home", href: "/home" },
          { label: "Practice", href: "/practice" },
          { label: "Lessons", href: "/lessons" },
          { label: "Analytics", href: "/analytics" },
        ]}
      />
      {children}
    </>
  );
}
