import DataTable, {TableStyles} from "react-data-table-component";
import styles from "./user.module.css";
import {useEffect, useState} from "react";
import axios from "axios";
import {Button} from "react-bootstrap";
import {getToken} from "@/app/helper/stogare";
import moment from "moment";
import {useRouter} from "next/navigation";
import {CiSettings} from "react-icons/ci";
import {RiDeleteBin5Line} from "react-icons/ri";

export default function UserTable() {
  const router = useRouter();
  const token = getToken();
  const [users, setUsers] = useState<IUser[]>([]);
  const [keySearch, setKeySearch] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [deleted, setDeleted] = useState<boolean>(false);

  useEffect(() => {
    const getUsers = async () => {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/user/get-all-users?s=${keySearch}&limit=${itemsPerPage}&page=${currentPage}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(data.users);
      setTotalUsers(data.totalUsers);
    };
    getUsers();
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
        `${process.env.BASE_HOST}/user/delete-many-users`,
        {
          userIds: selectedRows,
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

  const handleDeleteOneUser = async (_id: string) => {
    try {
      const {data} = await axios.post(
        `${process.env.BASE_HOST}/user/delete-a-user`,
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
      selector: (row: IUser) => row.username,
    },
    {
      name: "Email",
      selector: (row: IUser) => row.email,
    },
    {
      name: "Số điện thoại",
      selector: (row: IUser) => row.mobile,
    },
    {
      name: "Vai trò",
      selector: (row: IUser) => row.role,
    },
    {
      name: "Created At",
      selector: (row: IUser) => {
        const dateTimeString = row.createdAt.toString();
        const dateTime = moment(dateTimeString);

        const formattedDate = dateTime.format("DD/MM/YYYY");
        const formattedTime = dateTime.format("HH:mm:ss");
        return `${formattedTime} ${formattedDate}`;
      },
    },
    {
      name: "Updated At",
      selector: (row: IUser) => {
        const dateTimeString = row.updatedAt.toString();
        const dateTime = moment(dateTimeString);

        const formattedDate = dateTime.format("DD/MM/YYYY");
        const formattedTime = dateTime.format("HH:mm:ss");
        return `${formattedTime} ${formattedDate}`;
      },
    },
    {
      name: "Actions",
      cell: (row: IUser): JSX.Element => (
        <div className={styles.buttons_container}>
          <RiDeleteBin5Line
            className={`${styles.button}`}
            onClick={() => handleDeleteOneUser(row._id)}
          />
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
        {selectedRows.length ? (
          <RiDeleteBin5Line
            className={`${styles.button}`}
            onClick={() => handleDeleteMany()}
          />
        ) : (
          <div></div>
        )}
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
          title="Danh sách người dùng"
          columns={columns}
          data={users}
          customStyles={tableCustomStyles}
          fixedHeader
          fixedHeaderScrollHeight="400px"
          pagination
          paginationPerPage={itemsPerPage}
          paginationServer={true}
          paginationTotalRows={totalUsers}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handleChangePage}
          paginationDefaultPage={currentPage}
          selectableRows
          onSelectedRowsChange={({selectedRows}) => {
            setSelectedRows(selectedRows.map((row: IUser) => row._id));
          }}
          onRowClicked={(row, e) => {
            router.replace(`/admin/user/${row._id}`);
          }}
        />
      </div>
    </div>
  );
}
