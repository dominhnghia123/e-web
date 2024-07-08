"use client";
import styles from "../user.module.css";
import {Button, Image} from "react-bootstrap";
import {DatePicker, Modal, Radio, RadioChangeEvent} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {useEffect, useState} from "react";
import axios from "axios";
import {getToken} from "@/app/helper/stogare";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {SlOptions} from "react-icons/sl";

export default function ViewDetailUser({params}: {params: {id: string}}) {
  const token = getToken();
  const router = useRouter();

  dayjs.extend(customParseFormat);
  const dateFormat = "YYYY-MM-DD";

  const [profile, setProfile] = useState<IUser | any>({});
  const getProfile = async () => {
    const {data} = await axios.post(
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
      setRole(data.user.role);
    }
  };
  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [role, setRole] = useState();
  const handleChangeRole = (e: RadioChangeEvent) => {
    setRole(e.target.value);
  };
  const handleSaveProfile = async () => {
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/user/change-role-for-user`,
        {
          userId: profile._id,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        toast.success(data.msg);
        router.replace("/admin/user");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/user/delete-a-user`,
        {
          _id: params.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        router.replace("/admin/user");
        toast.success(data.msg);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [openModal, setOpenModal] = useState(false);
  const handleOk = async () => {
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/user/cancel-sell-function`,
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
        setOpenModal(false);
        setProfile(data.user);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleCancel = () => {
    setOpenModal(false);
  };

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
          <div className={styles.form__field}>
            <div className={styles.form__field__title}>Đăng ký bán hàng</div>
            <Radio.Group value={profile.isSeller}>
              <Radio value={true}>Đã đăng ký</Radio>
              <Radio value={false}>Chưa đăng ký</Radio>
            </Radio.Group>
            {profile.isSeller && (
              <SlOptions
                className={styles.option_icon}
                onClick={() => setOpenModal(true)}
              />
            )}
          </div>
          <div className={styles.form__field}>
            <div className={styles.form__field__title}>Vai trò</div>
            <Radio.Group value={role} onChange={handleChangeRole}>
              <Radio value="admin">Admin</Radio>
              <Radio value="user">User</Radio>
            </Radio.Group>
          </div>
          <div className={styles.button_delete_container}>
            {role !== profile.role ? (
              <Button
                className={styles.button}
                onClick={() => handleSaveProfile()}
              >
                Lưu
              </Button>
            ) : (
              <div className={styles.div_empty}></div>
            )}
            <Button
              className={styles.button_delete}
              onClick={() => handleDeleteUser()}
            >
              Xóa người dùng
            </Button>
          </div>
        </form>
      </div>
      <Modal
        title={
          <div>
            <span style={{display: "block"}}>Hủy đăng ký bán hàng.</span>
            <span>
              Bạn có chắc chắn muốn hủy tính năng bán hàng của người dùng này
              không?
            </span>
          </div>
        }
        open={openModal}
        onOk={() => handleOk()}
        onCancel={handleCancel}
      />
    </div>
  );
}
