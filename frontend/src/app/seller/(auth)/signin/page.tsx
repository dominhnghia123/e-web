"use client";
import { Button, Image } from "react-bootstrap";
import styles from "./signin.module.css";
import { IoLogoFacebook } from "react-icons/io5";
import { IoLogoGoogle } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/store";
import { MouseEvent, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  logInError,
  logInStart,
  logInSuccess,
} from "@/redux/features/auth/authSlice";
import { logInUser } from "@/redux/features/auth/authService";
import { Modal } from "antd";

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
  const [openModal, setOpenModal] = useState(false);

  const handleOk = async () => {
    setOpenModal(false);
    router.replace("/register-seller");
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  const handleSignin = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(logInStart());
    try {
      const response = await logInUser(dataLogin, setDataLoginError);
      const currentUser = response?.currentUser;
      if (response.status === true) {
        setDataLoginError((prev) => ({ ...prev, loginError: "" }));
        dispatch(logInSuccess(currentUser));
        Cookies.set("userActive", "1", { expires: 1 });
        if (currentUser.isSeller === true) {
          setIsLoading(true);
          toast.success(response.msg);
          router.replace("/seller");
        } else {
          setOpenModal(true);
        }
      }
      if (response.status === false) {
        setDataLoginError((prev) => ({ ...prev, loginError: response.msg }));
      }
    } catch (error) {
      dispatch(logInError());
    }
  };

  return (
    <div className={styles.main_container}>
      {isLoading && <div className={styles.loading}></div>}
      <title>Đăng nhập người bán</title>
      <div className={styles.main_container__content_left}>
        <div className={styles.main_container__content_left__title}>
          Bán hàng chuyên nghiệp
        </div>
        <div className={styles.main_container__content_left__text}>
          Quản lý shop của bạn một cách hiệu quả hơn trên Shopify với Shopify -
          Kênh người bán
        </div>
        <Image
          src="/images/image-ban-hang.png"
          alt=""
          className={styles.main_container__content_left__image}
        />
      </div>
      <div className={styles.main_container__content_right}>
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
            <Button
              type="submit"
              className={styles.button}
              onClick={(e) => handleSignin(e)}
            >
              Đăng nhập
            </Button>
          </form>
          <Modal
            title={
              <div>
                <span style={{ display: "block" }}>
                  Tài khoản của bạn chưa đăng ký trở thành người bán.
                </span>
                <span>
                  Nhấn Ok để đến trang đăng ký trở thành người bán của Shopify.
                </span>
              </div>
            }
            open={openModal}
            onOk={() => handleOk()}
            onCancel={handleCancel}
          />
          <div className={styles.forgot_password}>
            <a href="#" className={styles.forgot_password__link}>
              Quên mật khẩu
            </a>
          </div>
          <div className={styles.other_method_signin}>
            <div className={styles.other_method_signin__header}>
              <div className={styles.other_method_signin__header__line}></div>
              <div className={styles.other_method_signin__header__text}>
                Hoặc
              </div>
              <div className={styles.other_method_signin__header__line}></div>
            </div>
            <div className={styles.other_method_signin__buttons_container}>
              <Button
                className={
                  styles.other_method_signin__buttons_container__button
                }
              >
                <IoLogoFacebook className={styles.logo_fb} />
                Facebook
              </Button>
              <Button
                className={
                  styles.other_method_signin__buttons_container__button
                }
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
              href="/seller/signup"
              className={styles.bottom_container__content__link}
            >
              Đăng ký
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
