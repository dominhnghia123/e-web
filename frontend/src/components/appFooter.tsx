import { Button } from "react-bootstrap";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import styles from "../app/app.module.css";

export default function AppFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_container}>
        <div className={styles.footer_container__top}>
          <div className={styles.footer_container__top__left}>
            <div className={styles.footer_container__top__left__column}>
              <div className={styles.title}>SHOP</div>
              <div className={styles.option}>Drinks</div>
              <div className={styles.option}>Gift Cards</div>
              <div className={styles.option}>Store Locator</div>
              <div className={styles.option}>Refer a Friend</div>
            </div>
            <div className={styles.footer_container__top__left__column}>
              <div className={styles.title}>HELP</div>
              <div className={styles.option}>Contact Us</div>
              <div className={styles.option}>FAQ</div>
              <div className={styles.option}>Accessibility</div>
            </div>
            <div className={styles.footer_container__top__left__column}>
              <div className={styles.title}>ABOUT</div>
              <div className={styles.option}>Our Story</div>
              <div className={styles.option}>OLIPOP Digest</div>
              <div className={styles.option}>Ingredients</div>
              <div className={styles.option}>Digestive Health</div>
              <div className={styles.option}>Wholesale</div>
              <div className={styles.option}>Press</div>
              <div className={styles.option}>Careers</div>
            </div>
          </div>
          <div className={styles.footer_container__top__right}>
            <div className={styles.footer_container__top__right__container}>
              <div
                className={styles.footer_container__top__right__container__text}
              >
                Sign up to get 10% off your first order
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
                    placeholder="Your Email Address"
                    className={
                      styles.footer_container__top__right__container__search__form__input
                    }
                  />
                  <Button
                    className={
                      styles.footer_container__top__right__container__search__form__button
                    }
                  >
                    Subcribe
                  </Button>
                </form>
              </div>
              <div
                className={styles.footer_container__top__right__container__icon}
              >
                <IoLogoInstagram className={styles.icon} />
                <FaFacebookF className={styles.icon} />
                <FaTwitter className={styles.icon} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footer_container__bottom}>
          <div className={styles.footer_container__bottom__left}>
            2024 Olipop, Inc.All Rights Reserved
          </div>
          <div className={styles.footer_container__bottom__right}>
            <a
              href="#"
              className={styles.footer_container__bottom__right__link}
            >
              Term of Service
            </a>
            <a
              href="#"
              className={styles.footer_container__bottom__right__link}
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className={styles.footer_container__bottom__right__link}
            >
              Do Not Sell My Information
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
