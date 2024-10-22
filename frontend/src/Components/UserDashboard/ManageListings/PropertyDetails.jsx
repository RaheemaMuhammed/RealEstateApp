import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { PropertiesOfLister } from '../../../api/services';
import { useSelector } from 'react-redux';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { IoLocationOutline } from 'react-icons/io5';
import { FaBath, FaBed } from 'react-icons/fa';

const PropertyDetails = ({property}) => {
    const {propertyId} = useParams()
  const token = useSelector((state) => state.UserReducer.accessToken);
  const navigate = useNavigate();
    const uri = 'http://127.0.0.1:8000'
 
  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <div className="mx-auto max-w-4xl p-2 ">
      
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
          <img class="object-cover" src={`${uri}${property?.image}`} alt="" />
          <div class=" flex flex-col justify-between py-4 leading-normal flex-1 h-auto">
            <div className="flex justify-between ">
            <div>
            <h5 className="mb-3 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              <span className="text-sm">USD</span>{" "}
              {property?.is_for_sale && (
                new Intl.NumberFormat().format(property?.listing_price)
              ) }
              
            </h5>
            <h5 className="mb-3 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              <span className="text-sm">USD</span>{" "}
              {(property?.is_for_rent || property?.is_for_lease) && (
                <>
                  {new Intl.NumberFormat().format(
                    property?.listing_price_per_month
                  )}{" "}
                  <span className="text-sm">monthly</span>
                </>
              )}</h5>
            </div>
           
         <p className="h-7 px-1 rounded-md border cursor-pointer hover:bg-gray-50 border-gray-400  ">edit</p>   
             
            
           
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

          {property?.sale_listing_details && (
            <>
              <div class="relative overflow-x-auto  sm:rounded-lg mb-2">
              <h5 className='my-2 text-title-md '>Sale Details</h5>

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
          { property?.rent_listing_details && (
            <>
              <div class="relative overflow-x-auto  sm:rounded-lg mb-2">
                <h5 className='my-2 text-title-md '>Rent Details</h5>
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
          { property?.lease_listing_details && (
            <>
              <div class="relative overflow-x-auto  sm:rounded-lg">
              <h5 className='my-2 text-title-md '>Lease Details</h5>

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

      
        
      </div>
    </div>
  )
}

export default PropertyDetails