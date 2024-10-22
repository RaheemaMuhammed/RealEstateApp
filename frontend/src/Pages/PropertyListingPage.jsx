import React, { useEffect, useState } from "react";
import hero from "../assets/hero.jpg";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FilteredProperties } from "../api/services";
import { useSelector } from "react-redux";
import { IoLocationOutline } from "react-icons/io5";
import { MdAttachMoney } from "react-icons/md";
import { FaBath, FaBed } from "react-icons/fa";
import { BiArea, BiSearch } from "react-icons/bi";
import FilterInput from "../Components/Property/FilterInput";

const PropertyListingPage = ({type}) => {
  console.log(type);

  
  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    areaMin: "",
    areaMax: "",
    propertyType: "residential",
    bathrooms: "",
    bedrooms: "",
    location: "",
  });
  const [appliedFilters, setAppliedFilters] =useState({});
  const [properties, setProperties] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.UserReducer.accessToken);

  

// apply filters when search button is clicked
const applyFilters = () => {
  const nonEmptyFilters = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      nonEmptyFilters[key] = value
    }
  }
  setSearchParams(nonEmptyFilters)
  setAppliedFilters(nonEmptyFilters)
};
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  

  // fetching based on filter applied
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertiesData = await FilteredProperties({ ...filters, type });
        console.log(propertiesData);
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, [type,appliedFilters,token]);

  return (
    <div>
      <div className="mb-6 px-5 md:w-[90%] mx-auto sticky bg-white">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <FilterInput
              icon={<IoLocationOutline />}
              type="text"
              id="location"
              value={filters.location}
              onChange={handleFilterChange}
              name="location"
              placeholder="Enter location"
            />
         
          </div>
          {/* Property Type */}
          <div>
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleFilterChange}
              className="block w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          {/* Price Range */}
          <div className="flex gap-1">
            <div>
              <FilterInput
                icon={<MdAttachMoney />}
                type="number"
                name="priceMin"
                value={filters.priceMin}
                onChange={handleFilterChange}
                placeholder="Min Price"
                id="priceMin"
              />
            </div>
            <div>
              <FilterInput
                icon={<MdAttachMoney />}
                type="number"
                name="priceMax"
                value={filters.priceMax}
                onChange={handleFilterChange}
                id="priceMin"
                placeholder="Max Price"
              />
            </div>
          </div>
          {/* Additional Filters */}
          {filters.propertyType === "residential" && (
            <>
              <div>
                <FilterInput
                  icon={<FaBath />}
                  type="number"
                  name="bathrooms"
                  value={filters.bathrooms}
                  onChange={handleFilterChange}
                  id="bathrooms"
                  placeholder="Bathrooms"
                />
              </div>
              <div>
                <FilterInput
                  icon={<FaBed />}
                  type="number"
                  name="bedrooms"
                  id="bedrooms"
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                  placeholder="Bedrooms"
                />
              </div>
            </>
          )}
          {/* Area Range */}
          <div className="flex gap-1">
            <div>
              <FilterInput
                icon={<BiArea />}
                type="number"
                name="areaMin"
                value={filters.areaMin}
                onChange={handleFilterChange}
                id="areaMin"
                placeholder="Min Area"
              />
            </div>
            <div>
              <FilterInput
                icon={<BiArea />}
                type="number"
                name="areaMax"
                value={filters.areaMax}
                onChange={handleFilterChange}
                id="areaMax"
                placeholder="Max Area"
              />
            </div>
            <div className="p-1 bg-blue-600  rounded-lg cursor-pointer" onClick={applyFilters}>
                <BiSearch size={24} color="white" style={{marginTop:'3px'}}/>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-5 mx-auto md:w-[90%] ">
        <p class="flex gap-2 mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Properties for{" "}
          {type === "buy"
            ? "sale"
            :type}
        </p>
        {properties?.length > 0 ? (
          <div>
            {properties?.map((property, indx) => (
              <Link to={`property/${property?.id}`}>
              
              <div className="flex flex-col my-2 bg-white border border-gray-200 rounded-lg shadow md:flex-row  hover:bg-gray-100 md:h-[350px">
                <img
                  class="object-cover w-full rounded-t-lg md:h-auto md:w-[40%] md:rounded-none md:rounded-s-lg h-full"
                  src={property?.image}
                  alt=""
                />
                <div class=" flex flex-col justify-between p-4 leading-normal flex-1 h-auto">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    <span className="text-sm">USD</span>{" "}
                    {/* {new Intl.NumberFormat().format(property?.listing_price)} */}
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
                          <FaBed />{" "}
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
            ))}
          </div>
        ) : (
          <>
            <p className="text-center text-2xl">No match found!!</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyListingPage;
