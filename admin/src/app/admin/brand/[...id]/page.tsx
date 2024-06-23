"use client";
import styles from "../addNew/addNew.module.css";
import {Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {getToken} from "@/app/helper/stogare";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";

export default function ViewDetailBrand({params}: {params: {id: string}}) {
  const token = getToken();
  const router = useRouter();
  const [dataInput, setDataInput] = useState({
    name: "",
  });

  useEffect(() => {
    const getBrand = async () => {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/brand/get-a-brand`,
        {
          _id: params.id[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        setDataInput({
          name: data.brand.name,
        });
      }
    };
    getBrand();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateBrand = async () => {
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/brand/update-brand`,
        {
          _id: params.id[0],
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
        router.replace("/admin/brand");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <title>Chi tiết thương hiệu</title>
      <h2>Thông tin thương hiệu</h2>
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
                setDataInput((prev) => ({...prev, name: e.target.value}))
              }
            />
          </div>
          <div className={`${styles.button_container}`}>
            <Button
              className={`${styles.button}`}
              onClick={() => handleUpdateBrand()}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
