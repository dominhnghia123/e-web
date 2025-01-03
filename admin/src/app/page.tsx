"use client";
import {MouseEvent, useState} from "react";
import styles from "./app.module.css";
import {Button, Spinner} from "react-bootstrap";
import {useRouter} from "next/navigation";
import axios, {AxiosError} from "axios";
import Cookies from "js-cookie";
import {toast} from "react-toastify";
import {setStogare} from "./helper/stogare";
import {Spin} from "antd";

export default function Login() {
  const router = useRouter();
  const [dataLogin, setDataLogin] = useState({
    email: "",
    password: "",
  });
  const [dataLoginError, setDataLoginError] = useState({
    emailError: "",
    passwordError: "",
    loginError: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/user/login`,
        dataLogin
      );
      if (data.status === true) {
        if (data.currentUser.role === "admin") {
          setDataLoginError((prev) => ({...prev, loginError: ""}));
          setIsLoading(true);
          Cookies.set("adminActive", "1", {expires: 1});
          setStogare("admin", JSON.stringify(data.currentUser));
          router.replace("/admin");
        }
        if (data.currentUser.role === "user") {
          toast.warning("Bạn không phải admin.");
        }
      }
      if (data.status === false) {
        setDataLoginError((prev) => ({...prev, loginError: data.msg}));
      }
    } catch (error: any) {
      const err = error as AxiosError<{
        message: {property: string; message: string}[];
      }>;
      if (err.response?.data?.message) {
        err.response.data.message?.forEach((value) => {
          if (value.property === "email") {
            setDataLoginError((prev: any) => ({
              ...prev,
              emailError: value.message,
              loginError: "",
            }));
          }
          if (value.property === "password") {
            setDataLoginError((prev: any) => ({
              ...prev,
              passwordError: value.message,
              loginError: "",
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
    <div className={styles.main}>
      {isLoading && (
        <div className={styles.loading}>
          <Spin tip="Loading" size="large">
            {content}
          </Spin>
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.title_container}>
          <p className={styles.title}>Đăng nhập</p>
        </div>
        <form className={styles.form_container}>
          <div className={styles.inputs_container}>
            <div className={styles.inputs}>
              <label className={styles.label}>Địa chỉ email:</label>
              <input
                className={styles.input}
                type="email"
                placeholder="Nhập địa chỉ email"
                value={dataLogin.email}
                onChange={(e) => {
                  setDataLogin((prev) => ({...prev, email: e.target.value}));
                  setDataLoginError((prev) => ({
                    ...prev,
                    emailError: "",
                    loginError: "",
                  }));
                }}
              />
              {dataLoginError.emailError && (
                <span className={styles.text_warning}>
                  {dataLoginError.emailError}
                </span>
              )}
            </div>
            <div className={styles.inputs}>
              <label className={styles.label}>Mật khẩu:</label>
              <input
                className={styles.input}
                type="password"
                placeholder="Nhập mật khẩu"
                value={dataLogin.password}
                onChange={(e) => {
                  setDataLogin((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                  setDataLoginError((prev) => ({
                    ...prev,
                    passwordError: "",
                    loginError: "",
                  }));
                }}
              />
              {dataLoginError.passwordError && (
                <span className={styles.text_warning}>
                  {dataLoginError.passwordError}
                </span>
              )}
              {dataLoginError.loginError && (
                <span className={styles.text_warning}>
                  {dataLoginError.loginError}
                </span>
              )}
            </div>
          </div>
          <div className={styles.button_container}>
            <Button
              type="submit"
              className={styles.button}
              onClick={(e) => handleLogin(e)}
            >
              Đăng nhập
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
