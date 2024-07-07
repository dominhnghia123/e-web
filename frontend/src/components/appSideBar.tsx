"use client";
import {usePathname} from "next/navigation";
import styles from "../app/app.module.css";
import axios from "axios";
import {useEffect, useState} from "react";

interface IProps {
  setIsLoading?: (value: boolean) => void;
}

export default function AppSideBar(props: IProps) {
  const pathname = usePathname();

  const [brands, setBrands] = useState<IBrand[]>([]);
  useEffect(() => {
    const getBrands = async () => {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/brand/get-all-brands`
      );
      if (data.status === true) {
        setBrands(data.brands);
      }
    };
    getBrands();
  }, []);

  const listBrands = brands.map((brand, index) => {
    return {
      id: index + 1,
      name: brand.name,
      url: brand.url,
    };
  });
  return (
    <div className={styles.sideBar}>
      <div className={styles.sideBar__container}>
        <div className={styles.title}>Danh mục</div>
        <div className={styles.options}>
          <a
            href={pathname === "/" ? "/" : "/buyer"}
            className={`${styles.options__link} ${
              pathname === "/" || pathname === "/buyer"
                ? styles.options__link_focus
                : ""
            }`}
            onClick={() => props.setIsLoading?.(true)}
          >
            Tất cả
          </a>
        </div>
        {listBrands.length ? (
          listBrands.map((brand) => {
            return (
              <div className={styles.options} key={brand.id}>
                <a
                  href={`/buyer/${brand.url}`}
                  className={`${styles.options__link} ${
                    pathname === `/buyer/${brand.url}`
                      ? styles.options__link_focus
                      : ""
                  }`}
                  onClick={() => props.setIsLoading?.(true)}
                >
                  {brand.name}
                </a>
              </div>
            );
          })
        ) : (
          <div style={{height: "300px"}}></div>
        )}
      </div>
    </div>
  );
}
