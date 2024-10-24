import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import DefaultLayout from '../layout/DefaultLayout'
import PageTitle from '../Components/Admin/PageTitle'
import Dashboard from '../Pages/Admin/Dashboard'
import { useSelector } from 'react-redux'
import ContractsTemplates from '../Pages/Admin/ContractsTemplates'
import ContractPending from '../Pages/Admin/ContractPending'
import Users from '../Pages/Admin/Users'
import Properties from '../Pages/Admin/Properties'
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
          <Route path='/users' element={token ? <>
              <PageTitle title="Users | Real Estate Application" />
              <Users />
            </> : 
            <Navigate to={'/login'}/> 
          }/>
          <Route path='/properties' element={token ? <>
              <PageTitle title="Properties | Real Estate Application" />
              <Properties />
            </> : 
            <Navigate to={'/login'}/> 
          }/>
          <Route path='/contracts/templates' element={token ? <>
              <PageTitle title="Templates | Real Estate Application" />
              <ContractsTemplates />
            </> : 
            <Navigate to={'/login'}/> 
          }/>
          {/* <Route path='/contracts/pending' element={token ? <>
              <PageTitle title="Contracts | Real Estate Application" />
              <ContractPending />
            </> : 
            <Navigate to={'/login'}/> 
          }/> */}
    </Routes>
    </DefaultLayout>
    </>

  )
}

export default AdminRoutes