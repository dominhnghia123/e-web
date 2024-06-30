"use client";
import CouponTable from "@/component/table/coupon/couponTable";
import styles from "./coupon.module.css";
import { useState } from "react";
import { Spin } from "antd";

export default function Coupon() {
  const [isLoading, setIsLoading] = useState(false);
  const contentStyle: React.CSSProperties = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };
  const content = <div style={contentStyle} />;

  return (
    <div>
      <title>Quản lý khuyến mãi</title>
      {isLoading && (
        <div className={styles.loading}>
          <Spin tip="Loading" size="large">
            {content}
          </Spin>
        </div>
      )}
      <CouponTable setIsLoading={setIsLoading}/>
    </div>
  );
}
