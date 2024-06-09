"use client";
import {Divider, Radio} from "antd";
import {useEffect, useState} from "react";
import styles from "./checkout.module.css";
import {Button, Image} from "react-bootstrap";
import CouponModal from "@/components/modal/couponModal/page";
import PickAddressModal from "@/components/modal/address/pickAddress/page";
import axios from "axios";
import {getToken} from "../helper/stogare";
import {toast} from "react-toastify";
import AppHeader from "@/components/appHeader";
import AppFooter from "@/components/appFooter";
import {RootState, useAppSelector} from "@/redux/store";
import {useRouter} from "next/navigation";

export default function Checkout() {
  const router = useRouter();
  const token = getToken();
  const cartIdsRedux: string[] | any = useAppSelector((state: RootState) => {
    return state.checkoutReducer?.getProductsCheckout?.checkedList;
  });
  const voucherIdRedux: string | any = useAppSelector((state: RootState) => {
    return state.checkoutReducer?.getProductsCheckout?.voucherId;
  });
  const addressIdRedux: string | any = useAppSelector((state: RootState) => {
    return state.checkoutReducer?.getProductsCheckout?.addressId;
  });
  //set up modal address
  const [openPickAddressModal, setOpenPickAddressModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] =
    useState<string>(addressIdRedux);
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
  const [selectedCouponId, setSelectedCouponId] =
    useState<string>(voucherIdRedux);
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
        console.log("222", data);
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

  const [products, setProducts] = useState<any>([]);
  useEffect(() => {
    const getCarts = async () => {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/cart/get-carts-by-id`,
        {
          cartIds: cartIdsRedux,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        setProducts(data.products);
      }
    };
    getCarts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartIdsRedux]);

  const [totalPriceBeforeApllyCoupon, setTotalPriceBeforeApplyCoupon] =
    useState<string | any>();

  useEffect(() => {
    const getOrderPending = async () => {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/order/get-user-order-pending`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        setProducts(data.order.orderItems);
        setSelectedCouponId(data.order.coupon);
        setSelectedAddressId(data.order.address);
        setTotalPriceBeforeApplyCoupon(data.order.totalPrice);
      }
    };
    getOrderPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePayment = async () => {
    //update cart: Remove products to be purchased from the shopping cart
    try {
      await axios.post(
        `${process.env.BASE_HOST}/cart/update-status-delivery-many-products`,
        {
          cartIds: products.map((product: any) => product.cartId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }

    // thanh toán đơn hàng
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/order/payment-order`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.replace(data.url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <AppHeader />
      <main className={styles.main}>
        <div className={styles.main_container}>
          <div className={styles.cart}>
            <h1>Thanh toán</h1>
            <div className={styles.cart_container}>
              <div className={styles.cart_products_container}>
                <div className={styles.title_head}>
                  <div className={`${styles.text_title_head} ${styles.name}`}>
                    Sản phẩm
                  </div>
                  <div
                    className={`${styles.text_title_head} ${styles.unit_price}`}
                  >
                    Đơn giá
                  </div>
                  <div
                    className={`${styles.text_title_head} ${styles.quantity}`}
                  >
                    Số lượng
                  </div>
                  <div
                    className={`${styles.text_title_head} ${styles.total_money}`}
                  >
                    Thành tiền
                  </div>
                </div>
                {products?.map((option: any, index: number) => {
                  return (
                    <div className={styles.option_container} key={index}>
                      <div className={styles.option_container__content}>
                        <div className={styles.option_container__content__main}>
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
                          <div className={`${styles.unit_price}`}>
                            {option.price} đ
                          </div>
                          <div className={`${styles.quantity}`}>
                            {option.quantity}
                          </div>
                          <div className={`${styles.total_money}`}>
                            {option.price * option.quantity} đ
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <Radio value="">Thanh toán qua Stripe</Radio>
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
                    <div className={styles.calc_money_voucher__value}>Free</div>
                  </div>
                  <div className={styles.calc_money_total}>
                    <div className={styles.calc_money_text}>Thành tiền</div>
                    <div className={styles.calc_money_total__value}>
                      {selectedCoupon
                        ? (parseFloat(totalPriceBeforeApllyCoupon) *
                            (100 - selectedCoupon?.discount)) /
                          100
                        : parseFloat(totalPriceBeforeApllyCoupon)}
                      đ
                    </div>
                  </div>
                </div>
                <div className={styles.button_container}>
                  <Button
                    className={styles.button}
                    onClick={() => handlePayment()}
                  >
                    Đặt hàng
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
