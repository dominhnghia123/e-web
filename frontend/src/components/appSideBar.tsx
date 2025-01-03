"use client";
import { usePathname } from "next/navigation";
import styles from "../app/app.module.css";
import axios from "axios";
import { useEffect, useState } from "react";

interface IProps {
  setIsLoading?: (value: boolean) => void;
  onCategorySelect?: (category: string) => void; // Callback to pass selected category
}

interface IBrand {
  name: string;
  url: string;
}

export default function AppSideBar(props: IProps) {
  const pathname = usePathname();
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);

  useEffect(() => {
    const getBrands = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.BASE_HOST}/brand/get-all-brands`
        );
        if (data.status === true) {
          setBrands(data.brands);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    getBrands();
  }, []);

  const listBrands = brands.map((brand, index) => ({
    id: index + 1,
    name: brand.name,
    url: brand.url,
  }));

  const toggleCategory = () => {
    setIsCategoryOpen((prevState) => !prevState);
  };

  // Handle category selection and pass it to the parent component
  const handleCategorySelect = (category: string) => {
    props.onCategorySelect?.(category);
    setIsCategoryOpen(false); // Optionally close the category dropdown after selecting
  };

  return (
    <div className={styles.sideBar}>
      <div className={styles.sideBar__container}>
        {/* Title remains visible */}
        <div className={styles.title} onClick={toggleCategory}>
          Danh mục
          <span
            className={`${styles.arrow} ${
              isCategoryOpen ? styles.arrow_up : styles.arrow_down
            }`}
          >
            ▼
          </span>
        </div>

        {/* Brand List */}
        <div
          className={`${styles.optionsContainer} ${
            isCategoryOpen ? styles.optionsContainerOpen : ""
          }`}
        >
          {isCategoryOpen && (
            <>
              <div className={styles.options}>
                <a
                  href={pathname === "/" ? "/" : "/buyer"}
                  className={`${styles.options__link} ${
                    pathname === "/" || pathname === "/buyer"
                      ? styles.options__link_focus
                      : ""
                  }`}
                  onClick={() => {
                    props.setIsLoading?.(true);
                    handleCategorySelect(""); // Select 'All' category when on main page
                  }}
                >
                  Tất cả
                </a>
              </div>
              {listBrands.length ? (
                listBrands.map((brand) => (
                  <div className={styles.options} key={brand.id}>
                    <a
                      href={`/buyer/${brand.url}`}
                      className={`${styles.options__link} ${
                        pathname === `/buyer/${brand.url}`
                          ? styles.options__link_focus
                          : ""
                      }`}
                      onClick={() => {
                        props.setIsLoading?.(true);
                        handleCategorySelect(brand.name); // Pass the selected brand name
                      }}
                    >
                      {brand.name}
                    </a>
                  </div>
                ))
              ) : (
                <div style={{ height: "300px" }}></div>
              )}
            </>
          )}
        </div>

        <div className={styles.imageContainer}>
          <img src="/images/1-1.png" alt="Image 1" className={styles.image} />
          <img src="/images/2-2.png" alt="Image 2" className={styles.image} />
          <img src="/images/2025-1.png" alt="Image 3" className={styles.image} />
          <img src="/images/2025-2.png" alt="Image 4" className={styles.image} />
        </div>
      </div>
    </div>
  );
}
