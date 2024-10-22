import React, { useEffect, useState } from 'react'
import OwnedProperties from '../../Components/UserDashboard/OwnedProperties';
import PipelineProperties from '../../Components/UserDashboard/PipelineProperties';
import SavedProperties from '../../Components/UserDashboard/SavedProperties';
import SinglePropertyPage from '../SinglePropertyPage';
import PropertyDetails from '../../Components/UserDashboard/ManageListings/PropertyDetails';
import CallRequestsTable from '../../Components/UserDashboard/ManageListings/CallRequestsTable';
import Contracts from '../../Components/UserDashboard/ManageListings/Contracts';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { PropertiesOfLister } from '../../api/services';

const ManageSingleProperty = () => {
    const {propertyId} = useParams()

    const [activeTab, setActiveTab] = useState("details");
    const [property, setProperty] = useState({});
    const [callRequests, setCallRequests] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [refresh,setRefresh] = useState(false)
    const [pendingRequests,setPendingRequests] = useState('')

    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
      };
      useEffect(() => {
        console.log('refresh changed');
      }, [refresh])
      
  const token = useSelector((state) => state.UserReducer.accessToken);
  const navigate = useNavigate();
  useEffect(() => {
    console.log(propertyId);
    try {
      const fetchProperty = async () => {
        const response = await PropertiesOfLister(token,propertyId);
        console.log(response);
        if (response) {
          setProperty(response);
          setCallRequests(response?.call_requests || []);
          setContracts(response?.contracts || []);
          setPendingRequests(response?.call_requests?.filter(request => request.status === 'pending').length );

        }
      };
      fetchProperty();
    } catch (error) {
      console.log(error);
    }
  }, [refresh,token]);
  return (
    <div className="w-full max-w-4xl mx-auto ">
    <div className="flex justify-around border-b border-gray-200 mb-8">
      <button
        className={`px-4 py-2 font-semibold focus:outline-none ${
          activeTab === "details"
            ? "border-b-2 border-primary-600 text-primary-600"
            : "text-gray-500 hover:text-primary-600"
        }`}
        onClick={() => handleTabSwitch("details")}
      >
        Property Details
      </button>
      <button
        className={`px-4 py-2 font-semibold focus:outline-none flex gap-2 ${
          activeTab === "call_requests"
            ? "border-b-2 border-primary-600 text-primary-600"
            : "text-gray-500 hover:text-primary-600"
        }`}
        onClick={() => handleTabSwitch("call_requests")}
      >
        Call Requests

        {pendingRequests >0 && <p className='px-2 text-white text-sm rounded-full bg-red-500'>{pendingRequests}</p>}
      </button>
      <button
        className={`px-4 py-2 font-semibold focus:outline-none ${
          activeTab === "contracts"
            ? "border-b-2 border-primary-600 text-primary-600"
            : "text-gray-500 hover:text-primary-600"
        }`}
        onClick={() => handleTabSwitch("contracts")}
      >
        Contracts
      </button>
    </div>

    {/* Content for each tab */}
    <div>
      {activeTab === "details" && (
        <PropertyDetails property={property}/>
      )}
      {activeTab === "call_requests" && (
        <CallRequestsTable call_requests={callRequests} setRefresh={setRefresh}/>
      )}
      {activeTab === "contracts" && (
        <Contracts/>
      )}
    </div>
  </div>
  )
}

export default ManageSingleProperty