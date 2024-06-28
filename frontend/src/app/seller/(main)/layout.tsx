"use client";
import HeaderSeller from "@/components/seller/header/headerSeller";
import styles from "./main.module.css";
import SideBarSeller from "@/components/seller/sideBar/sideBarSeller";
import {useState} from "react";

export default function SellerLayout({children}: {children: React.ReactNode}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={styles.container}>
      <HeaderSeller isLoading={isLoading} setIsLoading={setIsLoading} />
      <main className={styles.main}>
        <SideBarSeller setIsLoading={setIsLoading} />
        <div className={styles.children_container}>{children}</div>
      </main>
    </div>
  );
}
