import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import DefaultLayout from '../layout/DefaultLayout'
import PageTitle from '../Components/Admin/PageTitle'
import Dashboard from '../Pages/Admin/Dashboard'
import { useSelector } from 'react-redux'
const AdminRoutes = () => {
    const token = useSelector(state=>state.AdminReducer.accessToken)
  return (
    <>
    <DefaultLayout>
    <Routes>
        <Route path='/dashboard' element={token ? <>
              <PageTitle title="Dashboard | Real Estate Application" />
              <Dashboard />
            </> : 
            <Navigate to={'/login'}/> 
          }/>
    </Routes>
    </DefaultLayout>
    </>

  )
}

export default AdminRoutes