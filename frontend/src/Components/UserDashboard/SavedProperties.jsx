import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getSavedProperties } from '../../api/services'
import { FaBed } from 'react-icons/fa'
import { IoLocationOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { axiosUserInstance } from '../../api/instance'
const SavedProperties = () => {
    const [savedProperties, setSavedProperties] = useState([])
    const token = useSelector(state => state.UserReducer.accessToken)


    useEffect(() => {
      const savedItems = async () =>{
        try {
            const response = await getSavedProperties(token)
            console.log(response);
            if(response?.status === 200){
                setSavedProperties(response?.payload)
            }
            
        } catch (error) {
            console.log(error);
        }
      }
      savedItems()
    }, [token])
    

  return (
    <div>
        {savedProperties?.length > 0 ? (
          <div>
            {savedProperties?.map((property, indx) => {
                const uri = 'http://127.0.0.1:8000'
                return(
              <Link to={`property/${property?.id}`}>
              
              <div className="flex flex-col my-2 bg-white border border-gray-200 rounded-lg shadow md:flex-row  hover:bg-gray-100 md:h-[350px">
                <img
                  class="object-cover w-full rounded-t-lg md:h-auto md:w-[40%] md:rounded-none md:rounded-s-lg h-full"
                  src={`${uri}${property?.image}`}
                  alt="property_image"
                />
                <div class=" flex flex-col justify-between p-4 leading-normal flex-1 h-auto">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    <span className="text-sm">USD</span>{" "}
                    {/* {new Intl.NumberFormat().format(property?.listing_price)} */}
                    {property?.listing_type === "buy" ? (
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
                  <div className="flex ">
                    <p class="mb-2 border-e-2 border-e-gray-500 pr-2 mr-2 tracking-tight text-gray-800 dark:text-white">
                      <span className="text-base font-medium text-gray-900">
                        Area:
                      </span>{" "}
                      {property?.area} sqft
                    </p>
                    <p class="mb-2 border-e-2 border-e-gray-500 pr-2  tracking-tight text-gray-800 dark:text-white">
                      <span className="text-base font-medium text-gray-900">
                        Furnished:
                      </span>{" "}
                      {property?.furnished ? "Yes" : "No"}
                    </p>
                    {property?.number_of_rooms && (
                      <p class="flex gap-1 mb-2 border-e-2 border-e-gray-500 pr-2  tracking-tight text-gray-800 dark:text-white">
                        <span className="flex text-base font-medium text-gray-900 mx-1 mt-1">
                          <FaBed/>{" "}
                        </span>{" "}
                        {" : "}
                        {property?.number_of_rooms}
                      </p>
                    )}
                  </div>

                  <p class="flex gap-2 mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    <IoLocationOutline style={{marginTop:'4px'}}/>
                    {property?.address}
                  </p>
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 overflow-hidden text-ellipsis line-clamp-3">
                    {property?.description}
                  </p>
                </div>
              </div>
              </Link>
            )})}
          </div>
        ) : (
          <>
            <p className="text-center text-2xl">No saved items!!</p>
          </>
        )}
    </div>
  )
}

export default SavedProperties