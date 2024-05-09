"use client";
import CouponTable from "@/component/table/coupon/couponTable";
import styles from "./coupon.module.css";

export default function Coupon() {
  return (
    <div className={styles.page_container}>
      <title>Quản lý khuyến mãi</title>
      <CouponTable />
    </div>
  );
}
