"use client";
import { useState } from "react";
import styles from "./brand.module.css";
import BrandTable from "@/component/table/brand/brandTable";
import { Spin } from "antd";

export default function Brand() {
  const [isLoading, setIsLoading] = useState(false);
  const contentStyle: React.CSSProperties = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };
  const content = <div style={contentStyle} />;

  return (
    <div>
      <title>Quản lý thương hiệu</title>
      {isLoading && (
        <div className={styles.loading}>
          <Spin tip="Loading" size="large">
            {content}
          </Spin>
        </div>
      )}
      <BrandTable setIsLoading={setIsLoading} />
    </div>
  );
}
