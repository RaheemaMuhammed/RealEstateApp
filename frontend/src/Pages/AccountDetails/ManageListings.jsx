import React, { useEffect, useState } from "react";
import { PropertiesOfLister } from "../../api/services";
import { useSelector } from "react-redux";
import TableOne from "../../Components/Admin/Tables/TableOne";
import "./tailwind.css";
import { Link } from "react-router-dom";
const ManageListings = () => {
  const token = useSelector((state) => state.UserReducer.accessToken);
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    try {
      const fetchProperties = async () => {
        const response = await PropertiesOfLister(token);
        console.log(response);
        if (response) {
          setProperties(response);
        }
      };
      fetchProperties();
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        My Listings
      </h4>
      {properties?.length > 0 ? (
        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
            <div className="p-2.5 xl:p-3">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Image
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-3">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Address
              </h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-3">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Type
              </h5>
            </div>
            {/* <div className="p-2.5 text-center xl:p-3">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Description
              </h5>
            </div> */}
            <div className="hidden p-2.5 text-center sm:block xl:p-3">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Types Listed
              </h5>
            </div>
          </div>

          {properties.map((property, key) => {
            const uri = "http://127.0.0.1:8000";
            return (
              <Link to={`${property?.id}`}>
                <div
                  className={`grid grid-cols-3 sm:grid-cols-5 hover:bg-gray-50 rounded-md cursor-pointer ${
                    key === key
                      ? ""
                      : "border-b border-stroke dark:border-strokedark"
                  }`}
                  key={key}
                >
                  <div className="flex items-center gap-3 p-2.5 xl:p-3">
                    <div className="flex-shrink-0">
                      <img
                        src={`${uri}${property?.image}`}
                        className="w-24 h-24 rounded-md"
                        alt="property"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center p-2.5 xl:p-3">
                    <p className="text-black dark:text-white">
                      {property.address}
                    </p>
                  </div>
                  <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-3">
                    <p className="text-meta-5">{property.property_type}</p>
                  </div>
                  {/* <div className="description hidden items-center justify-center p-2.5 sm:flex xl:p-3 overflow-hidden text-ellipsis line-clamp-1">
                <p className="text-black dark:text-white ">{property.description}</p>
              </div> */}
                  <div className="flex items-center justify-center  p-2.5 xl:p-3">
                    <div className="flex flex-col gap-1 items-center justify-center badges text-sm">
                      {property.is_for_sale && (
                        <span className="badge-sale">For Sale</span>
                      )}
                      {property.is_for_lease && (
                        <span className="badge-lease">For Lease</span>
                      )}
                      {property.is_for_rent && (
                        <span className="badge-rent">For Rent</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <>
          <p className="text-center text-2xl">
            You have not listed any property!!
          </p>
        </>
      )}
    </div>
  );
};

export default ManageListings;
