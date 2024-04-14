"use client";
import { Checkbox, Divider, InputNumber } from "antd";
import type {
  CheckboxOptionType,
  CheckboxProps,
  GetProp,
  InputNumberProps,
} from "antd";
import { useState } from "react";
import styles from "./cart.module.css";
import { Button, Image } from "react-bootstrap";
import { RiDeleteBin6Line } from "react-icons/ri";
import AddressModal from "@/components/modal/addressModal/page";
import CouponModal from "@/components/modal/couponModal/page";

type CheckboxValueType = GetProp<typeof Checkbox.Group, "value">[number];

const CheckboxGroup = Checkbox.Group;

export default function Cart() {
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
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [openCouponModal, setOpenCouponModal] = useState(false);

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
            {plainOptions.map((option) => (
              <div className={styles.option_container}>
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
              onClick={() => setOpenAddressModal(true)}
            >
              Thay đổi
            </a>
            <AddressModal
              openAddressModal={openAddressModal}
              setOpenAddressModal={setOpenAddressModal}
            />
          </div>
          <div className={styles.payment_address}>
            <div className={styles.payment_address__name_phone}>
              Nguyễn Văn Hiển 0975191025
            </div>
            <div className={styles.payment_address__detail}>
              Ngách 78 ngõ 169, phường hoàng văn thụ, quận hoàng mai, hà nội,
              Phường Hoàng Văn Thụ, Quận Hoàng Mai, Hà Nội
            </div>
          </div>
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
