"use client";
import {Button, Image} from "react-bootstrap";
import styles from "./register-seller.module.css";
import {Divider, Modal} from "antd";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {getStogare, getToken} from "../helper/stogare";
import axios, {AxiosError} from "axios";
import {toast} from "react-toastify";
import AppLoading from "@/components/appLoading";

export default function RegisterSellerPage() {
  const router = useRouter();
  const token = getToken();
  const [isLoading, setIsLoading] = useState(false);

  const currentUserString = getStogare("currentUser");
  let currentUser;
  if (currentUserString) {
    currentUser = JSON.parse(currentUserString);
  }

  const [isChecked, setIsChecked] = useState(false);
  const [dataInput, setDataInput] = useState({
    shopName: "",
    addressGetGoods: "",
    cccd: "",
    fullName: "",
  });
  const [dataInputError, setDataInputError] = useState({
    shopNameError: "",
    addressGetGoodsError: "",
    cccdError: "",
    fullNameError: "",
    checkedPolicy: "",
  });

  const handleOk = async () => {
    try {
      if (isChecked) {
        setIsLoading(true);
        const {data} = await axios.post(
          `${process.env.BASE_HOST}/requestSeller/send-request-become-seller`,
          {
            shopName: dataInput.shopName,
            addressGetGoods: dataInput.addressGetGoods,
            cccd: dataInput.cccd,
            fullName: dataInput.fullName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.status === true) {
          toast.success(data.msg);
          router.back();
        }
        if (data.status === false) {
          toast.error(data.msg);
        }
        setIsLoading(false);
      } else {
        setDataInputError((prev: any) => ({
          ...prev,
          checkedPolicy: "Vui lòng click chọn ô này trước khi đăng ký.",
        }));
      }
    } catch (error: any) {
      const err = error as AxiosError<{
        message: {property: string; message: string}[];
      }>;
      if (err.response?.data?.message) {
        err.response.data.message?.forEach((value) => {
          if (value.property === "shopName") {
            setDataInputError((prev: any) => ({
              ...prev,
              shopNameError: value.message,
            }));
          }
          if (value.property === "addressGetGoods") {
            setDataInputError((prev: any) => ({
              ...prev,
              addressGetGoodsError: value.message,
            }));
          }
          if (value.property === "cccd") {
            setDataInputError((prev: any) => ({
              ...prev,
              cccdError: value.message,
            }));
          }
          if (value.property === "fullName") {
            setDataInputError((prev: any) => ({
              ...prev,
              fullNameError: value.message,
            }));
          }
        });
      }
    }
  };

  return (
    <div className={styles.container}>
      {isLoading && <AppLoading />}
      <div className={styles.header}>
        <div className={styles.header_content}>
          <Image
            src="./images/shopify-icon.jpg"
            alt=""
            className={styles.image}
          />
          <div className={styles.text}>Đăng ký trở thành Người bán Shopify</div>
        </div>
      </div>
      <Divider />
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
              value={currentUser.email}
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
              value={currentUser.mobile}
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
                value={dataInput.shopName}
                onChange={(e) => {
                  setDataInput((prev) => ({
                    ...prev,
                    shopName: e.target.value,
                  }));
                  setDataInputError((prev) => ({
                    ...prev,
                    shopNameError: "",
                  }));
                }}
              />
              {dataInputError.shopNameError && (
                <span className={styles.text_warning}>
                  {dataInputError.shopNameError}
                </span>
              )}
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
                value={dataInput.addressGetGoods}
                onChange={(e) => {
                  setDataInput((prev) => ({
                    ...prev,
                    addressGetGoods: e.target.value,
                  }));
                  setDataInputError((prev) => ({
                    ...prev,
                    addressGetGoodsError: "",
                  }));
                }}
              />
              {dataInputError.addressGetGoodsError && (
                <span className={styles.text_warning}>
                  {dataInputError.addressGetGoodsError}
                </span>
              )}
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
                value={dataInput.cccd}
                onChange={(e) => {
                  setDataInput((prev) => ({
                    ...prev,
                    cccd: e.target.value,
                  }));
                  setDataInputError((prev) => ({
                    ...prev,
                    cccdError: "",
                  }));
                }}
              />
              {dataInputError.cccdError && (
                <span className={styles.text_warning}>
                  {dataInputError.cccdError}
                </span>
              )}
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
                value={dataInput.fullName}
                onChange={(e) => {
                  setDataInput((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }));
                  setDataInputError((prev) => ({
                    ...prev,
                    fullNameError: "",
                  }));
                }}
              />
              {dataInputError.fullNameError && (
                <span className={styles.text_warning}>
                  {dataInputError.fullNameError}
                </span>
              )}
            </div>
          </div>
          <div className={styles.policy_container}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => {
                setIsChecked(!isChecked);
                setDataInputError((prev) => ({
                  ...prev,
                  checkedPolicy: "",
                }));
              }}
            />
            <div>
              Tôi xác nhận tất cả dữ liệu đã cung cấp là chính xác và trung
              thực. Tôi đã đọc và đồng ý với{" "}
              <span className={styles.policy_container__text_red}>
                Điều khoản dịch vụ
              </span>{" "}
              &{" "}
              <span className={styles.policy_container__text_red}>
                Chính sách bảo mật
              </span>{" "}
              của Shopify.
            </div>
          </div>
          {dataInputError.checkedPolicy && (
            <span className={styles.text_warning}>
              {dataInputError.checkedPolicy}
            </span>
          )}
          <div className={`${styles.button_container} ${styles.back}`}>
            <Button
              className={`${styles.button} ${styles.back}`}
              onClick={() => {
                setIsLoading(true);
                router.back();
              }}
            >
              Quay lại
            </Button>
            <Button
              className={`${styles.button} ${styles.register}`}
              onClick={() => handleOk()}
            >
              Đăng ký bán hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
