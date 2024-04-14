import { Modal } from "antd";

interface IProps {
  openCouponModal: boolean;
  setOpenCouponModal: (value: boolean) => void;
}

export default function CouponModal(props: IProps) {
  const { openCouponModal, setOpenCouponModal } = props;
  const handleOk = () => {
    setOpenCouponModal(false);
  };

  const handleCancel = () => {
    setOpenCouponModal(false);
  };
  return (
    <Modal
      title="Chọn voucher khuyến mãi"
      open={openCouponModal}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
}
