import { Modal } from "antd";
import { useEffect, useState } from "react";
import styles from "./createAddress.module.css";
import axios from "axios";
import { getToken } from "@/app/helper/stogare";
import { toast } from "react-toastify";

interface IProps {
  openModalCreateAddress: boolean;
  setOpenModalCreateAddress: (value: boolean) => void;
}

export default function CreateAddressModal(props: IProps) {
  const { openModalCreateAddress, setOpenModalCreateAddress } = props;
  const token = getToken();

  const [dataInput, setDataInput] = useState({
    username: "",
    phone: "",
    address: "",
  });

  const handleOk = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.BASE_HOST}/address/create-address`,
        {
          username: dataInput.username,
          phone: dataInput.phone,
          address: dataInput.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        toast.success(data.msg);
        setDataInput({
          username: "",
          phone: "",
          address: "",
        });
        setOpenModalCreateAddress(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setDataInput({
      username: "",
      phone: "",
      address: "",
    });
    setOpenModalCreateAddress(false);
  };

  return (
    <Modal
      title="Địa chỉ mới"
      open={openModalCreateAddress}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <form className={styles.form_container}>
        <div className={styles.input_container}>
          <input
            type="text"
            placeholder="Họ và tên"
            className={styles.input}
            value={dataInput.username}
            onChange={(e) =>
              setDataInput((prev) => ({ ...prev, username: e.target.value }))
            }
          />
        </div>
        <div className={styles.input_container}>
          <input
            type="text"
            placeholder="Số điện thoại"
            className={styles.input}
            value={dataInput.phone}
            onChange={(e) =>
              setDataInput((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        </div>
        <div className={styles.input_container}>
          <input
            type="text"
            placeholder="Địa chỉ cụ thể"
            className={styles.input}
            value={dataInput.address}
            onChange={(e) =>
              setDataInput((prev) => ({ ...prev, address: e.target.value }))
            }
          />
        </div>
      </form>
    </Modal>
  );
}
