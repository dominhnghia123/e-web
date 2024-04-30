import { Modal } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { getToken } from "@/app/helper/stogare";

interface IProps {
  openModalDeleteAddress: boolean;
  setOpenModalDeleteAddress: (value: boolean) => void;
  address: IAddress;
}

export default function DeleteAddressModal(props: IProps) {
  const { openModalDeleteAddress, setOpenModalDeleteAddress, address } = props;

  const token = getToken();

  const handleOk = async (addressId: string) => {
    try {
      const { data } = await axios.post(
        `${process.env.BASE_HOST}/address/delete-a-address`,
        {
          _id: addressId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        toast.success(data.msg);
        setOpenModalDeleteAddress(false);
      }
      if (data.status === false) {
        toast.error(data.msg);
        setOpenModalDeleteAddress(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setOpenModalDeleteAddress(false);
  };

  return (
    <Modal
      title="Bạn có chắc chắn muốn xóa địa chỉ này không?"
      open={openModalDeleteAddress}
      onOk={() => handleOk(address._id)}
      onCancel={handleCancel}
    ></Modal>
  );
}
