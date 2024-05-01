"use client";
import { Image } from "react-bootstrap";
import styles from "../app/app.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

interface IProps {
  brand: string;
}

export default function AppContent(props: IProps) {
  const { brand } = props;

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const [userActive, setUserActive] = useState("");
  useEffect(() => {
    const userActiveCookie = Cookies.get("userActive");
    setUserActive(userActiveCookie || "");
  }, [router]);

  //get products
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
            brand: brand ? brand : "",
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
  }, [currentPage, itemsPerPage]);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
    router.push(`?page=${selected + 1}&limit=${itemsPerPage}`);
  };

  return (
    <div className={styles.content}>
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
                      >
                        <div className={styles.product_container__image}>
                          <Image
                            src={product.variants[0].image}
                            alt=""
                            style={{ height: "100%", width: "100%" }}
                          />
                        </div>
                        <div className={styles.product_container__desc}>
                          <div
                            className={styles.product_container__desc__title}
                          >
                            {product.name}
                          </div>
                          <div
                            className={
                              styles.product_container__desc__price_sold
                            }
                          >
                            <div className={styles.price}>
                              {product.variants[0].price} vnđ
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
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}
                    previousLabel="< previous"
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
    </div>
  );
}
