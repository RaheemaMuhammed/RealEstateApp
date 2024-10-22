import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { CallRequestsOfProperty } from '../../../api/services'
import CallRequestRow from './CallRequestRow'

const CallRequestsTable = ({call_requests,setRefresh}) => {
    const token = useSelector(state=>state.UserReducer.accessToken)
    console.log(call_requests);

    
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        {call_requests?.length > 0 ? <div className="max-w-full overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            <th className=" py-4 px-2 font-medium text-black dark:text-white ">
              User
            </th>
            <th className="py-4 px-2 font-medium text-black dark:text-white">
              Phone Number
            </th>
            <th className=" py-4 px-2 font-medium text-black dark:text-white">
              Message
            </th>
            <th className=" py-4 px-2 font-medium text-black dark:text-white">
              Requested date
            </th>
            <th className=" py-4  font-medium text-black dark:text-white">
              
            </th>
            
          </tr>
        </thead>
        <tbody>
              {call_requests.map((request, key) => (
                <CallRequestRow key={key} request={request} setRefresh={setRefresh}/>
              ))}
            </tbody>
      </table>
    </div>  :
    <>          <p className="text-center text-2xl">No requests yet !!</p>
</>
    }
   
  </div>
  )
}

export default CallRequestsTable