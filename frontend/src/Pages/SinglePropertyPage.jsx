import React, { useEffect, useState } from "react";
import { handleSaveStatus, RequestCallBack, UploadedPropertyDetails } from "../api/services";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaBath, FaBed } from "react-icons/fa";
import { IoLocationOutline, IoPerson } from "react-icons/io5";
import avatar from "../assets/avatar.png";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Modal } from "flowbite-react";
import * as yup from "yup";
import { FaRegBookmark,FaBookmark } from "react-icons/fa6";

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
import { useFormik } from "formik";
import { toast } from "react-toastify";

const SinglePropertyPage = ({ type }) => {
  const { propertyId } = useParams();
  const token = useSelector((state) => state.UserReducer.accessToken);
  const user_id = useSelector((state) => state.UserReducer.user.id);
  const [property, setProperty] = useState({});
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [ refresh,setRefresh] =useState(false)


  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await UploadedPropertyDetails(token ? token : '', propertyId);
        console.log(response);
        if (response) {
          setProperty(response);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPropertyDetails();
  }, [propertyId,refresh]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const onSubmit = async () => {
    try {
      console.log(values);
      const response = await RequestCallBack(values, token);

      console.log(response);
      if (response) {
        toast.success("Request has been sent");
        handleOpen();
      }
    } catch (error) {
      console.log(error);
      handleOpen()
      toast.error("Couldn't sent request!!");
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
      listing_type:type,
      phone_number: "",
      message: "",
      property_id: propertyId || "",
    },
    validationSchema: yup.object().shape({
      phone_number: yup.string()
        .matches(/^\d{10}$/, "Phone number must be 10 digits") // Validate phone number format
        .required("Phone number is required"),
      message: yup.string(),
    }),
    onSubmit,
  });

    // for save and unsave
    const handleSave = async()=>{
      console.log('save handling....');
      try{
          const data= {
              property_id:propertyId,
              type:type
          }
          if(token){
              const response = await handleSaveStatus(token,data)
              console.log(response);
           
              setRefresh(!refresh)
              
  
          }else{
              navigate('/login/')
              
          }
          
      }
      catch(error){
          // navigate('/expired/')
      }

  }
  return (
    <div className="mx-auto max-w-4xl p-2 ">
      <>
        <Dialog
          size="xs"
          open={open}
          handler={handleOpen}
          className="bg-transparent shadow-none"
        >
          <Card className="mx-auto w-full max-w-[24rem]">
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4" color="blue-gray">
                Request a call
              </Typography>
              <Typography
                className="mb-3 font-normal"
                variant="paragraph"
                color="gray"
              >
                Fill out the form and the property owner will contact you soon.
              </Typography>
              <Typography className="-mb-2" variant="h6">
                Your phone
              </Typography>
              <Input
                label="Phone"
                size="lg"
                name="phone_number"
                value={values.phone_number}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.phone_number && errors.phone_number
                    ? errors.phone_number
                    : null
                }
              />
              <Typography className="-mb-2" variant="h6">
                Your Message
              </Typography>
              <Textarea
                label="Message"
                size="lg"
                name="message"
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </CardBody>
            <CardFooter className="pt-0">
              <Button
                color="#1d4ed8"
                variant="gradient"
                onClick={handleSubmit}
                fullWidth
              >
                Send Request
              </Button>
            </CardFooter>
          </Card>
        </Dialog>
      </>
      <div
        onClick={handleGoBack}
        className="flex gap-2 text-primary-600 hover:underline cursor-pointer"
      >
        <span className="mt-1">
          <FaArrowLeftLong />
        </span>
        <span>Go Back</span>
      </div>
      <div className="py-2 flex gap-2">
        <div className="w-[70%]">
          <img class="object-cover" src={property?.image} alt="" />
          <div class=" flex flex-col justify-between py-4 leading-normal flex-1 h-auto">
            <div className="flex justify-between ">

            <h5 className="mb-3 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              <span className="text-sm">USD</span>{" "}
              {type === "buy" ? (
                new Intl.NumberFormat().format(property?.listing_price)
              ) : (
                <>
                  {new Intl.NumberFormat().format(
                    property?.listing_price_per_month
                  )}{" "}
                  <span className="text-sm">monthly</span>
                </>
              )}
            </h5>
            {user_id && user_id === property?.owner_id ? <p className="h-7 px-1 rounded-md border cursor-pointer hover:bg-gray-50 border-gray-400  ">edit</p>  : 
             <span onClick={handleSave} className="my-2 h-7 px-2 py-1 rounded-md border cursor-pointer hover:bg-gray-50 border-gray-400 flex gap-2 ">
              {property?.is_saved ?<><FaBookmark color="#1976d2" size={16} />
              <p className="mt-0  pt-0 leading-3">saved</p> </> :<><FaRegBookmark size={16} />
              <p className="mt-0  pt-0 leading-3">save</p> </> }
              
               </span>
            }
           
            </div>

            <div className="flex ">
              <p class="mb-3 border-e-2 border-e-gray-500 pr-2 mr-2 tracking-tight text-gray-800 dark:text-white">
                <span className="text-base font-medium text-gray-900">
                  Area:
                </span>{" "}
                {property?.area} sqft
              </p>
              <p class="mb-3 border-e-2 border-e-gray-500 pr-2  tracking-tight text-gray-800 dark:text-white">
                <span className="text-base font-medium text-gray-900">
                  Furnished:
                </span>{" "}
                {property?.furnished ? "Yes" : "No"}
              </p>
              {property?.number_of_rooms && (
                <p class="flex gap-1 mb-3 border-e-2 border-e-gray-500 pr-2  tracking-tight text-gray-800 dark:text-white">
                  <span className="flex text-base font-medium text-gray-900 mx-1 mt-1">
                    <FaBed />{" "}
                  </span>{" "}
                  {" : "}
                  {property?.number_of_rooms}
                </p>
              )}
              {property?.number_of_bathrooms && (
                <p class="flex gap-1 mb-3 border-e-2 border-e-gray-500 pr-2  tracking-tight text-gray-800 dark:text-white">
                  <span className="flex text-base font-medium text-gray-900 mx-1 mt-1">
                    <FaBath />{" "}
                  </span>{" "}
                  {" : "}
                  {property?.number_of_bathrooms}
                </p>
              )}
              <p class="mb-3  px-2  tracking-tight text-gray-800 dark:text-white">
                <span className="text-base font-medium text-gray-900">
                  Parking:
                </span>{" "}
                {property?.parking_space ? "Yes" : "No"}
              </p>
            </div>

            <p class="flex gap-2 mb-3 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              <IoLocationOutline style={{ marginTop: "3px" }} />
              {property?.address}
            </p>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 ">
              {property?.description}
            </p>
          </div>

          {type === "buy" && property?.sale_listing_details && (
            <>
              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <tbody>
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Conditions
                      </th>
                      <td class="px-6 py-4">
                        {property?.sale_listing_details?.conditions}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
          {type === "rent" && property?.rent_listing_details && (
            <>
              <div class="relative overflow-x-auto  sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <tbody>
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Rent Term
                      </th>
                      <td class="px-6 py-4">
                        {property?.rent_listing_details?.rent_term} months
                      </td>
                    </tr>

                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Conditions
                      </th>
                      <td class="px-6 py-4">
                        {property?.rent_listing_details?.conditions}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
          {type === "lease" && property?.lease_listing_details && (
            <>
              <div class="relative overflow-x-auto  sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <tbody>
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Security deposit
                      </th>
                      <td class="px-6 py-4">
                        {property?.lease_listing_details?.deposit_amount}
                      </td>
                    </tr>
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Lease Term
                      </th>
                      <td class="px-6 py-4">
                        {property?.lease_listing_details?.lease_term} months
                      </td>
                    </tr>

                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Conditions
                      </th>
                      <td class="px-6 py-4">
                        {property?.lease_listing_details?.conditions}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* owner details */}
        {user_id && user_id === property?.owner_id ? '' :<div className="flex-1 ">
          <div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div class="flex justify-end px-4 pt-4"></div>
            <div class="flex flex-col items-center pb-10">
              <img
                class="w-28 h-24 mb-3 rounded-full shadow-lg"
                src={avatar}
                alt="Bonnie image"
              />
              <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                {property?.owner_name}
              </h5>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {property?.is_owner ? "Owner" : "Agent"}
              </span>
              <div class="flex mt-4 md:mt-6">
                <a
                  href={`mailto:${property?.owner_email}`}
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Send mail
                </a>
                <p
                  onClick={handleOpen}
                  class="cursor-pointer py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Request a call
                </p>
              </div>
            </div>
          </div>
        </div> }
        
      </div>
    </div>
  );
};

export default SinglePropertyPage;
