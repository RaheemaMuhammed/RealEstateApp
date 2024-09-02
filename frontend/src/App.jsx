import { BrowserRouter,Routes,Route, Navigate } from "react-router-dom";
import Landing from "./Pages/Landing";
import Header from "./Components/Header";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import ListingOwnerDetails from "./Pages/ListingOwnerDetails";
import ListingPropertyDetails from "./Pages/ListingPropertyDetails";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import 'react-toastify/dist/ReactToastify.css';
import ListingTypeDetails from "./Pages/ListingTypeDetails";
import PropertyListingPage from "./Pages/PropertyListingPage";
import SinglePropertyPage from "./Pages/SinglePropertyPage";
import PropertyLayout from "./Pages/PropertyLayout";

function App() {
  const token = useSelector(state=>state.UserReducer.accessToken)

  

  return (
    <>
<BrowserRouter>
    <Header/>
    <ToastContainer/>
<Routes>
  <Route path="/" element={<Landing/>}/>
  <Route path="/register" element={<Register/>}/>
  <Route path="/login" element={<Login/>}/>
  

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
</BrowserRouter>
</>
  )
}

export default App