"use client";
import { Button } from "react-bootstrap";
import { BsCart4 } from "react-icons/bs";
import { FaShopify } from "react-icons/fa6";
import styles from "../app/app.module.css";
import Cookies from "js-cookie";
import { getStogare, removeStogare } from "@/app/helper/stogare";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function AppHeader() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userActive, setUserActive] = useState("");
  useEffect(() => {
    const userActiveCookie = Cookies.get("userActive");
    setUserActive(userActiveCookie || "");
  }, [router]);

  let username: string = "";
  const currentUserString = getStogare("currentUser")?.trim();
  if (currentUserString) {
    const currentUser = JSON.parse(currentUserString);
    username = currentUser?.username;
  }

  const [openOptionsMenu, setOpenOptionsMenu] = useState(false);
  const handleLogout = () => {
    setIsLoading(true);
    Cookies.remove("userActive");
    removeStogare("currentUser");
    router.replace("/");
  };

  return (
    <>
      {isLoading && <div className={styles.loading}></div>}
      <header className={styles.header}>
        <div className={styles.header__header_top}>
          <nav className={styles.header__header_top__nav_container}>
            <div className={styles.header__header_top__nav_container__left}>
              <a
                href="/seller/signin"
                className={styles.header__header_top__nav_container__left__link}
              >
                Kênh người bán
              </a>
              <a
                href="/seller/signup"
                className={styles.header__header_top__nav_container__left__link}
              >
                Trở thành người bán Shopify
              </a>
            </div>
            <div className={styles.header__header_top__nav_container__right}>
              {userActive !== "1" ? (
                <div>
                  <a
                    href="/buyer/signup"
                    className={
                      styles.header__header_top__nav_container__right__link
                    }
                  >
                    Đăng ký
                  </a>
                  <a
                    href="/buyer/signin"
                    className={
                      styles.header__header_top__nav_container__right__link
                    }
                  >
                    Đăng nhập
                  </a>
                </div>
              ) : (
                <div
                  className={
                    styles.header__header_top__nav_container__right__link_container
                  }
                >
                  <a
                    className={
                      styles.header__header_top__nav_container__right__link
                    }
                    onClick={() => setOpenOptionsMenu(!openOptionsMenu)}
                  >{`Hi, ${username}`}</a>
                  {openOptionsMenu && (
                    <div className={styles.options_menu_container}>
                      <a
                        className={styles.option_menu}
                        href="/user/account/profile"
                      >
                        Tài khoản của tôi
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
              )}
            </div>
          </nav>
        </div>
        <div className={styles.header__header_bottom}>
          <div className={styles.header__header_bottom__container}>
            <div
              className={styles.header__header_bottom__container__logo_section}
            >
              <FaShopify
                className={
                  styles.header__header_bottom__container__logo_section__logo
                }
              />
              <a
                href={userActive !== "1" ? "/" : "/buyer/home"}
                className={
                  styles.header__header_bottom__container__logo_section__link
                }
              >
                Shopify
              </a>
            </div>
            <div
              className={
                styles.header__header_bottom__container__search_section
              }
            >
              <form
                action="#"
                className={
                  styles.header__header_bottom__container__search_section__form
                }
              >
                <div
                  className={
                    styles.header__header_bottom__container__search_section__form__input_container
                  }
                >
                  <input
                    type="text"
                    placeholder="Search here..."
                    className={
                      styles.header__header_bottom__container__search_section__form__input_container__input
                    }
                  />
                  <Button
                    className={
                      styles.header__header_bottom__container__search_section__form__input_container__button
                    }
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>
            <BsCart4
              className={styles.header__header_bottom__container__cart_section}
            />
          </div>
        </div>
      </header>
    </>
  );
}
