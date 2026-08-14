import { AppNavbar } from "components/Heading/app-navbar";

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppNavbar>{children}</AppNavbar>;
}
