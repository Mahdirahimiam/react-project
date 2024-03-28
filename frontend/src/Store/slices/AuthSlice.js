import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    token: null   
}
const AuthSlice = createSlice({
    name:'authSlice',
    initialState,
    reducers:{
        login:(state,action)=>{
            state.token=action.payload
        },
        logout:((state)=>{
            state.token=null
        })
    }
})
export const {login,logout}=AuthSlice.actions
export default AuthSlice.reducer