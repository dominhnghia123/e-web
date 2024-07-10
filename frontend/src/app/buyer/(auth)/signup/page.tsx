"use client";
import styles from "./signup.module.css";
import {Button, Spinner} from "react-bootstrap";
import {IoLogoFacebook} from "react-icons/io5";
import {IoLogoGoogle} from "react-icons/io";
import {MouseEvent, useState} from "react";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import {useAppDispatch} from "@/redux/store";
import {
  registerError,
  registerStart,
  registerSuccess,
} from "@/redux/features/auth/authSlice";
import {registerUser} from "@/redux/features/auth/authService";
import {Modal, Spin} from "antd";

export default function Signup() {
  const router = useRouter();
  const dispatch = useAppDispatch();
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
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(registerStart());
    setIsLoading(true);
    try {
      const response = await registerUser(dataSignup, setDataSignupError);
      const currentUser = response?.newUser;
      if (response.status === true) {
        dispatch(registerSuccess(currentUser));
        setDataSignupError((prev) => ({...prev, loginError: ""}));
        Cookies.set("userActive", "1", {expires: 1});
        showModalCommentSuccess();
      }
      if (response.status === false) {
        if (response.property === "username") {
          setDataSignupError((prev) => ({
            ...prev,
            usernameError: response.msg,
          }));
        }
        if (response.property === "email") {
          setDataSignupError((prev) => ({...prev, emailError: response.msg}));
        }
        if (response.property === "mobile") {
          setDataSignupError((prev) => ({
            ...prev,
            mobileError: response.msg,
          }));
        }
      }
    } catch (error) {
      dispatch(registerError());
    }
    setIsLoading(false);
  };

  const showModalCommentSuccess = () => {
    Modal.success({
      content:
        "Chúc mừng bạn đã đăng ký tài khoản thành công. Hãy bắt đầu trải nghiệm nào!",
      onOk: () => {
        setIsLoading(true);
        router.replace("/buyer");
      },
    });
  };

  const contentStyle: React.CSSProperties = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };

  const content = <div style={contentStyle} />;

  return (
    <div className={styles.signup_content_container}>
      {isLoading && (
        <div className={styles.loading}>
          <Spin tip="Loading" size="large">
            {content}
          </Spin>
        </div>
      )}
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
                setDataSignupError((prev) => ({...prev, usernameError: ""}));
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
                setDataSignupError((prev) => ({...prev, emailError: ""}));
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
                setDataSignupError((prev) => ({...prev, passwordError: ""}));
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
                setDataSignupError((prev) => ({...prev, mobileError: ""}));
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
          <a
            href="/buyer/signin"
            className={styles.bottom_container__content__link}
          >
            Đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}
