"use client";
import LineChart from "@/component/chart/LineChart";
import styles from "./admin.module.css";
import ColumnChart from "@/component/chart/ColumnChart";
import {getToken} from "../helper/stogare";
import axios from "axios";
import {useEffect, useState} from "react";

export default function Admin() {
  const token = getToken();

  const [monthlySales, setMonthlySales] = useState<[]>([]);
  const calculateMonthlySales = async () => {
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/cart/calculate-monthly-sales`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        setMonthlySales(data.totalSales);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [totalUsers, setTotalUsers] = useState(0);
  const countUsers = async () => {
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/user/count-users`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        setTotalUsers(data.countUsers);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [totalOrders, setTotalOrders] = useState(0);
  const [countOrderForEachMonth, setCountOrderForEachMonth] = useState<[]>([]);
  const countOrders = async () => {
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/cart/count-all-orders`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        setTotalOrders(data.countAllOrders);
        setCountOrderForEachMonth(data.countOrderForEachMonth);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [totalProducts, setTotalProducts] = useState(0);
  const countProducts = async () => {
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/product/count-all-products`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        setTotalProducts(data.countAllProducts);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    calculateMonthlySales();
    countUsers();
    countOrders();
    countProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSalesAllMonth = monthlySales.reduce(
    (total, item: any) => total + item.totalSales,
    0
  );

  const listDash = [
    {
      id: 1,
      title: "Doanh thu",
      content: `${Number(totalSalesAllMonth).toLocaleString("vi-VN")} VND`,
    },
    {
      id: 2,
      title: "Tổng người dùng",
      content: totalUsers,
    },
    {
      id: 3,
      title: "Tổng đơn hàng",
      content: totalOrders,
    },
    {
      id: 4,
      title: "Tổng sản phẩm",
      content: totalProducts,
    },
  ];

  return (
    <div className={styles.homepage_container}>
      <title>Tổng quan hệ thống</title>
      <h2 className={styles.overview_title}>Tổng quan</h2>
      <div className={styles.listdash_section}>
        {listDash.map((dash) => {
          return (
            <div key={dash.id} className={styles.dash_container}>
              <div className={styles.dash_title}>{dash.title}</div>
              <div className={styles.dash_content}>{dash.content}</div>
            </div>
          );
        })}
      </div>
      <div className={styles.sales_container}>
        <h2 className={styles.overview_title}>Thống kê doanh thu</h2>
        <LineChart monthlySales={monthlySales} />
      </div>
      <div className={styles.orders_container}>
        <h2 className={styles.overview_title}>Thống kê đơn hàng</h2>
        <ColumnChart countOrderForEachMonth={countOrderForEachMonth} />
      </div>
    </div>
  );
}
