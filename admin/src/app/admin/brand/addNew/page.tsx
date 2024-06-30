"use client";
import {Button} from "react-bootstrap";
import styles from "./addNew.module.css";
import {useState} from "react";
import axios, {AxiosError} from "axios";
import {getToken} from "@/app/helper/stogare";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {Spin} from "antd";

export default function AddNewBrand() {
  const token = getToken();
  const router = useRouter();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleAddBrand = async () => {
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/brand/create-brand`,
        {
          name: name,
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
        router.replace("/admin/brand");
      }
    } catch (error) {
      const err = error as AxiosError<{
        message: {property: string; message: string}[];
      }>;
      if (err.response?.data?.message) {
        err.response.data.message?.forEach((value) => {
          if (value.property === "name") {
            setNameError(value.message);
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
      <title>Thêm mới thương hiệu</title>
      {isLoading && (
        <div className={styles.loading}>
          <Spin tip="Loading" size="large">
            {content}
          </Spin>
        </div>
      )}
      <h2>Thêm mới thương hiệu</h2>
      <div className={styles.main}>
        <div className={styles.main_content}>
          <div className={styles.input_label_container}>
            <label htmlFor="" className={styles.label}>
              Tên thương hiệu *
            </label>
            <div className={styles.input_container}>
              <input
                type="text"
                placeholder="Tên thương hiệu"
                className={styles.input}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError("");
                }}
              />
              {nameError && (
                <span className={styles.text_warning}>{nameError}</span>
              )}
            </div>
          </div>
          <div className={`${styles.button_container}`}>
            <Button
              className={`${styles.button}`}
              onClick={() => handleAddBrand()}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
