"use client";
import { Button } from "react-bootstrap";
import styles from "./signin.module.css";
import { IoLogoFacebook } from "react-icons/io5";
import { IoLogoGoogle } from "react-icons/io";
import { MouseEvent, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAppDispatch } from "@/redux/store";
import {
  logInError,
  logInStart,
  logInSuccess,
} from "@/redux/features/auth/authSlice";
import { logInUser } from "@/redux/features/auth/authService";

export default function Signin() {
  const router = useRouter();
  const dispatch = useAppDispatch();

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

  const handleSignin = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(logInStart());
    try {
      const response = await logInUser(dataLogin, setDataLoginError);
      const currentUser = response?.currentUser;
      if (response.status === true) {
        dispatch(logInSuccess(currentUser));
        setDataLoginError((prev) => ({ ...prev, loginError: "" }));
        setIsLoading(true);
        toast.success(response.msg);
        Cookies.set("userActive", "1", {expires: 1});
        router.replace("/buyer");
      }
      if (response.status === false) {
        setDataLoginError((prev) => ({ ...prev, loginError: response.msg }));
      }
    } catch (error) {
      dispatch(logInError());
    }
  };
  return (
    <div className={styles.signin_content_container}>
      {isLoading && <div className={styles.loading}></div>}
      <title>Đăng nhập người dùng</title>
      <div className={styles.signin_title}>Đăng nhập</div>
      <div className={styles.signin_container}>
        <form action="" className={styles.form_container}>
          <div className={styles.input_container}>
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              value={dataLogin.email}
              onChange={(e) => {
                setDataLogin((prev) => ({ ...prev, email: e.target.value }));
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
          <div className={styles.input_container}>
            <input
              type="password"
              placeholder="Password"
              className={styles.input}
              value={dataLogin.password}
              onChange={(e) => {
                setDataLogin((prev) => ({ ...prev, password: e.target.value }));
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
          <Button
            className={styles.button}
            type="submit"
            onClick={(e) => handleSignin(e)}
          >
            Đăng nhập
          </Button>
        </form>
        <div className={styles.forgot_password}>
          <a href="/buyer/reset-password" className={styles.forgot_password__link}>
            Quên mật khẩu
          </a>
        </div>
        <div className={styles.other_method_signin}>
          <div className={styles.other_method_signin__header}>
            <div className={styles.other_method_signin__header__line}></div>
            <div className={styles.other_method_signin__header__text}>Hoặc</div>
            <div className={styles.other_method_signin__header__line}></div>
          </div>
          <div className={styles.other_method_signin__buttons_container}>
            <Button
              className={styles.other_method_signin__buttons_container__button}
            >
              <IoLogoFacebook className={styles.logo_fb} />
              Facebook
            </Button>
            <Button
              className={styles.other_method_signin__buttons_container__button}
            >
              <IoLogoGoogle className={styles.logo_gg} />
              Google
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.bottom_container}>
        <div className={styles.bottom_container__content}>
          Bạn mới biết đến Shopify?
          <a
            href="/buyer/signup"
            className={styles.bottom_container__content__link}
          >
            Đăng ký
          </a>
        </div>
      </div>
    </div>
  );
}
