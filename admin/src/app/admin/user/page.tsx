"use client";
import UserTable from "@/component/table/user/userTable";
import styles from "./user.module.css";
import {useState} from "react";
import {Spin} from "antd";

export default function User() {
  const [isLoading, setIsLoading] = useState(false);
  const contentStyle: React.CSSProperties = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };
  const content = <div style={contentStyle} />;

  return (
    <div className={styles.page_container}>
      <title>Quản lý người dùng</title>
      {isLoading && (
        <div className={styles.loading}>
          <Spin tip="Loading" size="large">
            {content}
          </Spin>
        </div>
      )}
      <UserTable setIsLoading={setIsLoading} />
    </div>
  );
}
