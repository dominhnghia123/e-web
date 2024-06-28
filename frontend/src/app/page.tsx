"use client";
import styles from "./app.module.css";
import AppHeader from "@/components/appHeader";
import AppFooter from "@/components/appFooter";
import AppSideBar from "@/components/appSideBar";
import AppContent from "@/components/appContent";
import {useState} from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={styles.container}>
      <AppHeader isLoading={isLoading} setIsLoading={setIsLoading} />
      <main className={styles.main}>
        <AppSideBar setIsLoading={setIsLoading} />
        <AppContent />
      </main>
      <AppFooter />
    </div>
  );
}
