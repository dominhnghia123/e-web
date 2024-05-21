"use client";
import { Divider, Modal, Radio, RadioChangeEvent } from "antd";
import styles from "./couponModal.module.css";
import { useEffect, useState } from "react";
import { getToken } from "@/app/helper/stogare";
import axios from "axios";

interface IProps {
  openCouponModal: boolean;
  setOpenCouponModal: (value: boolean) => void;
  selectedCouponId: string | any;
  setSelectedCouponId: (value: string | any) => void;
}

export default function CouponModal(props: IProps) {
  const {
    openCouponModal,
    setOpenCouponModal,
    selectedCouponId,
    setSelectedCouponId,
  } = props;
  const token = getToken();

  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  useEffect(() => {
    getCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCoupons = async () => {
    const { data } = await axios.post(
      `${process.env.BASE_HOST}/coupon/get-coupons-by-user`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (data.status === true) {
      setCoupons(data?.allCoupons);
    }
  };

  const handleOk = (selectCouponTemporary: string) => {
    setSelectedCouponId(selectCouponTemporary);
    setOpenCouponModal(false);
  };

  const handleCancel = () => {
    setOpenCouponModal(false);
  };

  const [selectCouponTemporary, setSelectCouponTemporary] = useState("");
  const handleChangeCoupon = (e: RadioChangeEvent) => {
    setSelectCouponTemporary(e.target.value);
  };
  useEffect(() => {
    setSelectCouponTemporary(selectedCouponId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCouponModal]);

  return (
    <Modal
      title="Chọn voucher khuyến mãi"
      open={openCouponModal}
      onOk={() => handleOk(selectCouponTemporary)}
      onCancel={handleCancel}
    >
      <Radio.Group onChange={handleChangeCoupon} value={selectCouponTemporary}>
        {coupons?.length > 0 ? (
          coupons.map((coupon, index) => {
            return (
              <div key={index}>
                <div className={styles.coupon_container}>
                  <Radio value={coupon._id}></Radio>
                  <div className={styles.coupon_container__content}>
                    <div className={styles.coupon_container__content__left}>
                      <div
                        className={
                          styles.coupon_container__content__left__name_phone
                        }
                      >
                        {coupon.name}
                      </div>
                      <div
                        className={styles.coupon_container__content__left__text}
                      >
                        Ngày hết hạn: {coupon.expiry}
                      </div>
                      <div
                        className={styles.coupon_container__content__left__text}
                      >
                        Discount: {coupon.discount} %
                      </div>
                    </div>
                  </div>
                </div>
                <Divider />
              </div>
            );
          })
        ) : (
          <h3>Bạn không có voucher khuyến mãi nào.</h3>
        )}
      </Radio.Group>
    </Modal>
  );
}
