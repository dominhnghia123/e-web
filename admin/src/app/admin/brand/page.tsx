"use client";
import styles from "./brand.module.css";
import BrandTable from "@/component/table/brand/brandTable";

export default function Brand() {
  return (
    <div className={styles.page_container}>
      <title>Quản lý thương hiệu</title>
      <BrandTable />
    </div>
  );
}
