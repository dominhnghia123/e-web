import { Button } from "react-bootstrap";
import styles from "./changePassword.module.css";

export default function ChangePassword() {
  return (
    <>
      <h3>Thay đổi mật khẩu</h3>
      <form action="" className={styles.form}>
        <div className={styles.form__field}>
          <div className={styles.form__field__title}>Mật khẩu hiện tại</div>
          <input
            type="password"
            className={styles.form__field__input}
          />
        </div>
        <div className={styles.form__field}>
          <div className={styles.form__field__title}>Mật khẩu mới</div>
          <input
            type="password"
            className={styles.form__field__input}
          />
        </div>
        <div className={styles.form__field}>
          <div className={styles.form__field__title}>Xác nhận mật khẩu</div>
          <input
            type="password"
            className={styles.form__field__input}
          />
        </div>
        <div className={styles.button_container}>
          <Button className={styles.button}>Lưu</Button>
        </div>
      </form>
    </>
  );
}
