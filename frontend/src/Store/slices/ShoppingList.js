import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    list: []
}
const ShoppingList = createSlice({
    name: 'shoppingList',
    initialState,
    reducers: {
        removeAll: (state)=>{
            state.list = null
        },
        removeItem: (state, action)=>{

            state.list=state.list.filter((e)=>{
                if(e.id===action.payload){
                    if(e.quantity>1){
                        e.quantity=e.quantity -1
                        return e
                    }else{
                        return false
                    }
                }else{
                    return true
                }
            })
        },
        addItems: (state, action)=>{
            let addItems = false
            if (state.list.length === 0) {
                let pr = action.payload
                pr.quantity = 1
                state.list.push(pr)
                addItems = true
            }else{
                state.list = state.list.map((e)=>{
                    if(e.id===action.payload.id){
                        e.quantity=e.quantity+1
                        addItems = true
                        return e
                    }
                    return e
                })
            }
        }
    }
})
export const {removeItem,removeAll,addItems} = ShoppingList.actions
export default ShoppingList.reducer