import DataTable, {TableStyles} from "react-data-table-component";
import styles from "./order.module.css";
import {useEffect, useState} from "react";
import axios from "axios";
import {getToken} from "@/app/helper/stogare";
import {Button, Image} from "react-bootstrap";
import moment from "moment";
import {toast} from "react-toastify";
import {CartConstant} from "@/contants/CartConstant";
import {useRouter} from "next/navigation";
import {OrderSellerConstant} from "@/app/helper/constant/OrderSellerConstant";
import {ProductConstant} from "@/app/helper/constant/ProductConstant";

interface IProps {
  setIsLoading: (value: boolean) => void;
}

export default function OrderTable(props: IProps) {
  const {setIsLoading} = props;
  const token = getToken();
  const router = useRouter();
  const [orders, setOrders] = useState<any>([]);
  const [keySearch, setKeySearch] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [updateStatus, setUpdateStatus] = useState<boolean>(false);

  useEffect(() => {
    const getOrdersBySeller = async () => {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/order/get-all-orders-by-seller?s=${keySearch}&limit=${itemsPerPage}&page=${currentPage}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("data", data);
      
      if (data.status === true) {
        setOrders(data.orders);
        setTotalOrders(data.totalOrders);
      }
    };
    getOrdersBySeller();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keySearch, itemsPerPage, currentPage, updateStatus]);

  const handlePerRowsChange = async (perPage: number, page: number) => {
    setItemsPerPage(perPage);
  };

  const handleChangePage = (page: number, totalRows: number): void => {
    setCurrentPage(page);
  };

  const handleUpdateStatusOrder = async (cartId: string) => {
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/cart/update-status-delivery-cart`,
        {
          cartId,
          status: CartConstant.STATUS_DELIVERY.SHIPPING,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        toast(data.msg);
        setUpdateStatus(!updateStatus);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getDisplayBtn = (cartId: string, status: string) => {
    switch (status) {
      case CartConstant.STATUS_DELIVERY.NOT_SHIPPED_YET:
        return (
          <Button
            className={`${styles.button} ${styles.button_delivery}`}
            onClick={() => handleUpdateStatusOrder(cartId)}
          >
            Giao hàng
          </Button>
        );

      case CartConstant.STATUS_DELIVERY.SHIPPING:
        return (
          <Button
            className={`${styles.button} ${styles.button_follow_delivery}`}
          >
            Theo dõi vận chuyển
          </Button>
        );

      case CartConstant.STATUS_DELIVERY.CANCEL:
      case CartConstant.STATUS_DELIVERY.SHIPPED:
        return (
          <Button
            className={`${styles.button} ${styles.button_view_detail}`}
            onClick={() => {
              setIsLoading(true);
              router.replace(`/seller/orders/${cartId}`);
            }}
          >
            Xem chi tiết
          </Button>
        );

      default:
        return null;
    }
  };

  const columns = [
    {
      name: "Khách hàng",
      selector: (row: any) => row.buyername,
      sortable: true,
    },
    {
      name: "Tên sản phẩm",
      selector: (row: any) =>
        `${row.productName} - ${
          ProductConstant.COLOR[
            row.variantName as keyof typeof ProductConstant.COLOR
          ]
        }`,
      sortable: true,
    },
    {
      name: "Số lượng",
      selector: (row: any) => row.quantity,
      sortable: true,
    },
    {
      name: "Thời điểm cập nhật",
      selector: (row: any) => {
        const dateTimeString = row.updatedAt?.toString();
        const dateTime = moment(dateTimeString);

        const formattedDate = dateTime.format("DD/MM/YYYY");
        const formattedTime = dateTime.format("HH:mm:ss");
        return `${formattedTime} ${formattedDate}`;
      },
      sortable: true,
    },
    {
      name: "Trạng thái",
      selector: (row: any) => {
        const status =
          row.status_delivery as keyof typeof OrderSellerConstant.ORDER_STATUS_DELIVERY;
        return OrderSellerConstant.ORDER_STATUS_DELIVERY[status];
      },
      sortable: true,
    },
    {
      name: "Hành động",
      cell: (row: any): JSX.Element => (
        <div className="d-flex">
          {getDisplayBtn(row.cartId.toString(), row.status_delivery)}
        </div>
      ),
    },
  ];
  const tableCustomStyles: TableStyles | undefined = {
    headCells: {
      style: {
        fontSize: "16px",
        textTransform: "capitalize",
        fontWeight: "bold",
        justifyContent: "start",
        backgroundColor: "#00FFFF",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        "&:hover": {
          cursor: "pointer",
          backgroundColor: "#EAEEFF",
        },
      },
    },
  };

  return (
    <div className={styles.table_container}>
      <div className={styles.table_top}>
        <div className={styles.input_container}>
          <input
            type="text"
            className={styles.input}
            placeholder="Tìm kiếm..."
            value={keySearch}
            onChange={(e) => setKeySearch(e.target.value)}
          />
        </div>
      </div>
      <div className="table-responsive">
        <DataTable
          title="Danh sách đơn hàng"
          columns={columns}
          data={orders}
          customStyles={tableCustomStyles}
          fixedHeader
          fixedHeaderScrollHeight="400px"
          pagination
          paginationPerPage={itemsPerPage}
          paginationServer={true}
          paginationTotalRows={totalOrders}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handleChangePage}
          paginationDefaultPage={currentPage}
          onRowClicked={(row, e) => {
            setIsLoading(true);
            router.replace(`/seller/orders/${row.cartId}`);
          }}
        />
      </div>
    </div>
  );
}
