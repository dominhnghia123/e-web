"use client";
import { Button } from "react-bootstrap";
import styles from "./signin.module.css";
import { IoLogoFacebook } from "react-icons/io5";
import { IoLogoGoogle } from "react-icons/io";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { MouseEvent, useState } from "react";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSignin = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${process.env.BASE_HOST}/user/login`, {
        email: email,
        password: password,
      });
      if (data.status === true) {
        setLoginError("");
        alert(data.msg);
      }
      if (data.status === false) {
        setLoginError(data.msg);
      }
    } catch (error) {
      const err = error as AxiosError<{
        message: { property: string; message: string }[];
      }>;
      if (err.response?.data?.message) {
        err.response.data.message?.forEach((value) => {
          if (value.property === "email") {
            setEmailError(value.message);
            setLoginError("");
          }
          if (value.property === "password") {
            setPasswordError(value.message);
            setLoginError("");
          }
        });
      }
    }
  };
  return (
    <div className={styles.signin_content_container}>
      <title>Đăng nhập người dùng</title>
      <div className={styles.signin_title}>Đăng nhập</div>
      <div className={styles.signin_container}>
        <form action="" className={styles.form_container}>
          <div className={styles.input_container}>
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
                setLoginError("");
              }}
            />
            {emailError && (
              <span className={styles.text_warning}>{emailError}</span>
            )}
          </div>
          <div className={styles.input_container}>
            <input
              type="password"
              placeholder="Password"
              className={styles.input}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
                setLoginError("");
              }}
            />
            {passwordError && (
              <span className={styles.text_warning}>{passwordError}</span>
            )}
            {loginError && (
              <span className={styles.text_warning}>{loginError}</span>
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
          <a href="" className={styles.forgot_password__link}>
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
          <Link
            href="/buyer/signup"
            className={styles.bottom_container__content__link}
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
}
