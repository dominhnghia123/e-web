"use client";
import { usePathname } from "next/navigation";
import styles from "./cart.module.css";
import { Container } from "react-bootstrap";
import AppFooter from "@/components/appFooter";
import AppHeader from "@/components/appHeader";

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className={styles.container}>
      <AppHeader />
      <main className={styles.main}>
        <div className={styles.main_container}>{children}</div>
      </main>
      <AppFooter />
    </div>
  );
}
