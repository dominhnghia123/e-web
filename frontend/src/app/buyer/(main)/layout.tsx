import styles from "./main.module.css";
import AppFooter from "@/components/appFooter";
import AppHeader from "@/components/appHeader";
import AppSideBar from "@/components/appSideBar";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <AppHeader />
      <main className={styles.main}>
        <AppSideBar />
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
