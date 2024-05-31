"use client";
import { Divider, Modal, Tabs, TabsProps } from "antd";
import styles from "./purchase.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/app/helper/stogare";
import { Button, Image } from "react-bootstrap";
import { useRouter } from "next/navigation";

const listStatusCart = [
  "",
  "notPaymentDone",
  "notShippedYet",
  "shipping",
  "shipped",
  "cancel",
];
export default function PurchasePage() {
  const token = getToken();
  const router = useRouter();
  const [changeTab, setChangeTab] = useState<boolean>(false);
  const [statusCarts, setStatusCarts] = useState<string>("");
  const [carts, setCarts] = useState<any>([]);

  const onChange = (key: string) => {
    setStatusCarts(listStatusCart[parseInt(key) - 1]);
    setChangeTab(!changeTab);
  };

  const [openModalConfirmCancelOrder, setOpenModalConfirmCancelOrder] =
    useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpenModalConfirmCancelOrder(true);
  };
  const handleCancel = () => {
    setOpenModalConfirmCancelOrder(false);
  };

  const handleCancelOrder = async (cartId: string) => {
    try {
      setConfirmLoading(true);
      const { data } = await axios.post(
        `${process.env.BASE_HOST}/order/cancel-order`,
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
        setOpenModalConfirmCancelOrder(false);
        setConfirmLoading(false);
        setChangeTab(!changeTab);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getCartsByStatus = async () => {
      const { data } = await axios.post(
        `${process.env.BASE_HOST}/cart/get-carts-by-status`,
        {
          status: statusCarts,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        setCarts(data.variantDetail);
      }
    };
    getCartsByStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeTab]);

  const handleBuyAgain = async (productId: string) => {
    try {
      const { data } = await axios.post(
        `${process.env.BASE_HOST}/product/get-a-product`,
        {
          _id: productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        router.replace(`/product/${data.product.slug}/${productId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePaymentOrder = async (
    cartId: string,
    productId: string,
    variantId: string,
    quantity: string,
    price: string
  ) => {
    const orderItems = [{ cartId, productId, variantId, quantity, price }];
    try {
      const { data } = await axios.post(
        `${process.env.BASE_HOST}/order/create-order`,
        {
          addressId: "6623d1a0f71ddedf65579800",
          couponId: "",
          orderItems,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        router.replace("/checkout");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getDisplayBtn = (
    status: string,
    cartId: string,
    productId: string,
    variantId: string,
    quantity: string,
    price: string
  ) => {
    switch (status) {
      case listStatusCart[1]:
        return (
          <div className={styles.one_button_container}>
            <Button
              className={`${styles.button} ${styles.button_payment}`}
              onClick={() =>
                handlePaymentOrder(
                  cartId,
                  productId,
                  variantId,
                  quantity,
                  price
                )
              }
            >
              Thanh toán
            </Button>
          </div>
        );
      case listStatusCart[2]:
        return (
          <div className={styles.one_button_container}>
            <Button
              className={`${styles.button} ${styles.button_cancel_order}`}
              onClick={showModal}
            >
              Hủy đơn
            </Button>
            <Modal
              title="Xác nhận hủy đơn hàng"
              open={openModalConfirmCancelOrder}
              onOk={() => handleCancelOrder(cartId)}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
            >
              <p>
                Nếu bạn đồng ý hủy không mua mặt hàng này sẽ đồng nghĩa với việc
                đơn hàng chứa mặt hàng này sẽ bị hủy toàn bộ.
              </p>
            </Modal>
          </div>
        );
      case listStatusCart[3]:
        return (
          <div className={styles.one_button_container}>
            <Button className={styles.button_follow_transport}>
              Xem quá trình vận chuyển
            </Button>
          </div>
        );
      case listStatusCart[4]:
        return (
          <div className={styles.button_container}>
            <Button
              className={`${styles.button} ${styles.button_buy_again}`}
              onClick={() => handleBuyAgain(productId)}
            >
              Mua lại
            </Button>
            <Button className={styles.button_rate}>Đánh giá shop</Button>
          </div>
        );
      case listStatusCart[5]:
        return (
          <div className={styles.one_button_container}>
            <Button
              className={`${styles.button} ${styles.button_buy_again}`}
              onClick={() => handleBuyAgain(productId)}
            >
              Mua lại
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const displayCarts = carts.length ? (
    <div className={styles.cart_container}>
      {carts.map((cart: any, index: number) => {
        const total_price = parseFloat(cart.price) * parseFloat(cart.quantity);
        return (
          <div className={styles.cart_content} key={index}>
            <div className={styles.main_content}>
              <div className={styles.cart_info}>
                <div className={styles.image_name_color_qty}>
                  <Image src={cart.image} alt="" className={styles.image} />
                  <div className={styles.name_color_qty}>
                    <div className={styles.name}>{cart.name}</div>
                    <div className={styles.color}>
                      Phân loại hàng: {cart.color}
                    </div>
                    <div className={styles.qty}>x{cart.quantity}</div>
                  </div>
                </div>
                <div className={styles.unit_price}>{cart.price} vnđ</div>
              </div>
              <Divider />
              <div className={styles.cart_bottom}>
                <div className={styles.total_price}>
                  Thành tiền: {total_price} vnđ
                </div>
                {getDisplayBtn(
                  cart.status_delivery,
                  cart.cartId.toString(),
                  cart.productId.toString(),
                  cart.variantId.toString(),
                  cart.quantity.toString(),
                  cart.price.toString()
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <h3>Không có đơn hàng nào để hiển thị!</h3>
  );

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Tất cả",
      children: displayCarts,
    },
    {
      key: "2",
      label: "Chờ thanh toán",
      children: displayCarts,
    },
    {
      key: "3",
      label: "Chưa vận chuyển",
      children: displayCarts,
    },
    {
      key: "4",
      label: "Đang vận chuyển",
      children: displayCarts,
    },
    {
      key: "5",
      label: "Đã hoàn thành",
      children: displayCarts,
    },
    {
      key: "6",
      label: "Đã hủy",
      children: displayCarts,
    },
  ];

  return (
    <div className={styles.container}>
      <title>Đơn hàng</title>
      <Tabs
        className={styles.tabs}
        defaultActiveKey="1"
        items={items}
        onChange={(activeKey) => onChange(activeKey)}
      />
    </div>
  );
}
