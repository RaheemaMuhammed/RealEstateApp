import React from 'react';

const TableForAll = ({ data = [], columns = [], imageField, onRowClick }) => {

  const getImageUrl = (imagePath) => {
    var BASE_URL="http://127.0.0.1:8000"
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${BASE_URL}${imagePath}`;
  };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm font-light">
        <thead className="border-b font-medium">
          <tr>
            {columns.map((col, index) => (
              <th key={index} scope="col" className="px-6 py-4">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={index}
                className="border-b transition duration-300 ease-in-out hover:bg-neutral-100"
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((col, i) => (
                  <td key={i} className="whitespace-nowrap px-3 py-2">
                    {col.cell ? (
                      col.cell(item) 
                    ) : col.accessor === imageField ? (
                      item[imageField] ? (
                        <img
                          src={getImageUrl(item[imageField])}
                          alt={item[columns[0].accessor]}
                          className="w-24 h-24 rounded-md "
                        />
                      ) : (
                        'No Image'
                      )
                    ) : (
                      item[col.accessor] || 'N/A'
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableForAll;
