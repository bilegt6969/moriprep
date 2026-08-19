"use client";

import { AppNavbar } from "components/Heading/app-navbar";

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppNavbar>{children}</AppNavbar>;
}
