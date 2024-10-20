import React from 'react'
import { Routes,Route, Navigate } from 'react-router-dom'
import Landing from '../Pages/Landing'
import Register from '../Pages/Register'
import PropertyLayout from '../Pages/PropertyLayout'
import PropertyListingPage from '../Pages/PropertyListingPage'
import SinglePropertyPage from '../Pages/SinglePropertyPage'
import ListingOwnerDetails from '../Pages/ListingOwnerDetails'
import ListingPropertyDetails from '../Pages/ListingPropertyDetails'
import ListingTypeDetails from '../Pages/ListingTypeDetails'
import { useSelector } from 'react-redux'
import LoginPage from '../Pages/LoginPage'
import Header from '../Components/Header'
const UserRoutes = () => {
    const token = useSelector(state=>state.UserReducer.accessToken)
    const adminToken = useSelector(state => state.AdminReducer.accessToken)

  return (
    <><Header/>
    <Routes>
        


    <Route path="/" element={adminToken ? <Navigate to={'/admin/dashboard'}/>: <Landing/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/login" element={<LoginPage/>}/>
    
  
    <Route path="properties" element={<PropertyLayout/>}>
          <Route path="buy" element={<PropertyListingPage type="buy" />} />
          <Route path="rent" element={<PropertyListingPage type="rent" />} />
          <Route path="lease" element={<PropertyListingPage type="lease" />} />
  
          <Route path="buy/property/:propertyId" element={<SinglePropertyPage type="buy" />} />
          <Route path="rent/property/:propertyId" element={<SinglePropertyPage type="rent" />} />
          <Route path="lease/property/:propertyId" element={<SinglePropertyPage type="lease" />} />
    </Route>
    
  
  
    <Route path="/listing/owner-details" element={token ? <ListingOwnerDetails/> : <Navigate to="/login"/>}/>
    <Route path="/listing/property-details" element={token ? <ListingPropertyDetails/>  : <Navigate to="/login"/>}/>
    <Route path="/listing/type/:propertyId" element={token ? <ListingTypeDetails/>  : <Navigate to="/login"/>}/>

    </Routes>
    </>

  )
}

export default UserRoutes