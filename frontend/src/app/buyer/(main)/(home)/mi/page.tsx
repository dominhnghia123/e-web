"use client";
import AppContent from "@/components/appContent";
import { usePathname } from "next/navigation";

export default function MiPage() {
  const pathname = usePathname();

  return <AppContent brand={pathname.split("/")[2]} />;
}
