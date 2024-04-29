import HeaderSeller from "@/components/seller/header/headerSeller";
import styles from "./main.module.css";
import SideBarSeller from "@/components/seller/sideBar/sideBarSeller";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <HeaderSeller />
      <main className={styles.main}>
        <SideBarSeller />
        <div className={styles.children_container}>{children}</div>
      </main>
    </div>
  );
}
