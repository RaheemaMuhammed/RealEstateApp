import { axiosUserInstance } from "./instance"

// Reistration process

export const Registeration = async (values) => {
    console.log(values,'values');
    try { 
        const config = {
            headers :{
                "Content-type" :"application/json"
            }
        }
        const response = await axiosUserInstance.post('auth/register/',values,config)
        console.log('response',response);
        return response.data
    }catch (error){
        console.log(error)
    }
}


// Login

export const Login = async (values) =>{
    try {
        const config = {
            headers :{
                "Content-type":"application/json",
            }
        }
        const response = await axiosUserInstance.post('auth/login/',values,config)
        return response.data
    }catch (error){
        throw(error)
        
    }

}

// profile creation for listing property

export const CreateListingProfile = async (values,token) =>{
    console.log('valuesandtoken',values,token);
    try {
        const config = {
            headers :{
                "Content-type":"application/json",
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axiosUserInstance.post('property/create_listing_profile/',values,config)
        return response.data
    }catch (error){
        throw(error)
        
    }

}
// profile details
export const ListingProfileDetails = async (token)=>{
    try{
        const config = {
           
            headers :{
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axiosUserInstance.get('property/listing_profile_details/',config)
        return response.data
        
    }
    catch (error){
        throw(error)
    }
    
}
// edit details
export const UpdateListingProfileDetails = async (token,values)=>{
    try{
        const config = {
           
            headers :{
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axiosUserInstance.patch('property/listing_profile_details/',values,config)
        return response.data
        
    }
    catch (error){
        throw(error)
    }
    
}
// upload a property
export const PropertyListing = async (values,token) =>{
    try {
        const config = {
            headers :{
                "Content-type":"multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axiosUserInstance.post('property/list_property/',values,config)
        return response.data
    }catch (error){
        throw(error)
        
    }

}

export const UploadedPropertyDetails = async (propertyId)=>{
    try{
        
        const response = await axiosUserInstance.get(`property/property_details/${propertyId}/`)
        return response.data
        
    }
    catch (error){
        throw(error)
    }
    
}
export const PropertyListingForSale = async (values,token,propertyId) =>{
    try {
        const config = {
            headers :{
                "Content-type":"multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axiosUserInstance.post(`property/${propertyId}/create_sale/`,values,config)
        return response.data
    }catch (error){
        throw(error)
        
    }

}
export const PropertyListingForRent = async (values,token,propertyId) =>{
    try {
        const config = {
            headers :{
                "Content-type":"multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axiosUserInstance.post(`property/${propertyId}/create_rent/`,values,config)
        return response.data
    }catch (error){
        throw(error)
        
    }

}
export const PropertyListingForLease = async (values,token,propertyId) =>{
    try {
        const config = {
            headers :{
                "Content-type":"multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axiosUserInstance.post(`property/${propertyId}/create_lease/`,values,config)
        return response.data
    }catch (error){
        throw(error)
        
    }

}
// list properties

export const FilteredProperties = async (filters)=>{
    try{
        const config = {
           
            
            params:filters,
        }
        const response = await axiosUserInstance.get(`property/properties/`,config)
        return response.data
        
    }
    catch (error){
        throw(error)
    }
    
}