"use client";
import AppFooter from "@/components/appFooter";
import AppHeader from "@/components/appHeader";
import styles from "./profile.module.css";
import { Image } from "react-bootstrap";
import { RiAccountCircleLine } from "react-icons/ri";
import { FaShoppingBag } from "react-icons/fa";
import { useState } from "react";
import {
  Button,
  DatePicker,
  message,
  Radio,
  RadioChangeEvent,
  Upload,
  UploadProps,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { UploadOutlined } from "@ant-design/icons";

export default function ViewProfile() {
  const [gender, setGender] = useState("");
  const handleChangeGender = (e: RadioChangeEvent) => {
    setGender(e.target.value);
  };

  dayjs.extend(customParseFormat);
  const dateFormat = "YYYY-MM-DD";

  const props: UploadProps = {
    name: "file",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <>
      <div className={styles.content_header}>
        <div className={styles.content_header__title}>Hồ sơ của tôi</div>
        <div className={styles.content_header__text}>
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.content_main}>
        <form action="" className={styles.form}>
          <div className={styles.form__field}>
            <div className={styles.form__field__title}>Tên đăng nhập</div>
            <input
              type="text"
              value={"db"}
              className={styles.form__field__input}
            />
          </div>
          <div className={styles.form__field}>
            <div className={styles.form__field__title}>Địa chỉ email</div>
            <input
              type="text"
              value={"db"}
              className={styles.form__field__input}
            />
          </div>
          <div className={styles.form__field}>
            <div className={styles.form__field__title}>Số điện thoại</div>
            <input
              type="text"
              value={"db"}
              className={styles.form__field__input}
            />
          </div>
          <div className={styles.form__field}>
            <div className={styles.form__field__title}>Giới tính</div>
            <Radio.Group onChange={handleChangeGender} value={gender}>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="other">Other</Radio>
            </Radio.Group>
          </div>
          <div className={styles.form__field}>
            <div className={styles.form__field__title}>Ngày sinh</div>
            <DatePicker
              defaultValue={dayjs("2019-09-03", dateFormat)}
              minDate={dayjs("1945-01-01", dateFormat)}
              maxDate={dayjs("2020-12-31", dateFormat)}
            />
          </div>
          <button className={styles.button}>Lưu</button>
        </form>
        <div className={styles.avatar_edit_container}>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Click to Upload avatar</Button>
          </Upload>
        </div>
      </div>
    </>
  );
}
