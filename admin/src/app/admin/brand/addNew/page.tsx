"use client";
import { Button } from "react-bootstrap";
import styles from "./addNew.module.css";
import { useState } from "react";
import axios from "axios";
import { getToken } from "@/app/helper/stogare";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function AddNewBrand() {
  const token = getToken();
  const router = useRouter();
  const [dataInput, setDataInput] = useState({
    name: "",
  });

  const handleAddBrand = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.BASE_HOST}/brand/create-brand`,
        {
          name: dataInput.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (data.status === true) {
        toast.success(data.msg);
        router.replace('/admin/brand');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <title>Thêm mới thương hiệu</title>
      <h2>Thêm mới thương hiệu</h2>
      <div className={styles.main}>
        <div className={styles.main_content}>
          <div className={styles.input_label_container}>
            <label htmlFor="" className={styles.label}>
              Tên thương hiệu *
            </label>
            <input
              type="text"
              placeholder="Tên thương hiệu"
              className={styles.input}
              value={dataInput.name}
              onChange={(e) =>
                setDataInput((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className={`${styles.button_container}`}>
            <Button
              className={`${styles.button}`}
              onClick={() => handleAddBrand()}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
