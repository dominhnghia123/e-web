"use client";
import styles from "../addNew/addNew.module.css";
import {Button} from "react-bootstrap";
import {DatePicker, DatePickerProps} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {useEffect, useState} from "react";
import {Autocomplete, TextField} from "@mui/material";
import axios, {AxiosError} from "axios";
import {getToken} from "@/app/helper/stogare";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
export default function ViewDetailCoupon({params}: {params: {id: string}}) {
  const token = getToken();
  const router = useRouter();
  const [dataInput, setDataInput] = useState({
    userId: "",
    name: "",
    expiry: "",
    discount: "",
  });
  const [dataInputError, setDataInputError] = useState({
    userId: "",
    name: "",
    expiry: "",
    discount: "",
  });
  dayjs.extend(customParseFormat);
  const dateFormat = "YYYY-MM-DD";
  const handleChangeExpiry: DatePickerProps["onChange"] = (
    date,
    dateString
  ) => {
    setDataInput((prev) => ({...prev, expiry: dateString.toString()}));
  };

  const [userArray, setUserArray] = useState<IUser[]>([]);
  useEffect(() => {
    const getUsers = async () => {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/user/get-all-users`
      );
      setUserArray(data.users);
    };
    const getCoupon = async () => {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/coupon/get-a-coupon`,
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
        setDataInput({
          userId: data.coupon.userId,
          name: data.coupon.name,
          expiry: data.coupon.expiry,
          discount: data.coupon.discount,
        });
      }
    };
    getUsers();
    getCoupon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateCoupon = async () => {
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/coupon/update-coupon`,
        {
          _id: params.id[0],
          userId: dataInput.userId,
          name: dataInput.name,
          expiry: dataInput.expiry,
          discount: dataInput.discount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        toast.success(data.msg);
        router.replace("/admin/coupon");
      }
    } catch (error) {
      const err = error as AxiosError<{
        message: {property: string; message: string}[];
      }>;
      if (err.response?.data?.message) {
        err.response.data.message?.forEach((value) => {
          if (value.property === "userId") {
            setDataInputError((prev: any) => ({
              ...prev,
              userId: value.message,
            }));
          }
          if (value.property === "name") {
            setDataInputError((prev: any) => ({
              ...prev,
              name: value.message,
            }));
          }
          if (value.property === "expiry") {
            setDataInputError((prev: any) => ({
              ...prev,
              expiry: value.message,
            }));
          }
          if (value.property === "discount") {
            setDataInputError((prev: any) => ({
              ...prev,
              discount: value.message,
            }));
          }
        });
      }
    }
  };

  const handleDeleteCoupon = async () => {
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/coupon/delete-a-coupon`,
        {
          _id: params.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        router.replace("/admin/coupon");
        toast.success(data.msg);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onKeyDown = (event: any) => {
    if (event.key === "-") {
      event.preventDefault();
    }
  };

  return (
    <div>
      <title>Chi tiết khuyến mãi</title>
      <h2>Thông tin khuyến mãi</h2>
      <div className={styles.main}>
        <div className={styles.main_content}>
          <div className={styles.input_label_container}>
            <label htmlFor="" className={styles.label}>
              Tên voucher *
            </label>
            <div className={styles.input_container}>
              <input
                type="text"
                placeholder="Tên voucher"
                className={styles.input}
                value={dataInput.name}
                onChange={(e) => {
                  setDataInput((prev) => ({...prev, name: e.target.value}));
                  setDataInputError((prev) => ({
                    ...prev,
                    name: "",
                  }));
                }}
              />
              {dataInputError.name && (
                <span className={styles.text_warning}>
                  {dataInputError.name}
                </span>
              )}
            </div>
          </div>
          <div className={styles.input_label_container}>
            <label htmlFor="" className={styles.label}>
              Ngày hết hạn *
            </label>
            <div className={styles.input_container}>
              <DatePicker
                value={
                  dataInput.expiry
                    ? dayjs(dataInput.expiry, dateFormat)
                    : dayjs("2024-06-01")
                }
                minDate={dayjs("2024-06-01", dateFormat)}
                maxDate={dayjs("2025-12-31", dateFormat)}
                onChange={handleChangeExpiry}
              />
              {dataInputError.expiry && (
                <span className={styles.text_warning}>
                  {dataInputError.expiry}
                </span>
              )}
            </div>
          </div>
          <div className={styles.input_label_container}>
            <label htmlFor="" className={styles.label}>
              Giảm giá *
            </label>
            <div className={styles.input_container}>
              <input
                type="number"
                placeholder="Lượng giảm giá"
                className={styles.input}
                max={100}
                min={0}
                onKeyDown={onKeyDown}
                value={dataInput.discount}
                onChange={(e) => {
                  setDataInput((prev) => ({
                    ...prev,
                    discount: e.target.value,
                  }));
                  setDataInputError((prev) => ({
                    ...prev,
                    discount: "",
                  }));
                }}
              />
              {dataInputError.discount && (
                <span className={styles.text_warning}>
                  {dataInputError.discount}
                </span>
              )}
            </div>
          </div>
          <div className={styles.input_label_container}>
            <label htmlFor="" className={styles.label}>
              Người được hưởng *
            </label>
            <div className={styles.input_container}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={
                  userArray?.map((user) => ({
                    label: user.username,
                    id: user._id,
                  })) ?? []
                }
                sx={{width: 370}}
                renderInput={(params) => (
                  <TextField {...params} label="Chọn user" />
                )}
                value={
                  userArray?.find((user) => user._id === dataInput.userId)
                    ?.username || null
                }
                onChange={(event: any, newValue: any) => {
                  setDataInput((prev) => ({
                    ...prev,
                    userId: newValue ? newValue.id : "",
                  }));
                  setDataInputError((prev) => ({
                    ...prev,
                    userId: "",
                  }));
                }}
              />
              {dataInputError.userId && (
                <span className={styles.text_warning}>
                  {dataInputError.userId}
                </span>
              )}
            </div>
          </div>
          <div className={`${styles.button_container}`}>
            <Button
              className={`${styles.button} ${styles.button_delete}`}
              onClick={() => handleDeleteCoupon()}
            >
              Xóa
            </Button>
            <Button
              className={`${styles.button}`}
              onClick={() => handleUpdateCoupon()}
            >
              Lưu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
