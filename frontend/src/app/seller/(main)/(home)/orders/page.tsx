"use client";
import { useEffect, useState } from "react";
import styles from "./orders.module.css";
import axios from "axios";
import { getToken } from "@/app/helper/stogare";
import OrderTable from "@/components/seller/table/order/orderTable";

export default function SellerOrders() {
  return (
    <div className={styles.page_container}>
      <OrderTable />
    </div>
  );
}
