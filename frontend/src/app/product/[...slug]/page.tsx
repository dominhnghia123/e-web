"use client";
import AppHeader from "@/components/appHeader";
import styles from "./product.module.css";
import AppFooter from "@/components/appFooter";
import { Button, Image } from "react-bootstrap";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { BsCart4 } from "react-icons/bs";
import { Divider, Modal, Rate } from "antd";
import type { InputNumberProps } from "antd";
import { InputNumber } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { getToken } from "@/app/helper/stogare";
import { useRouter } from "next/navigation";

export default function ViewDetailProduct({
  params,
}: {
  params: { slug: string };
}) {
  const token = getToken();
  const router = useRouter();
  const [hasLove, setHasLove] = useState(false);

  const [quantity, setQuantity] = useState<number | any>(1);
  const onChangeQuantity: InputNumberProps["onChange"] = (value) => {
    setQuantity(value);
  };

  const [addToCart, setAddToCart] = useState(false);
  const handleAddToCart = async (type: string) => {
    try {
      if (selectedVariantId) {
        const { data } = await axios.post(
          `${process.env.BASE_HOST}/cart/add-to-cart`,
          {
            productId: params.slug[1],
            variantId: selectedVariantId,
            quantity: quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.status === true && type === "addToCart") {
          toast.success(data.msg);
          setAddToCart(true);
        }
        if (data.status === false && type === "addToCart") {
          toast.error(data.msg);
        }
        if (type === "buyNow") {
          router.replace("/cart");
        }
      } else {
        toast.warning("Vui lòng chọn loại sản phẩm bạn muốn.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  //get detail product
  const [product, setProduct] = useState<IProduct>();
  const [detailRatings, setDetailRatings] = useState<any>([]);

  const [selectedVariant, setSelectedVariant] = useState<number | any>(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | any>("");

  const quantityVariant: string | undefined =
    product?.variants[selectedVariant]?.quantity;
  const soldVariant: string | undefined =
    product?.variants[selectedVariant]?.sold;
  const inventoryVariant =
    quantityVariant &&
    soldVariant &&
    parseInt(quantityVariant) - parseInt(soldVariant);

  const [star, setStar] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [checkSubmitComment, setCheckSubmitComment] = useState(false);
  const handleSubmitComment = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.BASE_HOST}/product/create-rating`,
        {
          productId: params.slug[1],
          star: star,
          comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        showModal();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const showModal = () => {
    Modal.success({
      content:
        "Cảm ơn sự đóng góp của bạn, chúng tôi sẽ xem xét và cải thiện nếu có bất kỳ vấn đề gì khách hàng gặp phải.",
    });
    setComment("");
    setStar(0);
    setCheckSubmitComment(!checkSubmitComment);
  };

  useEffect(() => {
    const getAProduct = async () => {
      const { data } = await axios.post(
        `${process.env.BASE_HOST}/product/get-a-product`,
        {
          _id: params.slug[1],
        }
      );
      if (data.status === true) {
        setProduct(data.product);
      }
      if (data.status === false) {
        toast.error(data.msg);
      }
    };
    const getDetailRatings = async () => {
      const { data } = await axios.post(
        `${process.env.BASE_HOST}/product/get-ratings`,
        {
          _id: params.slug[1],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDetailRatings(data);
    };
    getAProduct();
    getDetailRatings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkSubmitComment]);

  return (
    <div className={styles.container}>
      <AppHeader changedCart={addToCart} setChangedCart={setAddToCart} />
      <main className={styles.main}>
        <div className={styles.main_container}>
          <div className={styles.order_part}>
            <div className={styles.images_textlove_container}>
              <div className={styles.images_container}>
                <div className={styles.images_container__main}>
                  <Image
                    src={product?.variants[0].image}
                    alt={product?.name}
                    className={styles.image_main}
                  />
                </div>
                <div className={styles.images_container__variants}>
                  {product?.variants.length &&
                    product.variants.map((variant, index) => {
                      return (
                        <Image
                          key={index}
                          src={variant.image}
                          alt=""
                          className={styles.image_variant}
                        />
                      );
                    })}
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
                <div className={styles.textlove__button}>
                  {product?.likes} yêu thích
                </div>
              </div>
            </div>
            <div className={styles.order_info_container}>
              <div className={styles.evaluate_container}>
                <div className={styles.detail_evaluate}>
                  {product?.totalRatings} sao
                </div>
                <div className={styles.devider_vertical}></div>
                <div className={styles.detail_evaluate}>
                  {product?.ratings.length} đánh giá
                </div>
                <div className={styles.devider_vertical}></div>
                <div className={styles.detail_evaluate}>
                  {product?.variants[selectedVariant]?.sold} đã bán
                </div>
              </div>
              <div className={styles.price_product}>
                {product?.variants[selectedVariant]?.price} vnđ
              </div>
              <div className={styles.detail_order_info}>
                <div className={styles.intro_product}>
                  <div className={styles.text}>Tên sản phẩm: </div>
                  <div className={styles.name_product}>{product?.name}</div>
                </div>
                <div className={styles.options_order_container}>
                  <div className={styles.variants_container}>
                    <div className={styles.text}>Mẫu</div>
                    <div className={styles.variants}>
                      {product?.variants.map((variant, index) => {
                        return (
                          <Button
                            key={index}
                            className={styles.variant_content}
                            onClick={() => {
                              setSelectedVariant(index);
                              setSelectedVariantId(variant._id);
                              setQuantity(1);
                            }}
                          >
                            <Image
                              src={variant.image}
                              alt=""
                              className={styles.variant_content__image}
                            />
                            <div className={styles.variant_content__text}>
                              {variant.color}
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                  <div className={styles.quantity_container}>
                    <div className={styles.text}>Số lượng</div>
                    <div className={styles.quantity}>
                      <div className={styles.quantity_pick}>
                        <InputNumber
                          min={1}
                          max={inventoryVariant}
                          defaultValue={1}
                          onChange={onChangeQuantity}
                          value={quantity}
                        />
                      </div>
                      <div className={styles.quantity_available}>
                        {inventoryVariant} sản phẩm có sẵn
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.buttons_container}>
                <Button
                  className={`${styles.button} ${styles.addToCart}`}
                  onClick={() => handleAddToCart("addToCart")}
                >
                  <BsCart4 className={styles.iconCart} />
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  className={`${styles.button} ${styles.buyNow}`}
                  onClick={() => {
                    handleAddToCart("buyNow");
                  }}
                >
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
                    {product?.description}
                  </div>
                  <Divider />
                  <div className={styles.content_desc_product__size}>
                    Thông số kỹ thuật:
                    <ul className={styles.specifications_container}>
                      <li>Bộ nhớ: {product?.specifications.memory} GB</li>
                      <li>Pin: {product?.specifications.pin} mAh</li>
                      <li>Ram: {product?.specifications.ram} GB</li>
                      <li>
                        Kích thước màn hình:{" "}
                        {product?.specifications.screen_size} inch
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.ratings_product}>
              <div className={styles.ratings_product__container}>
                <div className={styles.text_ratings}>Đánh giá sản phẩm</div>

                <div className={styles.comment_container}>
                  {detailRatings?.length ? (
                    <>
                      <div className={styles.total_star}>
                        {product?.totalRatings} / 5
                      </div>
                      {detailRatings.map((rating: any, index: number) => {
                        const createdAt = new Date(rating.createdAt);
                        const formattedCreatedAt = `${createdAt.getDate()}-${
                          createdAt.getMonth() + 1
                        }-${createdAt.getFullYear()}`;
                        return (
                          <div className={styles.detail_comment} key={index}>
                            <Image
                              src={
                                rating.posted.avatar ||
                                "/images/avatar_default.webp"
                              }
                              alt=""
                              className={styles.comment_avatar}
                            />
                            <div className={styles.comment_content}>
                              <div className={styles.comment_content__username}>
                                {rating.posted.username}
                              </div>
                              <div className={styles.comment_content__ratings}>
                                <Rate value={rating.star} />
                              </div>
                              <div className={styles.comment_content__time}>
                                {formattedCreatedAt}
                              </div>
                              <div className={styles.comment_content__desc}>
                                {rating.comment}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <h4>Chưa có đánh giá nào cho sản phẩm này.</h4>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.writing_evaluate}>
              <div className={styles.writing_evaluate_container}>
                <div className={styles.writing_evaluate_container__title}>
                  Viết đánh giá
                </div>
                <div className={styles.ratings_star_evaluate}>
                  <Rate
                    value={star}
                    onChange={(value: number) => setStar(value)}
                  />
                </div>
                <div className={styles.input_ratings_container}>
                  <input
                    type="text"
                    placeholder="Viết đánh giá cho sản phẩm"
                    className={styles.input_ratings}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <div className={styles.submit_evaluate_container}>
                  <Button
                    className={styles.submit_evaluate_container__button}
                    onClick={() => handleSubmitComment()}
                    disabled={!(star && comment)}
                  >
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
