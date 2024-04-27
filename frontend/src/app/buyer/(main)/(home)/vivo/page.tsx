"use client";
import AppContent from "@/components/appContent";
import { usePathname } from "next/navigation";

export default function VivoPage() {
  const pathname = usePathname();

  return <AppContent brand={pathname.split("/")[2]} />;
}
