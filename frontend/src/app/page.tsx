"use client";
import styles from "./app.module.css";
import AppHeader from "@/components/appHeader";
import AppFooter from "@/components/appFooter";
import AppSideBar from "@/components/appSideBar";
import AppContent from "@/components/appContent";

export default function Home() {
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
