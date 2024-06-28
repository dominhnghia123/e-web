"use client";
import styles from "./orders.module.css";
import OrderTable from "@/components/seller/table/order/orderTable";

export default function SellerOrders() {
  return (
    <div className={styles.page_container}>
      <OrderTable />
    </div>
  );
}
