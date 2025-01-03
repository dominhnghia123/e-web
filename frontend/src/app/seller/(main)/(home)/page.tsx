"use client";
import ColumnChart from "@/components/seller/chart/ColumnChart";
import styles from "./home.module.css";
import LineChart from "@/components/seller/chart/LineChart";
import axios from "axios";
import {getToken} from "@/app/helper/stogare";
import {useEffect, useState} from "react";

export default function Seller() {
  const token = getToken();

  const [monthlySales, setMonthlySales] = useState<[]>([]);
  const calculateMonthlySales = async () => {
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/cart/calculate-monthly-sales-by-seller`,
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

  const [totalProducts, setTotalProducts] = useState();
  const countProducts = async () => {
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/product/count-products-by-seller`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        setTotalProducts(data.countProducts);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [countOrderByStatus, setCountOrderByStatus] = useState({
    notShippedYet: 0,
    shipping: 0,
    shipped: 0,
  });
  const [countOrderForEachMonth, setCountOrderForEachMonth] = useState<[]>([]);
  const countOrdersBySeller = async () => {
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/cart/count-orders-by-seller`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        setCountOrderByStatus({
          notShippedYet: data.notShippedYet,
          shipping: data.shipping,
          shipped: data.shipped,
        });
        setCountOrderForEachMonth(data.countOrderForEachMonth);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    calculateMonthlySales();
    countProducts();
    countOrdersBySeller();
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
      title: "Tổng sản phẩm",
      content: totalProducts,
    },
    {
      id: 3,
      title: "Chờ xác nhận",
      content: countOrderByStatus.notShippedYet,
    },
    {
      id: 4,
      title: "Đang vận chuyển",
      content: countOrderByStatus.shipping,
    },
    {
      id: 5,
      title: "Đã hoàn thành",
      content: countOrderByStatus.shipped,
    },
  ];

  return (
    <div className={styles.homepage_container}>
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
