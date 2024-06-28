"use client";
import {FaShopify} from "react-icons/fa6";
import styles from "./header.module.css";
import Cookies from "js-cookie";
import {getStogare, removeStogare} from "@/app/helper/stogare";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Spin} from "antd";

interface IProps {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export default function HeaderSeller(props: IProps) {
  const {isLoading, setIsLoading} = props;
  const router = useRouter();

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

  const contentStyle: React.CSSProperties = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };

  const content = <div style={contentStyle} />;

  return (
    <>
      {isLoading && (
        <div className={styles.loading_container}>
          <div className={styles.loading}>
            <Spin tip="Loading" size="large">
              {content}
            </Spin>
          </div>
        </div>
      )}

      <header className={styles.header}>
        <div className={styles.header__content}>
          <div className={styles.header__content__left}>
            <FaShopify className={styles.header__content__left__logo} />
            <a
              href="/seller"
              className={styles.header__content__left__link}
              onClick={() => setIsLoading(true)}
            >
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
                <a
                  href="/buyer"
                  className={styles.option_menu}
                  onClick={() => setIsLoading(true)}
                >
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
