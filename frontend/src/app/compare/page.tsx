"use client";
import AppHeader from "@/components/appHeader";
import styles from "./compare.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Image } from "react-bootstrap";
import { toast } from "react-toastify";

export default function ComparePage() {
  const [compareList, setCompareList] = useState<IProduct[]>([]);
  const router = useRouter();
  const [userActive, setUserActive] = useState("");

  useEffect(() => {
    const storedCompareList = localStorage.getItem("compareList");
    if (storedCompareList) {
      setCompareList(JSON.parse(storedCompareList));
    }

    const userActiveCookie = Cookies.get("userActive");
    setUserActive(userActiveCookie || "");
  }, [router]);

  const handleRemoveFromCompare = (id: string) => {
    const updatedList = compareList.filter((item) => item._id !== id);
    setCompareList(updatedList);
    localStorage.setItem("compareList", JSON.stringify(updatedList));
    toast.success("Đã xóa sản phẩm khỏi danh sách so sánh.");
  };

  const handleRemoveAllFromCompare = () => {
    setCompareList([]);  // Clear the compare list
    localStorage.removeItem("compareList");  // Remove from localStorage
    toast.success("Đã xóa tất cả sản phẩm khỏi danh sách so sánh.");
  };

  const handleBackToProducts = () => {
    router.push("/");
  };

  const limitedCompareList = compareList.slice(0, 4);

  return (
    <div className={styles.container}>
      <AppHeader />
      <div className={styles.main_content}>
        <div className={styles.main_content__container}>
          <div className={styles.text}>
            <h1>
              Danh sách so sánh sản phẩm
              <button
                className={styles.clearAllButton}
                onClick={handleRemoveAllFromCompare}
              >
                Xóa tất cả
              </button>
            </h1>
            {limitedCompareList.length > 0 ? (
              <div className={styles.horizontalView}>
                {limitedCompareList.map((product) => (
                  <div key={product._id} className={styles.productCard}>
                    {/* Wrap only the image with a link */}
                    <a
                      href={
                        userActive !== "1"
                          ? "/buyer/signin"
                          : `/product/${product.slug}/${product._id}`
                      }
                    >
                      <div className={styles.productImageContainer}>
                        <Image
                          src={product.variants[0].image}
                          alt={product.name}
                          className={styles.productImage}
                        />
                      </div>
                    </a>
                    <h3>{product.name}</h3>
                    <div className={styles.detail_evaluate}>
                      {product?.totalRatings} <span className={styles.starIcon}>&#9733;</span>
                    </div>
                    <p className={styles.price}>{product.variants[0].price} vnđ</p>
                    <ul className={styles.specificationsList}>
                      <li>Bộ nhớ: {product.specifications.memory} GB</li>
                      <li>Pin: {product.specifications.pin} mAh</li>
                      <li>Ram: {product.specifications.ram} GB</li>
                      <li>Kích thước màn hình: {product.specifications.screen_size} inch</li>
                    </ul>
                    <button
                      className={styles.button_remove}
                      onClick={(e) => {
                        e.preventDefault(); // Prevent redirect when removing
                        handleRemoveFromCompare(product._id);
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <h3>Danh sách so sánh trống!</h3>
                <button className={styles.button_back}
                 onClick={handleBackToProducts}>Quay lại cửa hàng</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




