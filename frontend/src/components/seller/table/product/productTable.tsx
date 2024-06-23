import DataTable, {TableStyles} from "react-data-table-component";
import styles from "./product.module.css";
import {useEffect, useState} from "react";
import axios from "axios";
import {Button} from "react-bootstrap";
import {getToken} from "@/app/helper/stogare";
import moment from "moment";
import {useRouter} from "next/navigation";

export default function ProductTable() {
  const router = useRouter();
  const token = getToken();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [keySearch, setKeySearch] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [deleted, setDeleted] = useState<boolean>(false);

  useEffect(() => {
    const getProducts = async () => {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/product/get-products-by-user?s=${keySearch}&limit=${itemsPerPage}&page=${currentPage}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(data.data);
      setTotalProducts(data.totalProducts);
    };
    getProducts();
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
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/product/delete-many-products`,
        {
          productIds: selectedRows,
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

  const handleDeleteOneProduct = async (_id: string) => {
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/product/delete-a-product`,
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
      name: "Name",
      selector: (row: IProduct) => row.name,
    },
    {
      name: "Brand",
      selector: (row: IProduct) => row.brand,
    },
    {
      name: "Total Rate",
      selector: (row: IProduct) => row.totalRatings,
    },
    {
      name: "Created At",
      selector: (row: IProduct) => {
        const dateTimeString = row.createdAt.toString();
        const dateTime = moment(dateTimeString);

        const formattedDate = dateTime.format("DD/MM/YYYY");
        const formattedTime = dateTime.format("HH:mm:ss");
        return `${formattedTime} ${formattedDate}`;
      },
    },
    {
      name: "Updated At",
      selector: (row: IProduct) => {
        const dateTimeString = row.updatedAt.toString();
        const dateTime = moment(dateTimeString);

        const formattedDate = dateTime.format("DD/MM/YYYY");
        const formattedTime = dateTime.format("HH:mm:ss");
        return `${formattedTime} ${formattedDate}`;
      },
    },
    {
      name: "Actions",
      cell: (row: IProduct): JSX.Element => (
        <div className="d-flex">
          <Button
            className={`${styles.button} ${styles.buttonDeleteMany}`}
            onClick={() => handleDeleteOneProduct(row._id)}
          >
            Xóa
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
          onClick={() => router.replace("/seller/products/addNew")}
        >
          Thêm sản phẩm
        </Button>
      </div>
      <div className={styles.table_top}>
        <Button
          className={`${styles.button} ${styles.buttonDeleteMany}`}
          onClick={() => handleDeleteMany()}
        >
          Xóa nhiều
        </Button>
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
          title="Danh sách sản phẩm"
          columns={columns}
          data={products}
          customStyles={tableCustomStyles}
          fixedHeader
          fixedHeaderScrollHeight="400px"
          pagination
          paginationPerPage={itemsPerPage}
          paginationServer={true}
          paginationTotalRows={totalProducts}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handleChangePage}
          paginationDefaultPage={currentPage}
          selectableRows
          onSelectedRowsChange={({selectedRows}) => {
            setSelectedRows(selectedRows.map((row: IProduct) => row._id));
          }}
          onRowClicked={(row, e) => {
            router.replace(`/seller/products/${row.slug}/${row._id}`);
          }}
        />
      </div>
    </div>
  );
}
