"use client";
import { usePathname } from "next/navigation";
import styles from "./auth.module.css";
import { Container, Image } from "react-bootstrap";
import { FaShopify } from "react-icons/fa";
import AppFooter from "@/components/appFooter";

export default function BuyerLayout({
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
              {pathname === "/buyer/signin" ? "Đăng nhập" : "Đăng ký"}
            </div>
          </div>
          <a href="#" className={styles.nav_content__right}>
            Bạn cần giúp đỡ?
          </a>
        </div>
      </nav>
      <main className={styles.main}>
        <div className={styles.main_container}>
          <div className={styles.main_container__content_left}>
            <FaShopify
              className={styles.main_container__content_left__logo_shops}
            />
            <div className={styles.main_container__content_left__brand}>
              ShopS
            </div>
            <div className={styles.main_container__content_left__text}>
              Nền tảng thương mại điện tử số 1 Việt Nam
            </div>
          </div>
          <Container className={styles.main_container__children}>
            {children}
          </Container>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
