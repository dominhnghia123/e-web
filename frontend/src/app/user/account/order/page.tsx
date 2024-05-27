"use client";
import OrderTable from "@/components/table/order/orderTable";
import styles from "./order.module.css";

export default function Order() {
    return (
        <div className={styles.page_container}>
            <OrderTable />
        </div>
    )
}