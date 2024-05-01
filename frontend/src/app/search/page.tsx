"use client";
import AppHeader from "@/components/appHeader";
import styles from "./search.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Image } from "react-bootstrap";

export default function SearchPage() {
  const arr = new Array(10).fill(1);
  const router = useRouter();
  const [userActive, setUserActive] = useState("");
  useEffect(() => {
    const userActiveCookie = Cookies.get("userActive");
    setUserActive(userActiveCookie || "");
  }, [router]);
  return (
    <div className={styles.container}>
      <AppHeader />
      <div className={styles.main_content}>
        <div className={styles.main_content__container}>
          <div className={styles.text}>
            Kết quả tìm kiếm cho từ khóa "<span>sad</span>"
          </div>
          <div className={styles.products_pagination}>
            <div className={styles.products}>
              {arr.map((item, index) => {
                return (
                  <a className={styles.product_container} key={index} href="#">
                    <div className={styles.product_container__image}>
                      <Image
                        src="/images/iphone15.jpg"
                        alt=""
                        style={{ height: "100%", width: "100%" }}
                      />
                    </div>
                    <div className={styles.product_container__desc}>
                      <div className={styles.product_container__desc__title}>
                        iphone 15
                      </div>
                      <div
                        className={styles.product_container__desc__price_sold}
                      >
                        <div className={styles.price}>100 vnđ</div>
                        <div className={styles.sold}>Đã bán 20</div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
            <div className={styles.pagination_container}>pagination</div>
          </div>
        </div>
      </div>
    </div>
  );
}
