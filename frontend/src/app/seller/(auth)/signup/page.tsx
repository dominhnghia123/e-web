"use client";
import styles from "./signup.module.css";
import {Button} from "react-bootstrap";
import {IoLogoFacebook} from "react-icons/io5";
import {IoLogoGoogle} from "react-icons/io";
import {SiHomeassistantcommunitystore} from "react-icons/si";
import {FaGift} from "react-icons/fa";
import {FaHandshake} from "react-icons/fa6";
import {MouseEvent, useState} from "react";
import axios, {AxiosError} from "axios";
import AlreadyMobileModal from "@/components/modal/mobile/alreadyMobileModal/page";
import NotAlreadyMobileModal from "@/components/modal/mobile/notAlreadyMobileModal/page";
import {Spin} from "antd";

export default function Signup() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [openPopupExistMobile, setOpenPopupExistMobile] = useState(false);
  const [openPopupNotExistMobile, setOpenPopupNotExistMobile] = useState(false);
  const handleNext = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/user/check-already-phone-number`,
        {
          mobile: phoneNumber,
        }
      );
      if (data.status === true) {
        setOpenPopupExistMobile(true);
      }
      if (data.status === false) {
        setOpenPopupNotExistMobile(true);
      }
    } catch (error: any) {
      const err = error as AxiosError<{
        message: {property: string; message: string}[];
      }>;
      if (err.response?.data?.message) {
        err.response.data.message?.forEach((value) => {
          if (value.property === "mobile") {
            setPhoneNumberError(value.message);
          }
        });
      }
    }
    setIsLoading(false);
  };

  const [isLoading, setIsLoading] = useState(false);

  const contentStyle: React.CSSProperties = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };

  const content = <div style={contentStyle} />;

  return (
    <div className={styles.main_container}>
      {isLoading && (
        <div className={styles.loading}>
          <Spin tip="Loading" size="large">
            {content}
          </Spin>
        </div>
      )}
      <title>Đăng ký tài khoản</title>
      <div className={styles.main_container__content_left}>
        <div className={styles.main_container__content_left__title}>
          Shopify Việt Nam
        </div>
        <div className={styles.main_container__content_left__title_second}>
          Trở thành người bán ngay hôm nay
        </div>
        <div className={styles.main_container__content_left__title_third}>
          <SiHomeassistantcommunitystore
            className={styles.main_container__content_left__title_third__icon}
          />
          <div>Nền tảng thương mại điện tử hàng đầu Đông Nam Á & Đài Loan</div>
        </div>
        <div className={styles.main_container__content_left__title_third}>
          <FaGift
            className={styles.main_container__content_left__title_third__icon}
          />
          <div>Phát triển trở thành thương hiệu toàn cầu</div>
        </div>
        <div className={styles.main_container__content_left__title_third}>
          <FaHandshake
            className={styles.main_container__content_left__title_third__icon}
          />
          <div>Dẫn đầu lượng người dùng trên ứng dụng mua sắm tại Việt Nam</div>
        </div>
      </div>
      <div className={styles.main_container__content_right}>
        <div className={styles.signup_title}>Đăng Ký</div>
        <div className={styles.signup_container}>
          <form action="" className={styles.form_container}>
            <div className={styles.input_container}>
              <input
                type="text"
                placeholder="Số điện thoại"
                className={styles.input}
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setPhoneNumberError("");
                }}
              />
              {phoneNumberError && (
                <span className={styles.text_warning}>{phoneNumberError}</span>
              )}
            </div>
            <Button
              className={styles.button}
              onClick={(e) => handleNext(e)}
              type="submit"
            >
              Tiếp theo
            </Button>
            <AlreadyMobileModal
              openModal={openPopupExistMobile}
              setOpenModal={setOpenPopupExistMobile}
              setIsLoading={setIsLoading}
            />
            <NotAlreadyMobileModal
              openModal={openPopupNotExistMobile}
              setOpenModal={setOpenPopupNotExistMobile}
              setIsLoading={setIsLoading}
            />
          </form>
          <div className={styles.other_method_signup}>
            <div className={styles.other_method_signup__header}>
              <div className={styles.other_method_signup__header__line}></div>
              <div className={styles.other_method_signup__header__text}>
                Hoặc
              </div>
              <div className={styles.other_method_signup__header__line}></div>
            </div>
            <div className={styles.other_method_signup__buttons_container}>
              <Button
                className={
                  styles.other_method_signup__buttons_container__button
                }
              >
                <IoLogoFacebook className={styles.logo_fb} />
                Facebook
              </Button>
              <Button
                className={
                  styles.other_method_signup__buttons_container__button
                }
              >
                <IoLogoGoogle className={styles.logo_gg} />
                Google
              </Button>
            </div>
          </div>
          <div className={styles.policy_container}>
            Bằng việc đăng kí, bạn đã đồng ý với Shopee về{" "}
            <span className={styles.policy_container__text_red}>
              Điều khoản dịch vụ
            </span>{" "}
            &{" "}
            <span className={styles.policy_container__text_red}>
              Chính sách bảo mật.
            </span>
          </div>
        </div>
        <div className={styles.bottom_container}>
          <div className={styles.bottom_container__content}>
            Bạn đã có tài khoản?
            <a
              href="/seller/signin"
              className={styles.bottom_container__content__link}
            >
              Đăng nhập
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
