"use client";

import {getToken} from "@/app/helper/stogare";
import axios from "axios";
import {useContext, useEffect, useState} from "react";
import styles from "./notifycation.module.css";
import {Button} from "react-bootstrap";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {PageContext} from "../../layout";
import { Spin } from "antd";

export default function Notifycation({params}: {params: {id: string}}) {
  const {setUpdateNoti} = useContext(PageContext);
  const token = getToken();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [request, setRequest] = useState<any>();
  useEffect(() => {
    const getDetailRequest = async () => {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/requestSeller/get-detail-request`,
        {
          _id: params.id[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        setRequest(data.request);
      }
    };
    getDetailRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefuseRequest = async () => {
    try {
      setIsLoading(true);
      setUpdateNoti(false);
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/requestSeller/refuse-request-become-seller`,
        {
          _id: params.id[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        toast.success(data.msg);
        router.replace("/admin");
        setUpdateNoti(true);
      }
      if (data.status === false) {
        toast.error(data.msg);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleAcceptRequest = async () => {
    try {
      setIsLoading(true);
      setUpdateNoti(false);
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/requestSeller/accept-request-become-seller`,
        {
          _id: params.id[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        toast.success(data.msg);
        router.replace("/admin");
        setUpdateNoti(true);
      }
      if (data.status === false) {
        toast.error(data.msg);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const contentStyle: React.CSSProperties = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };

  const content = <div style={contentStyle} />;

  return (
    <div>
      {isLoading && (
        <div className={styles.loading}>
          <Spin tip="Loading" size="large">
            {content}
          </Spin>
        </div>
      )}
      <h2>Thông tin chi tiết</h2>
      <title>Thông báo</title>
      <div className={styles.main}>
        <div className={styles.main_content}>
          <div className={styles.input_label_container}>
            <label htmlFor="" className={styles.label}>
              Email *
            </label>
            <input
              type="email"
              placeholder="Địa chỉ email"
              className={styles.input}
              value={request?.userId?.email || ""}
              disabled
            />
          </div>
          <div className={styles.input_label_container}>
            <label htmlFor="" className={styles.label}>
              Số điện thoại *
            </label>
            <input
              type="text"
              placeholder="Số điện thoại"
              className={styles.input}
              value={request?.userId?.mobile || ""}
              disabled
            />
          </div>
          <div className={styles.input_label_container}>
            <label htmlFor="" className={styles.label}>
              Tên shop *
            </label>
            <div className={styles.input_container}>
              <input
                type="text"
                placeholder="Tên shop"
                className={styles.input}
                value={request?.shopName || ""}
                disabled
              />
            </div>
          </div>
          <div className={styles.input_label_container}>
            <label htmlFor="" className={styles.label}>
              Địa chỉ lấy hàng *
            </label>
            <div className={styles.input_container}>
              <input
                type="text"
                placeholder="Địa chỉ lấy hàng"
                className={styles.input}
                value={request?.addressGetGoods || ""}
                disabled
              />
            </div>
          </div>
          <div className={styles.input_label_container}>
            <label htmlFor="" className={styles.label}>
              Số CCCD *
            </label>
            <div className={styles.input_container}>
              <input
                type="text"
                placeholder="Số căn cước công dân"
                className={styles.input}
                value={request?.cccd || ""}
                disabled
              />
            </div>
          </div>
          <div className={styles.input_label_container}>
            <label htmlFor="" className={styles.label}>
              Họ & tên *
            </label>
            <div className={styles.input_container}>
              <input
                type="text"
                placeholder="Họ & tên theo CCCD"
                className={styles.input}
                value={request?.fullName || ""}
                disabled
              />
            </div>
          </div>
          <div className={`${styles.button_container}`}>
            <Button
              className={`${styles.button} ${styles.refuse}`}
              onClick={() => handleRefuseRequest()}
            >
              Từ chối
            </Button>
            <Button
              className={`${styles.button} ${styles.accept}`}
              onClick={() => handleAcceptRequest()}
            >
              Đồng ý
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
