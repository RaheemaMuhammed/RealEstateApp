import React, { useState } from 'react'
import OwnedProperties from '../../Components/UserDashboard/OwnedProperties';
import PipelineProperties from '../../Components/UserDashboard/PipelineProperties';
import SavedProperties from '../../Components/UserDashboard/SavedProperties';

const MyProperties = () => {
    const [activeTab, setActiveTab] = useState("owned");
    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
      };
  return (
    <div className="w-full max-w-4xl mx-auto ">
    <div className="flex justify-around border-b border-gray-200 mb-8">
      <button
        className={`px-4 py-2 font-semibold focus:outline-none ${
          activeTab === "owned"
            ? "border-b-2 border-primary-600 text-primary-600"
            : "text-gray-500 hover:text-primary-600"
        }`}
        onClick={() => handleTabSwitch("owned")}
      >
        Owned Properties
      </button>
      <button
        className={`px-4 py-2 font-semibold focus:outline-none ${
          activeTab === "pipeline"
            ? "border-b-2 border-primary-600 text-primary-600"
            : "text-gray-500 hover:text-primary-600"
        }`}
        onClick={() => handleTabSwitch("pipeline")}
      >
        Pipeline
      </button>
      <button
        className={`px-4 py-2 font-semibold focus:outline-none ${
          activeTab === "saved"
            ? "border-b-2 border-primary-600 text-primary-600"
            : "text-gray-500 hover:text-primary-600"
        }`}
        onClick={() => handleTabSwitch("saved")}
      >
        Saved Properties
      </button>
    </div>

    {/* Content for each tab */}
    <div>
      {activeTab === "owned" && (
        <OwnedProperties/>
      )}
      {activeTab === "pipeline" && (
        <PipelineProperties/>
      )}
      {activeTab === "saved" && (
        <SavedProperties/>
      )}
    </div>
  </div>
  )
}

export default MyProperties