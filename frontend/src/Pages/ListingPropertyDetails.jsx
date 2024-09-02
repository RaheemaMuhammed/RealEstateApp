import { useFormik } from "formik";
import React, { useState } from "react";
import { PropertyListing } from "../api/services";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import * as yup from 'yup';
import { useSelector } from "react-redux";

const ListingPropertyDetails = () => {
    const [imagePreview, setImagePreview] = useState(null)
  const prop_types = [
    { id: "residential", name: "Residential" },
    { id: "commercial", name: "commercial" },
  ];
  const token = useSelector((state) => state.UserReducer.accessToken);

  const navigate = useNavigate()
  const onSubmit = async()=>{
    try {
        const response = await PropertyListing(values,token)
        const propertyId = response.pk;

        console.log(response);
        if(response && propertyId){
            toast.success("Property has been added")
            navigate(`/listing/type/${propertyId}`)
            
        }
        
    } catch (error) {
        console.log(error);
        toast.error("Property adding failed!!")
    }
  }

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
      address: "",
      area: "",
      description: "",
      property_type: "",
      number_of_rooms: "",
      number_of_bathrooms: "",
      parking_space: null,
      furnished: null,
      built_at: null,
      image: null,
    },
    validationSchema: yup.object().shape({ 
        address: yup
    .string()
    .required('Address is required')
    .min(5, 'Address should be at least 5 characters long'),
  area: yup
    .number()
    .required('Area is required')
    .positive('Area must be a positive number'),
  description: yup.string().required('Description is required'), 
  property_type: yup
    .string()
    .oneOf(['residential', 'commercial'], 'Invalid property type')
    .required('Property type is required'),
  number_of_rooms: yup
    .number()
    .positive('Number of rooms must be a positive number')
    .integer('Number of rooms must be an integer value')
    .nullable(),
  number_of_bathrooms: yup
    .number()
    .positive('Number of bathrooms must be a positive number')
    .integer('Number of bathrooms must be an integer value')
    .nullable(),
  parking_space: yup.boolean().nullable(),
  furnished: yup.boolean().nullable(), 
  built_at: yup.date().nullable(), 
  image: yup
    .mixed()
    .required('An image is required')
    .test(
      'fileType',
      'Unsupported file format',
      value => value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)
    ),
    }),
    onSubmit,
  });



  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUploadClick = () => {
    document.getElementById("image").click();
  };

  return (
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class=" px-6 py-8  md:h-screen lg:py-6">
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0  xl:p-0 ">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Property Details
            </h1>
            <form class="space-y-4 md:space-y-6 " onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label
                    for="address"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Address
                  </label>
                  <textarea
                    type="text"
                    name="address"
                    id="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.address && touched.address && (
                      <p className="text-red-600">{errors.address}</p>
                    )}
                </div>

                <div>
                  <label
                    for="description"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <textarea
                    type="text"
                    name="description"
                    id="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.description && touched.description && (
                      <p className="text-red-600">{errors.description}</p>
                    )}
                </div>
                <div>
                  <label
                    for="area"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Area/sqft
                  </label>
                  <input
                    type="number"
                    name="area"
                    id="area"
                    value={values.area}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.area && touched.area && (
                      <p className="text-red-600">{errors.area}</p>
                    )}
                </div>

                <div>
                  <label
                    htmlFor="property_type"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Property type
                  </label>
                  <select
                    id="property_type"
                    name="property_type"
                    value={values.property_type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                  >
                    <option>Select a property_type</option>
                    {prop_types.map((property_type) => (
                      <option key={property_type.id} value={property_type.id}>
                        {property_type.name}
                      </option>
                    ))}
                    
                  </select>
                  {errors.property_type && touched.property_type && (
                      <p className="text-red-600">{errors.property_type}</p>
                    )}
                </div>
                {values.property_type &&
                  values.property_type == "residential" && (
                    <>
                      <div>
                        <label
                          for="number_of_rooms"
                          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Number of rooms
                        </label>
                        <input
                          type="number"
                          name="number_of_rooms"
                          id="number_of_rooms"
                          value={values.number_of_rooms}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          for="number_of_bathrooms"
                          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Number of bathrooms
                        </label>
                        <input
                          type="number"
                          name="number_of_bathrooms"
                          id="number_of_bathrooms"
                          value={values.number_of_bathrooms}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </div>
                    </>
                  )}

            <div className="space-y-4 md:space-y-6 mt-2 ">
              <div class="flex items-center">
                  <input
                    id="furnished"
                    name="furnished"
                    type="checkbox"
                    checked={values.furnished}
                    onChange={(e) =>
                      setFieldValue("furnished", !values.furnished)
                    }
                    class="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    for="furnished"
                    class="ml-3 block text-sm text-gray-800"
                  >
                    Furnished
                  </label>
                  {errors.furnished && touched.furnished && (
                      <p className="text-red-600">{errors.furnished}</p>
                    )}
                </div>
                <div class="flex items-center">
                  <input
                    id="parking_space"
                    name="parking_space"
                    type="checkbox"
                    checked={values.parking_space}
                    onChange={(e) =>
                      setFieldValue("parking_space", !values.parking_space)
                    }
                    class="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    for="parking_space"
                    class="ml-3 block text-sm text-gray-800"
                  >
                    Parking
                  </label>
                  {errors.parking_space && touched.parking_space && (
                      <p className="text-red-600">{errors.parking_space}</p>
                    )}
                </div>
              </div>
              

              <div className="col-span-2">
                  <label
                    htmlFor="image"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Property Image
                  </label>
                  <div onClick={handleImageUploadClick} className="w-[50%] h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-700">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Uploaded Preview"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400">
                        Click to upload an image
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {errors.image && touched.image && (
                      <p className="text-red-600">{errors.image}</p>
                    )}
                </div>



              
              </div>
              
              
              <button
                type="submit"
                class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                
                Add property
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListingPropertyDetails;
