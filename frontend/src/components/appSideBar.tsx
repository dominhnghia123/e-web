import { Image } from "react-bootstrap";
import styles from "../app/app.module.css";
import { FaApple } from "react-icons/fa";
export default function AppSideBar() {
  return (
    <div className={styles.sideBar}>
      <div className={styles.sideBar__container}>
        <div className={styles.title}>Danh mục</div>
        <div className={styles.options}>
          <a href="#" className={styles.options__link}>
            <FaApple className={styles.icon} />
            <div className={styles.options__link__title}>Iphone</div>
          </a>
        </div>
        <div className={styles.options}>
          <a href="#" className={styles.options__link}>
            <FaApple className={styles.icon} />
            <div className={styles.options__link__title}>Sam Sung</div>
          </a>
        </div>
        <div className={styles.options}>
          <a href="#" className={styles.options__link}>
            <FaApple className={styles.icon} />
            <div className={styles.options__link__title}>Vivo</div>
          </a>
        </div>
        <div className={styles.options}>
          <a href="#" className={styles.options__link}>
            <FaApple className={styles.icon} />
            <div className={styles.options__link__title}>Huawei</div>
          </a>
        </div>
        <div className={styles.options}>
          <a href="#" className={styles.options__link}>
            <FaApple className={styles.icon} />
            <div className={styles.options__link__title}>Oppo</div>
          </a>
        </div>
        <div className={styles.options}>
          <a href="#" className={styles.options__link}>
            <FaApple className={styles.icon} />
            <div className={styles.options__link__title}>MI</div>
          </a>
        </div>
      </div>
    </div>
  );
}
