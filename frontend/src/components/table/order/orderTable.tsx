import DataTable, { TableStyles } from "react-data-table-component";
import styles from "./order.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { getToken } from "@/app/helper/stogare";
import moment from "moment";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function OrderTable() {
  const router = useRouter();
  const token = getToken();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [keySearch, setKeySearch] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalOrders, setTotalOrders] = useState<number>(0);

  const [changeOrder, setChangeOrder] = useState(false);

  useEffect(() => {
    const getOrders = async () => {
      const { data } = await axios.post(
        `${process.env.BASE_HOST}/order/get-orders-by-user?s=${keySearch}&limit=${itemsPerPage}&page=${currentPage}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(data.data);
      setTotalOrders(data.totalOrders);
    };
    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keySearch, itemsPerPage, currentPage, changeOrder]);

  const handlePerRowsChange = async (perPage: number, page: number) => {
    setItemsPerPage(perPage);
  };

  const handleChangePage = (page: number, totalRows: number): void => {
    setCurrentPage(page);
  };

  const handleCancelOrder = async (id: string) => {
    try {
      const { data } = await axios.post(
        `${process.env.BASE_HOST}/order/cancel-order`,
        {
          orderId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        toast.success(data.msg);
        setChangeOrder(!changeOrder);
      }
      if (data.status === false) {
        toast.error(data.msg);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      name: "Order Id",
      selector: (row: IOrder) => row._id,
    },
    {
      name: "Status",
      selector: (row: IOrder) =>
        row.status === "pending"
          ? "Chưa thanh toán"
          : row.status === "done"
          ? "Đã thanh toán"
          : "Đã hủy",
    },
    {
      name: "Created At",
      selector: (row: IOrder) => {
        const dateTimeString = row.createdAt.toString();
        const dateTime = moment(dateTimeString);

        const formattedDate = dateTime.format("DD/MM/YYYY");
        const formattedTime = dateTime.format("HH:mm:ss");

        return `${formattedTime} ${formattedDate}`;
      },
    },
    // {
    //   name: "Note",
    //   cell: (row: IOrder): JSX.Element => {
    //     let btnAction;
    //     if (row.status === "pending") {
    //       btnAction = (
    //         <Button
    //           className={`${styles.button} ${styles.button_delivery}`}
    //           onClick={() => {
    //             router.replace("/checkout");
    //           }}
    //         >
    //           Thanh toán
    //         </Button>
    //       );
    //     }
    //     if (row.status === "done" && row.status_delivery === "notShippedYet") {
    //       btnAction = (
    //         <Button
    //           className={`${styles.button} ${styles.button_cancel}`}
    //           onClick={() => handleCancelOrder(row._id)}
    //         >
    //           Hủy đơn hàng
    //         </Button>
    //       );
    //     }
    //     if (row.status === "cancel") {
    //       btnAction = "";
    //     }
    //     if (row.status_delivery === "shipping") {
    //       btnAction = (
    //         <Button className={`${styles.button} ${styles.button_delivery}`}>
    //           Đang vận chuyển
    //         </Button>
    //       );
    //     }
    //     if (row.status_delivery === "shipped") {
    //       btnAction = (
    //         <Button className={`${styles.button} ${styles.button_delivery}`}>
    //           Đã giao hàng
    //         </Button>
    //       );
    //     }
    //     return <div className={styles.actions_column}>{btnAction}</div>;
    //   },
    // },
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
        height: "50px",
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
            placeholder="Search here..."
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
            router.replace(`/user/account/order/${row._id}`);
          }}
        />
      </div>
    </div>
  );
}
