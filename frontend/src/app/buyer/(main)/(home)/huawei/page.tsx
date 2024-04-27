"use client";
import AppContent from "@/components/appContent";
import { usePathname } from "next/navigation";

export default function HuaweiPage() {
  const pathname = usePathname();

  return <AppContent brand={pathname.split("/")[2]} />;
}
