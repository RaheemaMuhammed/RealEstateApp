import React from 'react'
import { NavLink, useLocation } from 'react-router-dom';

const CustomNavLink = ({ to, children }) => {
  const location = useLocation();

  // Parse the current URL and query string
  const currentPath = location.pathname;
  const currentSearch = location.search;

  // Determine if the current link is active
  const isActive = (currentPath + currentSearch) === to;

  return (
    <NavLink
      to={to}
      className={isActive
        ? "block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
        : "block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
      }
    >
      {children}
    </NavLink>
  )
}

export default CustomNavLink


