import styles from "./signup.module.css";
import { Button } from "react-bootstrap";
import { IoLogoFacebook } from "react-icons/io5";
import { IoLogoGoogle } from "react-icons/io";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { FaGift } from "react-icons/fa";
import { FaHandshake } from "react-icons/fa6";

export default function Signup() {
  return (
    <div className={styles.main_container}>
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
                placeholder="Username"
                className={styles.input}
              />
              <span className={styles.text_warning}>
                Vui lòng điền vào mục này.
              </span>
            </div>
            <div className={styles.input_container}>
              <input
                type="email"
                placeholder="Email"
                className={styles.input}
              />
              <span className={styles.text_warning}>
                Vui lòng điền vào mục này.
              </span>
            </div>
            <div className={styles.input_container}>
              <input
                type="password"
                placeholder="Password"
                className={styles.input}
              />
              <span className={styles.text_warning}>
                Vui lòng điền vào mục này.
              </span>
            </div>
            <div className={styles.input_container}>
              <input
                type="text"
                placeholder="Mobile phone"
                className={styles.input}
              />
              <span className={styles.text_warning}>
                Vui lòng điền vào mục này.
              </span>
            </div>
            <Button className={styles.button}>Đăng ký</Button>
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
