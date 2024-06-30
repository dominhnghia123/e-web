"use client";
import {Button} from "react-bootstrap";
import styles from "./addNew.module.css";
import {DatePicker, DatePickerProps, Spin} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {useEffect, useState} from "react";
import {Autocomplete, TextField} from "@mui/material";
import axios, {AxiosError} from "axios";
import {getToken} from "@/app/helper/stogare";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";

export default function AddNewCoupon() {
  const token = getToken();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dataInput, setDataInput] = useState({
    userId: "",
    name: "",
    expiry: "2024-06-01",
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
    setDataInputError((prev) => ({
      ...prev,
      expiry: "",
    }));
  };

  const [userArray, setUserArray] = useState<IUser[]>([]);
  useEffect(() => {
    const getUsers = async () => {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/user/get-all-users`
      );
      setUserArray(data.users);
    };
    getUsers();
  }, []);

  const handleAddCoupon = async () => {
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/coupon/create-coupon`,
        {
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
        setIsLoading(true);
        router.replace("/admin/coupon");
      }
    } catch (error) {
      console.log(error);

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

  const contentStyle: React.CSSProperties = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };

  const content = <div style={contentStyle} />;

  return (
    <div>
      <title>Thêm mới khuyến mãi</title>
      {isLoading && (
        <div className={styles.loading}>
          <Spin tip="Loading" size="large">
            {content}
          </Spin>
        </div>
      )}
      <h2>Thêm mới khuyến mãi</h2>
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
              className={`${styles.button}`}
              onClick={() => handleAddCoupon()}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
