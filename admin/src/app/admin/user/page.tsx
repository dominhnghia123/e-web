"use client";
import UserTable from "@/component/table/user/userTable";
import styles from "./user.module.css";

export default function User() {
  return (
    <div className={styles.page_container}>
      <title>Quản lý người dùng</title>
      <UserTable />
    </div>
  );
}
