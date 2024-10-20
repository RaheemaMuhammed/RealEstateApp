import { BrowserRouter,Routes,Route, Navigate } from "react-router-dom";
import Landing from "./Pages/Landing";
import Header from "./Components/Header";
import Register from "./Pages/Register";
import ListingOwnerDetails from "./Pages/ListingOwnerDetails";
import ListingPropertyDetails from "./Pages/ListingPropertyDetails";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import 'react-toastify/dist/ReactToastify.css';
import ListingTypeDetails from "./Pages/ListingTypeDetails";
import PropertyListingPage from "./Pages/PropertyListingPage";
import SinglePropertyPage from "./Pages/SinglePropertyPage";
import PropertyLayout from "./Pages/PropertyLayout";
import UserRoutes from "./Routes/UserRoutes";
import AdminRoutes from "./Routes/AdminRoutes";
function App() {
  
  

  return (
    <>
<BrowserRouter>
    
    <ToastContainer/>
<Routes>
<Route path="/*" Component={UserRoutes}/>
<Route path="/admin/*" Component={AdminRoutes}/>
  


</Routes>
</BrowserRouter>
</>
  )
}

export default App