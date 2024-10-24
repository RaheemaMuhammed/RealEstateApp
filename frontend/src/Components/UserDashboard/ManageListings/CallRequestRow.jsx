import React, { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Textarea,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { handleStatusChange } from "../../../api/services";
import { toast } from "react-toastify";
const CallRequestRow = ({ request, setRefresh }) => {
  const [status, setStatus] = useState(request?.status || "pending");
  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const token = useSelector((state) => state.UserReducer.accessToken);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formattedDate = formatDate(request?.created_at);

  const handleOpen = () => setOpen((cur) => !cur);

  const handleChangingStatus = (e) => {
    const selectedStatus = e.target.value;
    setNewStatus(selectedStatus);
    setOpen(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log(request?.id, newStatus);
    try {
      const response = await handleStatusChange(token, {
        call_request_id: request?.id,
        status: newStatus,
      });
      console.log(response);
      if (response?.status === 200) {
        setLoading(false);
        setOpen(false);
        toast.success("Status updated!!");
        setStatus(newStatus);
        setRefresh((ref) => !ref);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <tr>
      <>
        <Dialog
          size="xs"
          open={open}
          handler={handleOpen}
          className="bg-transparent shadow-none"
        >
          <Card className="mx-auto w-full max-w-[24rem]">
            <CardBody className="flex flex-col gap-4">
              <Typography
                className="mb-3 font-normal text-center"
                variant="h5"
                color="gray"
              >
                {newStatus === "success"
                  ? 'By setting the status to "Success", the contract will be initiated. Are you sure you want to proceed?'
                  : `Are you sure you want to change the status to '${newStatus}'?`}
              </Typography>
            </CardBody>
            <CardFooter className="pt-0 flex justify-between px-5">
              {loading ? (
                <div className="justify-center" role="status">
                  <svg
                    aria-hidden="true"
                    class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
              ) : (
                <>
                  <Button
                    color="#1d4ed8"
                    variant="gradient"
                    onClick={handleOpen}
                  >
                    No
                  </Button>
                  <Button
                    color="#1d4ed8"
                    variant="gradient"
                    onClick={handleSubmit}
                  >
                    Yes
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </Dialog>
      </>
      <td className="border-b border-[#eee] py-5 px-2 dark:border-strokedark ">
        <h5 className="font-medium text-black dark:text-white">
          #user{request?.requested_by}
        </h5>
      </td>
      <td className="border-b border-[#eee] py-5 px-2 dark:border-strokedark">
        <p className="text-black dark:text-white">{request?.phone_number}</p>
      </td>
      <td className="border-b border-[#eee] py-5 px-2 dark:border-strokedark">
        <p className="text-black dark:text-white">{request?.message}</p>
      </td>
      <td className="border-b border-[#eee] py-5 px-2 dark:border-strokedark">
        <p className="text-black dark:text-white">{formattedDate}</p>
      </td>
      <td className="border-b border-[#eee] py-5 px-2 dark:border-strokedark">
        <select
          className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
            status === "success"
              ? "bg-success text-success"
              : status === "failed"
              ? "bg-danger text-danger"
              : "bg-warning text-warning"
          }`}
          value={status}
          onChange={handleChangingStatus}
        >
          <option value="pending">Pending</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
        </select>
      </td>
    </tr>
  );
};

export default CallRequestRow;
