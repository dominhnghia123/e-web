"use client";
import styles from "../user.module.css";
import { Button, Image } from "react-bootstrap";
import { DatePicker, DatePickerProps, Radio } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/app/helper/stogare";

export default function ViewDetailUser({ params }: { params: { id: string } }) {
  const token = getToken();
  dayjs.extend(customParseFormat);
  const dateFormat = "YYYY-MM-DD";

  const [profile, setProfile] = useState<IUser | any>({});
  useEffect(() => {
    const getProfile = async () => {
      const { data } = await axios.post(
        `${process.env.BASE_HOST}/user/get-a-user`,
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
        setProfile(data.user);
      }
    };
    getProfile();
  }, []);

  return (
    <div>
      <title>Chi tiết người dùng</title>
      <h2>Thông tin người dùng</h2>
      {profile.avatar && (
        <div className={styles.avatar_container}>
          <Image src={profile.avatar} alt="" className={styles.avatar} />
        </div>
      )}
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
            <Radio.Group value={profile.gender}>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="other">Other</Radio>
            </Radio.Group>
          </div>
          <div className={styles.form__field}>
            <div className={styles.form__field__title}>Ngày sinh</div>
            <DatePicker
              value={
                profile.birthday ? dayjs(profile.birthday, dateFormat) : null
              }
              minDate={dayjs("1945-01-01", dateFormat)}
              maxDate={dayjs("2020-12-31", dateFormat)}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
