import { Modal } from "antd";
import { useRouter } from "next/navigation";

interface IProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
}

export default function NotAlreadyMobileModal(props: IProps) {
  const { openModal, setOpenModal } = props;
  const router = useRouter();
  const handleOk = async () => {
    setOpenModal(false);
    router.replace("/buyer/signup");
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  return (
    <Modal
      title={
        <div>
          <span style={{ display: "block" }}>
            Số điện thoại chưa được đăng ký.
          </span>
          <span>
            Vui lòng đăng ký tài khoản với số điện thoại này trước khi đăng ký
            bán hàng.
          </span>
        </div>
      }
      open={openModal}
      onOk={() => handleOk()}
      onCancel={handleCancel}
    />
  );
}
