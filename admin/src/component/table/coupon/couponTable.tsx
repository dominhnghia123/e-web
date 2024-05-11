import DataTable, { TableStyles } from "react-data-table-component";
import styles from "./coupon.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { getToken } from "@/app/helper/stogare";
import moment from "moment";
import { useRouter } from "next/navigation";

export default function CouponTable() {
  const router = useRouter();
  const token = getToken();
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [keySearch, setKeySearch] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCoupons, setTotalCoupons] = useState<number>(0);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [deleted, setDeleted] = useState<boolean>(false);

  useEffect(() => {
    const getCoupons = async () => {
      const { data } = await axios.post(
        `${process.env.BASE_HOST}/coupon/get-all-coupons?s=${keySearch}&limit=${itemsPerPage}&page=${currentPage}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCoupons(data.coupons);
      setTotalCoupons(data.totalCoupons);
    };
    getCoupons();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keySearch, itemsPerPage, currentPage, deleted]);

  const handlePerRowsChange = async (perPage: number, page: number) => {
    setItemsPerPage(perPage);
  };

  const handleChangePage = (page: number, totalRows: number): void => {
    setCurrentPage(page);
  };

  const handleDeleteMany = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.BASE_HOST}/coupon/delete-many-coupons`,
        {
          couponIds: selectedRows,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        setDeleted(!deleted);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteOneCoupon = async (_id: string) => {
    try {
      const { data } = await axios.post(
        `${process.env.BASE_HOST}/coupon/delete-a-coupon`,
        {
          _id: _id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status === true) {
        setDeleted(!deleted);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      name: "Tên",
      selector: (row: ICoupon) => row.name,
    },
    {
      name: "Thời hạn",
      selector: (row: ICoupon) => row.expiry,
    },
    {
      name: "Giảm giá",
      selector: (row: ICoupon) => row.discount,
    },
    {
      name: "Người sở hữu",
      selector: (row: ICoupon) => row.userId.username,
    },
    {
      name: "Created At",
      selector: (row: ICoupon) => {
        const dateTimeString = row.createdAt.toString();
        const dateTime = moment(dateTimeString);

        const formattedDate = dateTime.format("DD/MM/YYYY");
        const formattedTime = dateTime.format("HH:mm:ss");
        return `${formattedTime} ${formattedDate}`;
      },
    },
    {
      name: "Updated At",
      selector: (row: ICoupon) => {
        const dateTimeString = row.updatedAt.toString();
        const dateTime = moment(dateTimeString);

        const formattedDate = dateTime.format("DD/MM/YYYY");
        const formattedTime = dateTime.format("HH:mm:ss");
        return `${formattedTime} ${formattedDate}`;
      },
    },
    {
      name: "Actions",
      cell: (row: ICoupon): JSX.Element => (
        <div className="d-flex">
          <Button
            className={`${styles.button} ${styles.buttonDeleteMany}`}
            onClick={() => handleDeleteOneCoupon(row._id)}
          >
            Delete
          </Button>
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
      <div className={styles.head}>
        <Button
          className={`${styles.button} ${styles.buttonAdd}`}
          onClick={() => router.replace("/admin/coupon/addNew")}
        >
          Add Coupon
        </Button>
      </div>
      <div className={styles.table_top}>
        <Button
          className={`${styles.button} ${styles.buttonDeleteMany}`}
          onClick={() => handleDeleteMany()}
        >
          Delete Many
        </Button>
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
          title="Danh sách khuyến mãi"
          columns={columns}
          data={coupons}
          customStyles={tableCustomStyles}
          fixedHeader
          fixedHeaderScrollHeight="400px"
          pagination
          paginationPerPage={itemsPerPage}
          paginationServer={true}
          paginationTotalRows={totalCoupons}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handleChangePage}
          paginationDefaultPage={currentPage}
          selectableRows
          onSelectedRowsChange={({ selectedRows }) => {
            setSelectedRows(selectedRows.map((row: ICoupon) => row._id));
          }}
          onRowClicked={(row, e) => {
            router.replace(`/admin/coupon/${row._id}`);
          }}
        />
      </div>
    </div>
  );
}
