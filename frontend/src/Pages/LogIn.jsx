import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Login } from '../api/services'
import { useFormik } from 'formik'
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { UserLogin } from '../store/UserSlice';

const login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
  
    const onSubmit = async () =>{
      const form = new FormData()
      form.append('email',values.email)
      form.append('password',values.password)
      
  
      try{
        const response = await Login(values)
        console.log(response);
        if(response && response?.access){
            dispatch((UserLogin({refreshToken: response?.refresh,
                accessToken: response?.access,
                user:response.pk})))
           
          toast.success('Successfully Logged in')
          navigate('/')
  
        }else {
            toast.error('Login failed. Please check your credentials and try again.');

        }
        
      }catch (error){
        console.log(error);
    toast.error('Login failed. Please check your credentials and try again.');
      }
  
    }
  
    // Formik working
    const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema:yup.object().shape({ 
          email:yup.string().email('Please enter a valid email').required('Email is required'),
          password:yup
          .string()
          .min(5,'password should contain 5-16 characters')
          .max(16,'password should contain 5-16 characters')
          .required('Password is Required')
      }),
      onSubmit,
    })
  
  return (
    <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Sign in to your account
                </h1>
                <form class="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Email</label>
                        <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                        placeholder="Enter Your Email" 
                       />
                       {errors.email && touched.email && (
                <p className="text-red-600">{errors.email}</p>
              )}
                    </div>
                    
                    <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                        <input 
                        type="password" 
                        name="password" 
                        id="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur} 
                        placeholder="Enter Your Password" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  " 
                        />
                    {errors.password && touched.password && (
                                    <p className="text-red-600">{errors.password}</p>
                                )}
                    </div>
                    
                    <button 
                    type="submit" 
                    class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">SignIn</button>
                    <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                        Don’t have an account yet? 
                        <Link to={'/register'} className='font-medium text-primary-600 hover:underline dark:text-primary-500'>Register now</Link>
                        
                    </p>
                </form>
               
            </div>
        </div>
    </div>
  </section>
  )
}

export default login