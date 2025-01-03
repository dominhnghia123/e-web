import { Button } from "react-bootstrap";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import styles from "../app/app.module.css";

export default function AppFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_container}>
        <div className={styles.footer_container__top}>
          <div className={styles.footer_container__top__left}>
            <div className={styles.footer_container__top__left__column}>
              <div className={styles.title}>Cửa Hàng</div>
              <div className={styles.option}>Phiếu giảm giá</div>
              <div className={styles.option}>Tìm kiếm cửa hàng</div>
              <div className={styles.option}>Giới thiệu bạn bè</div>
            </div>
            <div className={styles.footer_container__top__left__column}>
              <div className={styles.title}>Hỗ trợ</div>
              <div className={styles.option}>Liên hệ với chúng tôi</div>
              <div className={styles.option}>Câu hỏi thường gặp</div>
              <div className={styles.option}>Phương thức thanh toán</div>
            </div>
            <div className={styles.footer_container__top__left__column}>
              <div className={styles.title}>Về chúng tôi</div>
              <div className={styles.option}>Tin tức</div>
              <div className={styles.option}>Giới thiệu</div>
              <div className={styles.option}>Tuyển dụng</div>
            </div>
          </div>
          <div className={styles.footer_container__top__right}>
            <div className={styles.footer_container__top__right__container}>
              <div
                className={styles.footer_container__top__right__container__text}
              >
                Đăng ký nhận giảm giá 5% cho đơn hàng đầu tiên
              </div>
              <div
                className={
                  styles.footer_container__top__right__container__search
                }
              >
                <form
                  action="#"
                  className={
                    styles.footer_container__top__right__container__search__form
                  }
                >
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className={
                      styles.footer_container__top__right__container__search__form__input
                    }
                  />
                  <Button
                    className={
                      styles.footer_container__top__right__container__search__form__button
                    }
                  >
                    Đăng ký
                  </Button>
                </form>
              </div>
              <div
                className={styles.footer_container__top__right__container__icon}
              >
                <FaInstagramSquare className={styles.icon} />
                <FaFacebook className={styles.icon} />
                <FaTwitter className={styles.icon} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footer_container__bottom}>
          <div className={styles.footer_container__bottom__left}>
            2024 ShopS All Rights Reserved
          </div>
          <div className={styles.footer_container__bottom__right}>
            <a
              href="#"
              className={styles.footer_container__bottom__right__link}
            >
              Điều khoản dịch vụ
            </a>
            <a
              href="#"
              className={styles.footer_container__bottom__right__link}
            >
              Chính sách bảo mật
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
