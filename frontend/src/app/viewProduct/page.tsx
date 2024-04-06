import AppHeader from "@/components/appHeader";
import styles from "./viewProduct.module.css";
import AppFooter from "@/components/appFooter";

export default function ViewProduct() {
  return (
    <div className={styles.container}>
      <AppHeader />
      <main className={styles.main}>product</main>
      <AppFooter />
    </div>
  );
}
