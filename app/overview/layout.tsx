"use client";

import { AppNavbar } from "components/Heading/app-navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppNavbar>{children}</AppNavbar>;
}
