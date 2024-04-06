"use client";
import { usePathname } from "next/navigation";
import styles from "./auth.module.css";
import { Container, Image } from "react-bootstrap";
import AppFooter from "@/components/appFooter";

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
