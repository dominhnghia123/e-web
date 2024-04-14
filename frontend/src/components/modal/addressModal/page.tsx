import { Modal, Radio, RadioChangeEvent } from "antd";
import { useState } from "react";
import styles from "./addressModal.module.css";

interface IProps {
  openAddressModal: boolean;
  setOpenAddressModal: (value: boolean) => void;
}

export default function AddressModal(props: IProps) {
  const { openAddressModal, setOpenAddressModal } = props;
  const handleOk = () => {
    setOpenAddressModal(false);
  };

  const handleCancel = () => {
    setOpenAddressModal(false);
  };

  const [address, setAddress] = useState("");
  const handleChangeAddress = (e: RadioChangeEvent) => {
    setAddress(e.target.value);
  };
  return (
    <Modal
      title="Chọn địa chỉ"
      open={openAddressModal}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div>
        <div>
          <Radio.Group onChange={handleChangeAddress} value={address}>
            <div>
              <Radio value="address1">nhu cak</Radio>
              <div className={styles.addess_container}>
                <div className={styles.address_container__left}>
                  <div className={styles.address_container__left__name_phone}>
                    Nguyễn Văn Hiển 0975191025
                  </div>
                  <div className={styles.address_container__left__text}>
                    Thôn 8 Làng Yên Thư Xã Yên Phương, Huyện Yên Lạc, Vĩnh Phúc
                  </div>
                  <div className={styles.address_container__left__default}>
                    Mặc định
                  </div>
                </div>
                <a href="#" className={styles.address_container__right}>
                  Cập nhật
                </a>
              </div>
            </div>
          </Radio.Group>
        </div>
      </div>
    </Modal>
  );
}
