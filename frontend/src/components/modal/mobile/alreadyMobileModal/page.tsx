import { Modal } from "antd";
import { useRouter } from "next/navigation";

interface IProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
}

export default function AlreadyMobileModal(props: IProps) {
  const { openModal, setOpenModal, setIsLoading } = props;
  const router = useRouter();
  const handleOk = async () => {
    setOpenModal(false);
    setIsLoading(true);
    router.replace("/buyer/signin");
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  return (
    <Modal
      title={
        <div>
          <span style={{ display: "block" }}>
            Số điện thoại đã được đăng ký.
          </span>
          <span>Vui lòng đăng nhập để đăng ký bán hàng.</span>
        </div>
      }
      open={openModal}
      onOk={() => handleOk()}
      onCancel={handleCancel}
    />
  );
}
