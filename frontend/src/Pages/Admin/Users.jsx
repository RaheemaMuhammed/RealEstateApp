import React, { useEffect, useState } from "react";
import { FetchUsers } from "../../api/services";
import { useSelector } from "react-redux";
import TableForAll from "../../Components/Admin/Tables/TableForAll";

const Users = () => {
  const [users, setUsers] = useState([]);
  const token = useSelector((state) => state.AdminReducer.accessToken);

  useEffect(() => {
    try {
      const fetchUsers = async () => {
        const response = await FetchUsers(token);
        console.log(response);
        if (response) {
          setUsers(response);
        }
      };
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  }, [token]);
  const columns = [
    { header: "User Email", accessor: "email" },
    { header: "Name", accessor: "name" },
    { header: "Phone", accessor: "phone" },
    { header: "Type", accessor: "user_type" },
    {
      header: "Status",
      accessor: "is_active",
      cell: (row) => (
        <p
          className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
            row.is_active ? "bg-success text-success" : "bg-danger text-danger"
          }`}
        >
          {row.is_active ? "active" : "blocked"}
        </p>
      ),
    },
  ];
  return (
    <div className="mt-4    ">
      <div className="col-span-12 xl:col-span-8">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            {users?.length > 0 ? (
              <TableForAll columns={columns} data={users} />
            ) : (
              <p className="text-center text-title-md">No users!!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
