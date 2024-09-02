import { useFormik } from 'formik';
import React from 'react'
import * as Yup from 'yup'
import { PropertyListingForLease, PropertyListingForRent, PropertyListingForSale } from '../../api/services';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
const PriceForm = ({type,propertyId, setRefresh}) => {
    const token = useSelector((state) => state.UserReducer.accessToken);

    const onSubmit = async () =>{
        console.log(values);
        let api = ''
        try {
            if(type === 'sell'){
                api= PropertyListingForSale

            }else if(type === 'rent'){
                api = PropertyListingForRent
            }else if(type === 'lease'){
                api = PropertyListingForLease
            }
            const response = await api(values,token,propertyId)
            console.log(response);
            if(response){
                toast.success('Property listed successfully')
                setRefresh((ref)=>!ref)
            }
        } catch (error) {
            console.log(error);
            
        }
    }


    const validationSchema = Yup.object().shape({
        price: type === 'sell' ? Yup.number().required('Price is required') : Yup.number().nullable(),
        price_per_month: type !== 'sell' ? Yup.number().required('Price per month is required') : Yup.number().nullable(),
        deposit_amount: type === 'lease' ? Yup.number().required('Deposit amount is required') : Yup.number().nullable(),
        lease_term: type === 'lease' ? Yup.string().required('Lease term is required') : Yup.string().nullable(),
        rent_term: type === 'rent' ? Yup.string().required('Rent term is required') : Yup.string().nullable(),
        conditions: Yup.string().required('Conditions are required'),
      });
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
            price: '',
            price_per_month: '',
            deposit_amount: '',
            lease_term: '',
            rent_term: '',
            conditions: '',
         
        },
        validationSchema,
        onSubmit,
      });
  return (
    <div className="">
        <form class="p-2 max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow" onSubmit={handleSubmit}>
          {type === 'sell' && (
            <>
            <div class="relative z-0 w-full mb-5 group">
            <input
              type="number"
              name="price"
              id="price"
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              
            />
            <label
              for="price"
              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Price
            </label>
            {errors.price && touched.price && (
                      <p className="text-red-600">{errors.price}</p>
                    )}
          </div>
            </>
          )}
          {type === 'rent' && (
            <>
            <div class="relative z-0 w-full mb-5 group">
            <input
              type="number"
              name="price_per_month"
              id="price_per_month"
              value={values.price_per_month}
              onChange={handleChange}
              onBlur={handleBlur}
              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              
            />
            <label
              for="price_per_month"
              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Price/month
            </label>
            {errors.price_per_month && touched.price_per_month && (
                      <p className="text-red-600">{errors.price_per_month}</p>
                    )}
          </div>
          <div class="relative z-0 w-full mb-5 group">
            <input
              type="number"
              name="rent_term"
              id="rent_term"
              value={values.rent_term}
              onBlur={handleBlur}
              onChange={handleChange}
              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              
            />
            <label
              for="rent_term"
              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Rent Term
            </label>
            {errors.rent_term && touched.rent_term && (
                      <p className="text-red-600">{errors.rent_term}</p>
                    )}
          </div>
            </>
          )}
          {type === 'lease' && (
            <>
            <div class="relative z-0 w-full mb-5 group">
            <input
              type="number"
              name="deposit_amount"
              id="deposit_amount"
              value={values.deposit_amount}
              onChange={handleChange}
              onBlur={handleBlur}
              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              
            />
            <label
              for="deposit_amount"
              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Security Deposit
            </label>
            {errors.deposit_amount && touched.deposit_amount && (
                      <p className="text-red-600">{errors.deposit_amount}</p>
                    )}
          </div>
            <div class="relative z-0 w-full mb-5 group">
            <input
              type="number"
              name="price_per_month"
              value={values.price_per_month}
              onChange={handleChange}
              onBlur={handleBlur}
              id="price_per_month"
              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              
            />
            <label
              for="price_per_month"
              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Price/month
            </label>
            {errors.price_per_month && touched.price_per_month && (
                      <p className="text-red-600">{errors.price_per_month}</p>
                    )}
          </div>
          <div class="relative z-0 w-full mb-5 group">
            <input
              type="number"
              name="lease_term"
              id="lease_term"
              value={values.lease_term}
              onChange={handleChange}
              onBlur={handleBlur}
              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              
            />
            <label
              for="lease_term"
              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Lease Term
            </label>
            {errors.lease_term && touched.lease_term && (
                      <p className="text-red-600">{errors.lease_term}</p>
                    )}
          </div>
            </>
          )}
          
          <div class="relative z-0 w-full mb-5 group">
            <textarea
              type="text"
              name="conditions"
              id="conditions"
              value={values.conditions}
              onChange={handleChange}
              onBlur={handleBlur}
              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              
            />
            <label
              for="conditions"
              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              conditions
            </label>
            {errors.conditions && touched.conditions && (
                      <p className="text-red-600">{errors.conditions}</p>
                    )}
          </div>
         
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      </div>
  )
}

export default PriceForm