"use client";
import { Button } from "react-bootstrap";
import styles from "./addNew.module.css";
import { useState } from "react";
import axios from "axios";
import { getToken } from "@/app/helper/stogare";
import { Divider, message, Upload, UploadProps } from "antd";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { InboxOutlined } from "@ant-design/icons";

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
  const [variants, setVariants] = useState<any>([]);
  const [dataInput, setDataInput] = useState({
    name: "",
    slug: "",
    description: "",
    specifications: specifications,
    variants: variants,
    brand: "",
  });
  const handleSpecificationChange = (key: string, value: string) => {
    setSpecifications((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleVariantChange = (
    fieldName: string,
    index: number,
    value: string
  ) => {
    const updateVariant = variants.map((item: any, indexVariant: number) => {
      if (indexVariant === index) {
        return { ...item, [fieldName]: value };
      }
      return item;
    });
    setVariants(updateVariant);
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
    try {
      const { data } = await axios.post(
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
    } catch (error) {
      console.error(error);
    }
  };

  //handle upload image
  const { Dragger } = Upload;
  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: `${process.env.BASE_HOST}/app/uploadFiles`,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className={styles.container}>
      <h3>Add new product</h3>
      <div className={styles.content_container}>
        <div className={styles.section_container}>
          <div className={styles.text_title}>Thông tin cơ bản</div>
          <div className={styles.main_section}>
            <div className={styles.input_container}>
              <label htmlFor="" className={styles.label}>
                Tên sản phẩm
              </label>
              <input
                type="text"
                placeholder="Nhập tên sản phẩm"
                className={styles.input}
                value={dataInput.name}
                onChange={(e) =>
                  setDataInput((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className={styles.input_container}>
              <label htmlFor="" className={styles.label}>
                Slug
              </label>
              <input
                type="text"
                placeholder="Nhập slug"
                className={styles.input}
                value={
                  isChangedInputSlug ? dataInput.slug : slugify(dataInput.name)
                }
                onChange={(e) => {
                  setIsChangedInputSlug(true);
                  setDataInput((prev) => ({
                    ...prev,
                    slug: e.target.value,
                  }));
                }}
              />
            </div>
            <div className={styles.input_container}>
              <label htmlFor="" className={styles.label}>
                Mô tả sản phẩm
              </label>
              <input
                type="text"
                placeholder="Mô tả sản phẩm"
                className={styles.input}
                value={dataInput.description}
                onChange={(e) =>
                  setDataInput((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div className={styles.input_container}>
              <label htmlFor="" className={styles.label}>
                Nhãn hiệu
              </label>
              <select
                className={styles.input}
                value={dataInput.brand}
                onChange={(e) =>
                  setDataInput((prev) => ({ ...prev, brand: e.target.value }))
                }
              >
                <option value="">Select brand</option>
                <option value="iphone">Iphone</option>
                <option value="samsung">Sam sung</option>
                <option value="vivo">Vivo</option>
                <option value="huawei">Huawei</option>
                <option value="oppo">Oppo</option>
                <option value="mi">MI</option>
              </select>
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
                  <input
                    type="number"
                    placeholder="Kích thước màn hình"
                    className={styles.input_small}
                    value={specifications.screen_size}
                    onChange={(e) =>
                      handleSpecificationChange("screen_size", e.target.value)
                    }
                  />
                  <span className={styles.unit}>INCH</span>
                </li>
                <li className={styles.input_unit}>
                  <label htmlFor="" className={styles.label_child}>
                    Bộ nhớ điện thoại
                  </label>
                  <input
                    type="number"
                    placeholder="Bộ nhớ điện thoại"
                    className={styles.input_small}
                    value={specifications.memory}
                    onChange={(e) =>
                      handleSpecificationChange("memory", e.target.value)
                    }
                  />
                  <span className={styles.unit}>GB</span>
                </li>
                <li className={styles.input_unit}>
                  <label htmlFor="" className={styles.label_child}>
                    Dung lượng pin
                  </label>
                  <input
                    type="number"
                    placeholder="Dung lượng pin"
                    className={styles.input_small}
                    value={specifications.pin}
                    onChange={(e) =>
                      handleSpecificationChange("pin", e.target.value)
                    }
                  />
                  <span className={styles.unit}>mAh</span>
                </li>
                <li className={styles.input_unit}>
                  <label htmlFor="" className={styles.label_child}>
                    Bộ nhớ RAM
                  </label>
                  <input
                    type="number"
                    placeholder="Bộ nhớ RAM"
                    className={styles.input_small}
                    value={specifications.ram}
                    onChange={(e) =>
                      handleSpecificationChange("ram", e.target.value)
                    }
                  />
                  <span className={styles.unit}>GB</span>
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
                        <Dragger
                          {...props}
                          className={styles.upload_image}
                          onChange={(info) => {
                            const { status, response } = info.file;
                            if (status === "done") {
                              handleVariantChange("image", index, response.url);
                            }
                          }}
                        >
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">
                            Click vào đây để upload ảnh
                          </p>
                          <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly
                            prohibited from uploading company data or other
                            banned files.
                          </p>
                        </Dragger>
                      </li>
                      <li className={styles.input_unit}>
                        <label htmlFor="" className={styles.label_child}>
                          Màu sắc
                        </label>
                        <select
                          className={styles.input_small_select}
                          value={item.color}
                          onChange={(e) =>
                            handleVariantChange("color", index, e.target.value)
                          }
                        >
                          <option value="">Select color</option>
                          <option value="white">Trắng</option>
                          <option value="black">Đen</option>
                          <option value="blue">Xanh da trời</option>
                          <option value="violet">Tím</option>
                          <option value="brown">Nâu</option>
                        </select>
                      </li>
                      <li className={styles.input_unit}>
                        <label htmlFor="" className={styles.label_child}>
                          Số lượng
                        </label>
                        <input
                          type="number"
                          placeholder="Số lượng sản phẩm"
                          className={styles.input_small}
                          value={item.quantity}
                          onChange={(e) =>
                            handleVariantChange(
                              "quantity",
                              index,
                              e.target.value
                            )
                          }
                        />
                      </li>
                      <li className={styles.input_unit}>
                        <label htmlFor="" className={styles.label_child}>
                          Giá
                        </label>
                        <input
                          type="number"
                          placeholder="Giá sản phẩm"
                          className={styles.input_small}
                          value={item.price}
                          onChange={(e) =>
                            handleVariantChange("price", index, e.target.value)
                          }
                        />
                        <span className={styles.unit}>VNĐ</span>
                      </li>
                      <Button
                        className={styles.button_remove}
                        onClick={() => handleRemoveVariant(index)}
                      >
                        Xóa
                      </Button>
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
          <div>vận chuyển</div>
        </div>
        <div className={styles.button_container}>
          <Button className={styles.button} onClick={() => handleAddProduct()}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
