"use client";
import AppFooter from "@/components/appFooter";
import AppHeader from "@/components/appHeader";
import styles from "./user.module.css";
import {Image} from "react-bootstrap";
import {RiAccountCircleLine} from "react-icons/ri";
import {FaShoppingBag} from "react-icons/fa";
import {usePathname} from "next/navigation";
import React, {createContext, useEffect, useState} from "react";
import axios from "axios";
import {getStogare, getToken} from "@/app/helper/stogare";
import {toast} from "react-toastify";

interface PageContextType {
  setIsChangeProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PageContext = createContext<PageContextType>({
  setIsChangeProfile: () => {}, // Default value
});

export default function AccountLayout({children}: {children: React.ReactNode}) {
  const pathname = usePathname();
  const currentUserString = getStogare("currentUser");
  const currentUser = JSON.parse(currentUserString);
  const token = getToken();
  //get profile
  const [profile, setProfile] = useState<IUser | any>({});
  const getProfile = async () => {
    const {data} = await axios.post(
      `${process.env.BASE_HOST}/user/get-a-user`,
      {
        _id: currentUser._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.status === true) {
      setProfile(data.user);
    }
    if (data.status === false) {
      toast.error(data.msg);
    }
  };
  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isChangeProfile, setIsChangeProfile] = useState<boolean | any>(false);
  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChangeProfile]);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={styles.container}>
      <title>Thông tin tài khoản</title>
      <AppHeader isLoading={isLoading} setIsLoading={setIsLoading} />
      <main className={styles.main}>
        <div className={styles.main_container}>
          <div className={styles.sidebar}>
            <div className={styles.avatar_username_container}>
              <Image
                src={profile.avatar ? profile.avatar : "/images/avatar.jpg"}
                alt=""
                className={styles.avatar}
              />
              <div className={styles.username}>{profile.username}</div>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.menu_container}>
              <div className={styles.account_container}>
                <div className={styles.title_container}>
                  <RiAccountCircleLine className={styles.icon} />
                  <a
                    className={styles.title_account}
                    href="/user/account/profile"
                    onClick={() => setIsLoading(true)}
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
                    onClick={() => setIsLoading(true)}
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
                    onClick={() => setIsLoading(true)}
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
                    onClick={() => setIsLoading(true)}
                  >
                    Đổi mật khẩu
                  </a>
                </div>
              </div>
              <div className={styles.order_container}>
                <FaShoppingBag className={styles.icon} />
                <a
                  className={
                    pathname.startsWith("/user/purchase")
                      ? `${styles.order} ${styles.focused}`
                      : `${styles.order}`
                  }
                  href="/user/purchase"
                  onClick={() => setIsLoading(true)}
                >
                  Đơn mua
                </a>
              </div>
            </div>
          </div>
          <div className={styles.content}>
            <PageContext.Provider value={{setIsChangeProfile}}>
              {children}
            </PageContext.Provider>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
