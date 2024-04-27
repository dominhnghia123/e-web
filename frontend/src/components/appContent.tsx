"use client";
import { Image } from "react-bootstrap";
import styles from "../app/app.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";

interface IProps {
  brand: string;
}

export default function AppContent(props: IProps) {
  const { brand } = props;

  const router = useRouter();
  const [userActive, setUserActive] = useState("");
  useEffect(() => {
    const userActiveCookie = Cookies.get("userActive");
    setUserActive(userActiveCookie || "");
  }, [router]);

  //get products
  const [products, setProducts] = useState<IProduct[]>([]);
  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.BASE_HOST}/product/get-product-by-brand`,
          {
            brand: brand ? brand : "",
          }
        );
        if (data.status === true) {
          setProducts(data.products);
        }
        if (data.status === false) {
          toast.error(data.msg);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getProducts();
  }, []);

  return (
    <div className={styles.content}>
      <div className={styles.content__main_container}>
        <div className={styles.main_head}>GỢI Ý HÔM NAY</div>
        <div className={styles.main_content}>
          <div className={styles.main_content__container}>
            {products.length ? (
              products.map((product, index) => {
                const soldArr = product.variants.map((variant) => ({
                  sold: variant.sold,
                }));
                const totalSold = soldArr.reduce(
                  (a: { sold: number }, b: { sold: number }) => ({
                    sold: a.sold + b.sold,
                  }),
                  { sold: 0 }
                ).sold;
                return (
                  <a
                    className={styles.product_container}
                    key={index}
                    href={
                      userActive !== "1"
                        ? "/buyer/signin"
                        : `/product/${product.slug}/${product._id}`
                    }
                  >
                    <div className={styles.product_container__image}>
                      <Image
                        src={product.variants[0].image}
                        alt=""
                        style={{ height: "100%", width: "100%" }}
                      />
                    </div>
                    <div className={styles.product_container__desc}>
                      <div className={styles.product_container__desc__title}>
                        {product.name}
                      </div>
                      <div
                        className={styles.product_container__desc__price_sold}
                      >
                        <div className={styles.price}>
                          {product.variants[0].price} vnđ
                        </div>
                        <div className={styles.sold}>Đã bán {totalSold}</div>
                      </div>
                    </div>
                  </a>
                );
              })
            ) : (
              <h4>Hiện tại chưa có sản phẩm nào thuộc hãng này.</h4>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
