"use client";
import { usePathname } from "next/navigation";
import styles from "./auth.module.css";
import { Container, Image } from "react-bootstrap";
import { BiLogoShopify } from "react-icons/bi";
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
              <Image
                src="/images/shopify-icon.jpg"
                alt="avatar"
                height={35}
                width={35}
                style={{ borderRadius: "50px" }}
              />
              <a href="/" className={styles.nav_content__left__shopify}>
                Shopify
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
            <BiLogoShopify
              className={styles.main_container__content_left__logo_shopify}
            />
            <div className={styles.main_container__content_left__brand}>
              SHOPIFY
            </div>
            <div className={styles.main_container__content_left__text}>
              Nền tảng thương mại điện tử yêu thích ở Đông Nam Á & Đài Loan
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
