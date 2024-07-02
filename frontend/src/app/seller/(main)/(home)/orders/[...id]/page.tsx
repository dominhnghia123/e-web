"use client";
import {getToken} from "@/app/helper/stogare";
import styles from "../orders.module.css";
import {useEffect, useState} from "react";
import axios from "axios";
import {Divider} from "antd";
import {Image} from "react-bootstrap";
import Link from "next/link";
import {OrderSellerConstant} from "@/app/helper/constant/OrderSellerConstant";
import {ProductConstant} from "@/app/helper/constant/ProductConstant";

export default function ViewDetailOrder({params}: {params: {id: string}}) {
  const token = getToken();
  const [cart, setCart] = useState<any>({});
  useEffect(() => {
    const getOrder = async () => {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/cart/get-carts-by-id`,
        {
          cartIds: params.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("aaaaa", data);
      if (data.status === true) {
        setCart(data.products[0]);
      }
    };
    getOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total_price = parseFloat(cart.price) * parseFloat(cart.quantity);

  return (
    <div className={styles.container}>
      <h3>Thông tin đơn hàng</h3>
      <div className={styles.cart_content}>
        <div className={styles.main_content}>
          <div className={styles.cart_info}>
            <div className={styles.image_name_color_qty}>
              <Image src={cart.image} alt="" className={styles.image} />
              <div className={styles.name_color_qty}>
                <Link
                  href={`/seller/products/${cart.slug}/${cart.productId}`}
                  className={styles.name}
                >
                  {cart.name}
                </Link>
                <div className={styles.color}>
                  Phân loại hàng:{" "}
                  {
                    ProductConstant.COLOR[
                      cart.color as keyof typeof ProductConstant.COLOR
                    ]
                  }
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
          </div>
        </div>
      </div>
      <h4>
        Trạng thái đơn hàng:{" "}
        <span className={styles.text_red}>
          {
            OrderSellerConstant.ORDER_STATUS_DELIVERY[
              cart.status_delivery as keyof typeof OrderSellerConstant.ORDER_STATUS_DELIVERY
            ]
          }
        </span>
      </h4>
    </div>
  );
}
