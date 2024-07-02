"use client";
import {useState} from "react";
import styles from "./orders.module.css";
import OrderTable from "@/components/seller/table/order/orderTable";
import {Spin} from "antd";

export default function SellerOrders() {
  const [isLoading, setIsLoading] = useState(false);
  const contentStyle: React.CSSProperties = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };
  const content = <div style={contentStyle} />;

  return (
    <div className={styles.page_container}>
      {isLoading && (
        <div className={styles.loading}>
          <Spin tip="Loading" size="large">
            {content}
          </Spin>
        </div>
      )}
      <OrderTable setIsLoading={setIsLoading} />
    </div>
  );
}
