import { useFormik } from "formik";
import React, { useEffect, useState } from "react";

import * as yup from "yup";
import { toast } from "react-toastify";
import {
  CreateListingProfile,
  ListingProfileDetails,
  UpdateListingProfileDetails,
} from "../api/services";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const ListingOwnerDetails = () => {
  const token = useSelector((state) => state.UserReducer.accessToken);
  const [profileExists, setProfileExists] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwnerDetails = async () => {
      try {
        const response = await ListingProfileDetails(token);
        if (response) {
          setProfileExists(true);
          setFieldValue("name", response?.name);
          setFieldValue("email", response?.email);
          setFieldValue("phone", response?.phone);
          setFieldValue("user_type", response?.user_type);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchOwnerDetails();
  }, [token]);

  const onSubmit = async () => {
    console.log(values);
    if (profileExists) {
      if (isEditing) {
        try {
          const response = await UpdateListingProfileDetails(token, values);
          if (response) {
            toast.success("Profile details updated successfully");
          }
        } catch (error) {
          toast.error("Couldn't update your profile");
        }
      }
      navigate("/listing/property-details");
    } else {
      try {
        const response = await CreateListingProfile(values, token);
        console.log(response);
        if (response) {
          toast.success("Profile details added succesfully");
        }
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    }
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      user_type: "agent",
    },
    validationSchema: yup.object().shape({
      phone: yup
        .number("Phone number must be a 10 digit number ")
        .positive()
        .integer()
        .test("len", "Phone number should be a 10 digit number", (val) =>
          /^\d{10}$/.test(val)
        )
        .required("Phone number is Required"),
      email: yup
        .string()
        .email("Please enter a valid email")
        .required("Email is required"),
      name: yup
        .string()
        .min(2, "username must be at least 2 characters")
        .max(20)
        .matches(/^[a-zA-Z]+$/, "Only alphabets are allowed")
        .required("Username is required"),
    }),
    onSubmit,
  });
  const handleFieldChange = (e) => {
    setIsEditing(true);
    handleChange(e);
  };
  return (
    <div class="font-[sans-serif] bg-white max-w-4xl flex items-center mx-auto md:h-screen p-4">
      <div class="grid md:grid-cols-3 items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-xl overflow-hidden">
        <div class="max-md:order-1 flex flex-col justify-center space-y-16 max-md:mt-16 min-h-full bg-gradient-to-r from-primary-900 to-primary-700 lg:px-8 px-4 py-4">
          <div>
            <h4 class="text-white text-lg font-semibold">Post your property</h4>
            <p class="text-[13px] text-gray-300 mt-3 leading-relaxed">
              Welcome to our property listing page!
            </p>
          </div>
          <div>
            <h4 class="text-white text-lg font-semibold">
              Simple Listing Process
            </h4>
            <p class="text-[13px] text-gray-300 mt-3 leading-relaxed">
              {" "}
              You can list your property in a few minutes. Just fill out our
              super simple form. Your property will go live immediately!
            </p>
          </div>
        </div>

        <form
          class="md:col-span-2 w-full py-6 px-6 sm:px-16"
          onSubmit={handleSubmit}
        >
          <div class="mb-6">
            <h3 class="text-gray-800 text-2xl font-bold">Personal Details</h3>
          </div>

          <div class="space-y-6">
            <div>
              <label class="text-gray-800 text-sm mb-2 block">Name</label>
              <div class="relative flex items-center">
                <input
                  name="name"
                  type="text"
                  value={values.name}
                  onChange={handleFieldChange}
                  onBlur={handleBlur}
                  class="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
                  placeholder="Enter name"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#bbb"
                  stroke="#bbb"
                  class="w-4 h-4 absolute right-4"
                  viewBox="0 0 24 24"
                >
                  <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                  <path
                    d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                    data-original="#000000"
                  ></path>
                </svg>
              </div>
              {errors.name && touched.name && (
                <p className="text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label class="text-gray-800 text-sm mb-2 block">Email Id</label>
              <div class="relative flex items-center">
                <input
                  name="email"
                  type="email"
                  onChange={handleFieldChange}
                  onBlur={handleBlur}
                  value={values.email}
                  class="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
                  placeholder="Enter email"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#bbb"
                  stroke="#bbb"
                  class="w-4 h-4 absolute right-4"
                  viewBox="0 0 682.667 682.667"
                >
                  <defs>
                    <clipPath id="a" clipPathUnits="userSpaceOnUse">
                      <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                    </clipPath>
                  </defs>
                  <g
                    clip-path="url(#a)"
                    transform="matrix(1.33 0 0 -1.33 0 682.667)"
                  >
                    <path
                      fill="none"
                      stroke-miterlimit="10"
                      stroke-width="40"
                      d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                      data-original="#000000"
                    ></path>
                    <path
                      d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                      data-original="#000000"
                    ></path>
                  </g>
                </svg>
              </div>
              {errors.email && touched.email && (
                <p className="text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label class="text-gray-800 text-sm mb-2 block">Phone</label>
              <div class="relative flex items-center">
                <input
                  name="phone"
                  type="phone"
                  onChange={handleFieldChange}
                  onBlur={handleBlur}
                  value={values.phone}
                  class="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
                  placeholder="Enter password"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-4 cursor-pointer"
                  fill="#bbb"
                  stroke="#bbb"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              {errors.phone && touched.phone && (
                <p className="text-red-600">{errors.phone}</p>
              )}
            </div>

            <div class="flex items-center">
              <input
                id="user_type"
                name="user_type"
                type="checkbox"
                checked={values.user_type === "owner"}
                onChange={(e) =>
                  setFieldValue(
                    "user_type",
                    e.target.checked ? "owner" : "agent"
                  )
                }
                class="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="user_type" class="ml-3 block text-sm text-gray-800">
                Are you the owner of this property?
              </label>
            </div>
          </div>

          <div class="!mt-12">
            <button
              type="submit"
              class="w-full py-3 px-4 tracking-wider text-sm rounded-md text-white bg-primary-700 hover:bg-primary-800 focus:outline-none"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingOwnerDetails;
