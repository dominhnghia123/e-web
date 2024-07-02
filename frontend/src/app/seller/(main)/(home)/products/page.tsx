"use client";
import ProductTable from "@/components/seller/table/product/productTable";
import styles from "./products.module.css";
import { Spin } from "antd";
import { useState } from "react";

export default function SellerProducts() {
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
      <ProductTable setIsLoading={setIsLoading} />
    </div>
  );
}
