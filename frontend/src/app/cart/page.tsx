"use client";
import { Checkbox, Divider, InputNumber } from "antd";
import type {
  CheckboxOptionType,
  CheckboxProps,
  GetProp,
  InputNumberProps,
} from "antd";
import { useEffect, useState } from "react";
import styles from "./cart.module.css";
import { Button, Image } from "react-bootstrap";
import { RiDeleteBin6Line } from "react-icons/ri";
import CouponModal from "@/components/modal/couponModal/page";
import PickAddressModal from "@/components/modal/address/pickAddress/page";
import axios from "axios";
import { getToken } from "../helper/stogare";
import { toast } from "react-toastify";

type CheckboxValueType = GetProp<typeof Checkbox.Group, "value">[number];

const CheckboxGroup = Checkbox.Group;

export default function Cart() {
  const token = getToken();
  const onChangeQuantity: InputNumberProps["onChange"] = (value) => {
    console.log("changed", value);
  };
  const plainOptions: CheckboxOptionType<CheckboxValueType>[] = [
    { label: "Apple", value: "apple" },
    { label: "Pear", value: "pear" },
    { label: "Orange", value: "orange" },
  ];

  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [checkAll, setCheckAll] = useState(false);
  const indeterminate =
    checkedList.length > 0 && checkedList.length < plainOptions.length;

  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setCheckAll(list.length === plainOptions.length);
  };

  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    setCheckedList(
      e.target.checked
        ? plainOptions.map((option) => option.value as CheckboxValueType)
        : []
    );
    setCheckAll(e.target.checked);
  };

  //set up modal
  const [openPickAddressModal, setOpenPickAddressModal] = useState(false);
  const [openCouponModal, setOpenCouponModal] = useState(false);

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    "6623d1a0f71ddedf65579800"
  );
  const [selectedAddress, setSelectedAddress] = useState<IAddress | any>();
  useEffect(() => {
    const getAnAddress = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.BASE_HOST}/address/get-an-address`,
          {
            _id: selectedAddressId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.status === true) {
          setSelectedAddress(data.address);
        }
        if (data.status === false) {
          toast.error(data.msg);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getAnAddress();
  }, [selectedAddressId]);

  return (
    <div className={styles.cart}>
      <h1>Giỏ hàng</h1>
      <div className={styles.cart_container}>
        <div className={styles.cart_products_container}>
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
            className={styles.select_all_text}
          >
            Chọn tất cả
          </Checkbox>
          <Divider />
          <CheckboxGroup
            className={styles.options_container}
            value={checkedList}
            onChange={onChange}
          >
            {plainOptions.map((option, index) => (
              <div className={styles.option_container} key={index}>
                <Checkbox value={option.value}></Checkbox>
                <div className={styles.option_container__content}>
                  <div className={styles.image_title_container}>
                    <Image
                      src="/images/avatar.jpg"
                      alt=""
                      className={styles.image}
                    />
                    <div className={styles.title}>desc product</div>
                  </div>
                  <div className={styles.unit_price}>120.000$</div>
                  <InputNumber
                    min={1}
                    max={999}
                    defaultValue={1}
                    onChange={onChangeQuantity}
                    className={styles.quanity}
                  />
                  <div className={styles.total_price_for_item}>120.000$</div>
                  <RiDeleteBin6Line className={styles.icon_delete} />
                </div>
              </div>
            ))}
          </CheckboxGroup>
        </div>
        <div className={styles.cart_payment_container}>
          <div className={styles.payment_top}>
            <div className={styles.payment_top__text}>Giao tới</div>
            <a
              className={styles.payment_top__link}
              onClick={() => setOpenPickAddressModal(true)}
            >
              Chọn địa chỉ
            </a>
            <PickAddressModal
              openPickAddressModal={openPickAddressModal}
              setOpenPickAddressModal={setOpenPickAddressModal}
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId}
            />
          </div>
          {selectedAddress && (
            <div className={styles.payment_address}>
              <div className={styles.payment_address__name_phone}>
                {selectedAddress.username} {selectedAddress.phone}
              </div>
              <div className={styles.payment_address__detail}>
                {selectedAddress.address}
              </div>
            </div>
          )}
          <Divider />
          <div className={styles.payment_voucher}>
            <a
              className={styles.payment_voucher__link}
              onClick={() => setOpenCouponModal(true)}
            >
              Chọn voucher khuyến mãi
            </a>
            <CouponModal
              openCouponModal={openCouponModal}
              setOpenCouponModal={setOpenCouponModal}
            />
            <div className={styles.payment_voucher__container}>
              <div className={styles.payment_voucher__detail}>voucher 1</div>
              <div className={styles.payment_voucher__detail}>voucher 2</div>
            </div>
          </div>
          <Divider />
          <div className={styles.calc_money_container}>
            <div className={styles.calc_money_temp}>
              <div className={styles.calc_money_text}>Tạm tính</div>
              <div className={styles.calc_money_temp__value}>500.000đ</div>
            </div>
            <div className={styles.calc_money_voucher}>
              <div className={styles.calc_money_text}>Giảm giá</div>
              <div className={styles.calc_money_voucher__value}>10%</div>
            </div>
            <div className={styles.calc_money_total}>
              <div className={styles.calc_money_text}>Thành tiền</div>
              <div className={styles.calc_money_total__value}>450.000đ</div>
            </div>
          </div>
          <div className={styles.button_container}>
            <Button className={styles.button}>Mua hàng</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
