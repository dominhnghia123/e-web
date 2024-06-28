"use client";
import {usePathname} from "next/navigation";
import styles from "./sideBar.module.css";

interface IProps {
  setIsLoading: (value: boolean) => void;
}

export default function SideBarSeller(props: IProps) {
  const {setIsLoading} = props;
  const pathname = usePathname();

  return (
    <div className={styles.sideBar}>
      <div className={styles.sideBar__container}>
        <div className={styles.title}>Quản lý bán hàng</div>
        <div className={styles.options}>
          <a
            href="/seller"
            className={`${styles.options__link} ${
              pathname === "/seller" ? styles.options__link_focus : ""
            }`}
            onClick={() => setIsLoading(true)}
          >
            Trang chủ
          </a>
        </div>
        <div className={styles.options}>
          <a
            href="/seller/products"
            className={`${styles.options__link} ${
              pathname.startsWith("/seller/products")
                ? styles.options__link_focus
                : ""
            }`}
            onClick={() => setIsLoading(true)}
          >
            Sản phẩm
          </a>
        </div>
        <div className={styles.options}>
          <a
            href="/seller/orders"
            className={`${styles.options__link} ${
              pathname.startsWith("/seller/orders")
                ? styles.options__link_focus
                : ""
            }`}
            onClick={() => setIsLoading(true)}
          >
            Đơn hàng
          </a>
        </div>
      </div>
    </div>
  );
}
