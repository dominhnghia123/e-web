"use client";
import { Image } from "react-bootstrap";
import styles from "../app/app.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import AppLoading from "./appLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldAlt, faExchangeAlt, faCheckCircle, faTruck } from "@fortawesome/free-solid-svg-icons";

interface IProps {
  selectedCategory?: string; // Nhận danh mục đã chọn
}

export default function AppContent(props: IProps) {
  const { selectedCategory } = props;

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const [userActive, setUserActive] = useState("");
  useEffect(() => {
    const userActiveCookie = Cookies.get("userActive");
    setUserActive(userActiveCookie || "");
  }, [router]);

  // Get all products
  const [products, setProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.BASE_HOST}/product/get-products-by-brand?page=${currentPage}&limit=${itemsPerPage}`,
          {
            brand: selectedCategory ? selectedCategory : "", // Lọc sản phẩm theo danh mục nếu có
          }
        );
        if (data.status === true) {
          setProducts(data.products);
          setItemsPerPage(data.limit);
          setPageCount(Math.ceil(data.totalProducts / data.limit));
        }
        if (data.status === false) {
          toast.error(data.msg);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, selectedCategory]); // Thêm selectedCategory vào dependencies

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
    router.push(`?page=${selected + 1}&limit=${itemsPerPage}`);
  };

  const [isLoading, setIsLoading] = useState(false);

  const lowestPriceProducts = products
    .sort((a, b) => a.variants[0].price - b.variants[0].price)
    .slice(0, 6);

  return (
    <div className={styles.content}>
      {isLoading && <AppLoading />}
      <div className={styles.content__main_container}>
        <div className={styles.main_head}>GỢI Ý HÔM NAY</div>
        <div className={styles.main_content}>
          <div className={styles.main_content__container}>
            {products.length ? (
              <div className={styles.products_pagination}>
                <div className={styles.products}>
                  {products.map((product, index) => {
                    const soldArr = product.variants.map((variant) => ({
                      sold: variant.sold,
                    }));
                    const totalSold = soldArr.reduce(
                      (a, b) => ({
                        sold: (parseInt(a.sold) + parseInt(b.sold)).toString(),
                      }),
                      { sold: "0" }
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
                        onClick={() => setIsLoading(true)}
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
                          <div className={styles.product_container__desc__price_sold}>
                            <div className={styles.price}>
                              {Number(product.variants[0].price).toLocaleString("vi-VN")} vnđ
                            </div>
                            <div className={styles.sold}>
                              Đã bán {totalSold}
                            </div>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
                <div className={styles.pagination_container}>
                  <ReactPaginate
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}
                    previousLabel="<"
                    pageClassName={styles.page_item}
                    pageLinkClassName={styles.page_link}
                    previousClassName={styles.page_item}
                    previousLinkClassName={styles.page_link}
                    nextClassName={styles.page_item}
                    nextLinkClassName={styles.page_link}
                    breakLabel="..."
                    breakClassName={styles.page_item}
                    breakLinkClassName={styles.page_link}
                    containerClassName="pagination"
                    activeClassName={styles.active}
                    renderOnZeroPageCount={null}
                    className={styles.react_pagination}
                    forcePage={page ? parseInt(page) - 1 : 0}
                  />
                </div>
              </div>
            ) : (
              <h4 style={{ textAlign: "center" }}>
                Hiện tại chưa có sản phẩm nào thuộc hãng này.
              </h4>
            )}
          </div>
        </div>
      </div>

      <div className={styles.content__main_container}>
        <div className={styles.main_head}>SẢN PHẨM BÁN CHẠY NHẤT</div>
        <div className={styles.main_content}>
          <div className={styles.main_content__container}>
            {products.length ? (
              <div className={styles.products}>
                {products
                  .map((product) => {
                    const totalSold = product.variants
                      .map((variant) => parseInt(variant.sold))
                      .reduce((a, b) => a + b, 0);
                    return { ...product, totalSold };
                  })
                  .sort((a, b) => b.totalSold - a.totalSold)
                  .slice(0, 6)
                  .map((product, index) => (
                    <a
                      className={styles.product_container}
                      key={index}
                      href={
                        userActive !== "1"
                          ? "/buyer/signin"
                          : `/product/${product.slug}/${product._id}`
                      }
                      onClick={() => setIsLoading(true)}
                    >
                      <div className={styles.product_container__image}>
                        <Image
                          src={product.variants[0].image}
                          alt={product.name}
                          style={{ height: "100%", width: "100%" }}
                        />
                      </div>
                      <div className={styles.product_container__desc}>
                        <div className={styles.product_container__desc__title}>
                          {product.name}
                        </div>
                        <div className={styles.product_container__desc__price_sold}>
                          <div className={styles.price}>
                            {Number(product.variants[0].price).toLocaleString("vi-VN")} vnđ
                          </div>
                          <div className={styles.sold}>
                            Đã bán {product.totalSold}
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
              </div>
            ) : (
              <h4 style={{ textAlign: "center" }}>
                Hiện tại chưa có sản phẩm bán chạy nào.
              </h4>
            )}
          </div>
        </div>
      </div>

      <div className={styles.content__main_container}>
        <div className={styles.main_head}>SẢN PHẨM ĐẠI HẠ GIÁ</div>
        <div className={styles.main_content}>
          <div className={styles.main_content__container}>
            {lowestPriceProducts.length ? (
              <div className={styles.products}>
                {lowestPriceProducts.map((product, index) => (
                  <a
                    className={styles.product_container}
                    key={index}
                    href={
                      userActive !== "1"
                        ? "/buyer/signin"
                        : `/product/${product.slug}/${product._id}`
                    }
                    onClick={() => setIsLoading(true)}
                  >
                    <div className={styles.product_container__image}>
                      <Image
                        src={product.variants[0].image}
                        alt={product.name}
                        style={{ height: "100%", width: "100%" }}
                      />
                    </div>
                    <div className={styles.product_container__desc}>
                      <div className={styles.product_container__desc__title}>
                        {product.name}
                      </div>
                      <div className={styles.product_container__desc__price_sold}>
                        <div className={styles.price}>
                          {Number(product.variants[0].price).toLocaleString("vi-VN")} vnđ
                        </div>
                        <div className={styles.sold}>
                          Đã bán {product.totalSold}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <h4 style={{ textAlign: "center" }}>
                Hiện tại chưa có sản phẩm đại hạ giá nào.
              </h4>
            )}
          </div>
        </div>
      </div>

      <div className={styles.brandIconsContainer}>
        <div className={styles.brandIcon}>
          <FontAwesomeIcon icon={faShieldAlt} className={styles.icon} />
          <p>Thương hiệu đảm bảo</p>
        </div>
        <div className={styles.brandIcon}>
          <FontAwesomeIcon icon={faExchangeAlt} className={styles.icon} />
          <p>Đổi trả dễ dàng</p>
        </div>
        <div className={styles.brandIcon}>
          <FontAwesomeIcon icon={faCheckCircle} className={styles.icon} />
          <p>Sản phẩm chất lượng</p>
        </div>
        <div className={styles.brandIcon}>
          <FontAwesomeIcon icon={faTruck} className={styles.icon} />
          <p>Giao hàng tận nơi</p>
        </div>
      </div>
    </div>
  );
}
