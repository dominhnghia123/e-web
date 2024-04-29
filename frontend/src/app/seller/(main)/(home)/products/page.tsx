"use client";
import ProductTable from "@/components/seller/table/product/productTable";
import styles from "./products.module.css";

export default function SellerProducts() {
  return (
    <div className={styles.page_container}>
      <ProductTable />
    </div>
  );
}
