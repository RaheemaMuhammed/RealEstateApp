import { axiosUserInstance } from "./instance";

// Reistration process

export const Registeration = async (values) => {
  console.log(values, "values");
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const response = await axiosUserInstance.post(
      "auth/register/",
      values,
      config
    );
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// Login

export const LoginAPI = async (values) => {
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const response = await axiosUserInstance.post(
      "auth/login/",
      values,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// profile creation for listing property

export const CreateListingProfile = async (values, token) => {
  console.log("valuesandtoken", values, token);
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosUserInstance.post(
      "property/create_listing_profile/",
      values,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
// profile details
export const ListingProfileDetails = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosUserInstance.get(
      "property/listing_profile_details/",
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
// edit details
export const UpdateListingProfileDetails = async (token, values) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosUserInstance.patch(
      "property/listing_profile_details/",
      values,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
// upload a property
export const PropertyListing = async (values, token) => {
  try {
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosUserInstance.post(
      "property/list_property/",
      values,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const UploadedPropertyDetails = async (token,propertyId) => {
    console.log(token);
  try {
    let config = {} ;
    if(token){
        const config = {
            headers: {
              "Content-type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          };
    }
    

    const response = await axiosUserInstance.get(
      `property/property_details/${propertyId}/`,
      token ? config : undefined
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const PropertyListingForSale = async (values, token, propertyId) => {
  try {
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosUserInstance.post(
      `property/${propertyId}/create_sale/`,
      values,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const PropertyListingForRent = async (values, token, propertyId) => {
  try {
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosUserInstance.post(
      `property/${propertyId}/create_rent/`,
      values,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const PropertyListingForLease = async (values, token, propertyId) => {
  try {
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosUserInstance.post(
      `property/${propertyId}/create_lease/`,
      values,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
// list properties

export const FilteredProperties = async (filters) => {
  try {
    const config = {
      params: filters,
    };
    const response = await axiosUserInstance.get(
      `property/properties/`,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// send call back request

export const RequestCallBack = async (values, token) => {
  try {
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosUserInstance.post(
      `property/call_requests/`,
      values,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// list notification

export const GetNotifications = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosUserInstance.get(
      `property/notifications/`,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// notification read or not
export const MarkNotificationRead = async (token, values) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axiosUserInstance.patch("property/notifications/", values, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// saving and unsaving
export const handleSaveStatus = async (token, values) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axiosUserInstance.patch("property/saved_properties/",values,config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// get saved properties
export const getSavedProperties = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axiosUserInstance.get("property/saved_properties/", config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const FetchOwnedProperties = async ( token) => {
  try {
      const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        };
    const response = await axiosUserInstance.get(
      "property/owned_properties/",
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const FetchPipelineProperties = async ( token) => {
  try {
      const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        };
    const response = await axiosUserInstance.get(
      "property/properties_in_pipeline/",
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


// properties of current user
export const PropertiesOfLister = async ( token,propertyId) => {
    try {
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params :propertyId ? {property_id : propertyId} : {}
          };
      const response = await axiosUserInstance.get(
        "property/list_property/",
        config
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

// properties of current user
export const CallRequestsOfProperty = async ( token,propertyId) => {
    try {
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params : {property_id : propertyId} 
          };
      const response = await axiosUserInstance.get(
        "property/call_requests/",
        config
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

// changing request status
export const handleStatusChange = async (token, values) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axiosUserInstance.patch("property/call_requests/",values,config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// templates creation and fetching

export const FetchTemplates = async ( token,propertyId) => {
  try {
      const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        };
    const response = await axiosUserInstance.get(
      "property/contract_templates/",
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const AddContractTemplate = async (values, token) => {
  try {
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosUserInstance.post(
      `property/contract_templates/`,
      values,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// contract fetching and updating

export const FetchContracts = async ( token) => {
  try {
      const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        };
    const response = await axiosUserInstance.get(
      "property/contracts/",
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const handleContractStatusChange = async (token, values) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axiosUserInstance.patch("property/contracts/",values,config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// fetch users 
export const FetchUsers = async ( token) => {
  try {
      const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        };
    const response = await axiosUserInstance.get(
      "adminpanel/users/",
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
// fetch Properties for admin 
export const FetchProperties = async ( token) => {
  try {
      const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        };
    const response = await axiosUserInstance.get(
      "adminpanel/properties/",
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
// fetch anlutics
export const FetchAnalytics = async ( token) => {
  try {
      const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        };
    const response = await axiosUserInstance.get(
      "adminpanel/analytics/",
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

