import { Divider } from "antd";
import { Button } from "react-bootstrap";
import { GoPlus } from "react-icons/go";
import styles from "./address.module.css";

export default function Address() {
  return (
    <div className={styles.address_container}>
      <div className={styles.address_container__top}>
        <div className={styles.address_container__top__text}>
          Địa chỉ của tôi
        </div>
        <Button
          className={styles.address_container__top__button_container__button}
        >
          <GoPlus className={styles.icon} />
          Thêm địa chỉ mới
        </Button>
      </div>
      <Divider />
      <div className={styles.address_container__content}>
        <div className={styles.address_detail_container}>
          <div className={styles.address_detail_container__left}>
            <div className={styles.address_detail_container__left__name_phone}>
              Nguyễn Văn Hiển 0975191025
            </div>
            <div className={styles.address_detail_container__left__text}>
              Ngách 78 Ngõ 169 Đường Hoàng Mai Phường Hoàng Văn Thụ, Quận Hoàng
              Mai, Hà Nội
            </div>
            <div className={styles.address_detail_container__left__default}>
              Mặc định
            </div>
          </div>
          <div className={styles.address_detail_container__right}>
            <div
              className={styles.address_detail_container__right__link_container}
            >
              <a href="#" className={styles.link}>
                Cập nhật
              </a>
              <a href="#" className={styles.link}>
                Xóa
              </a>
            </div>
            <Button className={styles.button_set_default}>
              Thiết lập mặc định
            </Button>
          </div>
        </div>
        <Divider />
        <div className={styles.address_detail_container}>
          <div className={styles.address_detail_container__left}>
            <div className={styles.address_detail_container__left__name_phone}>
              Nguyễn Văn Hiển 0975191025
            </div>
            <div className={styles.address_detail_container__left__text}>
              Thôn 8 Làng Yên Thư Xã Yên Phương, Huyện Yên Lạc, Vĩnh Phúc
            </div>
            <div className={styles.address_detail_container__left__default}>
              Mặc định
            </div>
          </div>
          <div className={styles.address_detail_container__right}>
            <div
              className={styles.address_detail_container__right__link_container}
            >
              <a href="#" className={styles.link}>
                Cập nhật
              </a>
              <a href="#" className={styles.link}>
                Xóa
              </a>
            </div>
            <Button className={styles.button_set_default}>
              Thiết lập mặc định
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
