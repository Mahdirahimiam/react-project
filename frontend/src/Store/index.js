import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./slices/AuthSlice";
import ShoppingList from "./slices/ShoppingList";
const store = configureStore({
    reducer:{
        auth:AuthSlice,
        cart:ShoppingList
    }
})
export default store