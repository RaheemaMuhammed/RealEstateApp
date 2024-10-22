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
const CallRequestRow = ({ request,setRefresh }) => {
  const [status, setStatus] = useState(request?.status || "pending");
  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const token = useSelector((state) => state.UserReducer.accessToken);

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
    console.log(request?.id, newStatus);
    try {
      const response = await handleStatusChange(token,{'call_request_id':request?.id,'status':newStatus})
      console.log(response);
      if(response?.status === 200){
        setOpen(false)
        toast.success('Status updated!!')
        setStatus(newStatus)
        setRefresh((ref)=>!ref)
      }
      
    } catch (error) {
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
              <Button color="#1d4ed8" variant="gradient" onClick={handleOpen}>
                No
              </Button>
              <Button color="#1d4ed8" variant="gradient" onClick={handleSubmit}>
                Yes
              </Button>
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
