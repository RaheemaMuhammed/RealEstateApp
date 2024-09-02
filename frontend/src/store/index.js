import { configureStore,combineReducers } from "@reduxjs/toolkit"
import { persistReducer,FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER, } from 'redux-persist'
import storage  from "redux-persist/lib/storage"
import UserReducer from "./UserSlice"
const PersistConfig = {key :'root' , storage,version:1}

const reducer = combineReducers({
    UserReducer,
})
const PersistReducer = persistReducer(PersistConfig,reducer)


export const store =configureStore({
    reducer:PersistReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    
})