import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FetchPipelineProperties } from '../../api/services'
import TableForAll from '../Admin/Tables/TableForAll'
const PipelineProperties = () => {
  

  const [ownedProperties, setOwnedProperties] = useState([])
  const token = useSelector(state => state.UserReducer.accessToken)


  useEffect(() => {
    const savedItems = async () =>{
      try {
          const response = await FetchPipelineProperties(token)
          console.log(response);
          if(response){
              setOwnedProperties(response)
          }
          
      } catch (error) {
          console.log(error);
      }
    }
    savedItems()
  }, [token])
  const columns = [
    { header: 'Image', accessor: 'image' },
    { header: 'Address', accessor: 'address' },
    { header: 'Area', accessor: 'area' },
    { header: 'Type', accessor: 'property_type' },
    { header: 'Stage', accessor: 'pipeline_stage' },
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
  {ownedProperties?.length > 0 ? (
            <TableForAll
              columns={columns}
              data={ownedProperties}
              imageField="image"
            />
          ) : (
            <p className='text-center text-title-md'>Nothing to showw!!</p>
          )}
   
  </div>
</div>
    </div>
   
  </div>
  )
}

export default PipelineProperties