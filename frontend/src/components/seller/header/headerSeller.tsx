"use client";
import { FaShopify } from "react-icons/fa6";
import styles from "./header.module.css";
import Cookies from "js-cookie";
import { getStogare, removeStogare } from "@/app/helper/stogare";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HeaderSeller() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const currentUserString = getStogare("currentUser")?.trim();
    if (currentUserString) {
      setCurrentUser(JSON.parse(currentUserString));
    }
  }, []);

  const [openOptionsMenu, setOpenOptionsMenu] = useState(false);
  const handleLogout = () => {
    setIsLoading(true);
    Cookies.remove("userActive");
    Cookies.remove("refreshToken");
    removeStogare("currentUser");
    router.replace("/");
  };

  return (
    <>
      {isLoading && <div className={styles.loading}></div>}
      <header className={styles.header}>
        <div className={styles.header__content}>
          <div className={styles.header__content__left}>
            <FaShopify className={styles.header__content__left__logo} />
            <a href="/seller" className={styles.header__content__left__link}>
              Shopify
            </a>
          </div>
          <div className={styles.header__content__right}>
            {currentUser ? (
              <a
                className={styles.header__content__right__link}
                onClick={() => setOpenOptionsMenu(!openOptionsMenu)}
              >{`Hi, ${currentUser?.username}`}</a>
            ) : (
              <a className={styles.header__content__right__link}>{`Hi, `}</a>
            )}
            {openOptionsMenu && (
              <div className={styles.options_menu_container}>
                <a href="/buyer" className={styles.option_menu}>
                  Kênh người mua
                </a>
                <a
                  className={styles.option_menu}
                  onClick={() => handleLogout()}
                >
                  Đăng xuất
                </a>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
