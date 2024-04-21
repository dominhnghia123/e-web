"use client";
import { Button } from "react-bootstrap";
import styles from "./changePassword.module.css";
import { getToken } from "@/app/helper/stogare";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ChangePassword() {
  const token = getToken();
  const [dataInput, setDataInput] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePassword = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.BASE_HOST}/user/change-password`,
        {
          currentPassword: dataInput.currentPassword,
          newPassword: dataInput.newPassword,
          confirmPassword: dataInput.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        toast.success(data.msg);
        setDataInput({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
      if (data.status === false) {
        toast.error(data.msg);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h3>Thay đổi mật khẩu</h3>
      <form action="" className={styles.form}>
        <div className={styles.form__field}>
          <div className={styles.form__field__title}>Mật khẩu hiện tại</div>
          <input
            type="password"
            className={styles.form__field__input}
            value={dataInput.currentPassword}
            onChange={(e) =>
              setDataInput((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
          />
        </div>
        <div className={styles.form__field}>
          <div className={styles.form__field__title}>Mật khẩu mới</div>
          <input
            type="password"
            className={styles.form__field__input}
            value={dataInput.newPassword}
            onChange={(e) =>
              setDataInput((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
          />
        </div>
        <div className={styles.form__field}>
          <div className={styles.form__field__title}>Xác nhận mật khẩu</div>
          <input
            type="password"
            className={styles.form__field__input}
            value={dataInput.confirmPassword}
            onChange={(e) =>
              setDataInput((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
          />
        </div>
        <div className={styles.button_container}>
          <Button
            className={styles.button}
            onClick={() => handleChangePassword()}
          >
            Lưu
          </Button>
        </div>
      </form>
    </>
  );
}
