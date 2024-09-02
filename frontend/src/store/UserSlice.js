import { createSlice } from '@reduxjs/toolkit';
 
const UserSlice= createSlice({
    name:'user',
    initialState:{
        refreshToken:null,
        accessToken:null,
        user:null,
      
    },
    reducers:{
        UserLogin:(state,action)=>{
            state.refreshToken=action.payload.refreshToken
            state.accessToken=action.payload.accessToken
            state.user=action.payload.user
           

        },
        
        UserLogout:(state,action)=>{
            state.refreshToken=null
            state.accessToken=null
            state.user=null
          
        },
       
    }
})

export const { UserLogin,UserLogout  }= UserSlice.actions
export default UserSlice.reducer