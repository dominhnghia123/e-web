"use client";
import AppFooter from "@/components/appFooter";
import AppHeader from "@/components/appHeader";
import styles from "./account.module.css";
import { Image } from "react-bootstrap";
import { RiAccountCircleLine } from "react-icons/ri";
import { FaShoppingBag } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className={styles.container}>
      <title>Thông tin tài khoản</title>
      <AppHeader />
      <main className={styles.main}>
        <div className={styles.main_container}>
          <div className={styles.sidebar}>
            <div className={styles.avatar_username_container}>
              <Image
                src="/images/avatar.jpg"
                alt=""
                className={styles.avatar}
              />
              <div className={styles.username}>username</div>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.menu_container}>
              <div className={styles.account_container}>
                <div className={styles.title_container}>
                  <RiAccountCircleLine className={styles.icon} />
                  <a
                    className={styles.title_account}
                    href="/user/account/profile"
                  >
                    Tài khoản của tôi
                  </a>
                </div>
                <div className={styles.options_account}>
                  <a
                    className={
                      pathname === "/user/account/profile"
                        ? `${styles.option} ${styles.focused}`
                        : `${styles.option}`
                    }
                    href="/user/account/profile"
                  >
                    Hồ sơ
                  </a>
                  <a
                    className={
                      pathname === "/user/account/address"
                        ? `${styles.option} ${styles.focused}`
                        : `${styles.option}`
                    }
                    href="/user/account/address"
                  >
                    Địa chỉ
                  </a>
                  <a
                    className={
                      pathname === "/user/account/changePassword"
                        ? `${styles.option} ${styles.focused}`
                        : `${styles.option}`
                    }
                    href="/user/account/changePassword"
                  >
                    Đổi mật khẩu
                  </a>
                </div>
              </div>
              <div className={styles.order_container}>
                <FaShoppingBag className={styles.icon} />
                <a className={styles.order} href="/user/account/profile">
                  Đơn mua
                </a>
              </div>
            </div>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
