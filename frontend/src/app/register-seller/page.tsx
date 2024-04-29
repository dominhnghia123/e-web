"use client";
import { Button, Image } from "react-bootstrap";
import styles from "./register-seller.module.css";
import { Divider, Modal } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterSellerPage() {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);

  const handleOk = () => {
    setOpenModal(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header_content}>
          <Image
            src="./images/shopify-icon.jpg"
            alt=""
            className={styles.image}
          />
          <div className={styles.text}>Đăng ký trở thành Người bán Shopify</div>
        </div>
      </div>
      <Divider />
      <div className={styles.main}>
        <div className={styles.main_content}>
          <div className={styles.input_container}>
            <label htmlFor="" className={styles.label}>
              Tên shop *
            </label>
            <input
              type="text"
              placeholder="Tên shop"
              className={styles.input}
            />
          </div>
          <div className={styles.input_container}>
            <label htmlFor="" className={styles.label}>
              Địa chỉ lấy hàng *
            </label>
            <input
              type="text"
              placeholder="Địa chỉ lấy hàng"
              className={styles.input}
            />
          </div>
          <div className={styles.input_container}>
            <label htmlFor="" className={styles.label}>
              Email *
            </label>
            <input
              type="email"
              placeholder="Địa chỉ email"
              className={styles.input}
            />
          </div>
          <div className={styles.input_container}>
            <label htmlFor="" className={styles.label}>
              Số điện thoại *
            </label>
            <input
              type="text"
              placeholder="Số điện thoại"
              className={styles.input}
            />
          </div>
          <div className={styles.input_container}>
            <label htmlFor="" className={styles.label}>
              Số CCCD *
            </label>
            <input
              type="text"
              placeholder="Số căn cước công dân"
              className={styles.input}
            />
          </div>
          <div className={styles.input_container}>
            <label htmlFor="" className={styles.label}>
              Họ & tên *
            </label>
            <input
              type="text"
              placeholder="Họ & tên theo CCCD"
              className={styles.input}
            />
          </div>
          <div className={styles.policy_container}>
            <input type="checkbox" />
            <div>
              Tôi xác nhận tất cả dữ liệu đã cung cấp là chính xác và trung
              thực. Tôi đã đọc và đồng ý với{" "}
              <span className={styles.policy_container__text_red}>
                Điều khoản dịch vụ
              </span>{" "}
              &{" "}
              <span className={styles.policy_container__text_red}>
                Chính sách bảo mật
              </span>{" "}
              của Shopify.
            </div>
          </div>
          <div className={`${styles.button_container} ${styles.back}`}>
            <Button
              className={`${styles.button} ${styles.back}`}
              onClick={() => router.back()}
            >
              Quay lại
            </Button>
            <Button
              className={`${styles.button} ${styles.register}`}
              onClick={() => setOpenModal(true)}
            >
              Đăng ký bán hàng
            </Button>
          </div>
          <Modal
            title={
              <div>
                <span>
                  Yêu cầu đăng ký trở thành người bán trên Shopify của bạn sẽ
                  được gửi tới bộ phận quản lý của chúng tôi sau khi bạn nhấn
                  nút Ok.
                </span>
                <br />
                <span>
                  Chúng tôi sẽ phản hồi lại bạn trong thời gian sớm nhất.
                </span>
                <br />
                <span>Bạn có chắc chắn muốn đăng ký?</span>
              </div>
            }
            open={openModal}
            onOk={() => handleOk()}
            onCancel={() => setOpenModal(false)}
          />
        </div>
      </div>
    </div>
  );
}
