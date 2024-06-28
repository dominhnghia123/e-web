import {Spin} from "antd";
import styles from "../app/app.module.css";

export default function AppLoading() {
  const contentStyle: React.CSSProperties = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };

  const content = <div style={contentStyle} />;

  return (
    <div className={styles.loading_container}>
      <div className={styles.loading}>
        <Spin tip="Loading" size="large">
          {content}
        </Spin>
      </div>
    </div>
  );
}
