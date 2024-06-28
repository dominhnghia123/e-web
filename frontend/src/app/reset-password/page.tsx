"use client";
import {Button, Image} from "react-bootstrap";
import styles from "./resetPassword.module.css";
import {FaArrowLeftLong} from "react-icons/fa6";
import {useRouter} from "next/navigation";
import {useState} from "react";
import axios, {AxiosError} from "axios";
import {toast} from "react-toastify";
import {Modal, Spin} from "antd";

export default function ResetPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const [openModalCheckCode, setOpenModalCheckCode] = useState<boolean>(false);
  const [confirmLoadingCheckCode, setConfirmLoadingCheckCode] = useState(false);
  const [code, setCode] = useState<string>("");

  const [openModalResetPassword, setOpenModalResetPassword] =
    useState<boolean>(false);
  const [confirmLoadingResetPassword, setConfirmLoadingResetPassword] =
    useState(false);
  const [password, setPassword] = useState<string>("");

  const handleSendRequest = async () => {
    setIsLoading(true);
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/user/forgot-password`,
        {
          email,
        }
      );
      if (data.status === false) {
        toast.error(data.msg);
      }
      if (data.status === true) {
        setOpenModalCheckCode(true);
      }
    } catch (error: any) {
      const err = error as AxiosError<{
        message: {property: string; message: string}[];
      }>;
      if (err.response?.data?.message) {
        err.response.data.message?.forEach((value) => {
          if (value.property === "email") {
            setEmailError(value.message);
          }
        });
      }
    }
    setIsLoading(false);
  };

  const handleCheckCode = async () => {
    try {
      setConfirmLoadingCheckCode(true);
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/user/pre-reset-password`,
        {
          code,
        }
      );
      setConfirmLoadingCheckCode(false);
      if (data.status === false) {
        toast.error(data.msg);
      }
      if (data.status === true) {
        setOpenModalCheckCode(false);
        setOpenModalResetPassword(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelCheckCode = () => {
    setOpenModalCheckCode(false);
  };

  const handleResetPassword = async () => {
    try {
      setConfirmLoadingResetPassword(true);
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/user/reset-password`,
        {
          email,
          newPassword: password,
        }
      );
      setConfirmLoadingResetPassword(false);
      if (data.status === false) {
        toast.error(data.msg);
      }
      if (data.status === true) {
        setOpenModalResetPassword(false);
        toast.success(data.msg);
        setEmail("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelResetPassword = () => {
    setOpenModalResetPassword(false);
  };

  const contentStyle: React.CSSProperties = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };

  const content = <div style={contentStyle} />;

  return (
    <div className={styles.container}>
      {isLoading && (
        <div className={styles.loading}>
          <Spin tip="Loading" size="large">
            {content}
          </Spin>
        </div>
      )}
      <title>Reset password</title>
      <nav className={styles.nav}>
        <div className={styles.nav_content}>
          <div className={styles.nav_content__left}>
            <div className={styles.nav_content__left__title}>
              <Image
                src="/images/shopify-icon.jpg"
                alt="avatar"
                height={35}
                width={35}
                style={{borderRadius: "50px"}}
              />
              <a
                href="/"
                className={styles.nav_content__left__shopify}
                onClick={() => setIsLoading(true)}
              >
                Shopify
              </a>
            </div>
            <div className={styles.nav_content__left__signin}>
              Đặt lại mật khẩu
            </div>
          </div>
          <a href="#" className={styles.nav_content__right}>
            Bạn cần giúp đỡ?
          </a>
        </div>
      </nav>
      <main className={styles.main}>
        <div className={styles.box_container}>
          <div className={styles.box_head}>
            <FaArrowLeftLong
              className={styles.arrow_left_icon}
              onClick={() => {
                setIsLoading(true);
                router.replace("/buyer/signin");
              }}
            />
            <div className={styles.title_container}>
              <h3>Đặt lại mật khẩu</h3>
            </div>
          </div>
          <div className={styles.form_container}>
            <input
              type="text"
              placeholder="Email"
              className={styles.input}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
            />
            <div className={styles.error_container}>
              {emailError && (
                <span className={styles.text_warning}>{emailError}</span>
              )}
            </div>
            <Button
              className={styles.button}
              onClick={() => handleSendRequest()}
            >
              Gửi yêu cầu
            </Button>
          </div>
        </div>
      </main>

      <Modal
        title="Kiểm tra thông tin"
        open={openModalCheckCode}
        onOk={handleCheckCode}
        confirmLoading={confirmLoadingCheckCode}
        onCancel={handleCancelCheckCode}
      >
        <p>
          Mã code sẽ được gửi qua email để xác thực. Vui lòng kiểm tra email để
          tiếp tục.
        </p>
        <form className={styles.form_container}>
          <input
            type="password"
            placeholder="Mã code"
            className={styles.input}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
            }}
          />
        </form>
      </Modal>

      <Modal
        title="Đặt lại mật khẩu"
        open={openModalResetPassword}
        onOk={handleResetPassword}
        confirmLoading={confirmLoadingResetPassword}
        onCancel={handleCancelResetPassword}
      >
        <p>
          Hãy đặt lại mật khẩu mới cho tài khoản của bạn. <br />{" "}
          <strong>Lưu ý:</strong> Hãy ghi nhớ thật kỹ nó và không tiết lộ cho
          người khác biết.
        </p>
        <form className={styles.form_container}>
          <input
            type="password"
            placeholder="Mật khẩu"
            className={styles.input}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </form>
      </Modal>
    </div>
  );
}
