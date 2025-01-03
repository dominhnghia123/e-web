"use client";
import { usePathname } from "next/navigation";
import styles from "./auth.module.css";
import { Container, Image } from "react-bootstrap";
import AppFooter from "@/components/appFooter";
import { FaShopify } from "react-icons/fa";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.nav_content}>
          <div className={styles.nav_content__left}>
            <div className={styles.nav_content__left__title}>
              <FaShopify
                className={styles.main_container__content_header__logo_shops}
              />
              <a href="/" className={styles.nav_content__left__shops}>
                ShopS
              </a>
            </div>
            <div className={styles.nav_content__left__signin}>
              {pathname === "/seller/signin" ? "Kênh người bán" : "Đăng ký"}
            </div>
          </div>
          <a href="#" className={styles.nav_content__right}>
            Bạn cần giúp đỡ?
          </a>
        </div>
      </nav>
      <Container className={styles.main}>{children}</Container>
      <AppFooter />
    </div>
  );
}
