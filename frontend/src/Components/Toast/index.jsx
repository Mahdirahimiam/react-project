import React, { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'

export default function Toast({ type, message }) {
    useEffect(()=>{
        if(type!=='info'){
            toast[type](message)
        }
    },[type,message])
    return (
        <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        />
    )
}
