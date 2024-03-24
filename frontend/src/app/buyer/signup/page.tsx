"use client";
import styles from "./signup.module.css";
import { Button } from "react-bootstrap";
import { IoLogoFacebook } from "react-icons/io5";
import { IoLogoGoogle } from "react-icons/io";
import Link from "next/link";
import { MouseEvent, useState } from "react";
import axios, { AxiosError } from "axios";

export default function Signup() {
  const [dataSignup, setDataSignup] = useState({
    username: "",
    email: "",
    password: "",
    mobile: "",
  });
  const [dataSignupError, setDataSignupError] = useState({
    usernameError: "",
    emailError: "",
    passwordError: "",
    mobileError: "",
  });

  const handleSignup = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { username, email, password, mobile } = dataSignup;
    try {
      const { data } = await axios.post(
        `${process.env.BASE_HOST}/user/register`,
        {
          username: username,
          email: email,
          password: password,
          mobile: mobile,
        }
      );
      if (data.status === true) {
        alert(data.msg);
      }
      if (data.status === false) {
        if (data.property === "username") {
          setDataSignupError((prev) => ({ ...prev, usernameError: data.msg }));
        }
        if (data.property === "email") {
          setDataSignupError((prev) => ({ ...prev, emailError: data.msg }));
        }
         if (data.property === "mobile") {
           setDataSignupError((prev) => ({ ...prev, mobileError: data.msg }));
         }
      }
    } catch (error) {
      console.log(error);

      const err = error as AxiosError<{
        message: { property: string; message: string }[];
      }>;
      if (err.response?.data?.message) {
        err.response.data.message?.forEach((value) => {
          if (value.property === "username") {
            setDataSignupError((prev) => ({
              ...prev,
              usernameError: value.message,
            }));
          }
          if (value.property === "email") {
            setDataSignupError((prev) => ({
              ...prev,
              emailError: value.message,
            }));
          }
          if (value.property === "password") {
            setDataSignupError((prev) => ({
              ...prev,
              passwordError: value.message,
            }));
          }
          if (value.property === "mobile") {
            setDataSignupError((prev) => ({
              ...prev,
              mobileError: value.message,
            }));
          }
        });
      }
    }
  };
  return (
    <div className={styles.signup_content_container}>
      <title>Đăng ký tài khoản</title>
      <div className={styles.signup_title}>Đăng Ký</div>
      <div className={styles.signup_container}>
        <form action="" className={styles.form_container}>
          <div className={styles.input_container}>
            <input
              type="text"
              placeholder="Username"
              className={styles.input}
              value={dataSignup.username}
              onChange={(e) => {
                setDataSignup((prev) => ({
                  ...prev,
                  username: e.target.value,
                }));
                setDataSignupError((prev) => ({ ...prev, usernameError: "" }));
              }}
            />
            {dataSignupError.usernameError && (
              <span className={styles.text_warning}>
                {dataSignupError.usernameError}
              </span>
            )}
          </div>
          <div className={styles.input_container}>
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              value={dataSignup.email}
              onChange={(e) => {
                setDataSignup((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
                setDataSignupError((prev) => ({ ...prev, emailError: "" }));
              }}
            />
            {dataSignupError.emailError && (
              <span className={styles.text_warning}>
                {dataSignupError.emailError}
              </span>
            )}
          </div>
          <div className={styles.input_container}>
            <input
              type="password"
              placeholder="Password"
              className={styles.input}
              value={dataSignup.password}
              onChange={(e) => {
                setDataSignup((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
                setDataSignupError((prev) => ({ ...prev, passwordError: "" }));
              }}
            />
            {dataSignupError.passwordError && (
              <span className={styles.text_warning}>
                {dataSignupError.passwordError}
              </span>
            )}
          </div>
          <div className={styles.input_container}>
            <input
              type="text"
              placeholder="Mobile phone"
              className={styles.input}
              value={dataSignup.mobile}
              onChange={(e) => {
                setDataSignup((prev) => ({
                  ...prev,
                  mobile: e.target.value,
                }));
                setDataSignupError((prev) => ({ ...prev, mobileError: "" }));
              }}
            />
            {dataSignupError.mobileError && (
              <span className={styles.text_warning}>
                {dataSignupError.mobileError}
              </span>
            )}
          </div>
          <Button
            className={styles.button}
            type="submit"
            onClick={(e) => handleSignup(e)}
          >
            Đăng ký
          </Button>
        </form>
        <div className={styles.other_method_signup}>
          <div className={styles.other_method_signup__header}>
            <div className={styles.other_method_signup__header__line}></div>
            <div className={styles.other_method_signup__header__text}>Hoặc</div>
            <div className={styles.other_method_signup__header__line}></div>
          </div>
          <div className={styles.other_method_signup__buttons_container}>
            <Button
              className={styles.other_method_signup__buttons_container__button}
            >
              <IoLogoFacebook className={styles.logo_fb} />
              Facebook
            </Button>
            <Button
              className={styles.other_method_signup__buttons_container__button}
            >
              <IoLogoGoogle className={styles.logo_gg} />
              Google
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.bottom_container}>
        <div className={styles.bottom_container__content}>
          Bạn đã có tài khoản?
          <Link
            href="/buyer/signin"
            className={styles.bottom_container__content__link}
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
