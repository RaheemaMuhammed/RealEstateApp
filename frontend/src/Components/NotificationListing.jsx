import React, { useEffect, useState } from "react";
import "./tailwind.css";
import { MarkNotificationRead } from "../api/services";
import { IoIosCall } from "react-icons/io";
import { Link } from "react-router-dom";
import { AiOutlineExport, AiFillSignature } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { GrCheckboxSelected } from "react-icons/gr";
import useTimeAgo from "../hooks/useTimeAgo";
import { useSelector } from "react-redux";
const NotificationListing = ({
  notifications,
  setNotificationList,
  notificationList,
  setNotiCount,
  token
}) => {
  const [slideClass, setSlideClass] = useState("translate-x-full");

  // for transition
  useEffect(() => {
    if (notificationList) {
      setSlideClass("translate-x-0");
    } else {
      setSlideClass("translate-x-full");
    }
  }, [notificationList]);
  // to mark notis as read
  async function handleRead() {
    try {
      const response = await MarkNotificationRead(token);

      if (response?.status === 200) {
        

        setNotiCount(0);
      } else {
        toast.error("Connection failed!!");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className={`notificationsList ${slideClass}`}>
        <p className="text-center font-base text-gray-500 uppercase text-xl">
          Your Notifications
        </p>
        <button
          type="button"
          onClick={() => setNotificationList(!notificationList)}
          className="text-black bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <div className="py-4 overflow-y-auto text-primary-500">
          {notifications?.length === 0 ? (
            <h1 className="text-center">No Notifications</h1>
          ) : (
            <ul className="space-y-2 font-medium">
              {notifications?.map((noti) => {
                 const relativeTime =noti?.created_at ?  useTimeAgo(noti?.created_at) :'now'

                 return (
                  <Link
                    className="flex items-center justify-between"
                    
                  >
                    
                    <span className="w-[5%]">
                      {noti?.notification_type === 'call_request' && <IoIosCall size={20} style={{ marginTop: '3px', marginRight: '5px' }} />}
                      {noti?.notification_type === 'contract_uploaded' && <IoIosCall size={20} style={{ marginTop: '6px', marginRight: '5px' }} />}
                      {noti?.notification_type === 'contract_approved' && <IoIosCall size={20} style={{ marginTop: '6px', marginRight: '5px' }} />}
                      {noti?.notification_type === 'contract_rejected' && <IoIosCall size={20} style={{ marginTop: '6px', marginRight: '5px' }} />}
                      {noti?.notification_type === 'contract_signing' && <IoIosCall size={20} style={{ marginTop: '6px', marginRight: '5px' }} />}
                    </span>
                
                    <li
                      className={`flex-1 font-${noti.is_read ? "light" : "semibold"} text-btnColor my-1 hover:font-bold cursor-pointer mx-2`}
                      onClick={handleRead}
                    >
                      {noti.content}
                    </li>
                
                   
                    <span className="text-sm font-extralight">
                      {relativeTime}
                    </span>
                  </Link>
                );
                
                
               
                
})}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationListing;
