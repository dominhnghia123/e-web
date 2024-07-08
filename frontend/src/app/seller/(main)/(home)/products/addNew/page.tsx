"use client";
import {Button, Image} from "react-bootstrap";
import styles from "./addNew.module.css";
import {useEffect, useState} from "react";
import axios, {AxiosError} from "axios";
import {getToken} from "@/app/helper/stogare";
import {Divider, message, Upload, UploadProps} from "antd";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import slugify from "slugify";

export default function AddNewProduct() {
  const token = getToken();
  const router = useRouter();
  const [isChangedInputSlug, setIsChangedInputSlug] = useState(false);
  const [specifications, setSpecifications] = useState({
    screen_size: "",
    memory: "",
    pin: "",
    ram: "",
  });
  const [variant, setVariant] = useState({
    image: "",
    color: "",
    quantity: "",
    price: "",
  });
  const [variants, setVariants] = useState<any>([variant]);
  const [dataInput, setDataInput] = useState({
    name: "",
    slug: "",
    description: "",
    specifications: specifications,
    variants: variants,
    brand: "",
  });
  const [dataInputError, setDataInputError] = useState({
    name: "",
    slug: "",
    description: "",
    specifications: {
      screen_size: "",
      memory: "",
      pin: "",
      ram: "",
    },
    variants: variants.map(() => ({
      image: "",
      color: "",
      quantity: "",
      price: "",
    })),
    brand: "",
  });
  const handleSpecificationChange = (fieldName: string, value: string) => {
    setSpecifications((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    setDataInputError((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [fieldName]: "",
      },
    }));
  };

  const handleVariantChange = (
    fieldName: string,
    index: number,
    value: string
  ) => {
    const updateVariant = variants.map((item: any, indexVariant: number) => {
      if (indexVariant === index) {
        return {...item, [fieldName]: value};
      }
      return item;
    });
    setVariants(updateVariant);

    const updatedErrors = dataInputError.variants.map(
      (item: any, idx: number) => {
        if (idx === index) {
          return {...item, [fieldName]: ""};
        }
        return item;
      }
    );
    setDataInputError((prev) => ({
      ...prev,
      variants: updatedErrors,
    }));
  };

  const handleAddVariant = () => {
    setVariants([...variants, variant]);
    setVariant({
      image: "",
      color: "",
      quantity: "",
      price: "",
    });
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleAddProduct = async () => {
    const newSpecificationError = {
      screen_size:
        dataInput.specifications.screen_size === ""
          ? "Vui lòng nhập kích thước màn hình."
          : "",
      memory:
        dataInput.specifications.memory === ""
          ? "Vui lòng nhập bộ nhớ điện thoại."
          : "",
      pin:
        dataInput.specifications.pin === ""
          ? "Vui lòng nhập dung lượng pin."
          : "",
      ram:
        dataInput.specifications.ram === ""
          ? "Vui lòng nhập dung lượng RAM."
          : "",
    };
    const hasSpecificationsError = Object.values(newSpecificationError).some(
      (error) => error !== ""
    );
    if (hasSpecificationsError) {
      setDataInputError((prev) => ({
        ...prev,
        specifications: newSpecificationError,
      }));
      return;
    }

    const newVariantErrors = variants.map((variant: any) => {
      return {
        image: variant.image === "" ? "Vui lòng chọn ảnh." : "",
        color: variant.color === "" ? "Vui lòng chọn màu." : "",
        quantity: variant.quantity === "" ? "Vui lòng nhập số lượng." : "",
        price: variant.price === "" ? "Vui lòng nhập giá." : "",
      };
    });
    const hasErrorVariant = newVariantErrors.some((variantError: any) =>
      Object.values(variantError).some((error) => error !== "")
    );
    if (hasErrorVariant) {
      setDataInputError((prev) => ({
        ...prev,
        variants: newVariantErrors,
      }));
      return;
    }

    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/product/create-product`,
        {
          name: dataInput.name,
          slug: dataInput.slug,
          description: dataInput.description,
          specifications: specifications,
          variants: variants,
          brand: dataInput.brand,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        toast.success(data.msg);
        router.replace("/seller/products");
      }
    } catch (error: any) {
      const err = error as AxiosError<{
        message: {property: string; message: string}[];
      }>;
      if (err.response?.data?.message) {
        err.response.data.message?.forEach((value) => {
          if (value.property === "name") {
            setDataInputError((prev: any) => ({
              ...prev,
              name: value.message,
            }));
          }
          if (value.property === "slug") {
            setDataInputError((prev: any) => ({
              ...prev,
              slug: value.message,
            }));
          }
          if (value.property === "description") {
            setDataInputError((prev: any) => ({
              ...prev,
              description: value.message,
            }));
          }
          if (value.property === "brand") {
            setDataInputError((prev: any) => ({
              ...prev,
              brand: value.message,
            }));
          }
        });
      }
    }
  };

  //handle upload image
  const {Dragger} = Upload;
  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: `${process.env.BASE_HOST}/app/uploadFiles`,
    onChange(info) {
      const {status} = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`File ${info.file.name} được tải lên thành công.`);
      } else if (status === "error") {
        message.error(`File ${info.file.name} tải lên thất bại.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const [brands, setBrands] = useState<IBrand[]>([]);
  useEffect(() => {
    const getBrands = async () => {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/brand/get-all-brands`
      );
      if (data.status === true) {
        setBrands(data.brands);
      }
    };
    getBrands();
  }, []);

  const listBrands = brands.map((brand, index) => {
    return {
      id: index + 1,
      name: brand.name,
      url: brand.url,
    };
  });

  const onKeyDown = (event: any) => {
    if (event.key === "-") {
      event.preventDefault();
    }
  };

  return (
    <div className={styles.container}>
      <h3>Thêm mới sản phẩm</h3>
      <div className={styles.content_container}>
        <div className={styles.section_container}>
          <div className={styles.text_title}>Thông tin cơ bản</div>
          <div className={styles.main_section}>
            <div className={styles.input_container}>
              <label htmlFor="" className={styles.label}>
                Tên sản phẩm
              </label>
              <div className={styles.text_warning_input}>
                <input
                  type="text"
                  placeholder="Nhập tên sản phẩm"
                  className={styles.input}
                  value={dataInput.name}
                  onChange={(e) => {
                    setDataInput((prev) => ({...prev, name: e.target.value}));
                    setDataInputError((prev) => ({...prev, name: ""}));
                    !isChangedInputSlug
                      ? setDataInputError((prev) => ({...prev, slug: ""}))
                      : "";
                  }}
                />
                {dataInputError.name && (
                  <span className={styles.text_warning}>
                    {dataInputError.name}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.input_container}>
              <label htmlFor="" className={styles.label}>
                Slug
              </label>
              <div className={styles.text_warning_input}>
                <input
                  type="text"
                  placeholder="Nhập slug"
                  className={styles.input}
                  value={
                    isChangedInputSlug
                      ? dataInput.slug
                      : slugify(dataInput.name)
                  }
                  onChange={(e) => {
                    setIsChangedInputSlug(true);
                    setDataInput((prev) => ({
                      ...prev,
                      slug: e.target.value,
                    }));
                    setDataInputError((prev) => ({...prev, slug: ""}));
                  }}
                />
                {dataInputError.slug && (
                  <span className={styles.text_warning}>
                    {dataInputError.slug}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.input_textarea_container}>
              <label htmlFor="" className={styles.label}>
                Mô tả sản phẩm
              </label>
              <div className={styles.text_warning_input_textarea}>
                <textarea
                  placeholder="Mô tả sản phẩm"
                  className={styles.input_textarea}
                  value={dataInput.description}
                  onChange={(e) => {
                    setDataInput((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }));
                    setDataInputError((prev) => ({...prev, description: ""}));
                  }}
                />
                {dataInputError.description && (
                  <span className={styles.text_warning}>
                    {dataInputError.description}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.input_container}>
              <label htmlFor="" className={styles.label}>
                Nhãn hiệu
              </label>
              <div className={styles.text_warning_input}>
                <select
                  className={styles.input}
                  value={dataInput.brand}
                  onChange={(e) => {
                    setDataInput((prev) => ({...prev, brand: e.target.value}));
                    setDataInputError((prev) => ({...prev, brand: ""}));
                  }}
                >
                  <option value="">Select brand</option>
                  {listBrands.map((brand) => {
                    return (
                      <option value={`${brand.url}`} key={brand.id}>
                        {brand.name}
                      </option>
                    );
                  })}
                </select>
                {dataInputError.brand && (
                  <span className={styles.text_warning}>
                    {dataInputError.brand}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.specifications_container}>
              <label htmlFor="" className={styles.label_specifications}>
                Thông số kỹ thuật
              </label>
              <div className={styles.four_input_container}>
                <li className={styles.input_unit}>
                  <label htmlFor="" className={styles.label_child}>
                    Kích thước màn hình
                  </label>
                  <div className={styles.variant_input_container}>
                    <div>
                      <input
                        type="number"
                        min={0}
                        onKeyDown={onKeyDown}
                        placeholder="Kích thước màn hình"
                        className={styles.input_small}
                        value={specifications.screen_size}
                        onChange={(e) => {
                          handleSpecificationChange(
                            "screen_size",
                            e.target.value
                          );
                        }}
                      />
                      <span className={styles.unit}>INCH</span>
                    </div>
                    {dataInputError.specifications.screen_size && (
                      <span className={styles.text_warning}>
                        {dataInputError.specifications.screen_size}
                      </span>
                    )}
                  </div>
                </li>
                <li className={styles.input_unit}>
                  <label htmlFor="" className={styles.label_child}>
                    Bộ nhớ điện thoại
                  </label>
                  <div className={styles.variant_input_container}>
                    <div>
                      <input
                        type="number"
                        min={0}
                        onKeyDown={onKeyDown}
                        placeholder="Bộ nhớ điện thoại"
                        className={styles.input_small}
                        value={specifications.memory}
                        onChange={(e) => {
                          handleSpecificationChange("memory", e.target.value);
                        }}
                      />
                      <span className={styles.unit}>GB</span>
                    </div>
                    {dataInputError.specifications.memory && (
                      <span className={styles.text_warning}>
                        {dataInputError.specifications.memory}
                      </span>
                    )}
                  </div>
                </li>
                <li className={styles.input_unit}>
                  <label htmlFor="" className={styles.label_child}>
                    Dung lượng pin
                  </label>
                  <div className={styles.variant_input_container}>
                    <div>
                      <input
                        type="number"
                        min={0}
                        onKeyDown={onKeyDown}
                        placeholder="Dung lượng pin"
                        className={styles.input_small}
                        value={specifications.pin}
                        onChange={(e) => {
                          handleSpecificationChange("pin", e.target.value);
                        }}
                      />
                      <span className={styles.unit}>mAh</span>
                    </div>
                    {dataInputError.specifications.pin && (
                      <span className={styles.text_warning}>
                        {dataInputError.specifications.pin}
                      </span>
                    )}
                  </div>
                </li>
                <li className={styles.input_unit}>
                  <label htmlFor="" className={styles.label_child}>
                    Bộ nhớ RAM
                  </label>
                  <div className={styles.variant_input_container}>
                    <div>
                      <input
                        type="number"
                        min={0}
                        onKeyDown={onKeyDown}
                        placeholder="Bộ nhớ RAM"
                        className={styles.input_small}
                        value={specifications.ram}
                        onChange={(e) => {
                          handleSpecificationChange("ram", e.target.value);
                        }}
                      />
                      <span className={styles.unit}>GB</span>
                    </div>
                    {dataInputError.specifications.ram && (
                      <span className={styles.text_warning}>
                        {dataInputError.specifications.ram}
                      </span>
                    )}
                  </div>
                </li>
              </div>
            </div>
            <Divider />
            <div className={styles.variants_container}>
              <label htmlFor="" className={styles.label_variants}>
                Các mẫu loại
              </label>
              <div className={styles.variant_content}>
                {variants.map((item: any, index: number) => {
                  return (
                    <div className={styles.four_input_container} key={index}>
                      <li className={styles.input_unit_upload_image}>
                        <label htmlFor="" className={styles.label_child}>
                          Ảnh
                        </label>
                        {item?.image !== "" && (
                          <Image
                            src={item?.image}
                            alt=""
                            className={styles.variant_image}
                          />
                        )}
                        <Dragger
                          {...props}
                          className={styles.upload_image}
                          onChange={(info) => {
                            const {status, response} = info.file;
                            if (status === "done") {
                              handleVariantChange("image", index, response.url);
                            }
                          }}
                        >
                          <p className="ant-upload-text">
                            Click vào đây để upload ảnh
                          </p>
                        </Dragger>
                        {dataInputError.variants[index]?.image && (
                          <span className={styles.text_warning}>
                            {dataInputError.variants[index].image}
                          </span>
                        )}
                      </li>
                      <li className={styles.input_unit}>
                        <label htmlFor="" className={styles.label_child}>
                          Màu sắc
                        </label>
                        <div className={styles.variant_input_container}>
                          <select
                            className={styles.input_small_select}
                            value={item.color}
                            onChange={(e) => {
                              handleVariantChange(
                                "color",
                                index,
                                e.target.value
                              );
                            }}
                          >
                            <option value="">Select color</option>
                            <option value="white">Trắng</option>
                            <option value="black">Đen</option>
                            <option value="blue">Xanh da trời</option>
                            <option value="violet">Tím</option>
                            <option value="brown">Nâu</option>
                            <option value="pink">Hồng</option>
                          </select>
                          {dataInputError.variants[index]?.color && (
                            <span className={styles.text_warning}>
                              {dataInputError.variants[index].color}
                            </span>
                          )}
                        </div>
                      </li>
                      <li className={styles.input_unit}>
                        <label htmlFor="" className={styles.label_child}>
                          Số lượng
                        </label>
                        <div className={styles.variant_input_container}>
                          <input
                            type="number"
                            min={0}
                            onKeyDown={onKeyDown}
                            placeholder="Số lượng sản phẩm"
                            className={styles.input_small}
                            value={item.quantity}
                            onChange={(e) => {
                              handleVariantChange(
                                "quantity",
                                index,
                                e.target.value
                              );
                            }}
                          />
                          {dataInputError.variants[index]?.quantity && (
                            <span className={styles.text_warning}>
                              {dataInputError.variants[index].quantity}
                            </span>
                          )}
                        </div>
                      </li>
                      <li className={styles.input_unit}>
                        <label htmlFor="" className={styles.label_child}>
                          Giá
                        </label>
                        <div className={styles.variant_input_container}>
                          <div>
                            <input
                              type="number"
                              min={0}
                              onKeyDown={onKeyDown}
                              placeholder="Giá sản phẩm"
                              className={styles.input_small}
                              value={item.price}
                              onChange={(e) => {
                                handleVariantChange(
                                  "price",
                                  index,
                                  e.target.value
                                );
                              }}
                            />
                            <span className={styles.unit}>VNĐ</span>
                          </div>
                          {dataInputError.variants[index]?.price && (
                            <span className={styles.text_warning}>
                              {dataInputError.variants[index].price}
                            </span>
                          )}
                        </div>
                      </li>
                      {variants.length > 1 ? (
                        <Button
                          className={styles.button_remove}
                          onClick={() => handleRemoveVariant(index)}
                        >
                          Xóa
                        </Button>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}
              </div>
              <a
                onClick={() => handleAddVariant()}
                className={styles.link_add_variant}
              >
                Thêm mẫu mới
              </a>
            </div>
          </div>
        </div>
        <div className={styles.section_container}>
          <div className={styles.text_title}>Thông tin vận chuyển</div>
        </div>
        <div className={styles.button_container}>
          <Button className={styles.button} onClick={() => handleAddProduct()}>
            Tạo sản phẩm
          </Button>
        </div>
      </div>
    </div>
  );
}
