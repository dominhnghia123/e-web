"use client";
import AppHeader from "@/components/appHeader";
import styles from "./product.module.css";
import AppFooter from "@/components/appFooter";
import { Button, Image } from "react-bootstrap";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";
import { BsCart4 } from "react-icons/bs";
import { Rate } from "antd";
import type { InputNumberProps } from "antd";
import { InputNumber } from "antd";

export default function ViewDetailProduct({
  params,
}: {
  params: { slug: string };
}) {
  console.log("params", params);
  const [hasLove, setHasLove] = useState(false);

  const onChangeQuantity: InputNumberProps["onChange"] = (value) => {
    console.log("changed", value);
  };

  const arr = new Array(8).fill(1);

  return (
    <div className={styles.container}>
      <AppHeader />
      <main className={styles.main}>
        <div className={styles.main_container}>
          <div className={styles.order_part}>
            <div className={styles.images_textlove_container}>
              <div className={styles.images_container}>
                <div className={styles.images_container__main}>
                  <Image
                    src="/images/avatar.jpg"
                    alt=""
                    className={styles.image_main}
                  />
                </div>
                <div className={styles.images_container__variants}>
                  <Image
                    src="/images/avatar.jpg"
                    alt=""
                    className={styles.image_variant}
                  />
                  <Image
                    src="/images/avatar.jpg"
                    alt=""
                    className={styles.image_variant}
                  />
                  <Image
                    src="/images/avatar.jpg"
                    alt=""
                    className={styles.image_variant}
                  />
                  <Image
                    src="/images/avatar.jpg"
                    alt=""
                    className={styles.image_variant}
                  />
                </div>
              </div>
              <div
                className={styles.textlove}
                onClick={() => setHasLove(!hasLove)}
              >
                {hasLove ? (
                  <FaHeart className={styles.iconLove} />
                ) : (
                  <FaRegHeart className={styles.iconLove} />
                )}
                <div className={styles.textlove__button}>28 yeu thich</div>
              </div>
            </div>
            <div className={styles.order_info_container}>
              <div className={styles.evaluate_container}>
                <div className={styles.detail_evaluate}>4.6 sao</div>
                <div className={styles.devider_vertical}></div>
                <div className={styles.detail_evaluate}>1000 đánh giá</div>
                <div className={styles.devider_vertical}></div>
                <div className={styles.detail_evaluate}>2000 đã bán</div>
              </div>
              <div className={styles.price_product}>90.000Đ</div>
              <div className={styles.detail_order_info}>
                <div className={styles.delivery_container}>
                  <div className={styles.text}>Vận chuyển</div>
                  <ul className={styles.detail_delivery}>
                    <li className={styles.fee_shipping}>Phí vận chuyển</li>
                    <li className={styles.address_shipping}>Địa chỉ</li>
                  </ul>
                </div>
                <div className={styles.options_order_container}>
                  <div className={styles.variants_container}>
                    <div className={styles.text}>Mẫu</div>
                    <div className={styles.variants}>
                      {arr.map((item, index) => {
                        return (
                          <Button key={index} className={styles.variant_content}>
                            <Image
                              src="/images/avatar.jpg"
                              alt=""
                              className={styles.variant_content__image}
                            />
                            <div className={styles.variant_content__text}>
                              Trắng
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                  <div className={styles.size_container}>
                    <div className={styles.text}>Size</div>
                    <div className={styles.size}>
                      {
                        arr.map((item, index) => {
                          return (
                            <Button key={index} className={styles.size_content}>
                              M: 45-50kg &lt; 1m65
                            </Button>
                          );
                        })
                      }
                    </div>
                  </div>
                  <div className={styles.quantity_container}>
                    <div className={styles.text}>Số lượng</div>
                    <div className={styles.quantity}>
                      <div className={styles.quantity_pick}>
                        <InputNumber
                          min={1}
                          max={999}
                          defaultValue={1}
                          onChange={onChangeQuantity}
                        />
                      </div>
                      <div className={styles.quantity_available}>
                        900 sản phẩm có sẵn
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.buttons_container}>
                <Button className={`${styles.button} ${styles.addToCart}`}>
                  <BsCart4 className={styles.iconCart} />
                  Thêm vào giỏ hàng
                </Button>
                <Button className={`${styles.button} ${styles.buyNow}`}>
                  Mua ngay
                </Button>
              </div>
            </div>
          </div>
          <div className={styles.detail_product_part}>
            <div className={styles.desc_product_container}>
              <div className={styles.desc_product_container__main}>
                <div className={styles.text_desc_product}>Mô tả sản phẩm</div>
                <div className={styles.content_desc_product}>
                  <div className={styles.content_desc_product__feature}>
                    Quần dài thể thao nam ống suông nhẹ chất poly lưng thun co
                    giãn - Chất liệu thun Poly co giãn 4 chiều tạo cảm giác
                    thoải mái khi mặc - Đặc biệt không nhăn không nhàu - Kiểu
                    dáng trơn đơn giản dễ mặc - Quần có 3 túi 2 túi sườn 1 túi
                    sau - 4 màu Đen,Than,Xám,Ghi
                  </div>
                  <div className={styles.devider_horizontal}></div>
                  <div className={styles.content_desc_product__size}>
                    Bảng size:M-3XL 48-88kg M48-59kg L 60-67kg XL 68-74kg 2XL
                    75-81kg 3XL 82-88kg
                  </div>
                  <div className={styles.devider_horizontal}></div>
                  <div className={styles.content_desc_product__text_bonus}>
                    Khách Hàng được kiểm tra quần trước khi thanh toán Hàng
                    xưởng việt nam sản xuất - Cam kết mang đến cho khách hàng
                    những sản phẩm với chất lượng tốt nhất trong tầm giá - Cam
                    kết chính sách bảo hành tốt nhất (Hỗ trợ đổi size, Hỗ trợ
                    đổi Sản phẩm lỗi) theo quy định của shopee - Nếu quá thời
                    hạn 3 ngày kể từ ngày nhận đơn hàng, chế độ bảo hành sẽ hết
                    hiệu lực
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.ratings_product}>
              <div className={styles.ratings_product__container}>
                <div className={styles.text_ratings}>Đánh giá sản phẩm</div>
                <div className={styles.total_star}>4.7 / 5</div>
                <div className={styles.comment_container}>
                  <div className={styles.detail_comment}>
                    <Image
                      src="/images/avatar.jpg"
                      alt=""
                      className={styles.comment_avatar}
                    />
                    <div className={styles.comment_content}>
                      <div className={styles.comment_content__username}>
                        Username
                      </div>
                      <div className={styles.comment_content__ratings}>
                        4 sao
                      </div>
                      <div className={styles.comment_content__time}>time</div>
                      <div className={styles.comment_content__desc}>
                        desc comment
                      </div>
                    </div>
                  </div>
                  <div className={styles.detail_comment}>
                    <Image
                      src="/images/avatar.jpg"
                      alt=""
                      className={styles.comment_avatar}
                    />
                    <div className={styles.comment_content}>
                      <div className={styles.comment_content__username}>
                        Username
                      </div>
                      <div className={styles.comment_content__ratings}>
                        4 sao
                      </div>
                      <div className={styles.comment_content__time}>time</div>
                      <div className={styles.comment_content__desc}>
                        desc comment
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.writing_evaluate}>
              <div className={styles.writing_evaluate_container}>
                <div className={styles.writing_evaluate_container__title}>
                  Viết đánh giá
                </div>
                <div className={styles.ratings_star_evaluate}>
                  <Rate />
                </div>
                <div className={styles.input_ratings_container}>
                  <input
                    type="text"
                    placeholder="Viết đánh giá cho sản phẩm"
                    className={styles.input_ratings}
                  />
                </div>
                <div className={styles.submit_evaluate_container}>
                  <Button className={styles.submit_evaluate_container__button}>
                    Gửi
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
