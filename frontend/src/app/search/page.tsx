"use client";
import AppHeader from "@/components/appHeader";
import styles from "./search.module.css";
import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import Cookies from "js-cookie";
import {Image} from "react-bootstrap";
import {RootState, useAppSelector} from "@/redux/store";
import axios from "axios";
import {toast} from "react-toastify";
import ReactPaginate from "react-paginate";
import {Spin} from "antd";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const [userActive, setUserActive] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const userActiveCookie = Cookies.get("userActive");
    setUserActive(userActiveCookie || "");
  }, [router]);

  const productsRedux: IProduct[] | any = useAppSelector((state: RootState) => {
    return state.productReducer?.getProductsBySearch?.products;
  });
  const pageRedux: number | any = useAppSelector((state: RootState) => {
    return state.productReducer?.getProductsBySearch?.page;
  });
  const limitRedux: string | any = useAppSelector((state: RootState) => {
    return state.productReducer?.getProductsBySearch?.limit;
  });
  const keySearchRedux: string | any = useAppSelector((state: RootState) => {
    return state.productReducer?.getProductsBySearch?.keySearch;
  });

  const [products, setProducts] = useState<IProduct[]>(productsRedux);
  const [currentPage, setCurrentPage] = useState(pageRedux | 1);
  const [itemsPerPage, setItemsPerPage] = useState(limitRedux | 10);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const {data} = await axios.post(
          `${process.env.BASE_HOST}/product/get-products-by-brand?s=${keySearchRedux}&page=${currentPage}&limit=${itemsPerPage}`,
          {
            brand: "",
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
  }, [currentPage, itemsPerPage, keySearchRedux]);

  const handlePageClick = ({selected}: {selected: number}) => {
    setCurrentPage(selected + 1);
    router.push(`?page=${selected + 1}&limit=${itemsPerPage}`);
  };

  const contentStyle: React.CSSProperties = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };

  const content = <div style={contentStyle} />;

  return (
    <div className={styles.container}>
      <AppHeader />
      {isLoading && (
        <div className={styles.loading}>
          <Spin tip="Loading" size="large">
            {content}
          </Spin>
        </div>
      )}
      <div className={styles.main_content}>
        <div className={styles.main_content__container}>
          <div className={styles.text}>
            Kết quả tìm kiếm cho từ khóa &quot;
            <span style={{fontStyle: "italic"}}>
              {keySearchRedux}
            </span> &quot;{" "}
          </div>
          <div className={styles.products_pagination}>
            <div className={styles.products}>
              {products?.map((product: IProduct, index: number) => {
                const soldArr = product.variants.map((variant) => ({
                  sold: variant.sold,
                }));
                const totalSold = soldArr.reduce(
                  (a, b) => ({
                    sold: (parseInt(a.sold) + parseInt(b.sold)).toString(),
                  }),
                  {sold: "0"}
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
                        style={{height: "100%", width: "100%"}}
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
              })}
            </div>
            <div className={styles.pagination_container}>
              <ReactPaginate
                nextLabel=" >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={pageCount}
                previousLabel="< "
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
        </div>
      </div>
    </div>
  );
}
