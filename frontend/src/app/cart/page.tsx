"use client";
import {Checkbox, Divider, InputNumber} from "antd";
import type {
  CheckboxOptionType,
  CheckboxProps,
  GetProp,
  InputNumberProps,
} from "antd";
import {useEffect, useState} from "react";
import styles from "./cart.module.css";
import {Button, Image} from "react-bootstrap";
import {RiDeleteBin6Line} from "react-icons/ri";
import CouponModal from "@/components/modal/couponModal/page";
import PickAddressModal from "@/components/modal/address/pickAddress/page";
import axios from "axios";
import {getStogare, getToken} from "../helper/stogare";
import {toast} from "react-toastify";
import AppHeader from "@/components/appHeader";
import AppFooter from "@/components/appFooter";
import {useRouter} from "next/navigation";
import {useAppDispatch} from "@/redux/store";
import {getProductsCheckout} from "@/redux/features/checkout/checkoutSlice";

type CheckboxValueType = GetProp<typeof Checkbox.Group, "value">[number];
const CheckboxGroup = Checkbox.Group;

export default function Cart() {
  const token = getToken();
  const currentUserString = getStogare("currentUser");
  let currentUser: any = null;
  if (currentUserString) {
    currentUser = JSON.parse(currentUserString);
  }
  const router = useRouter();
  //handle change quantity product
  const [changeQuantity, setChangeQuantity] = useState(false);
  const [quantityPurchase, setQuantityPurchase] = useState();
  const onChangeQuantity: InputNumberProps["onChange"] | any = async (
    id: any,
    value: any
  ) => {
    const updateQuantity = plainOptions.map((option: any) => {
      if (option.cartId === id) {
        return {...option, quantity: value};
      }
      return option;
    });
    setPlainOptions(updateQuantity);
    const {data} = await axios.post(
      `${process.env.BASE_HOST}/cart/change-quantity-product`,
      {
        cartId: id,
        newQuantity: value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (data.status === true) {
      setChangeQuantity(!changeQuantity);
      setQuantityPurchase(value);
    }
  };

  //handle delete product from cart
  const [deleted, setDeleted] = useState(false);
  const handleDeleteProduct = async (cartId: string) => {
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/cart/remove-product`,
        {
          cartId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        setDeleted(true);
        if (checkedList.includes(cartId)) {
          const newCheckedList = checkedList.filter((item) => item !== cartId);
          setCheckedList(newCheckedList);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  //handle show product in cart
  const [plainOptions, setPlainOptions] = useState<
    CheckboxOptionType<CheckboxValueType>[] | any
  >([]);
  useEffect(() => {
    const getCarts = async () => {
      try {
        const {data} = await axios.post(
          `${process.env.BASE_HOST}/cart/get-cart-not-ordered-yet`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.status === true) {
          const cart = data.variantDetail.map((item: any) => {
            return {...item, value: item.cartId};
          });
          setPlainOptions(cart);
          setDeleted(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getCarts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleted]);

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
        ? plainOptions.map((option: any) => option.value as CheckboxValueType)
        : []
    );
    setCheckAll(e.target.checked);
  };

  const [totalPriceBeforeApllyCoupon, setTotalPriceBeforeApplyCoupon] =
    useState<number>(0);
  useEffect(() => {
    let totalPrice = 0;
    checkedList.forEach((cartId) => {
      const item = plainOptions.find(
        (plainOption: any) => plainOption.cartId.toString() === cartId
      );
      totalPrice += item.price * item.quantity;
    });
    setTotalPriceBeforeApplyCoupon(totalPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedList, changeQuantity]);

  //set up modal address
  const [openPickAddressModal, setOpenPickAddressModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    "666b23f5980641f8c29182cf"
  );
  const [selectedAddress, setSelectedAddress] = useState<IAddress | any>();
  useEffect(() => {
    const getAnAddress = async () => {
      try {
        const {data} = await axios.post(
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAddressId]);

  //set up modal coupon
  const [openCouponModal, setOpenCouponModal] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<string>("");
  const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | any>(
    undefined
  );
  useEffect(() => {
    const getACoupon = async () => {
      try {
        const {data} = await axios.post(
          `${process.env.BASE_HOST}/coupon/get-a-coupon`,
          {
            _id: selectedCouponId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.status === true) {
          setSelectedCoupon(data.coupon);
        }
        if (data.status === false) {
          toast.error(data.msg);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getACoupon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCouponId]);

  const dispatch = useAppDispatch();
  const handlePurchase = async () => {
    dispatch(
      getProductsCheckout({
        checkedList,
        quantityPurchase,
        selectedAddressId,
        selectedCouponId,
        totalPriceBeforeApllyCoupon,
      })
    );

    const {data} = await axios.post(
      `${process.env.BASE_HOST}/cart/get-carts-by-id`,
      {
        cartIds: checkedList,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const orderItems = data.products.map((item: any) => {
      return {
        cartId: item.cartId,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
      };
    });

    await axios.post(
      `${process.env.BASE_HOST}/order/create-order`,
      {
        user: currentUser._id,
        addressId: selectedAddressId,
        couponId: selectedCouponId || "",
        orderItems,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    router.replace(`/checkout`);
  };

  return (
    <div className={styles.container}>
      <AppHeader changedCart={deleted} setChangedCart={setDeleted} />
      <main className={styles.main}>
        <div className={styles.main_container}>
          <div className={styles.cart}>
            <h1>Giỏ hàng</h1>
            {plainOptions.length ? (
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
                    {plainOptions.map((option: any, index: number) => {
                      return (
                        <div className={styles.option_container} key={index}>
                          <Checkbox value={option.value}></Checkbox>
                          <div className={styles.option_container__content}>
                            <div
                              className={styles.option_container__content__main}
                            >
                              <div className={styles.image_title_container}>
                                <Image
                                  src={option.image}
                                  alt=""
                                  className={styles.image}
                                />
                                <div className={styles.title}>
                                  {option.name} ({option.color})
                                </div>
                              </div>
                              <div className={styles.unit_price}>
                                {option.price} đ
                              </div>
                              <InputNumber
                                min={1}
                                max={option.inventory_quantity - option.sold}
                                onChange={(value) =>
                                  onChangeQuantity(option.cartId, value)
                                }
                                className={styles.quanity}
                                value={option.quantity}
                              />
                              <div className={styles.total_price_for_item}>
                                {option.price * option.quantity} đ
                              </div>
                            </div>
                            <RiDeleteBin6Line
                              className={styles.icon_delete}
                              onClick={() => handleDeleteProduct(option.cartId)}
                            />
                          </div>
                        </div>
                      );
                    })}
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
                      selectedCouponId={selectedCouponId}
                      setSelectedCouponId={setSelectedCouponId}
                    />
                    <div className={styles.payment_voucher__container}>
                      <div className={styles.payment_voucher__detail}>
                        {selectedCoupon?.name}
                      </div>
                    </div>
                  </div>
                  <Divider />
                  <div className={styles.calc_money_container}>
                    <div className={styles.calc_money_temp}>
                      <div className={styles.calc_money_text}>Tạm tính</div>
                      <div className={styles.calc_money_temp__value}>
                        {totalPriceBeforeApllyCoupon} đ
                      </div>
                    </div>
                    {selectedCoupon && (
                      <div className={styles.calc_money_voucher}>
                        <div className={styles.calc_money_text}>Giảm giá</div>
                        <div className={styles.calc_money_voucher__value}>
                          {selectedCoupon?.discount}%
                        </div>
                      </div>
                    )}
                    <div className={styles.calc_money_total}>
                      <div className={styles.calc_money_text}>Phí ship</div>
                      <div className={styles.calc_money_voucher__value}>
                        Free
                      </div>
                    </div>
                    <div className={styles.calc_money_total}>
                      <div className={styles.calc_money_text}>Thành tiền</div>
                      <div className={styles.calc_money_total__value}>
                        {selectedCoupon
                          ? (totalPriceBeforeApllyCoupon *
                              (100 - selectedCoupon?.discount)) /
                            100
                          : totalPriceBeforeApllyCoupon}
                        đ
                      </div>
                    </div>
                  </div>
                  <div className={styles.button_container}>
                    <Button
                      className={styles.button}
                      onClick={() => handlePurchase()}
                    >
                      Mua hàng
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <h4>Không có sản phẩm nào trong giỏ hàng</h4>
            )}
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
