"use client";
import styles from "./main.module.css";
import AppFooter from "@/components/appFooter";
import AppHeader from "@/components/appHeader";
import AppSideBar from "@/components/appSideBar";
import { useState } from "react";

export default function BuyerLayout({children}: {children: React.ReactNode}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={styles.container}>
      <AppHeader isLoading={isLoading} setIsLoading={setIsLoading} />
      <main className={styles.main}>
      <AppSideBar setIsLoading={setIsLoading} />
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
