"use client";
import styles from "./app.module.css";
import AppHeader from "@/components/appHeader";
import AppFooter from "@/components/appFooter";
import AppSideBar from "@/components/appSideBar";
import AppContent from "@/components/appContent";

export default function Home() {
  const arr = new Array(25).fill(1);
  return (
    <div className={styles.container}>
      <AppHeader />
      <main className={styles.main}>
        <AppSideBar />
        <AppContent />
      </main>
      <AppFooter />
    </div>
  );
}
