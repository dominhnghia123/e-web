"use client";
import { Divider } from "antd";
import { Button } from "react-bootstrap";
import { GoPlus } from "react-icons/go";
import styles from "./address.module.css";
import { useEffect, useState } from "react";
import CreateAddressModal from "@/components/modal/address/createAddress/page";
import UpdateAddressModal from "@/components/modal/address/updateAddress/page";
import axios from "axios";
import { getToken } from "@/app/helper/stogare";
import DeleteAddressModal from "@/components/modal/address/deleteAddress/page";

export default function Address() {
  const [openModalCreateAddress, setOpenModalCreateAddress] =
    useState<boolean>(false);
  const [openModalUpdateAddress, setOpenModalUpdateAddress] =
    useState<boolean>(false);
  const [openModalDeleteAddress, setOpenModalDeleteAddress] =
    useState<boolean>(false);
  const [addressDetail, setAddressDetail] = useState<IAddress | any>({});
  const [addresses, setAddresses] = useState<IAddress[]>([]);

  const token = getToken();

  useEffect(() => {
    getAllAddress();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    getAllAddress();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModalCreateAddress, openModalUpdateAddress, openModalDeleteAddress]);
  
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

  return (
    <div className={styles.address_container}>
      <div className={styles.address_container__top}>
        <div className={styles.address_container__top__text}>
          Địa chỉ của tôi
        </div>
        <Button
          className={styles.address_container__top__button_container__button}
          onClick={() => setOpenModalCreateAddress(true)}
        >
          <GoPlus className={styles.icon} />
          Thêm địa chỉ mới
        </Button>
        <CreateAddressModal
          openModalCreateAddress={openModalCreateAddress}
          setOpenModalCreateAddress={setOpenModalCreateAddress}
        />
      </div>
      <Divider />
      <div className={styles.address_container__content}>
        {addresses?.length > 0 ? (
          addresses.map((address, index) => {
            return (
              <div key={index}>
                <div className={styles.address_detail_container}>
                  <div className={styles.address_detail_container__left}>
                    <div
                      className={
                        styles.address_detail_container__left__name_phone
                      }
                    >
                      {address.username} {address.phone}
                    </div>
                    <div
                      className={styles.address_detail_container__left__text}
                    >
                      {address.address}
                    </div>
                    <div
                      className={styles.address_detail_container__left__default}
                    >
                      Mặc định
                    </div>
                  </div>
                  <div className={styles.address_detail_container__right}>
                    <div
                      className={
                        styles.address_detail_container__right__link_container
                      }
                    >
                      <a
                        href="#"
                        className={styles.link}
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
                      <a
                        href="#"
                        className={styles.link}
                        onClick={() => {
                          setAddressDetail(address);
                          setOpenModalDeleteAddress(true);
                        }}
                      >
                        Xóa
                      </a>
                      <DeleteAddressModal
                        openModalDeleteAddress={openModalDeleteAddress}
                        setOpenModalDeleteAddress={setOpenModalDeleteAddress}
                        address={addressDetail}
                      />
                    </div>
                    <Button className={styles.button_set_default}>
                      Thiết lập mặc định
                    </Button>
                  </div>
                </div>
                <Divider />
              </div>
            );
          })
        ) : (
          <h3>
            Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ để có thể mua và giao
            hàng.
          </h3>
        )}
      </div>
    </div>
  );
}
