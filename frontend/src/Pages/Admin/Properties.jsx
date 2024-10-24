import React, { useEffect, useState } from 'react'
import { FetchProperties } from '../../api/services';
import { useSelector } from 'react-redux';
import TableForAll from '../../Components/Admin/Tables/TableForAll';
const Properties = () => {
  const [properties,setProperties] = useState([])
  const token = useSelector(state=>state.AdminReducer.accessToken)
  
  useEffect(() => {
    try {
      const fetchPropes = async () => {
        const response = await FetchProperties(token);
        console.log(response);
        if (response) {
          setProperties(response)
        }
      };
      fetchPropes();
    } catch (error) {
      console.log(error);
    }

  }, [token])
  const columns = [
    { header: 'Image', accessor: 'image' },
    { header: 'Address', accessor: 'address' },
    { header: 'Area', accessor: 'area' },
    { header: 'Type', accessor: 'property_type' },
    {
      header: ' ',
      cell: (row) => (
        <>
        <div className="flex flex-col gap-1 items-center justify-center badges text-sm">


        {row.is_for_sale && (
                        <span className="badge-sale">For Sale</span>
                      )}
                      {row.is_for_lease && (
                        <span className="badge-lease">For Lease</span>
                      )}
                      {row.is_for_rent && (
                        <span className="badge-rent">For Rent</span>
                      )}

        </div>

        </>
        
      )
    }
  ];
  return (
    <div className="mt-4    ">
   
    <div className="col-span-12 xl:col-span-8">
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
  <div className="max-w-full overflow-x-auto">
  {properties?.length > 0 ? (
            <TableForAll
              columns={columns}
              data={properties}
              imageField="image"
            />
          ) : (
            <p className='text-center text-title-md'>No Properties listed!!</p>
          )}
   
  </div>
</div>
    </div>
   
  </div>
  )
}

export default Properties