import { Modal } from "antd";
import { useEffect, useState } from "react";
import styles from "./updateAddress.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { getToken } from "@/app/helper/stogare";

interface IProps {
  openModalUpdateAddress: boolean;
  setOpenModalUpdateAddress: (value: boolean) => void;
  address: IAddress;
}

export default function UpdateAddressModal(props: IProps) {
  const { openModalUpdateAddress, setOpenModalUpdateAddress, address } = props;

  const token = getToken();

  useEffect(() => {
    setDataUpdateAddress({
      username: address.username,
      phone: address.phone,
      address: address.address,
    });
  }, [address]);

  const [dataUpdateAddress, setDataUpdateAddress] = useState({
    username: address.username,
    phone: address.phone,
    address: address.address,
  });

  const handleOk = async (addressId: string) => {
    try {
      const { data } = await axios.post(
        `${process.env.BASE_HOST}/address/update-address`,
        {
          _id: addressId,
          username: dataUpdateAddress.username,
          phone: dataUpdateAddress.phone,
          address: dataUpdateAddress.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        toast.success(data.msg);
        setOpenModalUpdateAddress(false);
        setDataUpdateAddress({
          username: "",
          phone: "",
          address: "",
        });
      }
      if (data.status === false) {
        toast.error(data.msg);
        setOpenModalUpdateAddress(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setOpenModalUpdateAddress(false);
  };

  return (
    <Modal
      title="Địa chỉ mới"
      open={openModalUpdateAddress}
      onOk={() => handleOk(address._id)}
      onCancel={handleCancel}
    >
      <form className={styles.form_container}>
        <div className={styles.input_container}>
          <input
            type="text"
            placeholder="Họ và tên"
            className={styles.input}
            value={dataUpdateAddress.username}
            onChange={(e) =>
              setDataUpdateAddress((prev) => ({
                ...prev,
                username: e.target.value,
              }))
            }
          />
        </div>
        <div className={styles.input_container}>
          <input
            type="text"
            placeholder="Số điện thoại"
            className={styles.input}
            value={dataUpdateAddress.phone}
            onChange={(e) =>
              setDataUpdateAddress((prev) => ({
                ...prev,
                phone: e.target.value,
              }))
            }
          />
        </div>
        <div className={styles.input_container}>
          <input
            type="text"
            placeholder="Địa chỉ cụ thể"
            className={styles.input}
            value={dataUpdateAddress.address}
            onChange={(e) =>
              setDataUpdateAddress((prev) => ({
                ...prev,
                address: e.target.value,
              }))
            }
          />
        </div>
      </form>
    </Modal>
  );
}
