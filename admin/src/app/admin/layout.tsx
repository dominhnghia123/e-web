"use client";
import styles from "./admin.module.css";
import React, { createContext, useEffect, useState } from "react";
import {
  AppstoreOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Divider, Layout, Menu, theme } from "antd";
import { RiCoupon4Line } from "react-icons/ri";
import { Image } from "react-bootstrap";
import { IoMdNotificationsOutline } from "react-icons/io";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getStogare, getToken, removeStogare } from "../helper/stogare";

const { Header, Sider, Content } = Layout;

interface PageContextType {
  setUpdateNoti: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PageContext = createContext<PageContextType>({
  setUpdateNoti: () => {}, // Default value
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const adminString = getStogare("admin").trim();
  let admin;
  if (adminString) {
    admin = JSON.parse(adminString);
  }
  const token = getToken();
  const router = useRouter();
  const [openPopupNoti, setOpenPopupNoti] = useState(false);
  const [openOptionsMenu, setOpenOptionsMenu] = useState(false);
  const [updateNoti, setUpdateNoti] = useState<boolean | any>(false);
  const handleLogout = () => {
    Cookies.remove("adminActive");
    removeStogare("admin");
    router.replace("/");
  };

  const [requests, setRequests] = useState<any>([]);
  useEffect(() => {
    const getRequests = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.BASE_HOST}/requestSeller/get-requests-become-seller`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data?.status === true) {
          setRequests(data.getRequests);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateNoti]);

  const calculateTimeAgo = (timestamp: any) => {
    const currentTime = new Date().getTime();
    const createdAt = new Date(timestamp).getTime();
    const timeDifference = Math.abs(currentTime - createdAt);
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);

    if (daysDifference > 0) {
      return `${daysDifference} ngày trước`;
    } else if (hoursDifference > 0) {
      return `${hoursDifference} giờ trước`;
    } else {
      return `${minutesDifference} phút trước`;
    }
  };

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={styles.sider_container}
      >
        <div className={styles.logo_container}>
          <h2 className={styles.logo_text}>
            {collapsed ? (
              <span className={styles.sm_logo}>
                <HomeOutlined />
              </span>
            ) : (
              <span className={styles.lg_logo}>Trang chủ</span>
            )}
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <AppstoreOutlined />,
              label: "Thống kê",
              onClick: () => {
                router.replace("/admin");
              },
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: "Quản lý người dùng",
              onClick: () => {
                router.replace("/admin/user");
              },
            },
            {
              key: "3",
              icon: <RiCoupon4Line />,
              label: "Khuyến mãi",
              onClick: () => {
                router.replace("/admin/coupon");
              },
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className={styles.header_container}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div className={styles.header_right_container}>
              <div className={styles.notifycation_container}>
                <IoMdNotificationsOutline
                  className={styles.icon_noti}
                  onClick={() => setOpenPopupNoti(!openPopupNoti)}
                />
                {requests?.length > 0 && (
                  <span className={styles.count_noti}>{requests.length}</span>
                )}
                {openPopupNoti && (
                  <div className={styles.show_noti_container}>
                    <div className={styles.noti_content}>
                      {requests.length ? (
                        requests.map((request: any, index: number) => {
                          return (
                            <div
                              key={index}
                              onClick={() => {
                                router.push(
                                  `/admin/notifycation/${request._id}`
                                );
                                setOpenPopupNoti(false);
                              }}
                            >
                              <div className={styles.item_noti}>
                                <Image
                                  src={
                                    request.userId.avatar
                                      ? request.userId.avatar
                                      : "/images/avatar_default.jpg"
                                  }
                                  alt="avatar"
                                  className={styles.image_noti}
                                />
                                <div className={styles.item_noti_right}>
                                  <div className={styles.username_noti}>
                                    {request.userId.username}
                                  </div>
                                  <div className={styles.text_noti}>
                                    Đã gửi yêu cầu đăng ký bán hàng (
                                    {calculateTimeAgo(request.createdAt)})
                                  </div>
                                </div>
                              </div>
                              <Divider />
                            </div>
                          );
                        })
                      ) : (
                        <h3>Không có thông báo nào.</h3>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.info_container}>
                <Image src="/images/avatar.jpg" alt="" className={styles.avatar} />
                <div
                  className={styles.username_email_container}
                  onClick={() => setOpenOptionsMenu(!openOptionsMenu)}
                >
                  <div className={styles.username}>{admin?.username}</div>
                  <div className={styles.email}>{admin?.email}</div>
                </div>
                {openOptionsMenu && (
                  <div className={styles.options_menu_container}>
                    <a
                      className={styles.option_menu}
                      onClick={() => handleLogout()}
                    >
                      Đăng xuất
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <PageContext.Provider value={{ setUpdateNoti }}>
            {children}
          </PageContext.Provider>
        </Content>
      </Layout>
    </Layout>
  );
}
