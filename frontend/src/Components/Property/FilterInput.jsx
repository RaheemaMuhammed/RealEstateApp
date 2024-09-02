import React from 'react'

const FilterInput = ({ icon, name,id, value,type, onChange, placeholder }) => {
  return (
    <div className="relative">
    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
      {icon}
    </div>
    <input
      type={type}
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      className="border border-gray-300 text-gray-900 text-base rounded-lg block w-full ps-10 p-2 placeholder-black"
      placeholder={placeholder}
    />
  </div>
  )
}

export default FilterInput