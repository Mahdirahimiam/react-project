import {useState } from 'react';
import { useField } from "formik";

export default function Captcha({label, captcha , oncaptcha , ...props }) {

    const[field , meta] = useField(props);
    
    const refreshCaptsha = () =>{
         oncaptcha( Math.random().toString(36).slice(8));
    }

  return (
    <div className='container_captcha'>
        <div className='grid'>
            <label>{label}</label> 
            <div className='captcha_flex flex'>
            <div className='captcha'>{captcha}</div>
            <input {...field} {...props}  className='captcha_input' />
            </div>
        </div>
        
     <span className='refresh_Captcha' onClick={refreshCaptsha}>اگر کد خوانا نیست اینجا را کلیک کنید</span> 
    </div>
  )
}
