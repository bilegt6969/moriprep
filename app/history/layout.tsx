"use client";

import { AppNavbar } from "components/Heading/app-navbar";

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppNavbar>{children}</AppNavbar>;
}
