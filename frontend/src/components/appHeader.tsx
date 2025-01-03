"use client";
import {Button} from "react-bootstrap";
import {FiShoppingCart} from "react-icons/fi";
import {FaShopify} from "react-icons/fa6";
import styles from "../app/app.module.css";
import Cookies from "js-cookie";
import {getStogare, getToken, removeStogare} from "@/app/helper/stogare";
import {MouseEvent, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import {toast} from "react-toastify";
import {useAppDispatch} from "@/redux/store";
import {
  getProductsBySearchError,
  getProductsBySearchStart,
  getProductsBySearchSuccess,
} from "@/redux/features/product/productSlice";
import {Spin} from "antd";

interface IProps {
  changedCart?: boolean;
  setChangedCart?: (value: boolean) => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}

export default function AppHeader(props: IProps) {
  const router = useRouter();
  const token = getToken();

  const [userActive, setUserActive] = useState("");
  useEffect(() => {
    const userActiveCookie = Cookies.get("userActive");
    setUserActive(userActiveCookie || "");
  }, [router]);

  let currentUser;
  const currentUserString = getStogare("currentUser")?.trim();
  if (currentUserString) {
    currentUser = JSON.parse(currentUserString);
  }

  const [openOptionsMenu, setOpenOptionsMenu] = useState(false);
  const handleLogout = () => {
    props.setIsLoading?.(true);
    Cookies.remove("userActive");
    Cookies.remove("refreshToken");
    removeStogare("currentUser");
    router.replace("/");
  };

  const [getCarts, setGetCarts] = useState([]);
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
          setGetCarts(data.variantDetail);
          props.setChangedCart?.(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (Cookies.get("userActive") === "1") {
      getCarts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.changedCart]);

  //handle search
  const dispatch = useAppDispatch();
  const [keySearch, setKeySearch] = useState("");
  const handleSearch = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(getProductsBySearchStart());
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/product/get-products-by-brand?s=${keySearch}&page=1&limit=10`,
        {
          brand: "",
        }
      );
      if (data.status === true) {
        dispatch(getProductsBySearchSuccess({...data, keySearch}));
        props.setIsLoading?.(true);
        router.replace("/search");
      }
      if (data.status === false) {
        dispatch(getProductsBySearchError());
        toast.error(data.msg);
      }
    } catch (error) {
      dispatch(getProductsBySearchError());
      console.error(error);
    }
  };

  const contentStyle: React.CSSProperties = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };

  const content = <div style={contentStyle} />;

  return (
    <>
      {props.isLoading && (
        <div className={styles.loading_container}>
          <div className={styles.loading}>
            <Spin tip="Loading" size="large">
              {content}
            </Spin>
          </div>
        </div>
      )}
      <header className={styles.header}>
        <div className={styles.header__header_top}>
          <nav className={styles.header__header_top__nav_container}>
            <div className={styles.header__header_top__nav_container__left}>
              <a
                href={
                  userActive === "1"
                    ? currentUser?.isSeller
                      ? "/seller"
                      : "/register-seller"
                    : "/seller/signin"
                }
                className={styles.header__header_top__nav_container__left__link}
                onClick={() => props.setIsLoading?.(true)}
              >
                Trang người bán
              </a>
              {userActive !== "1" && (
                <a
                  href="/seller/signup"
                  className={
                    styles.header__header_top__nav_container__left__link
                  }
                  onClick={() => props.setIsLoading?.(true)}
                >
                  Trở thành người bán ShopS
                </a>
              )}
            </div>
            <div className={styles.header__header_top__nav_container__right}>
              {userActive !== "1" ? (
                <div>
                  <a
                    href="/buyer/signup"
                    className={
                      styles.header__header_top__nav_container__right__link
                    }
                    onClick={() => props.setIsLoading?.(true)}
                  >
                    Đăng ký
                  </a>
                  <a
                    href="/buyer/signin"
                    className={
                      styles.header__header_top__nav_container__right__link
                    }
                    onClick={() => props.setIsLoading?.(true)}
                  >
                    Đăng nhập
                  </a>
                </div>
              ) : (
                <div
                  className={
                    styles.header__header_top__nav_container__right__link_container
                  }
                >
                  <a
                    className={
                      styles.header__header_top__nav_container__right__link
                    }
                    onClick={() => setOpenOptionsMenu(!openOptionsMenu)}
                  >{`Hi, ${currentUser?.username}`}</a>
                  {openOptionsMenu && (
                    <div className={styles.options_menu_container}>
                      <a
                        className={styles.option_menu}
                        href="/user/account/profile"
                        onClick={() => props.setIsLoading?.(true)}
                      >
                        Tài khoản của tôi
                      </a>
                      <a
                        className={styles.option_menu}
                        onClick={() => handleLogout()}
                      >
                        Đăng xuất
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
        <div className={styles.header__header_bottom}>
          <div className={styles.header__header_bottom__container}>
            <div
              className={styles.header__header_bottom__container__logo_section}
            >
              <FaShopify
                className={
                  styles.header__header_bottom__container__logo_section__logo
                }
              />
              <a
                href={userActive !== "1" ? "/" : "/buyer"}
                className={
                  styles.header__header_bottom__container__logo_section__link
                }
                onClick={() => props.setIsLoading?.(true)}
              >
                ShopS
              </a>
            </div>
            <div
              className={
                styles.header__header_bottom__container__search_section
              }
            >
              <form
                action=""
                className={
                  styles.header__header_bottom__container__search_section__form
                }
              >
                <div
                  className={
                    styles.header__header_bottom__container__search_section__form__input_container
                  }
                >
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className={
                      styles.header__header_bottom__container__search_section__form__input_container__input
                    }
                    value={keySearch}
                    onChange={(e) => setKeySearch(e.target.value)}
                  />
                  <Button
                    type="submit"
                    className={
                      styles.header__header_bottom__container__search_section__form__input_container__button
                    }
                    onClick={(e) => handleSearch(e)}
                  >
                    Tìm kiếm
                  </Button>
                </div>
              </form>
            </div>
            <div
              className={styles.header__header_bottom__container__cart_section}
            >
              <FiShoppingCart
                onClick={() => {
                  props.setIsLoading?.(true);
                  userActive !== "1"
                    ? router.replace("/buyer/signin")
                    : router.replace("/cart");
                }}
                className={styles.iconCart}
              />
              {userActive === "1" && (
                <span className={styles.number}>{getCarts.length}</span>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
