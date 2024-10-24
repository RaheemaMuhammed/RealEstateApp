import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UploadedPropertyDetails } from "../api/services";
import { useSelector } from "react-redux";
import PriceForm from "../Components/Property/PriceForm";

const ListingTypeDetails = () => {
  const { propertyId } = useParams();
  const token = useSelector((state) => state.UserReducer.accessToken);
  const [property, setProperty] = useState({});
  const [listingType, setListingType] = useState('');
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await UploadedPropertyDetails(token, propertyId);
        console.log(response);
        if (response) {
          setProperty(response);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPropertyDetails();
  }, [refresh]);

  return (
    <section className="bg-gray-50 md:flex justify-between">
      <div className="px-6 py-8  md:h-screen lg:py-6  ">
        <h5 class="mb-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Sell. Lease. Rent.
        </h5>
        <p class="text-xs font-normal text-gray-500 dark:text-gray-400">
          You can list the same property to sell, rent or lease
        </p>

        <div className="mt-2">
          <fieldset>
            

            <div class="flex items-center mb-4">
        <input
          id="radio-sell"
          type="radio"
          name="listingType"
          value="sell"
          checked={listingType === 'sell'}
          onChange={() => setListingType('sell')}
          disabled={property?.is_for_sale}
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          for="radio-sell"
          class="ms-2 text-2xl font-medium text-gray-900 dark:text-gray-300"
        >
          Sell
        </label>
      </div>

      <div class="flex items-center mb-4">
        <input
          id="radio-rent"
          type="radio"
          name="listingType"
          value="rent"
          checked={listingType === 'rent'}
          disabled={property?.is_for_rent}
          onChange={() => setListingType('rent')}
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          for="radio-rent"
          class="ms-2 text-2xl font-medium text-gray-900 dark:text-gray-300"
        >
          Rent
        </label>
      </div>

      <div class="flex items-center mb-4">
        <input
          id="radio-lease"
          type="radio"
          name="listingType"
          value="lease"
          checked={listingType === 'lease'}
          onChange={() => setListingType('lease')}
          disabled={property?.is_for_lease}
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          for="radio-lease"
          class="ms-2 text-2xl font-medium text-gray-900 dark:text-gray-300"
        >
          Lease
        </label>
      </div>

           
          </fieldset>

        </div>
      </div>
      <div className=" px-6 py-8 w-full md:w-[40%]  md:h-screen lg:py-6">
        {listingType && 
        <PriceForm type={listingType} propertyId={propertyId} setRefresh={setRefresh} />}
        
      </div>

      <div class=" px-6 py-8  md:h-screen lg:py-6">
        <div class="relative max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <img class="rounded-t-lg" src={property?.image} alt="" />
          <div className="absolute top-2 left-2 flex flex-col gap-2">
    {property?.is_for_sale && (
      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">For Sale</span>
    )}
    {property?.is_for_rent && (
      <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">For Rent</span>
    )}
    {property?.is_for_lease && (
      <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">For Lease</span>
    )}
  </div>
          <div class="p-5">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {property?.address}
            </h5>

            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {property?.description}
            </p>
            <div className="flex gap-1 mb-2 text-base font-medium tracking-tight text-gray-900">
              Property type:
              <p class=" font-normal text-gray-700 dark:text-gray-400">
                {property?.property_type}
              </p>
            </div>

            <div className="grid grid-cols-2">
              {property?.property_type == "residential" && (
                <>
                  <div className="flex gap-1 mb-2 text-base font-medium tracking-tight text-gray-900">
                    No.of Rooms:
                    <p class=" font-normal text-gray-700 dark:text-gray-400">
                      {property?.number_of_rooms}
                    </p>
                  </div>
                  <div className="flex gap-1 mb-2 text-base font-medium tracking-tight text-gray-900">
                    No.of Bathrooms:
                    <p class=" font-normal text-gray-700 dark:text-gray-400">
                      {property?.number_of_bathrooms}
                    </p>
                  </div>
                </>
              )}

              <div className="flex gap-1 mb-2 text-base font-medium tracking-tight text-gray-900">
                Parking Available:
                <p class=" font-normal text-gray-700 dark:text-gray-400">
                  {property?.parking_space ? "Yes" : "No"}
                </p>
              </div>
              <div className="flex gap-1 mb-2 text-base font-medium tracking-tight text-gray-900">
                Furnished:
                <p class=" font-normal text-gray-700 dark:text-gray-400">
                  {property?.furnished ? "Yes" : "No"}
                </p>
              </div>
            </div>
            <Link to={'/my_listings'}
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
            Your properties
              <svg
                class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </Link>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListingTypeDetails;
