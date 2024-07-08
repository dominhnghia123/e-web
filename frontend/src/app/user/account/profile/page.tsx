"use client";
import styles from "./profile.module.css";
import React, {useContext, useEffect, useState} from "react";
import {
  DatePicker,
  DatePickerProps,
  message,
  Radio,
  RadioChangeEvent,
  Upload,
  UploadProps,
  Button,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {UploadOutlined} from "@ant-design/icons";
import {getStogare, getToken} from "@/app/helper/stogare";
import axios from "axios";
import {toast} from "react-toastify";
import ButtonReactBootStrap from "react-bootstrap/Button";
import {PageContext} from "../../layout";
import AppLoading from "@/components/appLoading";
import {Image} from "react-bootstrap";

export default function ViewProfile() {
  const {setIsChangeProfile} = useContext(PageContext);
  const [isLoading, setIsLoading] = useState(false);

  const currentUserString = getStogare("currentUser");
  const currentUser = JSON.parse(currentUserString);
  const token = getToken();

  //get profile
  const [profile, setProfile] = useState<IUser | any>({});
  useEffect(() => {
    const getProfile = async () => {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/user/get-a-user`,
        {
          _id: currentUser._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.status === true) {
        setProfile(data.user);
      }
      if (data.status === false) {
        toast.error(data.msg);
      }
    };
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gender
  const [gender, setGender] = useState("");
  const handleChangeGender = (e: RadioChangeEvent) => {
    setGender(e.target.value);
  };

  //Birthday
  dayjs.extend(customParseFormat);
  const dateFormat = "YYYY-MM-DD";

  const [birthday, setBirthday] = useState<string | any>(profile.birthday);
  const handleChangeBirthday: DatePickerProps["onChange"] = (
    date,
    dateString
  ) => {
    setBirthday(dateString);
  };

  useEffect(() => {
    setGender(profile.gender);
    setBirthday(profile.birthday);
    setUrl(profile.avatar);
  }, [profile]);

  //upload file
  const [url, setUrl] = useState("");
  const props: UploadProps = {
    name: "file",
    action: `${process.env.BASE_HOST}/app/uploadFiles`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`File ${info.file.name} được tải lên thành công.`);
        setUrl(info.file.response.url);
      } else if (info.file.status === "error") {
        message.error(`File ${info.file.name} tải lên thất bại.`);
      }
    },
  };

  //update profile
  const handleUpdateProfile = async () => {
    setIsChangeProfile(false);
    setIsLoading(true);
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/user/update-user`,
        {
          _id: currentUser._id,
          gender: gender,
          birthday: birthday,
          avatar: url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        setIsChangeProfile(true);
        setIsLoading(false);
        setUrl("");
        toast.success(data.msg);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isLoading && <AppLoading />}
      <div className={styles.content_header}>
        <div className={styles.content_header__title}>Hồ sơ của tôi</div>
        <div className={styles.content_header__text}>
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.content_main}>
        <form className={styles.form}>
          <div className={styles.form__field}>
            <div className={styles.form__field__title}>Tên đăng nhập</div>
            <input
              type="text"
              className={styles.form__field__input}
              value={profile.username}
              disabled
            />
          </div>
          <div className={styles.form__field}>
            <div className={styles.form__field__title}>Địa chỉ email</div>
            <input
              type="text"
              className={styles.form__field__input}
              value={profile.email}
              disabled
            />
          </div>
          <div className={styles.form__field}>
            <div className={styles.form__field__title}>Số điện thoại</div>
            <input
              type="text"
              className={styles.form__field__input}
              value={profile.mobile}
              disabled
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
              value={birthday ? dayjs(birthday, dateFormat) : null}
              minDate={dayjs("1945-01-01", dateFormat)}
              maxDate={dayjs("2020-12-31", dateFormat)}
              onChange={handleChangeBirthday}
            />
          </div>
          <ButtonReactBootStrap
            className={styles.button}
            onClick={() => handleUpdateProfile()}
          >
            Lưu
          </ButtonReactBootStrap>
        </form>
        <div className={styles.avatar_edit_container}>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Click to Upload avatar</Button>
          </Upload>
          {url && <Image src={url} alt="" className={styles.avatar_img} />}
        </div>
      </div>
    </>
  );
}
