import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { UserLogout } from "../../store/UserSlice";
import { CiSettings, CiTimer } from "react-icons/ci";
import { IoTimeOutline } from "react-icons/io5";
import { LuTableProperties } from "react-icons/lu";
import { RiListIndefinite } from "react-icons/ri";
import { BsPersonLinesFill } from "react-icons/bs";
import "./tailwind.css";
import { useSelect } from "@material-tailwind/react";
const Sidebar = () => {
  const [isToggled, setIsToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleToggle = () => {
    setIsToggled(!isToggled);
  };
  const token = useSelector(state=>state.UserReducer.accessToken)
  // logout function
  const handleLogout = () => {
    if (token) {
      dispatch(UserLogout());
    }
    navigate("/");
  };
  return (
    <aside className="left-0  md:w-64 h-fit md:h-screen sm:w-full  bg-white border border-gray-200 rounded-sm" >
      <div className="md:hidden">
        <button
          className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border mb-0 mr-0"
          onClick={handleToggle}
        >
          {isToggled ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>
      <div
        className={`flex-1 justify-self-center pb-3  md:block md:pb-0 md:mt-0 ${
          isToggled ? "block" : "hidden"
        }`}
      >
        <div className="h-full py-4 overflow-y-auto ">
          <ul className="space-y-10 font-medium mx-1">
            <li className="cursor-pointer mx-3 flex text-gray-800 hover:text-primary-700 rounded">
              <IoTimeOutline className="sidebar_icon" />

              <NavLink
                to={"/my_account"}
                className={({ isActive, isPending }) =>
                  isPending
                    ? "bg-primary-400"
                    : isActive
                    ? "text-primary-700 "
                    : ""
                }
              >

                Recent
              </NavLink>
            </li>
            <li className="flex cursor-pointer mx-3 my-3 hover:text-primary-700 ">
              <LuTableProperties className="sidebar_icon"/>
              <NavLink
                to={"/my_properties"}
                className={({ isActive, isPending }) =>
                  isPending
                    ? " bg-gray-100 "
                    : isActive
                    ? "text-primary-700 "
                    : ""
                }
              >
                My Properties
              </NavLink>
            </li>
            <li className="flex cursor-pointer mx-3 my-3 hover:text-primary-700 ">
              <RiListIndefinite className="sidebar_icon"/>
              <NavLink
                to={"/my_listings"}
                className={({ isActive, isPending }) =>
                  isPending
                    ? " bg-newCoral "
                    : isActive
                    ? "text-primary-700 "
                    : ""
                }
              >
                Manage Listing
              </NavLink>
            </li>

            <li className="flex cursor-pointer mx-3 my-3 hover:text-primary-700 ">
              <BsPersonLinesFill className="sidebar_icon"/>
              <NavLink
                to={"/listing_profile"}
                className={({ isActive, isPending }) =>
                  isPending
                    ? " bg-newCoral "
                    : isActive
                    ? "text-primary-700"
                    : ""
                }
              >
                Manage Profile
              </NavLink>
            </li>
            <li className="flex cursor-pointer mx-3 my-3 hover:text-primary-700 ">
              <CiSettings className="sidebar_icon"/>
              <NavLink
                to={"/settings"}
                className={({ isActive, isPending }) =>
                  isPending
                    ? " bg-newCoral "
                    : isActive
                    ? "text-primary-700 "
                    : ""
                }
              >
                Settings
              </NavLink>
            </li>

            <li className="flex cursor-pointer mx-3 my-3 hover:text-primary-700 ">
              <svg
                className="flex-shrink-0 w-5 h-4 mr-2 mt-1 text-gray-600 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                />
              </svg>
              <p onClick={handleLogout}>Logout</p>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
