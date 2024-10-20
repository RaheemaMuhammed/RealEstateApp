import { createSlice } from "@reduxjs/toolkit";


const AdminSlice = createSlice({
    name:'admin',
    initialState:{
        refreshToken:null,
        accessToken:null,
        admin:null,
        type:null
    },
    reducers:{
        AdminLogin :(state,action) =>{
            state.refreshToken = action.payload.refreshToken
            state.accessToken = action.payload.accessToken
            state.admin = action.payload.admin
            state.type = action.payload.type
            },
       
        AdminLogout :(state,action) =>{
            state.refreshToken =  null
            state.accessToken = null
            state.admin = null
            state.type = null
        }
    }
})
export const { AdminLogin, AdminLogout } = AdminSlice.actions
export default AdminSlice.reducer