import { Divider, Modal, Radio, RadioChangeEvent } from "antd";
import { useEffect, useState } from "react";
import styles from "./pickAddress.module.css";
import { getToken } from "@/app/helper/stogare";
import axios from "axios";
import UpdateAddressModal from "../updateAddress/page";

interface IProps {
  openPickAddressModal: boolean;
  setOpenPickAddressModal: (value: boolean) => void;
  selectedAddressId: string | any;
  setSelectedAddressId: (value: string | any) => void;
}

export default function PickAddressModal(props: IProps) {
  const {
    openPickAddressModal,
    setOpenPickAddressModal,
    selectedAddressId,
    setSelectedAddressId,
  } = props;
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [openModalUpdateAddress, setOpenModalUpdateAddress] =
    useState<boolean>(false);
  const [addressDetail, setAddressDetail] = useState<IAddress | any>({});

  const token = getToken();

  useEffect(() => {
    getAllAddress();
  }, []);

  useEffect(() => {
    getAllAddress();
  }, [openModalUpdateAddress]);

  const getAllAddress = async () => {
    const { data } = await axios.post(
      `${process.env.BASE_HOST}/address/get-all-address`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.status === true) {
      setAddresses(data?.allAddresses);
    }
  };

  const handleOk = (selectAddressTemporary: string) => {
    setSelectedAddressId(selectAddressTemporary);
    setOpenPickAddressModal(false);
  };

  const handleCancel = () => {
    setOpenPickAddressModal(false);
  };

  const [selectAddressTemporary, setSelectAddressTemporary] = useState("");
  const handleChangeAddress = (e: RadioChangeEvent) => {
    setSelectAddressTemporary(e.target.value);
  };
  useEffect(() => {
    setSelectAddressTemporary(selectedAddressId);
  }, [openPickAddressModal]);
  
  return (
    <Modal
      title="Chọn địa chỉ"
      open={openPickAddressModal}
      onOk={() => handleOk(selectAddressTemporary)}
      onCancel={handleCancel}
    >
      <Radio.Group onChange={handleChangeAddress} value={selectAddressTemporary}>
        {addresses?.length > 0 ? (
          addresses.map((address, index) => {
            return (
              <div key={index}>
                <div className={styles.address_container}>
                  <Radio value={address._id}></Radio>
                  <div className={styles.addess_container__content}>
                    <div className={styles.address_container__content__left}>
                      <div
                        className={
                          styles.address_container__content__left__name_phone
                        }
                      >
                        {address.username} {address.phone}
                      </div>
                      <div
                        className={
                          styles.address_container__content__left__text
                        }
                      >
                        {address.address}
                      </div>
                      <div
                        className={
                          styles.address_container__content__left__default
                        }
                      >
                        Mặc định
                      </div>
                    </div>
                    <a
                      href="#"
                      className={styles.address_container__content__right}
                      onClick={() => {
                        setAddressDetail(address);
                        setOpenModalUpdateAddress(true);
                      }}
                    >
                      Cập nhật
                    </a>
                    <UpdateAddressModal
                      openModalUpdateAddress={openModalUpdateAddress}
                      setOpenModalUpdateAddress={setOpenModalUpdateAddress}
                      address={addressDetail}
                    />
                  </div>
                </div>
                <Divider />
              </div>
            );
          })
        ) : (
          <h3>Bạn chưa có địa chỉ nào</h3>
        )}
      </Radio.Group>
    </Modal>
  );
}
