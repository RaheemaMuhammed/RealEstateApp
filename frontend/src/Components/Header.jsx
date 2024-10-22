import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CustomNavLink from "./CustomNavLink";
import { UserLogout } from "../store/UserSlice";
import { BsBell } from "react-icons/bs";
import { GetNotifications } from "../api/services";
import "./tailwind.css";
import useWebSocket from "../hooks/useWebsocket";
import NotificationListing from "./NotificationListing";
import { CiUser } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = useSelector((state) => state.UserReducer.accessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notificationList, setNotificationList] = useState(false);
  const [notiCount, setNotiCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [flyNoti, setFlyNoti] = useState("");
  const [Refresh, setRefresh] = useState(false);

  // to show flying notification
  const showNotification = (message) => {
    setFlyNoti(message);
    setTimeout(() => {
      setFlyNoti("");
    }, 3000);
  };

  useWebSocket(token, (data) => {
    setNotifications((prevNotifications) => [
      data,
      ...(prevNotifications || []),
    ]);
    showNotification(data?.message);
  });

  // getting notifications
  useEffect(() => {
    if (token) {
      try {
        const userNotifications = async () => {
          const response = await GetNotifications(token);
          console.log(response,'noftsvfd');
          setNotifications(response?.payload);
        };
        userNotifications();
      } catch (error) {
        console.log(error);
      }
    }
  }, [Refresh, token]);

  useEffect(() => {
    const unreadNotifications = notifications?.filter((noti) => !noti.is_read);

    setNotiCount(unreadNotifications?.length || 0);
  }, [notifications]);

  // logout function
  const handleLogout = () => {
    if (token) {
      dispatch(UserLogout());
    }
    navigate("/");
  };

  return (
    <header>
      {flyNoti !== "" && <p className={`notification`}>{flyNoti}</p>}

      <nav className="bg-white sticky border-gray-200 px-4 lg:px-6 py-5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/" className="flex items-center">
            <img
              src="/logoreb.png"
              className="mr-3 sm:w-9 w-6 h-9 sm:h-6"
              alt=" Logo"
            />
            <span className="self-center md:text-xl text-base font-semibold whitespace-nowrap dark:text-white">
              REApp
            </span>
          </Link>

          <div className="flex items-center lg:order-2">
            {token ? (
              <>
                {notificationList && (
                  <NotificationListing
                    notifications={notifications}
                    setNotificationList={setNotificationList}
                    notificationList={notificationList}
                    setNotiCount={setNotiCount}
                    token={token}
                  />
                )}
                <li className="flex p-1 cursor-pointer">
                  <span
                    className="relative"
                    onClick={() => {
                      setNotificationList(!notificationList);
                    }}
                  >
                    <IoIosNotificationsOutline
                      size={30}
                      color="#1d4ed8 "
                      style={{ marginTop: "1px" }}
                    />
                  </span>
                  {notiCount > 0 && (
                    <span className="absolute mt-0 bg-orange-900 text-white rounded-3xl h-fit w-4 text-center text-xs font-bold">
                      {notiCount}
                    </span>
                  )}
                  <Link to="/my_account">
                    <p>
                      <CiUser size={28} color="#1d4ed8 " />
                    </p>
                  </Link>
                </li>

                {/* <p
                  className="mx-1 mr-3 cursor-pointer font-semibold text-primary-700"
                  onClick={handleLogout}
                >
                  {" "}
                  Logout
                </p> */}
              </>
            ) : (
              <Link
                to={"/login"}
                className="text-gray-800 dark:text-white hover:bg-gray-50  font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
              >
                Log in
              </Link>
            )}
            <Link
              to={"/listing/owner-details"}
              className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-1 lg:px-2 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
            >
              Post your property
            </Link>

            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <svg
                className="hidden w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <CustomNavLink to="/">Home</CustomNavLink>
              </li>
              <li>
                <CustomNavLink to="/properties/buy">Buy</CustomNavLink>
              </li>
              <li>
                <CustomNavLink to="/properties/rent">Rent</CustomNavLink>
              </li>
              <li>
                <CustomNavLink to="/properties/lease">Lease</CustomNavLink>
              </li>
              {/* <li>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? "block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
            : "block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
        }
      >
        Contact
      </NavLink>
    </li> */}
            </ul>
          </div>

          {/* <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                    <li>
                        <a href="#" className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white" aria-current="page">Home</a>
                    </li>
                    <li>
                        <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Buy</a>
                    </li>
                    <li>
                        <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Rent</a>
                    </li>
                    <li>
                        <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Lease</a>
                    </li>
                    
                    <li>
                        <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
                    </li>
                </ul>
            </div> */}
        </div>
      </nav>
    </header>
  );
};

export default Header;
