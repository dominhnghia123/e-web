import { Button, Image } from "react-bootstrap";
import styles from "./signin.module.css";
import { IoLogoFacebook } from "react-icons/io5";
import { IoLogoGoogle } from "react-icons/io";

export default function Signin() {
  return (
    <div className={styles.main_container}>
      <title>Đăng nhập người bán</title>
      <div className={styles.main_container__content_left}>
        <div className={styles.main_container__content_left__title}>
          Bán hàng chuyên nghiệp
        </div>
        <div className={styles.main_container__content_left__text}>
          Quản lý shop của bạn một cách hiệu quả hơn trên Shopify với Shopify -
          Kênh người bán
        </div>
        {/* <div className={styles.main_container__content_left__image}>
        </div> */}
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
            <Button className={styles.button}>Đăng nhập</Button>
          </form>
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
